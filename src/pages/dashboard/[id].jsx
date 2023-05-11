import { useSession } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import Applicantdashboard from '@/components/dashboard/Applicantdashboard'
import { createSupabaseClient } from '@/lib/supabaseClient'

const Dashboard = ({ role, applicant }) => {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated') {
    return <div>Access denied. Please log in. Redirect to login page then.</div>
  }

  if (status === 'loading') {
    return <div>Loading page...</div>
  }

  return (
    <>
      {role === 'applicant' && <Applicantdashboard applicant={applicant} />}
      {role === 'recruiter' && <div>recruiter dashboard</div>}
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session?.user?.id) {
    return {
      redirect: {
        destination: '/signup',
        permanent: false
      }
    }
  }
  const supabase = createSupabaseClient(session.supabaseAccessToken)
  const userId = session.user.id
  const users = await supabase.from('users').select('role').limit(1).single().eq('id', userId)

  if (!users.data) {
    return {
      redirect: {
        destination: '/signup',
        permanent: false
      }
    }
  }

  if (users.data.role === 'applicant') {
    const applicant = await supabase
      .from('applicants')
      .select()
      .limit(1)
      .single()
      .eq('users_id', userId)
    console.log('applicant: ', applicant.data)
    if (!applicant.data) {
      return {
        props: { role: users.data.role }
      }
    } else {
      return {
        props: { role: users.data.role, applicant: applicant.data }
      }
    }
  }

  return {
    props: { role: users.data.role, applicant: applicant.data }
  }
}

export default Dashboard
