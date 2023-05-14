import { useState, useEffect } from 'react'
import { GrDocumentUpload, GrDocumentPdf, GrStatusWarning } from 'react-icons/gr'
import { CgProfile } from 'react-icons/cg'
import { MdDashboard, MdOutlinePostAdd } from 'react-icons/md'

import { FiDownload } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { createSupabaseClient } from '@/lib/supabaseClient'
import DashboardNavbar from './DashboardNavbar'
import RecruiterProfile from './RecruiterProfile'
const Recruiterdashboard = ({ recruiter, onRefresh }) => {
  return (
    <div className="flex w-full border-2 justify-center items-center min-h-screen m-auto">
      <div className="flex justify-center items-start gap-2 md:gap-20 w-[80%]  m-auto">
        {/* Navbar */}
        <DashboardNavbar />
        {/* main */}
        <RecruiterProfile recruiter={recruiter} />
      </div>
    </div>
  )
}

export default Recruiterdashboard
