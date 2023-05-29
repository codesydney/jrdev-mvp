import { useState, useEffect } from 'react'
import { GrDocumentUpload, GrDocumentPdf, GrStatusWarning } from 'react-icons/gr'
import { CgProfile } from 'react-icons/cg'
import { MdDashboard, MdOutlinePostAdd } from 'react-icons/md'

import { FiDownload } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { createSupabaseClient } from '@/lib/supabaseClient'
import DashboardNavbar from './Recruiterdashboard/DashboardNavbar'
import RecruiterProfile from './Recruiterdashboard/RecruiterProfile'
import JobMangement from './Recruiterdashboard/JobMangement'
import { useRouter } from 'next/router'

import Link from 'next/link'
const Recruiterdashboard = ({ recruiter, jobList, onRefresh }) => {
  const router = useRouter()
  console.log('router', router)
  return (
    <div className="flex w-full justify-center items-center min-h-screen m-auto bg-gray-100">
      <div className="flex w-full justify-center lg:justify-even items-start gap-2 md:gap-20 md:w-[80%] m-auto">
        {/* Navbar */}
        <DashboardNavbar />
        {/* main */}
        {router.query.id[0] === 'profile' && (
          <RecruiterProfile recruiter={recruiter} onRefresh={onRefresh} />
        )}
        {router.query.id[0] === 'jobmanagement' && (
          <JobMangement jobList={jobList} recruiter={recruiter} onRefresh={onRefresh} />
        )}
      </div>
    </div>
  )
}

export default Recruiterdashboard
