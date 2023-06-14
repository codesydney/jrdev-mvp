import { useRouter } from "next/router";
import { useState } from "react";

const User = () => {
  // const router = useRouter()
  // const { userid } = router.query
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState("");
  const required=true;

  let emailRegex =
  /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    const resumeHandler = (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      setResumeFile(file);
      if (file) {
        setResumePreviewUrl(URL.createObjectURL(file));
      }
    };

  const handleSubmit = () => {
    console.log(name, email, phone, resume);
  };

  return (
    <div>
      <div>
        <label className="block">Input your name</label>
        <input
        className="border-2 w-64 border-gray-300 px-4 rounded-lg m-2 invalid:border-red-500 invalid:ring-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required={true}
        />

<div style={{ height: '0em' }}>
        {name !== "" && name.length < 2 && (
          <p className="text-center invalid:visible text-center text-red-500">Name is required</p>
        )}
        </div>

        <label className="block">Input your email</label>
        <input
        className="border-2 w-64 border-gray-300 px-4 rounded-lg m-2 invalid:border-red-500 invalid:ring-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />

<div style={{ height: '0em' }}>
        {email !== "" && !emailRegex.test(email) && (
          <p className="text-center invalid:visible text-center text-red-500">
            Entered Email address is invalid
          </p>
        )}
        </div>

        <br />

        <label className="block">Input your phone</label>
        <input
        className="border-2 w-64 border-gray-300 px-4 rounded-lg m-2 invalid:border-red-500 invalid:ring-red-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
          type="tel"
          name="phone"
          onChange={(e) => setPhone(e.target.value)}
          required={true}
        />

         {/*Phone number validation */}
         <div style={{ height: '0em' }}>
         {phone !== "" &&
            /^\d+$/.test(phone) &&
            phone.length < 10 ? (
              <p className="text-center invalid:visible text-center text-red-500">
                Phone number is required. It must be at least 10 numbers.
              </p>
            ) : phone !== "" && !/^\d+$/.test(phone) ? (
              <p className="text-center invalid:visible text-center text-red-500">Numbers only</p>
            ) : null}
            </div>

            <br />

{/*Update colours and stuff in styles > globals.css */}
<div className="fileUploadContainer">
              <label
                htmlFor="fileUpload"
                className="text-center custom-file-upload"
              >
                <i className="fa fa-file-arrow-up fileIcon"></i>
                <span>Upload Resume</span>
              </label>
              <input
                id="fileUpload"
                type="file"
                name="fileUpload"
                onChange={resumeHandler}
                value={resumeFile}
                required={true}
              />

              {required && resumeFile ? null : (
                <p className="text-center invalid:visible text-center text-red-500">A resume is required</p>
              )}
            </div>

        <button
          className="relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        bg-white 
        border-black 
        text-black
        text-md py-3 font-semibold border-2 mt-6"
          disabled={
            !name ||
            !email ||
            !emailRegex.test(formInput.email) ||
            phone ||
            resume
          }
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default User;
