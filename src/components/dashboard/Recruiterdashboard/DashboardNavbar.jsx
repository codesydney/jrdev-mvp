import { CgProfile } from 'react-icons/cg'
import { useSession } from 'next-auth/react'
import { MdDashboard, MdOutlinePostAdd } from 'react-icons/md'
import Link from 'next/link'

const DashboardNavbar = () => {
  const { data: seesion } = useSession()
  return (
    <div className="w-[25%] shadow-lg rounded-3xl px-4 py-6 hidden md:block">
      <ul className="flex flex-col  gap-4 items-start justify-center ">
        <li className="flex w-full items-center flex-1 border-b-4 border-primary pb-2">
          <MdDashboard className="text-2xl inline-block mr-3 text-primary" />
          <span className="font-bold">Dashboard</span>
        </li>
        <li className="w-full  ">
          <Link
            href={`/dashboard/profile/${seesion.user.id}}`}
            className="flex items-center flex-1 hover:text-primary focus:text-primary active:text-primary border-b pb-2"
          >
            <CgProfile className="text-2xl inline-block mr-3" />
            <span className="font-semibold">Profile</span>
          </Link>
        </li>
        <li className="w-full">
          <Link
            href="/dashboard/bc25e653-057f-47ce-91ce-9c34dee84f6b"
            className="flex items-center hover:text-primary focus:text-primary active:text-primary border-b pb-2"
          >
            <MdOutlinePostAdd className="text-2xl inline-block mr-3" />
            <span className="font-semibold">Job management</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default DashboardNavbar
