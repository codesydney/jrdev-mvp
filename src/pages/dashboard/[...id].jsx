import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import Applicantdashboard from "@/components/dashboard/Applicantdashboard";
import Recruiterdashboard from "@/components/dashboard/Recruiterdashboard";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Loading from "@/components/Loading";

const Dashboard = ({
  role,
  initialApplicant,
  initialRecrutier,
  initialJobList,
}) => {
  const { data: session, status } = useSession();
  const [applicant, setApplicant] = useState(initialApplicant);
  const [recruiter, setRecruiter] = useState(initialRecrutier);
  const [jobList, setJobList] = useState(initialJobList);

  const fetchExistingData = async () => {
    const supabase = createSupabaseClient(session.supabaseAccessToken);
    if (role === "applicant") {
      const userId = session.user.id;
      const applicant = await supabase
        .from("applicants")
        .select()
        .limit(1)
        .single()
        .eq("users_id", userId);

      setApplicant(applicant.data);
    } else if (role === "recruiter") {
      const userId = session.user.id;
      const recruiter = await supabase
        .from("recruiters")
        .select()
        .limit(1)
        .single()
        .eq("users_id", userId);

      let jobList = null;
      if (recruiter?.data) {
        const jobListRes = await supabase
          .from("jobdescription")
          .select("id, jobdescription_url")
          .eq("recruiters_id", recruiter.data.id);
        jobList = jobListRes.data;
      }

      setRecruiter(recruiter.data);
      setJobList(jobList);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div>Access denied. Please log in. Redirect to login page then.</div>
    );
  }

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <>
      {role === "applicant" && (
        <Applicantdashboard
          applicant={applicant}
          onRefresh={fetchExistingData}
        />
      )}
      {role === "recruiter" && (
        <Recruiterdashboard
          recruiter={recruiter}
          jobList={jobList}
          onRefresh={fetchExistingData}
        />
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const supabase = createSupabaseClient(session.supabaseAccessToken);
  const userId = session.user.id;
  const users = await supabase
    .from("users")
    .select("role")
    .limit(1)
    .single()
    .eq("id", userId);

  console.log("users: ", users);
  if (!users.data) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  if (users.data.role === "applicant") {
    const applicant = await supabase
      .from("applicants")
      .select()
      .limit(1)
      .single()
      .eq("users_id", userId);
    console.log("applicant: ", applicant.data);
    if (!applicant.data) {
      return {
        props: { role: users.data.role },
      };
    } else {
      return {
        props: { role: users.data.role, initialApplicant: applicant.data },
      };
    }
  }

  if (users.data.role === "recruiter") {
    const recruiter = await supabase
      .from("recruiters")
      .select()
      .limit(1)
      .single()
      .eq("users_id", userId);

    console.log("recruiter: ", recruiter.data);
    let jobdescription = null;
    if (recruiter?.data) {
      const jobdescriptionRes = await supabase
        .from("jobdescription")
        .select("id,jobdescription_url")
        .eq("recruiters_id", recruiter.data.id);
      jobdescription = jobdescriptionRes.data;
    }

    return {
      props: {
        role: users.data.role,
        initialRecrutier: recruiter.data,
        initialJobList: jobdescription,
      },
    };
  }

  return {
    props: {},
  };
}

export default Dashboard;
