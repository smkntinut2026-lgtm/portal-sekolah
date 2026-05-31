'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, School, Megaphone, Images, KeyRound, LogOut, Menu, ExternalLink, ChevronLeft, X, BookMarked } from 'lucide-react'

const MENU = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={17} /> },
  { label: 'Profil Sekolah', href: '/admin/profil', icon: <School size={17} /> },
  { label: 'Jurusan', href: '/admin/jurusan', icon: <BookMarked size={17} /> },
  { label: 'Pengumuman', href: '/admin/pengumuman', icon: <Megaphone size={17} /> },
  { label: 'Galeri', href: '/admin/galeri', icon: <Images size={17} /> },
  { label: 'Ganti Password', href: '/admin/password', icon: <KeyRound size={17} /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ok = sessionStorage.getItem('admin_logged_in')
      if (!ok && pathname !== '/admin') router.push('/admin')
    }
  }, [pathname, router])

  const logout = () => {
    sessionStorage.removeItem('admin_logged_in')
    sessionStorage.removeItem('admin_username')
    router.push('/admin')
  }

  if (pathname === '/admin') return <>{children}</>

  const current = MENU.find(m => m.href === pathname)

  return (
      <div className="admin-root" style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', color: '#0f172a' }}>

      {/* Sidebar */}
      <aside style={{
        width: 256, background: '#0f172a', color: 'white',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)'
      }} className="admin-sidebar">

        {/* Brand */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏫</div>
            <div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>Admin Panel</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Portal Sekolah</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', overflowY: 'auto' }}>
          {MENU.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.7rem',
                  padding: '0.65rem 0.9rem', borderRadius: 10,
                  color: active ? 'white' : 'rgba(255,255,255,0.55)',
                  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none', fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <span style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
                {item.label}
                {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }} />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.9rem', borderRadius: 10, color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '0.15rem', transition: 'all 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = 'rgba(255,255,255,0.8)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.45)' }}>
            <ExternalLink size={14} /> Lihat Website
          </a>
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.6rem 0.9rem', borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(239,68,68,0.2)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(239,68,68,0.12)' }}>
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }} className="admin-main">

        {/* Topbar */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => setSidebarOpen(s => !s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'none', padding: '0.25rem' }}
              className="sidebar-toggle">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
              <Link href="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none' }}>Dashboard</Link>
              {current && current.href !== '/admin/dashboard' && (
                <><span style={{ color: '#e2e8f0' }}>/</span><span style={{ color: '#0f172a', fontWeight: 600 }}>{current.label}</span></>
              )}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>A</div>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Admin</span>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          {pathname !== '/admin/dashboard' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Link href="/admin/dashboard"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.82rem', textDecoration: 'none', padding: '0.4rem 0.8rem', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 500, transition: 'all 0.15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#2563eb'; el.style.borderColor = '#2563eb' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#64748b'; el.style.borderColor = '#e2e8f0' }}>
                <ChevronLeft size={14} /> Kembali ke Dashboard
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(${sidebarOpen ? '0' : '-100%'}) !important; }
          .admin-main { margin-left: 0 !important; }
          .sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
