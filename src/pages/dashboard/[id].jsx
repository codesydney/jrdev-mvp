import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import Applicantdashboard from '@/components/dashboard/Applicantdashboard'
import DashboardRecruiter from '@/components/dashboard/Recruiterdashboard'
import { createSupabaseClient } from '@/lib/supabaseClient'

const Dashboard = ({ role, initialApplicant, initialRecrutier }) => {
  const { data: session, status } = useSession()
  const [applicant, setApplicant] = useState(initialApplicant)
  const [recruiter, setRecruiter] = useState(initialRecrutier)

  const fetchExistingData = async () => {
    const supabase = createSupabaseClient(session.supabaseAccessToken)
    if (role === 'applicant') {
      const userId = session.user.id
      const applicant = await supabase
        .from('applicants')
        .select()
        .limit(1)
        .single()
        .eq('users_id', userId)

      setApplicant(applicant.data)
    } else if (role === 'recruiter') {
      const userId = session.user.id
      const recruiter = await supabase
        .from('recruiters')
        .select()
        .limit(1)
        .single()
        .eq('users_id', userId)
      setRecruiter(recruiter.data)
    }
  }

  if (status === 'unauthenticated') {
    return <div>Access denied. Please log in. Redirect to login page then.</div>
  }

  if (status === 'loading') {
    return <div>Loading page...</div>
  }

  return (
    <>
      {role === 'applicant' && (
        <Applicantdashboard applicant={applicant} onRefresh={fetchExistingData} />
      )}
      {role === 'recruiter' && (
        <DashboardRecruiter recruiter={recruiter} onRefresh={fetchExistingData} />
      )}
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

  console.log('users: ', users)
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
        props: { role: users.data.role, initialApplicant: applicant.data }
      }
    }
  }

  if (users.data.role === 'recruiter') {
    const recruiter = await supabase
      .from('recruiters')
      .select()
      .limit(1)
      .single()
      .eq('users_id', userId)
    console.log('recruiter: ', recruiter.data)
    return {
      props: { role: users.data.role, initialRecrutier: recruiter.data }
    }
  }

  return {
    props: {}
  }
}

export default Dashboard
