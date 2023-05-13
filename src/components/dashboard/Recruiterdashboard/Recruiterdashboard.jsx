import { useState, useEffect } from 'react'
import { GrDocumentUpload, GrDocumentPdf, GrStatusWarning } from 'react-icons/gr'
import { CgProfile } from 'react-icons/cg'
import { MdDashboard, MdOutlinePostAdd } from 'react-icons/md'
import Link from 'next/link'
import { FiDownload } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { createSupabaseClient } from '@/lib/supabaseClient'
import Navbar from './Navbar'

const Recruiterdashboard = ({ applicant, onRefresh }) => {
  const [companyName, setCompanyName] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleSubmit = async () => {}
  return (
    <div className="flex justify-center items-center min-h-screen m-auto">
      <div className="flex justify-center items-start gap-20 w-[70%] m-auto">
        {/* Navbar */}
        <Navbar />
        {/* main */}
        <div className="flex rounded-3xl items-center justify-center  shadow-lg">
          <div className="w-full max-w-md  p-4 sm:p-8 bg-white rounded-lg ">
            {/* profile form */}
            <h2 className="text-2xl font-semibold mb-6 text-dark">My Profile</h2>

            <label>
              <span className="font-semibold after:content-['*'] after:ml-0.5">Company Name</span>
              <input
                className="w-full p-2 mb-4 border-[3px] border-dark rounded"
                type="text"
                placeholder="companyName"
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
            {applicant ? (
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
      </div>
    </div>
  )
}

export default Recruiterdashboard
