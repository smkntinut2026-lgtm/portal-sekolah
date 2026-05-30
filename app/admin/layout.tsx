'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, School, Megaphone, Image, KeyRound, LogOut, Menu, X, ExternalLink } from 'lucide-react'

const MENU = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Profil Sekolah', href: '/admin/profil', icon: <School size={18} /> },
  { label: 'Pengumuman', href: '/admin/pengumuman', icon: <Megaphone size={18} /> },
  { label: 'Galeri', href: '/admin/galeri', icon: <Image size={18} /> },
  { label: 'Ganti Password', href: '/admin/password', icon: <KeyRound size={18} /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('admin_logged_in')
      if (!loggedIn && pathname !== '/admin') {
        router.push('/admin')
      }
    }
  }, [pathname, router])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in')
    sessionStorage.removeItem('admin_username')
    router.push('/admin')
  }

  if (pathname === '/admin') return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: sidebarOpen ? 0 : -240, bottom: 0, zIndex: 50, transition: 'left 0.3s'
      }} className="admin-sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700 }}>🏫 Admin Panel</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>Portal Sekolah</div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {MENU.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1.25rem',
                color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.7)',
                background: pathname === item.href ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: pathname === item.href ? 600 : 400,
                borderLeft: pathname === item.href ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.15s'
              }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', textDecoration: 'none' }}>
            <ExternalLink size={14} /> Lihat Website
          </a>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Top bar */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', color: 'var(--text)' }} className="sidebar-toggle">
            <Menu size={22} />
          </button>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Selamat datang, <strong>Admin</strong>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem 0.85rem', borderRadius: 6, fontSize: '0.8rem' }}>
            <LogOut size={14} /> Keluar
          </button>
        </div>

        <div style={{ padding: '2rem', flex: 1 }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { left: ${sidebarOpen ? '0' : '-240px'} !important; }
          .admin-main { margin-left: 0 !important; }
          .sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
