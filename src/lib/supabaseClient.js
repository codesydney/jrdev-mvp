// import { createClient } from '@supabase/supabase-js'
// import { useSession } from 'next-auth/react'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// const useSupabaseClient = () => {
//   const { data: session } = useSession()

//   const supabaseAccessToken = session?.supabaseAccessToken
//   const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//     global: {
//       headers: {
//         Authorization: `Bearer ${supabaseAccessToken}`
//       }
//     }
//   })
//   return supabase
// }

// export default useSupabaseClient

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const createSupabaseClient = (accessToken) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  })

  return supabase
}
