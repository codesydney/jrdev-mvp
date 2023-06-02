import Layout from "@/components/layout/Layout";
import Card from "@/components/Card";
import { getSession } from "next-auth/react";
import { createSupabaseClient } from "@/lib/supabaseClient";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <article className="prose flex flex-col items-center">
        <div className="text-center ">
          <h1 className="m-0 text-black">Jr-dev</h1>
          <p className="m-0 text-dark font-semibold">From Code.Sydney</p>
        </div>

        <div className="flex flex-col md:flex-row md:gap-[10%] h-[45vh]">
          <Card
            title="Recruiter"
            text="Make an account with jr-dev to find and hire qualified dev's in your area"
          />
          <Card
            title="Jr developer"
            text="Make an account with jr-dev to find Local jobs and stand out from the crowd"
          />
        </div>
      </article>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return {
      props: {},
    };
  }
  const supabase = createSupabaseClient(session.supabaseAccessToken);

  const userId = session.user.id;
  const res = await supabase
    .from("users")
    .select("role")
    .limit(1)
    .single()
    .eq("id", userId);

  const role = res.data.role ?? null;
  if (role === null) {
    return {
      redirect: {
        destination: "/roleselect",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
