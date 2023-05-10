import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { createSupabaseClient } from '@/lib/supabaseClient'

const Roleselect = () => {
  const [role, setRole] = useState('applicant')
  const router = useRouter()
  const { data: session, status } = useSession()
  const [errorMessage, setErrorMessage] = ''

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session) {
    const supabase = createSupabaseClient(session.supabaseAccessToken)

    const handleChange = (event) => {
      const selectedValue = event.target.value
      if (selectedValue === '') {
        // Handle the case where the user has not selected a role
        setErrorMessage('Please select a role.')
      } else {
        // Handle the case where the user has selected a role
        setRole(selectedValue)
      }
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
      <form onSubmit={handleSubmit}>
        <label className="block">Select your role:</label>
        <select value={role} onChange={handleChange}>
          <option value="">-- Select --</option>
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" disabled={role === ''}>
          Next
        </button>

        <p className="text-center text-red-500">{errorMessage}</p>
      </form>
    )
  }
}

export default Roleselect
