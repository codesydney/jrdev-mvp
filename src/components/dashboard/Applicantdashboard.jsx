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

  const handleUpload = async () => {
    console.log('resume', resumeFile)
  }

  const handleSubmit = async () => {
    try {
      if (resumeFile) {
      }
    } catch (error) {
      console.log('error:', error)
    }

    if (name && phone && email && resumeFile) {
      // upload resume to storage
      const { data: file, error: uploadError } = await supabase.storage
        .from('resume')
        .upload('resume/' + resumeFile.name, resumeFile)
      console.log('file', file)
      if (uploadError) {
        throw uploadError
      }

      //get resume url from storage
      const resp = await supabase.storage.from('resume').getPublicUrl('resume/' + resumeFile.name)
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Application Form</h2>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
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
        <input type="file" accept="application/pdf" id="file_input" onChange={resumeHandler} />
        <button onClick={handleUpload}>Upload Resume</button>
        <button
          className="w-full px-4 py-2 font-semibold text-black bg-indigo-200 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default Applicantdashboard
