'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { Menu, X, ExternalLink, ChevronDown, Target, BookOpen, User, GraduationCap } from 'lucide-react'

const SPMB_HREF = '/spmb'
const EXT = [
  { label: 'Arsip File', href: 'https://arsip-sekolah-peach.vercel.app/' },
]

export default function Header() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profilOpen, setProfilOpen] = useState(false)
  const [mobileProfilOpen, setMobileProfilOpen] = useState(false)
  const profilRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => { if (data) setProfile(data) })
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profilRef.current && !profilRef.current.contains(e.target as Node)) {
        setProfilOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const dropdownItems = [
    profile?.kepsek_nama ? { label: 'Kepala Sekolah', href: '/profil#kepsek', icon: <User size={14} /> } : null,
    profile?.visi || profile?.misi ? { label: 'Visi & Misi', href: '/profil#visi-misi', icon: <Target size={14} /> } : null,
    profile?.sejarah ? { label: 'Sejarah Sekolah', href: '/profil#sejarah', icon: <BookOpen size={14} /> } : null,
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode }[]

  const hasDropdown = dropdownItems.length > 0
  const isProfilActive = pathname === '/profil' || pathname.startsWith('/profil')

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setProfilOpen(true)
  }
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setProfilOpen(false), 150)
  }

  const NAV_LEFT = [
    { label: 'Beranda', href: '/' },
    { label: 'Pengumuman', href: '/pengumuman' },
    { label: 'Galeri', href: '/galeri' },
  ]

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.45rem 1rem',
    borderRadius: 10,
    fontSize: '0.84rem',
    fontWeight: active ? 700 : 500,
    color: active ? '#7c4a00' : 'rgba(45,26,6,0.6)',
    background: active
      ? 'linear-gradient(135deg, rgba(184,121,26,0.18) 0%, rgba(212,146,31,0.14) 100%)'
      : 'transparent',
    border: active ? '1px solid rgba(184,121,26,0.3)' : '1px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '0.01em',
  })

  return (
    <>
      <style>{`
        .nav-link:hover { color: #7c4a00 !important; background: rgba(184,121,26,0.1) !important; border-color: rgba(184,121,26,0.22) !important; }
        .dropdown-item:hover { background: linear-gradient(135deg, rgba(184,121,26,0.12) 0%, rgba(212,146,31,0.08) 100%) !important; color: #7c4a00 !important; }
        .spmb-btn:hover { background: linear-gradient(135deg, #7c4a00 0%, #b8791a 100%) !important; color: #fff9ee !important; border-color: transparent !important; box-shadow: 0 0 30px rgba(184,121,26,0.55) !important; transform: translateY(-1px); }
        .ext-btn:hover { background: rgba(184,121,26,0.1) !important; border-color: rgba(184,121,26,0.3) !important; color: #7c4a00 !important; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled
          ? 'rgba(253,248,240,0.82)'
          : 'rgba(253,248,240,0.5)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: scrolled
          ? '1px solid rgba(184,121,26,0.22)'
          : '1px solid rgba(184,121,26,0.1)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: scrolled ? '0 4px 30px rgba(120,70,10,0.12)' : 'none',
      }}>
        {/* Glossy top stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(232,168,37,0.7) 30%, rgba(184,121,26,0.9) 50%, rgba(232,168,37,0.7) 70%, transparent)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

          {/* Left Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {NAV_LEFT.map(item => (
              <Link key={item.href} href={item.href} className="nav-link" style={navLinkStyle(pathname === item.href)}>{item.label}</Link>
            ))}
          </nav>

          {/* Logo center */}
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)', gap: 2 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #7c4a00 0%, #b8791a 50%, #e8a825 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(184,121,26,0.4), 0 2px 8px rgba(120,70,10,0.3)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.25)', borderRadius: '12px 12px 0 0' }} />
              <GraduationCap size={20} color="#fff9ee" style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <span style={{
              fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #7c4a00, #b8791a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {profile?.nama_sekolah?.split(' ').slice(0, 2).join(' ') || 'Portal Sekolah'}
            </span>
          </Link>

          {/* Right Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {/* Profil dropdown */}
            <div ref={profilRef} style={{ position: 'relative' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              {hasDropdown ? (
                <button
                  onClick={() => setProfilOpen(o => !o)}
                  className="nav-link"
                  style={{ ...navLinkStyle(isProfilActive), display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', background: isProfilActive ? 'linear-gradient(135deg,rgba(184,121,26,0.18),rgba(212,146,31,0.14))' : 'transparent', border: isProfilActive ? '1px solid rgba(184,121,26,0.3)' : '1px solid transparent' }}>
                  Profil
                  <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: profilOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
              ) : (
                <Link href="/profil" className="nav-link" style={navLinkStyle(isProfilActive)}>Profil</Link>
              )}

              {hasDropdown && profilOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 200,
                  background: 'rgba(253,248,240,0.95)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(184,121,26,0.2)', borderRadius: 14,
                  boxShadow: '0 8px 40px rgba(120,70,10,0.15), 0 2px 8px rgba(120,70,10,0.08)',
                  padding: '0.5rem', animation: 'slideDown 0.18s ease',
                  zIndex: 200,
                }}>
                  <Link href="/profil" className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', borderRadius: 9, color: 'rgba(45,26,6,0.65)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}>
                    <GraduationCap size={14} style={{ color: '#b8791a' }} /> Profil Sekolah
                  </Link>
                  <div style={{ height: 1, background: 'rgba(184,121,26,0.1)', margin: '0.25rem 0.5rem' }} />
                  {dropdownItems.map(item => (
                    <Link key={item.href} href={item.href} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', borderRadius: 9, color: 'rgba(45,26,6,0.65)', fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}>
                      <span style={{ color: '#b8791a' }}>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SPMB */}
            <a href={SPMB_HREF} className="spmb-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1.1rem', borderRadius: 10, fontSize: '0.84rem', fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(184,121,26,0.1), rgba(212,146,31,0.08))',
              color: '#7c4a00', border: '1px solid rgba(184,121,26,0.28)',
              textDecoration: 'none', transition: 'all 0.2s', letterSpacing: '0.01em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.3)', borderRadius: 'inherit', pointerEvents: 'none' }} />
              SPMB
            </a>

            {/* External links */}
            {EXT.map(e => (
              <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer" className="ext-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.45rem 0.85rem', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600,
                  background: 'transparent', color: 'rgba(45,26,6,0.5)',
                  border: '1px solid rgba(184,121,26,0.15)',
                  textDecoration: 'none', transition: 'all 0.2s',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                {e.label} <ExternalLink size={11} />
              </a>
            ))}
          </nav>

          {/* Mobile burger */}
          <button className="mobile-burger" onClick={() => setMenuOpen(o => !o)}
            style={{ display: 'none', background: 'rgba(184,121,26,0.1)', color: '#7c4a00', borderRadius: 10, padding: '0.5rem', cursor: 'pointer', border: '1px solid rgba(184,121,26,0.2)' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: 'rgba(253,248,240,0.97)', backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(184,121,26,0.15)',
            padding: '1rem 1.5rem 1.5rem',
          }}>
            {NAV_LEFT.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '0.7rem 0', fontSize: '0.95rem', fontWeight: 600, color: pathname === item.href ? '#7c4a00' : 'rgba(45,26,6,0.65)', textDecoration: 'none', borderBottom: '1px solid rgba(184,121,26,0.08)' }}>
                {item.label}
              </Link>
            ))}
            <div>
              <button onClick={() => setMobileProfilOpen(o => !o)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', fontSize: '0.95rem', fontWeight: 600, color: isProfilActive ? '#7c4a00' : 'rgba(45,26,6,0.65)', background: 'none', border: 'none', borderBottom: '1px solid rgba(184,121,26,0.08)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Profil <ChevronDown size={14} style={{ transform: mobileProfilOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {mobileProfilOpen && (
                <div style={{ paddingLeft: '1rem' }}>
                  <Link href="/profil" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '0.55rem 0', fontSize: '0.88rem', color: 'rgba(45,26,6,0.6)', textDecoration: 'none' }}>Profil Sekolah</Link>
                  {dropdownItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '0.55rem 0', fontSize: '0.88rem', color: 'rgba(45,26,6,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href={SPMB_HREF} style={{ display: 'block', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #7c4a00, #b8791a)', color: '#fff9ee', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>SPMB Online</a>
              {EXT.map(e => (
                <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '0.75rem 1rem', background: 'rgba(184,121,26,0.08)', color: '#7c4a00', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(184,121,26,0.18)' }}>{e.label} ↗</a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
