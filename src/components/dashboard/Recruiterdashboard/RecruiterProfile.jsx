import { useState, useEffect } from "react";
import { GrStatusWarning, GrStatusGood } from "react-icons/gr";
import { useSession } from "next-auth/react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Loading from "@/components/Loading";

const RecruiterProfile = ({ recruiter, onRefresh }) => {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // set applicant data to state
  useEffect(() => {
    if (recruiter && errorMessage === "") {
      setCompanyName(recruiter.company);
      setName(recruiter.name);
      setPhone(recruiter.phone);
      setEmail(recruiter.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruiter]);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  const { data: session, status } = useSession();
  const supabase = createSupabaseClient(session.supabaseAccessToken);

  const companyNameHandler = (e) => {
    setCompanyName(e.target.value);
  };

  const nameHandler = (e) => {
    setName(e.target.value);
  };

  const phoneHandler = (e) => {
    setPhone(e.target.value);
  };

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  // create profile
  const handleSubmit = async () => {
    try {
      if (!name || !phone || !email || !companyName) {
        setErrorMessage("Please fill all the fields");
      } else {
        const { data, error } = await supabase.from("recruiters").insert({
          name,
          phone,
          email,
          company: companyName,
          users_id: session.user.id,
        });
        onRefresh();
        setSuccessMessage("Profile created successfully");

        if (error) {
          setErrorMessage(error.message);
          throw new Error(error.message);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // update profile
  const handleUpdate = async () => {
    try {
      if (!name || !phone || !email || !companyName) {
        setErrorMessage("Please fill all the fields");
      } else {
        const { data, error } = await supabase
          .from("recruiters")
          .update({
            name,
            phone,
            email,
            company: companyName,
          })
          .eq("users_id", session.user.id);
        onRefresh();
        setSuccessMessage("Profile updated successfully");
        if (error) {
          setErrorMessage(error.message);
          throw new Error(error.message);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex rounded-3xl items-center justify-center md:w-[60%]">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg shadow-lg">
        {/* profile form */}
        <h2 className="text-2xl font-semibold mb-6 text-dark">My Profile</h2>

        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">
            Company Name
          </span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={companyNameHandler}
          />
        </label>

        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">
            Name
          </span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="text"
            placeholder="Name"
            value={name}
            onChange={nameHandler}
          />
        </label>
        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">
            Phone
          </span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={phoneHandler}
          />
        </label>

        <label>
          <span className="font-semibold after:content-['*'] after:ml-0.5">
            Email
          </span>
          <input
            className="w-full p-2 mb-4 border-[3px] border-dark rounded"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={emailHandler}
          />
        </label>

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
        {recruiter ? (
          <button
            className="w-full px-4 py-2 font-semibold text-white bg-primary rounded mt-2"
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
      </div>
    </div>
  );
};

export default RecruiterProfile;
