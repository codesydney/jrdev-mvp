import { useState } from 'react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { GrDocumentUpload, GrDocumentPdf, GrStatusWarning, GrStatusGood } from 'react-icons/gr'
import { BiArrowFromLeft } from 'react-icons/bi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiDownload } from 'react-icons/fi'
import { createSupabaseClient } from '@/lib/supabaseClient'
import Confirmation from '@/components/Confirmation'

const JobMangement = ({ recruiter, jobList, onRefresh }) => {
  const [jobDescriptionFile, setJobDescriptionFile] = useState('')
  const [jdPreviewUrl, setJdPreviewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    let timer
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }

    return () => clearTimeout(timer)
  }, [errorMessage, successMessage])

  console.log('jobList', jobList)
  const { data: session, status } = useSession()
  const supabase = createSupabaseClient(session.supabaseAccessToken)

  const jobdescriptionHandler = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    setJobDescriptionFile(file)
    if (file) {
      setJdPreviewUrl(URL.createObjectURL(file))
    } else {
      setJdPreviewUrl('')
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
        const recruiterId = recruiter.id

        // insert applicant data to db
        const { data, error } = await supabase.from('jobdescription').insert({
          jobdescription_url: jdUrl,
          recruiters_id: recruiterId
        })

        if (error) {
          console.error('Error submitting form:', error)
          throw error
        }
        setJdPreviewUrl('')
        setJobDescriptionFile('')
        setSuccessMessage('Upload successfully')
        onRefresh()
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const HandleshowConfirmation = () => {
    setShowConfirmation(true)
  }

  const handleDelete = async (id) => {
    try {
      // get uploaded jd name
      const { data: uploadJd, error: getError } = await supabase
        .from('jobdescription')
        .select('jobdescription_url')
        .eq('id', id)
        .single()

      const uploadedResumeName = decodeURIComponent(uploadJd.jobdescription_url.split('/').pop())
      console.log('1', uploadJd)
      // delete jobdescription file from storage
      const { data, error: deleteError } = await supabase.storage
        .from('jobdescription')
        .remove([`${session.user.id}/${uploadedResumeName}`])

      console.log('2')
      if (deleteError) {
        console.log('deleteError: ', deleteError)
        throw deleteError
      }

      // delete jobdescription data from Jd table
      await supabase.from('jobdescription').delete().eq('id', id)
      setShowConfirmation(false)
      onRefresh()
    } catch (error) {
      // *modify later
      setErrorMessage(error.message)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl items-center justify-center w-full md:w-[60%]">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-lg ">
        <h2 className="text-2xl font-semibold mb-6 text-dark">Post a job</h2>
        <label className="h-[100px] border-[3px] border-dark rounded cursor-pointer flex flex-col items-center p-1 justify-center">
          {jobDescriptionFile ? (
            <span className="font-semibold">Update Job Description</span>
          ) : (
            <span className="font-semibold after:content-['*'] after:ml-0.5">
              Upload A Job Description in PDF
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
              <a
                href={jdPreviewUrl}
                target="_blank"
                className="flex justify-between items-center hover:underline"
              >
                <div className="flex justify-center items-center mr-1 overflow-hidden">
                  <GrDocumentPdf className="text-3xl mr-3 flex-shrink-0" />
                  <p className="max-w-[350px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {jobDescriptionFile?.name}
                  </p>
                </div>
                <BiArrowFromLeft className="text-2xl flex-shrink-0" />
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
          Post a job
        </button>
      </div>

      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-dark">Job listings</h2>
        {jobList.length > 0 ? (
          jobList
            .slice()
            .reverse()
            .map((job) => (
              <div className="flex gap-2 items-center" key={job.id}>
                <div className="w-full border-b-[3px] border-dark rounded py-2 ">
                  <a
                    href={job.jobdescription_url}
                    target="_blank"
                    className="flex justify-between items-center hover:underline"
                  >
                    <div className="flex justify-center items-center mr-1 overflow-hidden">
                      <GrDocumentPdf className="text-3xl mr-3 flex-shrink-0" />
                      <p className="max-w-[350px] overflow-hidden whitespace-nowrap text-ellipsis ">
                        {decodeURIComponent(job.jobdescription_url.split('/').pop())}
                      </p>
                    </div>
                    <FiDownload className="text-2xl" />
                  </a>
                </div>
                <div onClick={HandleshowConfirmation}>
                  <button className="rounded-full p-1 hover:bg-dark">
                    <RiDeleteBin6Line className="text-xl" />
                  </button>
                </div>
                <Confirmation
                  isOpen={showConfirmation}
                  title="Confirm Delete"
                  message="Are you sure you want to delete this job Description?"
                  onConfirm={() => handleDelete(job.id)}
                  onCancel={handleCancelDelete}
                />
              </div>
            ))
        ) : (
          <div>
            <p>No job posted. Please post a new job first.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobMangement
