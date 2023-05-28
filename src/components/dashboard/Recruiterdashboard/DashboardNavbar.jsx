import React, { useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import { useSession } from 'next-auth/react'
import { MdDashboard, MdOutlinePostAdd } from 'react-icons/md'
import Link from 'next/link'

const DashboardNavbar = () => {
  const { data: seesion } = useSession()
  const [activeLink, setActiveLink] = useState('Profile')

  const handleLinkClick = (link) => {
    setActiveLink(link)
  }

  return (
    <div className="w-72 shadow-lg rounded-3xl px-4 py-6 hidden md:block">
      <ul className="flex  flex-col  gap-4 items-start justify-center ">
        <li className="flex w-full items-center flex-1 border-b-4 border-primary pb-2">
          <MdDashboard className="text-2xl inline-block mr-3 text-primary" />
          <span className="font-bold">Dashboard</span>
        </li>
        <li className="w-full">
          <Link
            href={`/dashboard/profile/${seesion.user.id}}`}
            className={`flex items-center flex-1 hover:text-primary focus:text-primary active:text-primary border-b pb-2 
            ${activeLink === 'Profile' ? 'text-primary' : ''}`}
            onClick={() => handleLinkClick('Profile')}
          >
            <CgProfile className="text-2xl inline-block mr-3" />
            <span className="font-semibold">Profile</span>
          </Link>
        </li>
        <li className="w-full">
          <Link
            href={`/dashboard/jobmanagement/${seesion.user.id}`}
            className={`flex items-center flex-1 hover:text-primary focus:text-primary active:text-primary border-b pb-2 
            ${activeLink === 'Job management' ? 'text-primary' : ''}`}
            onClick={() => handleLinkClick('Job management')}
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
