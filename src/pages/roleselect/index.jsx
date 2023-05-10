import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { createSupabaseClient } from '@/lib/supabaseClient'

const Roleselect = () => {
  const [role, setRole] = useState('applicant')
  const router = useRouter()
  const { data: session, status } = useSession()
  console.log('session: ', session)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session) {
    const supabase = createSupabaseClient(session.supabaseAccessToken)

    const handleChange = (event) => {
      setRole(event.target.value)
    }

    const handleSubmit = async (event) => {
      event.preventDefault()
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ role })
          .eq('id', session.user.id)
        if (error) throw error
        router.push('/')
      } catch (error) {
        console.log('error', error)
      }
    }

    return (
      <div>
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
      </div>
    )
  }
}

export default Roleselect
