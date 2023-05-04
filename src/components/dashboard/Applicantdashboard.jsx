import React, { useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { GrDocumentUpload, GrDocumentPdf } from 'react-icons/gr'
import { FiDownload } from 'react-icons/fi'
import { useSession } from 'next-auth/react'

const Applicantdashboard = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumePreviewUrl, setResumePreviewUrl] = useState('')

  const { data: session, error } = useSession()

  const nameHandler = (e) => {
    setName(e.target.value)
  }

  const phoneHandler = (e) => {
    setPhone(e.target.value)
  }

  const emailHandler = (e) => {
    setEmail(e.target.value)
  }

  const resumeHandler = (e) => {
    const file = e.target.files[0]
    setResumeFile(file)
    setResumePreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (name && phone && email && resumeFile) {
      // upload resume to storage
      const resumeBucketPath = `resume/${session.user.id}/${resumeFile.name}`
      const { data: file, error: uploadError } = await supabase.storage
        .from('resume')
        .upload(resumeBucketPath, resumeFile)
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
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md  p-4 sm:p-8 bg-white rounded-lg shadow-md ">
        <h2 className="text-2xl font-semibold mb-6 text-dark">Application Form</h2>
        <input
          className="w-full p-2 mb-4 border-[3px] border-dark rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={nameHandler}
        />
        <input
          className="w-full p-2 mb-4 border-[3px] border-dark rounded"
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={phoneHandler}
        />
        <input
          className="w-full p-2 mb-6 border-[3px] border-dark rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={emailHandler}
        />

        <label
          htmlFor="file_input"
          className="h-[100px] w-[160px] border-[3px] border-dark rounded cursor-pointer flex flex-col items-center justify-center"
        >
          {resumeFile ? (
            <span className="text-l">Update Resume</span>
          ) : (
            <span className="text-l">Upload Resume</span>
          )}
          <GrDocumentUpload className="text-5xl mt-2" />
        </label>
        <input
          type="file"
          accept="application/pdf"
          id="file_input"
          onChange={resumeHandler}
          className="hidden"
        />
        {resumePreviewUrl && (
          <div className="border-[3px] border-dark rounded p-2 mt-6">
            <a
              href={resumePreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between"
            >
              <div>
                <span>Uploaded Resume: </span>
                <GrDocumentPdf className="text-xl inline-block mr-1" />
                {resumeFile.name}
              </div>

              <FiDownload className="text-2xl inline-block" />
            </a>
          </div>
        )}
        <button
          className="w-full px-4 py-2 font-semibold text-black bg-primary text-white rounded mt-6"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default Applicantdashboard
