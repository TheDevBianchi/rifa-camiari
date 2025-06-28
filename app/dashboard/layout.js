import { AuthGuard } from '@/components/auth/auth-guard'
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/layout/navbar'
import { ThemeProvider } from '@/components/providers/theme-provider'

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard de la aplicación de rifas'
}

export default function Layout ({ children }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
    >
      <AuthGuard>
        <div className='min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-black to-amber-900/5'>
          <div className='relative'>
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#f59e0b10_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b10_1px,transparent_1px)] bg-[size:14px_24px]'></div>
            <div className='flex min-h-screen relative'>
              <div className='hidden md:block'>
                <Sidebar />
              </div>
              <main className='flex-1 overflow-y-auto'>
                <div className='flex items-center md:hidden'>
                  <Sidebar />
                  <div className='flex-1'>
                    <Navbar />
                  </div>
                </div>
                <div className='p-6'>{children}</div>
              </main>
            </div>
          </div>
        </div>
      </AuthGuard>
    </ThemeProvider>
  )
}
