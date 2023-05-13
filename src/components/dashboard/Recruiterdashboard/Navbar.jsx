import { CgProfile } from 'react-icons/cg'
import { MdDashboard, MdOutlinePostAdd } from 'react-icons/md'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="w-[15%] shadow-lg rounded-3xl  px-4 py-6">
      <ul className="flex flex-col  gap-4 items-start justify-center ">
        <li className="flex w-full items-center flex-1 border-b pb-2">
          <MdDashboard className="text-2xl inline-block mr-3" />
          <span className="">Dash board</span>
        </li>
        <li className="w-full border-b pb-2">
          <Link
            href="/dashboard/bc25e653-057f-47ce-91ce-9c34dee84f6b"
            className="flex items-center flex-1 "
          >
            <CgProfile className="text-2xl inline-block mr-3" />
            <span className="">Profile</span>
          </Link>
        </li>
        <li className="w-full border-b pb-2">
          <Link
            href="/dashboard/bc25e653-057f-47ce-91ce-9c34dee84f6b"
            className="flex items-center"
          >
            <MdOutlinePostAdd className="text-2xl inline-block mr-3" />
            <span>Post a job</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
