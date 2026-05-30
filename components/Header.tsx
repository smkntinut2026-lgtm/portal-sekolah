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
    color: active ? '#fff' : 'rgba(238,242,255,0.6)',
    background: active
      ? 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.2) 100%)'
      : 'transparent',
    border: active ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '0.01em',
  })

  return (
    <>
      <style>{`
        .nav-link:hover { color: #fff !important; background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.12) !important; }
        .dropdown-item:hover { background: linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%) !important; color: #fff !important; }
        .spmb-btn:hover { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 0 30px rgba(99,102,241,0.5) !important; transform: translateY(-1px); }
        .ext-btn:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.2) !important; color: #fff !important; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled
          ? 'rgba(5,7,15,0.8)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(99,102,241,0.12)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
            <div style={{ position: 'relative' }}>
              {profile?.logo_url
                ? <Image src={profile.logo_url} alt="Logo" width={40} height={40} style={{ borderRadius: 11, objectFit: 'cover', border: '1.5px solid rgba(99,102,241,0.4)', display: 'block' }} />
                : (
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={20} color="white" />
                  </div>
                )
              }
              <div style={{ position: 'absolute', inset: -1, borderRadius: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.3))', opacity: 0.4, pointerEvents: 'none' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#eef2ff', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                {profile?.nama_sekolah || 'Portal Sekolah'}
              </div>
              {profile?.npsn && <div style={{ fontSize: '0.62rem', color: 'rgba(238,242,255,0.35)', marginTop: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>NPSN {profile.npsn}</div>}
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }} className="desktop-nav">

            {NAV_LEFT.map(l => {
              const active = pathname === l.href
              return (
                <Link key={l.href} href={l.href} className="nav-link" style={navLinkStyle(active)}>
                  {l.label}
                </Link>
              )
            })}

            {/* Profil dropdown */}
            <div
              ref={profilRef}
              style={{ position: 'relative' }}
              onMouseEnter={hasDropdown ? handleMouseEnter : undefined}
              onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/profil" className="nav-link" style={{
                  ...navLinkStyle(isProfilActive),
                  borderRadius: hasDropdown ? '10px 0 0 10px' : 10,
                  borderRight: hasDropdown ? 'none' : undefined,
                }}>
                  Profil
                </Link>
                {hasDropdown && (
                  <button
                    onClick={() => setProfilOpen(o => !o)}
                    style={{
                      padding: '0.45rem 0.45rem',
                      borderRadius: '0 10px 10px 0',
                      color: isProfilActive ? '#fff' : 'rgba(238,242,255,0.6)',
                      background: isProfilActive ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))' : 'transparent',
                      border: isProfilActive ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
                      borderLeft: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center',
                    }}>
                    <ChevronDown size={13} style={{ transition: 'transform 0.25s', transform: profilOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                )}
              </div>

              {hasDropdown && profilOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', left: 0,
                  minWidth: 210,
                  background: 'rgba(8,12,24,0.95)',
                  backdropFilter: 'blur(30px) saturate(200%)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 14,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.05)',
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
                }}>
                  <div style={{ padding: '0.45rem' }}>
                    {dropdownItems.map(item => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="dropdown-item"
                        onClick={() => setProfilOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.65rem',
                          padding: '0.65rem 0.9rem', borderRadius: 10,
                          color: 'rgba(238,242,255,0.65)',
                          textDecoration: 'none', fontSize: '0.82rem',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 500,
                          transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: 0 }}>{item.icon}</span>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 0.6rem' }} />

            {/* SPMB pill button */}
            <Link href={SPMB_HREF} className="spmb-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 1.1rem',
              borderRadius: 10,
              fontSize: '0.78rem', fontWeight: 800,
              color: '#a5b4fc',
              border: '1px solid rgba(99,102,241,0.3)',
              textDecoration: 'none',
              background: 'rgba(99,102,241,0.1)',
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              SPMB
            </Link>

            {EXT.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                className="ext-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 10,
                  fontSize: '0.78rem', fontWeight: 500,
                  color: 'rgba(238,242,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                {l.label} <ExternalLink size={10} />
              </a>
            ))}
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'none', padding: '0.25rem' }}
            className="mobile-burger">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setMenuOpen(false)} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(8,12,24,0.98)', borderBottom: '1px solid rgba(99,102,241,0.2)', padding: '5rem 1.5rem 2rem', backdropFilter: 'blur(30px)' }}>

            {NAV_LEFT.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '0.9rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: pathname === l.href ? '#818cf8' : 'rgba(238,242,255,0.6)', textDecoration: 'none', fontWeight: pathname === l.href ? 700 : 500, fontSize: '1rem' }}>
                {l.label}
              </Link>
            ))}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Link href="/profil" onClick={() => setMenuOpen(false)}
                  style={{ color: isProfilActive ? '#818cf8' : 'rgba(238,242,255,0.6)', textDecoration: 'none', fontWeight: isProfilActive ? 700 : 500, fontSize: '1rem' }}>
                  Profil
                </Link>
                {hasDropdown && (
                  <button onClick={() => setMobileProfilOpen(o => !o)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(238,242,255,0.5)', padding: '0.25rem', display: 'flex' }}>
                    <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: mobileProfilOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                )}
              </div>
              {hasDropdown && mobileProfilOpen && (
                <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: 12, margin: '0.4rem 0', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.12)' }}>
                  {dropdownItems.map(item => (
                    <a key={item.href} href={item.href}
                      onClick={() => { setMenuOpen(false); setMobileProfilOpen(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', color: 'rgba(238,242,255,0.65)', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#818cf8' }}>{item.icon}</span>
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link href={SPMB_HREF} onClick={() => setMenuOpen(false)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.65rem 1.2rem', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                SPMB
              </Link>
              {EXT.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.65rem 1.1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(238,242,255,0.55)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  {l.label} <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
