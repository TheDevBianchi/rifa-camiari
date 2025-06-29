import { AuthGuard } from '@/components/auth/auth-guard'
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/layout/navbar'
import { ThemeProvider } from '@/components/providers/theme-provider'
import AdminSidebarMobile from '@/components/layout/AdminSidebarMobile'

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
        <div className='min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/10 via-black to-primary-900/5'>
          <div className='relative'>
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#f59e0b10_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b10_1px,transparent_1px)] bg-[size:14px_24px]'></div>
            <div className='flex min-h-screen relative'>
              {/* Sidebar desktop */}
              <div className='hidden md:block'>
                <Sidebar />
              </div>
              {/* Sidebar mobile */}
              <div className='block md:hidden'>
                <AdminSidebarMobile />
              </div>
              <main className='mt-16 md:mt-0 flex-1 overflow-y-auto'>
                <div className='p-6'>{children}</div>
              </main>
            </div>
          </div>
        </div>
      </AuthGuard>
    </ThemeProvider>
  )
}
