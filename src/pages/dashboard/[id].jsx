import { useSession } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import supabase from '@/lib/supabaseClient'
import Applicantdashboard from '@/components/dashboard/Applicantdashboard'

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

  const userId = session.user.id
  const res = await supabase.from('users').select('role').eq('id', userId)
  return {
    props: { role: res.data[0].role }
  }
}

export default Dashboard
