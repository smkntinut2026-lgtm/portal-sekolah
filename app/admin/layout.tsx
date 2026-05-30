'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, School, Megaphone, Image as ImageIcon,
  KeyRound, LogOut, Menu, ExternalLink, ChevronLeft
} from 'lucide-react'

const MENU = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Profil Sekolah', href: '/admin/profil', icon: <School size={18} /> },
  { label: 'Pengumuman', href: '/admin/pengumuman', icon: <Megaphone size={18} /> },
  { label: 'Galeri', href: '/admin/galeri', icon: <ImageIcon size={18} /> },
  { label: 'Ganti Password', href: '/admin/password', icon: <KeyRound size={18} /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('admin_logged_in')
      if (!loggedIn && pathname !== '/admin') router.push('/admin')
    }
  }, [pathname, router])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in')
    sessionStorage.removeItem('admin_username')
    router.push('/admin')
  }

  if (pathname === '/admin') return <>{children}</>

  const currentMenu = MENU.find(m => m.href === pathname)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

      {/* Sidebar */}
      <aside style={{
        width: 260, background: 'linear-gradient(180deg, #0f2744 0%, var(--primary) 100%)',
        color: 'white', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transition: 'transform 0.3s', boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
      }} className="admin-sidebar">

        {/* Brand */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent)', borderRadius: 10, padding: '0.5rem', fontSize: 20, lineHeight: 1 }}>🏫</div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700 }}>Admin Panel</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.1rem' }}>Portal Sekolah</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {MENU.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 1rem', borderRadius: 10,
                  color: active ? 'white' : 'rgba(255,255,255,0.65)',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  textDecoration: 'none', fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  border: active ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                {item.label}
                {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textDecoration: 'none', padding: '0.4rem 0.5rem', borderRadius: 6 }}>
            <ExternalLink size={13} /> Lihat Website
          </a>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5', cursor: 'pointer', fontSize: '0.8rem', padding: '0.5rem 0.75rem', borderRadius: 6, width: '100%' }}>
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main">

        {/* Topbar */}
        <header style={{
          background: 'white', borderBottom: '1px solid #e2e8f0',
          padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'none', padding: '0.4rem' }}
              className="sidebar-toggle">
              <Menu size={22} />
            </button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Link href="/admin/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Dashboard</Link>
              {currentMenu && currentMenu.href !== '/admin/dashboard' && (
                <>
                  <span style={{ color: 'var(--border)' }}>/</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{currentMenu.label}</span>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>A</div>
              Admin
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          {/* Tombol kembali (tampil jika bukan dashboard) */}
          {pathname !== '/admin/dashboard' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <Link href="/admin/dashboard"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', padding: '0.4rem 0.85rem', borderRadius: 8, border: '1px solid var(--border)', background: 'white', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
                <ChevronLeft size={15} /> Kembali ke Dashboard
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(${sidebarOpen ? '0' : '-100%'}); }
          .admin-main { margin-left: 0 !important; }
          .sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
