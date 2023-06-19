import { useState, useEffect } from "react";
import {
  GrDocumentUpload,
  GrDocumentPdf,
  GrStatusWarning,
} from "react-icons/gr";
import { FiDownload } from "react-icons/fi";
import { BiArrowFromLeft } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Loading from "../Loading";

const Applicantdashboard = ({ applicant, onRefresh }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState("");
  const [resumePreviewUrl, setResumePreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const required = (resumeFile || applicant?.resume_url) ? false : true;

  let emailRegex =
  /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  // set applicant data to state
  useEffect(() => {
    if (applicant && errorMessage === "") {
      setName(applicant.name);
      setPhone(applicant.phone);
      setEmail(applicant.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicant]);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const { data: session, status } = useSession();

  const supabase = createSupabaseClient(session.supabaseAccessToken);

  const resumeHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setResumeFile(file);
    if (file) {
      setResumePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (name && phone && email && resumeFile) {
      // upload resume to storage
      const resumeBucketPath = `${session.user.id}/${resumeFile.name}`;

      //upload resume to storage
      const { data: file, error: uploadError } = await supabase.storage
        .from("resume")
        .upload(resumeBucketPath, resumeFile);

      if (uploadError) {
        console.log("uploadError: ", uploadError);
        throw uploadError;
      }

      //get resume url from storage
      const resp = await supabase.storage
        .from("resume")
        .getPublicUrl(resumeBucketPath);
      const resumeUrl = resp.data.publicUrl;

      // insert applicant data to db
      const { data, error } = await supabase.from("applicants").insert({
        name,
        phone,
        email,
        resume_url: resumeUrl,
        users_id: session.user.id,
      });

      if (error) {
        console.error("Error submitting form:", error);
        throw error;
      }

      setResumePreviewUrl("");
      setResumeFile("");
      onRefresh();
    } else {
      setErrorMessage("Please fill in all fields and upload a resume.");
    }
  };

  const handleUpdate = async () => {
    if (name && phone && email) {
      const updateData = { name, phone, email };

      if (resumeFile) {
        // get public resume url from storage
        const resumeBucketPath = `${session.user.id}/${resumeFile.name}`;
        const resp = await supabase.storage
          .from("resume")
          .getPublicUrl(resumeBucketPath);
        const resumeUrl = resp.data.publicUrl;

        // get uploaded resume name
        const uploadedResumeName = decodeURIComponent(
          applicant.resume_url.split("/").pop()
        );

        // check if resume file is the same as the uploaded one and rewrite it if it is
        if (resumeFile.name === uploadedResumeName) {
          const { data: file, error: uploadError } = await supabase.storage
            .from("resume")
            .update(resumeBucketPath, resumeFile, { upsert: true });
          updateData.resume_url = resumeUrl;
          setResumePreviewUrl("");
          setResumeFile("");
          if (uploadError) {
            console.log("uploadError: ", uploadError);
            throw uploadError;
          }
        } else {
          // upload new resume file and delete the old one
          const { data: file, error: uploadError } = await supabase.storage
            .from("resume")
            .upload(resumeBucketPath, resumeFile);
          updateData.resume_url = resumeUrl;
          setResumePreviewUrl("");
          setResumeFile("");
          if (uploadError) {
            console.log("uploadError: ", uploadError);
            throw uploadError;
          }

          // delete old resume file
          const { data, error: deleteError } = await supabase.storage
            .from("resume")
            .remove([`${session.user.id}/${uploadedResumeName}`]);
          if (deleteError) {
            console.log("deleteError: ", deleteError);
            throw deleteError;
          }
        }
      }

      // update applicant data
      const { data, error } = await supabase
        .from("applicants")
        .update(updateData)
        .eq("users_id", session.user.id);
      if (error) {
        console.error("Error updating applicant:", error);
        throw error;
      }
    } else {
      setErrorMessage("Please fill in all fields.");
    }
    onRefresh();
  };

  if (status === "loading") {
    return <Loading />;
  }
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-md ">
        {/* application form */}
        <form>
        <h2 className="text-2xl font-semibold mb-6 text-dark">
          Application Form
        </h2>

        <label>
        {required ? (<span className="font-semibold after:content-['*'] after:ml-0.5">
        Input your Name
          </span>):(<span className="font-semibold">Update Name</span>)}</label>
          <input
            className="w-full border-gray-300 px-4 rounded-lg m-2 invalid:border-red-500 invalid:ring-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

<div style={{ height: '0em' }}>
          {name !== "" &&
              name.length < 2 &&
              (required === true ? (
                <p className="w-full text-center invalid:visible text-center text-red-500">
                  Name is required. It must be at minimum 2 characters
                </p>
              ) : (
                <p className="w-full text-center invalid:visible text-center text-red-500">
                  Name must be at minimum 2 characters
                </p>
              ))}
              </div>

              <br />

              <label>
        {required ? (<span className="font-semibold after:content-['*'] after:ml-0.5">
        Input your Phone
          </span>):(<span className="font-semibold">Update Phone</span>)}</label>
          <input
            className="w-full border-2 w-64 border-gray-300 px-4 rounded-lg m-2 invalid:border-red-500 invalid:ring-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
            type="tel"
            id="phone"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

              {/*Phone number validation */}
              <div style={{ height: '0em' }}>
            {phone !== "" &&
            /^\d+$/.test(phone) &&
            phone.length < 10 &&
            required === true ? (
              <p className="w-full text-center invalid:visible text-center text-red-500">
                Phone number is required. It must be at least 10 numbers.
              </p>
            ) : phone !== "" && !/^\d+$/.test(phone) ? (
              <p className="w-full text-center invalid:visible text-center text-red-500">Numbers only</p>
            ) : phone !== "" && phone.length < 10 ? (
              required === false && (
                <p className="w-full text-center invalid:visible text-center text-red-500">
                  Phone number must be at least 10 numbers
                </p>
              )
            ) : null}
            </div>
        
        <br />

        <label>
        {required ? (<span className="font-semibold after:content-['*'] after:ml-0.5">
        Input your Email
          </span>):(<span className="font-semibold">Update Email</span>)}</label>
          <input
            className="w-full border-2 w-64 border-gray-300 px-4 rounded-lg m-2 invalid:border-red-500 invalid:ring-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
       
       <div style={{ height: '0em' }}>
       {email !== "" && !emailRegex.test(email) && (
          <p className="text-center invalid:visible text-center text-red-500">
            Please enter a valid email address.
          </p>
        )}
        </div>

        <br />

        {/*<label className="h-[100px] w-[160px] border-[3px] border-dark rounded cursor-pointer flex flex-col items-center justify-center">
          {resumeFile || applicant?.resume_url ? (
            <span className="font-semibold">Update Resume</span>
          ) : (
            <span className="font-semibold after:content-['*'] after:ml-0.5">
              Upload Resume
            </span>
          )}</label>
          <GrDocumentUpload className="text-5xl mt-2" />
          <input
            type="file"
            accept="application/pdf"
            onChange={resumeHandler}
            className="hidden"
            required={resumeFile || applicant?.resume_url ? false : true}
          />

          {resumeFile ? null : (
              <p className="text-center text-red-500">A resume is required</p>
            )}*/}

{/*Update colours and stuff in styles > globals.css */}
<div className="fileUploadContainer">
              <label
                htmlFor="fileUpload"
                className="text-center custom-file-upload hover:bg-primary"
              ><i className="fa fa-file-arrow-up fileIcon"></i>
                {required ? (
                <span className="font-semibold after:content-['*'] after:ml-0.5">Upload Resume</span>
              ) : (
                <span className="font-semibold">
                  Update Resume
                </span>
              )}</label>
              {/*<GrDocumentUpload className="text-5xl mt-2" />*/}
              <input
                id="fileUpload"
                type="file"
                name="fileUpload"
                onChange={resumeHandler}
                required
              />

              {required ? <p className="text-center invalid:visible text-center text-red-500">A resume is required</p> : (
                null
              )}
            </div>

      

        {/* Preview resume */}
        {resumePreviewUrl && (
          <div className="text-lg font-semibold mt-4">
            <p className=" text-primary mb-2">Preview Resume: </p>
            <div className=" border-b-[3px] border-dark rounded py-2">
              <a
                href={resumePreviewUrl}
                target="_blank"
                className="flex justify-between items-center hover:underline"
              >
                <div className="flex justify-center items-center mr-1 overflow-hidden">
                  <GrDocumentPdf className="text-3xl mr-3 flex-shrink-0" />
                  <p className="max-w-[350px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {resumeFile?.name}
                  </p>
                </div>
                <BiArrowFromLeft className="text-2xl flex-shrink-0" />
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
                    {decodeURIComponent(applicant.resume_url.split("/").pop())}
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
            className="w-full px-4 py-2 font-semibold text-black bg-primary rounded mt-2"
            onClick={handleUpdate}
          >
            Update Profile
          </button>
        ) : (
          <button
            className="w-full px-4 py-2 font-semibold text-white bg-primary rounded mt-6"
            onClick={handleSubmit}
          >
            Create Profile
          </button>
        )}
        </form>
      </div>
    </div>
  );
};

export default Applicantdashboard;
