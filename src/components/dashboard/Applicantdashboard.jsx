import React, { useState, useEffect } from 'react'
import { GrDocumentUpload, GrDocumentPdf } from 'react-icons/gr'
import { FiDownload } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { createSupabaseClient } from '@/lib/supabaseClient'

const Applicantdashboard = ({ applicant, onRefresh }) => {
  console.log('applicant: ', applicant)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumePreviewUrl, setResumePreviewUrl] = useState('')

  useEffect(() => {
    if (applicant) {
      setName(applicant.name || '')
      setPhone(applicant.phone)
      setEmail(applicant.email)
    }
  }, [applicant])

  const { data: session, status } = useSession()
  console.log('session: ', session)

  const supabase = createSupabaseClient(session.supabaseAccessToken)
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

  const ifApplicantExists = async () => {
    const { data, error } = await supabase
      .from('applicants')
      .select()
      .limit(1)
      .single()
      .eq('users_id', session.user.id)
    if (error) {
      console.error('Error fetching applicant:', error)
      return
    }
    return data
  }

  const handleSubmit = async () => {
    if (name && phone && email && resumeFile) {
      // upload resume to storage
      const resumeBucketPath = `${session.user.id}/${resumeFile.name}`

      const { data: file, error: uploadError } = await supabase.storage
        .from('resume')
        .upload(resumeBucketPath, resumeFile)
      if (uploadError) {
        console.log('uploadError: ', uploadError)
        throw uploadError
      }

      // check if applicant exists
      const applicantExists = await ifApplicantExists()
      //get resume url from storage
      console.log('pass the upload')
      const resp = await supabase.storage.from('resume').getPublicUrl(resumeBucketPath)
      const resumeUrl = resp.data.publicUrl
      console.log('resumeUrl', resumeUrl)
      if (applicantExists) {
        // update applicant data
        console.log('update applicant data')
        const { data, error } = await supabase
          .from('applicants')
          .update({
            name,
            phone,
            email,
            resume_url: resumeUrl
          })
          .eq('users_id', session.user.id)
        if (error) {
          console.error('Error updating applicant:', error)
          return
        }
      } else {
        // insert applicant data to db
        const { data, error } = await supabase
          .from('applicants')
          .insert({
            name,
            phone,
            email,
            resume_url: resumeUrl,
            users_id: session.user.id
          })
          .eq('users_id', 'b9210e4c-9f4a-4379-bb04-64c6edce46bb')
        if (error) {
          console.error('Error submitting form:', error)
        }
      }
      setResumePreviewUrl('')
      onRefresh()
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
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
          className="w-full p-2 mb-4 border-[3px] border-dark rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={emailHandler}
        />

        <label
          htmlFor="file_input"
          className="h-[100px] w-[160px] border-[3px] border-dark rounded cursor-pointer flex flex-col items-center justify-center"
        >
          {resumeFile || applicant?.resume_url ? (
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
        <div className="text-dark text-lg font-semibold mt-4">
          <p className="">Uploaded Resume: </p>
        </div>
        {applicant?.resume_url ? (
          <div className="border-[3px] border-dark rounded p-2 mt-4">
            <a href={applicant.resume_url} target="_blank" className="flex justify-between">
              <div>
                <GrDocumentPdf className="text-xl inline-block mr-1" />
                {decodeURIComponent(applicant.resume_url.split('/')[9])}
              </div>
              <FiDownload className="text-2xl inline-block" />
            </a>
          </div>
        ) : (
          <div>
            <p>No resume uploaded</p>
          </div>
        )}

        {resumePreviewUrl && (
          <div className="border-[3px] border-dark rounded p-2 mt-4">
            <a href={resumePreviewUrl} target="_blank" className="flex justify-between">
              <div>
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
