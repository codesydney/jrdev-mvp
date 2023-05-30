import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { createSupabaseClient } from '@/lib/supabaseClient'
import Confirmation from '@/components/Confirmation'
import Loading from '@/components/Loading'

const Roleselect = () => {
  const [role, setRole] = useState('')
  console.log('role: ', role)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [errorMessage, setErrorMessage] = useState('')

  if (status === 'loading') {
    return <Loading />
  }

  if (session) {
    const supabase = createSupabaseClient(session.supabaseAccessToken)

    const handleRoleSelection = (selectedRole) => {
      setRole(selectedRole)
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
        setErrorMessage(error.message)
      }
    }

    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-bold mb-4">Select your role</h2>
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => handleRoleSelection('applicant')}
              className={` hover:bg-blue  text-white font-bold py-2 px-4 rounded-md ${
                role === 'applicant' ? 'bg-blue shadow-lg scale-110' : 'bg-secondary'
              }`}
            >
              I'm a Applicant
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelection('recruiter')}
              className={` hover:bg-blue  text-white font-bold py-2 px-4 rounded-md ${
                role === 'recruiter' ? 'bg-blue shadow-lg scale-110' : 'bg-secondary'
              }`}
            >
              I'm a Recruiter
            </button>
          </div>

          {role && (
            <button
              type="submit"
              disabled={role === ''}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md"
            >
              Confirm
            </button>
          )}

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    )
  }
}

export default Roleselect
