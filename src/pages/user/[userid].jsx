import { useRouter } from "next/router";
import { useState } from "react";

const User = () => {
  // const router = useRouter()
  // const { userid } = router.query
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState("");

  let emailRegex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const handleSubmit = () => {
    console.log(name, email, phone, resume);
  };

  return (
    <div>
      <div>
        <label>Input your name</label>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required={true}
        />

        {name !== "" && name.length < 1 && (
          <p className="text-center text-red-500">Name is required</p>
        )}

        <label>Input your email</label>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />

        {email !== "" && !emailRegex.test(email) && (
          <p className="text-center text-red-500">
            Entered Email address is invalid
          </p>
        )}

        <label>Input your phone</label>
        <input
          type="tel"
          name="phone"
          onChange={(e) => setPhone(e.target.value)}
          required={true}
          pattern="[0-9]{4}[0-9]{3}[0-9]{3}"
        />

        {phone !== "" && phone.length < 10 && (
          <p className="text-center text-red-500">
            Phone number needs to be 10 numbers
          </p>
        )}

        {/*should this be type=file?*/}
        <label>Input your resume</label>
        <input
          type="file"
          name="resume"
          //onChange={(e) => setResume(e.target.value)}
          required={true}
        />
        <input
          className="w-full disabled block bg-indigo-100 hover:bg-indigo-200 hover:scale-105 focus:bg-teal-700 text-white font-semibold rounded-lg px-4 py-3 mt-6"
          type="submit"
          onClick={(e) => setResume(e.target.value)}
        ></input>

        {resume.files.length == 0 && (
          <p className="text-center text-red-500">A Resume is required</p>
        )}

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
