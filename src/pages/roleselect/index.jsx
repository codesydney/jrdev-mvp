import { useState } from 'react'
// import { authOptions } from '../api/auth/[...nextauth]'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
// import { getServerSession } from 'next-auth/next'

import useSupabaseClient from '@/lib/useSupabaseClient'

const Roleselect = () => {
  const [role, setRole] = useState('applicant')
  const router = useRouter()
  const supabase1 = useSupabaseClient()
  const { data: session, status } = useSession()

  // const { supabaseAccessToken } = session
  // console.log('session2: ', supabaseAccessToken)
  // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  //   header: { Authorization: `Bearer ${supabaseAccessToken}` }
  // })
  const handleChange = (event) => {
    setRole(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('session4: ', session)
    try {
      const { data, error } = await supabase1
        .from('users')
        .update({ role })
        .eq('id', session.user.id)
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.log('error', error)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  return (
    <div>
      {session ? (
        <form onSubmit={handleSubmit}>
          <label>
            Select your role:
            <select value={role} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="applicant">Applicant</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>
          <button type="submit">Next</button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res, authOptions)
//   console.log('session1: ', session)
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       session: session.user
//     }
//   }
// }

export default Roleselect
