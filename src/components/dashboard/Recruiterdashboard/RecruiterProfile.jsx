import { useState, useEffect } from 'react'
import { GrStatusWarning } from 'react-icons/gr'
import { useSession } from 'next-auth/react'
import { createSupabaseClient } from '@/lib/supabaseClient'

const RecruiterProfile = ({ recruiter, onRefresh }) => {
  const [companyName, setCompanyName] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { data: session, status } = useSession()
  const supabase = createSupabaseClient(session.supabaseAccessToken)

  const companyNameHandler = (e) => {
    setCompanyName(e.target.value)
  }

  const nameHandler = (e) => {
    setName(e.target.value)
  }

  const phoneHandler = (e) => {
    setPhone(e.target.value)
  }

  const emailHandler = (e) => {
    setEmail(e.target.value)
  }
  const handleSubmit = async () => {
    try {
      if (!name || !phone || !email || !companyName) {
        setErrorMessage('Please fill all the fields')
      } else {
        const { data, error } = await supabase.from('recruiters').insert({
          name,
          phone,
          email,
          company: companyName,
          users_id: session.user.id
        })

        if (error) {
          setErrorMessage(error.message)
          throw new Error(error.message)
        }
        if (data) {
          setErrorMessage('Profile updated successfully')
          //   onRefresh()
        }
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  return (
    <div className="flex  rounded-3xl items-center justify-center  shadow-lg">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg ">
        {/* profile form */}
        <h2 className="text-2xl font-semibold mb-6 text-dark">My Profile</h2>

        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">Company Name</span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={companyNameHandler}
          />
        </label>

        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">Name</span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="text"
            placeholder="Name"
            value={name}
            onChange={nameHandler}
          />
        </label>
        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">Phone</span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={phoneHandler}
          />
        </label>

        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">Email</span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={emailHandler}
          />
        </label>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-sm font-semibold mt-4 flex items-center">
            <GrStatusWarning className="text-lg inline-block mr-2" />
            {errorMessage}
          </div>
        )}
        {/* Submit button */}
        {recruiter ? (
          <button
            className="w-full px-4 py-2 font-semibold text-black bg-primary text-white rounded mt-2"
            onClick={handleUpdate}
          >
            Update Profile
          </button>
        ) : (
          <button
            className="w-full px-4 py-2 font-semibold text-black bg-primary text-white rounded mt-6"
            onClick={handleSubmit}
          >
            Create Profile
          </button>
        )}
      </div>
    </div>
  )
}

export default RecruiterProfile
