import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { GrDocumentUpload, GrDocumentPdf, GrStatusWarning, GrStatusGood } from 'react-icons/gr'
import { FiDownload } from 'react-icons/fi'
import { createSupabaseClient } from '@/lib/supabaseClient'

const JobMangement = ({ jobList }) => {
  const [jobDescriptionFile, setJobDescriptionFile] = useState('')
  const [jdPreviewUrl, setJdPreviewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  console.log('jobList', jobList)
  const { data: session, status } = useSession()
  const supabase = createSupabaseClient(session.supabaseAccessToken)

  const jobdescriptionHandler = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    setJobDescriptionFile(file)
    if (file) {
      setJdPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    try {
      if (!jobDescriptionFile) {
        setErrorMessage('Please upload a job description.')
      } else {
        // upload resume to storage
        const jdBucketPath = `${session.user.id}/${jobDescriptionFile.name}`
        console.log('handleSubmit1')
        const { data: file, error: uploadError } = supabase.storage
          .from('jobdescription')
          .upload(jdBucketPath, jobDescriptionFile)
        if (uploadError) {
          console.log('uploadError: ', uploadError)
          throw uploadError
        }
        console.log('handleSubmit2')

        //get job description url from storage
        const resp = await supabase.storage.from('jobdescription').getPublicUrl(jdBucketPath)
        const jdUrl = resp.data.publicUrl
        console.log('handleSubmit3')

        // get recruiters id
        const { data: recruiter, error: recruiterError } = await supabase
          .from('recruiters')
          .select('id')
          .eq('users_id', session.user.id)
          .single()
        const recruiterId = recruiter.id

        // insert applicant data to db
        const { data, error } = await supabase.from('jobdescription').insert({
          jobdescription_url: jdUrl,
          users_id: session.user.id,
          recruiters_id: recruiterId
        })

        if (error) {
          console.error('Error submitting form:', error)
          throw error
        }
        setJdPreviewUrl('')
        setJobDescriptionFile('')
        setSuccessMessage('Upload successfully')
        // onRefresh()
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl items-center justify-center border-2 w-full md:w-[60%]">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-lg ">
        <h2 className="text-2xl font-semibold mb-6 text-dark">Post a job</h2>
        <label className="h-[100px] border-[3px] border-dark rounded cursor-pointer flex flex-col items-center p-1 justify-center">
          {jobDescriptionFile ? (
            <span className="font-semibold">Update a Job Description</span>
          ) : (
            <span className="font-semibold after:content-['*'] after:ml-0.5">
              Upload a Job Description
            </span>
          )}
          <GrDocumentUpload className="text-5xl mt-2" />
          <input
            type="file"
            accept="application/pdf"
            onChange={jobdescriptionHandler}
            className="hidden"
          />
        </label>

        {jdPreviewUrl && (
          <div className="text-lg font-semibold mt-4">
            <p className=" text-primary mb-2">Preview Job Description: </p>
            <div className=" border-b-[3px] border-dark rounded py-2">
              <a href={jdPreviewUrl} target="_blank" className="flex justify-between items-center">
                <div className="flex justify-center items-center mr-1 overflow-hidden">
                  <GrDocumentPdf className="text-3xl mr-3 flex-shrink-0" />
                  <p className="max-w-[350px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {jobDescriptionFile?.name}
                  </p>
                </div>
                <FiDownload className="text-2xl flex-shrink-0" />
              </a>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-sm font-semibold mt-4 flex items-center">
            <GrStatusWarning className="text-lg inline-block mr-2" />
            {errorMessage}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="text-green-500 text-sm font-semibold mt-4 flex items-center">
            <GrStatusGood className="text-lg inline-block mr-2" />
            {successMessage}
          </div>
        )}

        {/* Submit button */}
        <button
          className="w-full bg-primary text-white rounded-lg py-2 mt-4"
          onClick={handleSubmit}
        >
          Post a Job
        </button>
      </div>

      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-dark">Uploaded jobs</h2>
      </div>
    </div>
  )
}

export default JobMangement
