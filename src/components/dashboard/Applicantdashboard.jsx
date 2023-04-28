import React, { useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { useSession } from 'next-auth/react'
const Applicantdashboard = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [resumeFile, setResumeFile] = useState(null)

  const { data: session, error } = useSession()

  const resumeHandler = (e) => {
    const file = e.target.files[0]
    setResumeFile(file)
  }

  const handleSubmit = async () => {
    if (name && phone && email && resumeFile) {
      // upload resume to storage
      const resumeBucketPath = `resume/${session.user.id}/${resumeFile.name}`
      const { data: file, error: uploadError } = await supabase.storage
        .from('resume')
        .upload(resumeBucketPath, resumeFile)
      console.log('file', file)
      if (uploadError) {
        throw uploadError
      }

      //get resume url from storage
      const resp = await supabase.storage.from('resume').getPublicUrl(resumeBucketPath)
      const resumeUrl = resp.data.publicUrl
      console.log('resumeUrl', resumeUrl)

      // insert applicant data to db
      const { data, error } = await supabase
        .from('applicants')
        .upsert([{ id: session.user.id, name, phone, email, resume_url: resumeUrl }])
      if (error) {
        console.error('Error submitting form:', error)
      } else {
        console.log('Submitted successfully:', data)
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md  p-4 sm:p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Application Form</h2>
          <input
            className="w-full p-2 mb-4 border border-gray-500 rounded"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="w-full p-2 mb-6 border border-gray-300 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <input
            type="file"
            accept="application/pdf"
            id="file_input"
            onChange={resumeHandler}
            className="w-full p-2 mb-6  border-gray-300 "
          /> */}
          <label
            htmlFor="file_input"
            className="w-full p-2 mb-6 border border-gray-300 rounded cursor-pointer flex items-center justify-center"
          >
            <span>Upload Resume</span>
            <input
              type="file"
              accept="application/pdf"
              id="file_input"
              onChange={resumeHandler}
              className="hidden"
            />
          </label>
          <button
            className="w-full px-4 py-2 font-semibold text-black bg-indigo-200 rounded mt-6"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}

export default Applicantdashboard
