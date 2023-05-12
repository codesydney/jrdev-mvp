import { useState, useEffect } from 'react'
import { GrDocumentUpload, GrDocumentPdf, GrStatusWarning } from 'react-icons/gr'
import { FiDownload } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { createSupabaseClient } from '@/lib/supabaseClient'

const Applicantdashboard = ({ applicant, onRefresh }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [resumeFile, setResumeFile] = useState('')
  const [resumePreviewUrl, setResumePreviewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // set applicant data to state
  useEffect(() => {
    if (applicant && errorMessage === '') {
      setName(applicant.name)
      setPhone(applicant.phone)
      setEmail(applicant.email)
    }
  }, [applicant])

  useEffect(() => {
    let timer
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }

    return () => clearTimeout(timer)
  }, [errorMessage])

  const { data: session, status } = useSession()

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
    e.preventDefault()
    const file = e.target.files[0]
    setResumeFile(file)
    if (file) {
      setResumePreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (name && phone && email && resumeFile) {
      // upload resume to storage
      const resumeBucketPath = `${session.user.id}/${resumeFile.name}`

      //upload resume to storage
      const { data: file, error: uploadError } = await supabase.storage
        .from('resume')
        .upload(resumeBucketPath, resumeFile)

      if (uploadError) {
        console.log('uploadError: ', uploadError)
        throw uploadError
      }

      //get resume url from storage
      const resp = await supabase.storage.from('resume').getPublicUrl(resumeBucketPath)
      const resumeUrl = resp.data.publicUrl

      // insert applicant data to db
      const { data, error } = await supabase.from('applicants').insert({
        name,
        phone,
        email,
        resume_url: resumeUrl,
        users_id: session.user.id
      })

      if (error) {
        console.error('Error submitting form:', error)
        throw error
      }

      setResumePreviewUrl('')
      setResumeFile('')
      onRefresh()
    } else {
      setErrorMessage('Please fill in all fields and upload a resume.')
    }
  }

  const handleUpdate = async () => {
    if (name && phone && email) {
      const updateData = { name, phone, email }

      if (resumeFile) {
        // get public resume url from storage
        const resumeBucketPath = `${session.user.id}/${resumeFile.name}`
        const resp = await supabase.storage.from('resume').getPublicUrl(resumeBucketPath)
        const resumeUrl = resp.data.publicUrl

        // get uploaded resume name
        const uploadedResumeName = decodeURIComponent(applicant.resume_url.split('/').pop())

        // check if resume file is the same as the uploaded one and rewrite it if it is
        if (resumeFile.name === uploadedResumeName) {
          const { data: file, error: uploadError } = await supabase.storage
            .from('resume')
            .update(resumeBucketPath, resumeFile, { upsert: true })
          updateData.resume_url = resumeUrl
          setResumePreviewUrl('')
          setResumeFile('')
          if (uploadError) {
            console.log('uploadError: ', uploadError)
            throw uploadError
          }
        } else {
          // upload new resume file and delete the old one
          const { data: file, error: uploadError } = await supabase.storage
            .from('resume')
            .upload(resumeBucketPath, resumeFile)
          updateData.resume_url = resumeUrl
          setResumePreviewUrl('')
          setResumeFile('')
          if (uploadError) {
            console.log('uploadError: ', uploadError)
            throw uploadError
          }

          // delete old resume file
          const { data, error: deleteError } = await supabase.storage
            .from('resume')
            .remove([`${session.user.id}/${uploadedResumeName}`])
          if (deleteError) {
            console.log('deleteError: ', deleteError)
            throw deleteError
          }
        }
      }

      // update applicant data
      const { data, error } = await supabase
        .from('applicants')
        .update(updateData)
        .eq('users_id', session.user.id)
      if (error) {
        console.error('Error updating applicant:', error)
        throw error
      }
    } else {
      setErrorMessage('Please fill in all fields.')
    }
    onRefresh()
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md  p-4 sm:p-8 bg-white rounded-lg shadow-md ">
        {/* application form */}
        <h2 className="text-2xl font-semibold mb-6 text-dark">Application Form</h2>

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

        <label className="h-[100px] w-[160px] border-[3px] border-dark rounded cursor-pointer flex flex-col items-center justify-center">
          {resumeFile || applicant?.resume_url ? (
            <span className="font-semibold">Update Resume</span>
          ) : (
            <span className="font-semibold after:content-['*'] after:ml-0.5">Upload Resume</span>
          )}
          <GrDocumentUpload className="text-5xl mt-2" />
          <input type="file" accept="application/pdf" onChange={resumeHandler} className="hidden" />
        </label>

        {/* Preview resume */}
        {resumePreviewUrl && (
          <div className="text-lg font-semibold mt-4">
            <p className=" text-primary mb-2">Preview Resume: </p>
            <div className=" border-b-[3px] border-dark rounded py-2">
              <a
                href={resumePreviewUrl}
                target="_blank"
                className="flex justify-between items-center"
              >
                <div className="flex justify-center items-center mr-1 overflow-hidden">
                  <GrDocumentPdf className="text-3xl mr-3 flex-shrink-0" />
                  <p className="max-w-[350px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {resumeFile?.name}
                  </p>
                </div>
                <FiDownload className="text-2xl flex-shrink-0" />
              </a>
            </div>
          </div>
        )}

        {/* Uploaded resume */}
        <div className="text-lg font-semibold mt-4">
          <p className=" text-primary mb-2">Uploaded Resume: </p>
          {applicant?.resume_url ? (
            <div className="border-b-[3px] border-dark rounded py-2 ">
              <a
                href={applicant.resume_url}
                target="_blank"
                className="flex justify-between items-center hover:underline"
              >
                <div className="flex justify-center items-center mr-1 overflow-hidden">
                  <GrDocumentPdf className="text-3xl mr-3 flex-shrink-0" />
                  <p className="max-w-[350px] overflow-hidden whitespace-nowrap text-ellipsis ">
                    {decodeURIComponent(applicant.resume_url.split('/').pop())}
                  </p>
                </div>
                <FiDownload className="text-2xl" />
              </a>
            </div>
          ) : (
            <div>
              <p>No resume uploaded.</p>
            </div>
          )}
        </div>

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
  )
}

export default Applicantdashboard
