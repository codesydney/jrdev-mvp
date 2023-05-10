import { useSession } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import Applicantdashboard from '@/components/dashboard/Applicantdashboard'
import { createSupabaseClient } from '@/lib/supabaseClient'

const Dashboard = ({ role }) => {
  const { data: session, status } = useSession()
  if (status === 'unauthenticated') {
    return <div>Access denied. Please log in. Redirect to login page then.</div>
  }

  if (status === 'loading') {
    return <div>Loading page...</div>
  }

  return (
    <>
      {role === 'applicant' && <Applicantdashboard />}
      {role === 'recruiter' && <div>recruiter dashboard</div>}
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session?.user?.id) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  const supabase = createSupabaseClient(session.supabaseAccessToken)
  const userId = session.user.id
  const res = await supabase.from('users').select('role').eq('id', userId)

  if (!res.data?.length) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: { role: res.data[0].role }
  }
}

export default Dashboard
