import React, { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import { useSession } from 'next-auth/react'
import { MdDashboard, MdOutlinePostAdd } from 'react-icons/md'
import Link from 'next/link'
import { useRouter } from 'next/router'

const DashboardNavbar = () => {
  const { data: session } = useSession()
  const [activeLink, setActiveLink] = useState('Profile')
  const router = useRouter()

  useEffect(() => {
    if (router.query.id[0] === 'profile') {
      setActiveLink('Profile')
    }
    if (router.query.id[0] === 'jobmanagement') {
      setActiveLink('Job management')
    }
  }, [router.query.id])

  return (
    <>
      <div className="w-72 shadow-lg rounded-xl sm:rounded-3xl px-4 py-6 hidden md:block bg-white">
        <ul className="flex flex-col gap-4 items-start justify-center ">
          <li className="flex w-full items-center flex-1 border-b-4 border-primary pb-2">
            <MdDashboard className="text-2xl inline-block mr-3 text-primary" />
            <span className="font-bold">Dashboard</span>
          </li>
          <li className="w-full">
            <Link
              href={`/dashboard/profile/${session.user.id}}`}
              className={`flex items-center flex-1 hover:text-primary focus:text-primary active:text-primary border-b pb-2 
            ${activeLink === 'Profile' ? 'text-primary' : ''}`}
            >
              <CgProfile className="text-2xl inline-block mr-3" />
              <span className="font-semibold">Profile</span>
            </Link>
          </li>
          <li className="w-full">
            <Link
              href={`/dashboard/jobmanagement/${session.user.id}`}
              className={`flex items-center flex-1 hover:text-primary focus:text-primary active:text-primary border-b pb-2 
            ${activeLink === 'Job management' ? 'text-primary' : ''}`}
            >
              <MdOutlinePostAdd className="text-2xl inline-block mr-3" />
              <span className="font-semibold">Job management</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* mobile */}
      <div className="flex w-[90%] sm:w-[70%] shadow-lg items-center justify-center rounded-3xl px-4 py-6 md:hidden bg-white overflow-auto">
        <ul className="flex gap-4 items-end justify-evenly w-full text-xs sm:text-sm flex-wrap">
          <li className="flex flex-col items-center border-b-4 border-primary pb-2">
            <MdDashboard className="text-2xl inline-block mr-3 text-primary" />
            <span className="font-bold">Dashboard</span>
          </li>
          <li>
            <Link
              href={`/dashboard/profile/${session.user.id}`}
              className={`flex flex-col items-center hover:text-primary focus:text-primary active:text-primary border-b pb-2 
        ${activeLink === 'Profile' ? 'text-primary' : ''}`}
            >
              <CgProfile className="text-2xl inline-block mr-3" />
              <span className="font-semibold">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/dashboard/jobmanagement/${session.user.id}`}
              className={`flex flex-col items-center justify-center  hover:text-primary focus:text-primary active:text-primary border-b pb-2 
        ${activeLink === 'Job management' ? 'text-primary' : ''}`}
            >
              <MdOutlinePostAdd className="text-2xl inline-block mr-3" />
              <span className="font-semibold">Job management</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default DashboardNavbar
