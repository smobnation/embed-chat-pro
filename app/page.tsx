import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  const isDemo = process.env.DEMO === 'true'
  
  if (isDemo) {
    // Demo mode: always show landing page
    redirect('/landing')
  } else {
    // Production mode
    if (session) {
      // Logged-in users go to dashboard
      redirect('/dashboard')
    } else {
      // Non-logged-in users go to login page
      redirect('/login')
    }
  }
}

