'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { Menu, X, ExternalLink, ChevronDown, Target, BookOpen, User } from 'lucide-react'

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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profilRef.current && !profilRef.current.contains(e.target as Node)) {
        setProfilOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Build dropdown items based on what's filled in
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

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(7,11,18,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            {profile?.logo_url
              ? <Image src={profile.logo_url} alt="Logo" width={38} height={38} style={{ borderRadius: 9, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }} />
              : <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🏫</div>
            }
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.2 }}>
                {profile?.nama_sekolah || 'Portal Sekolah'}
              </div>
              {profile?.npsn && <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: 1, fontFamily: 'Space Grotesk, sans-serif' }}>NPSN {profile.npsn}</div>}
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }} className="desktop-nav">

            {/* Beranda */}
            {NAV_LEFT.map(l => {
              const active = pathname === l.href
              return (
                <Link key={l.href} href={l.href} style={{
                  padding: '0.4rem 0.9rem', borderRadius: 8,
                  fontSize: '0.85rem', fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  background: active ? 'var(--surface)' : 'transparent',
                  border: active ? '1px solid var(--border-bright)' : '1px solid transparent',
                  textDecoration: 'none', transition: 'all 0.15s',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  {l.label}
                </Link>
              )
            })}

            {/* Profil with dropdown */}
            <div
              ref={profilRef}
              style={{ position: 'relative' }}
              onMouseEnter={hasDropdown ? handleMouseEnter : undefined}
              onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/profil" style={{
                  padding: '0.4rem 0.75rem', borderRadius: hasDropdown ? '8px 0 0 8px' : 8,
                  fontSize: '0.85rem', fontWeight: isProfilActive ? 600 : 400,
                  color: isProfilActive ? 'var(--text)' : 'var(--text-muted)',
                  background: isProfilActive ? 'var(--surface)' : 'transparent',
                  border: isProfilActive ? '1px solid var(--border-bright)' : '1px solid transparent',
                  borderRight: hasDropdown ? 'none' : undefined,
                  textDecoration: 'none', transition: 'all 0.15s',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  Profil
                </Link>
                {hasDropdown && (
                  <button
                    onClick={() => setProfilOpen(o => !o)}
                    style={{
                      padding: '0.4rem 0.4rem', borderRadius: '0 8px 8px 0',
                      fontSize: '0.85rem',
                      color: isProfilActive ? 'var(--text)' : 'var(--text-muted)',
                      background: isProfilActive ? 'var(--surface)' : 'transparent',
                      border: isProfilActive ? '1px solid var(--border-bright)' : '1px solid transparent',
                      borderLeft: '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center',
                    }}>
                    <ChevronDown size={14} style={{
                      transition: 'transform 0.2s',
                      transform: profilOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} />
                  </button>
                )}
              </div>

              {/* Dropdown */}
              {hasDropdown && profilOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                  minWidth: 200,
                  background: 'rgba(13,20,33,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
                  overflow: 'hidden',
                  animation: 'fadeUp 0.15s ease forwards',
                }}>
                  <div style={{ padding: '0.4rem' }}>
                    {dropdownItems.map(item => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setProfilOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.6rem 0.85rem', borderRadius: 8,
                          color: 'rgba(240,244,255,0.7)',
                          textDecoration: 'none', fontSize: '0.83rem',
                          fontFamily: 'Space Grotesk, sans-serif',
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = 'rgba(59,130,246,0.12)'
                          el.style.color = 'rgba(240,244,255,1)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = 'transparent'
                          el.style.color = 'rgba(240,244,255,0.7)'
                        }}
                      >
                        <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</span>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 0.6rem' }} />
            <Link href={SPMB_HREF}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', textDecoration: 'none', transition: 'all 0.15s', fontFamily: 'Space Grotesk, sans-serif', background: 'rgba(59,130,246,0.08)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(59,130,246,0.18)'; el.style.borderColor = 'rgba(59,130,246,0.5)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(59,130,246,0.08)'; el.style.borderColor = 'rgba(59,130,246,0.3)' }}>
              SPMB
            </Link>
            {EXT.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', border: '1px solid var(--border)', textDecoration: 'none', transition: 'all 0.15s', fontFamily: 'Space Grotesk, sans-serif' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text)'; el.style.borderColor = 'var(--border-bright)'; el.style.background = 'var(--surface)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent' }}>
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
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setMenuOpen(false)} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 2rem' }}>

            {NAV_LEFT.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '0.9rem 0', borderBottom: '1px solid var(--border)', color: pathname === l.href ? 'var(--accent)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: pathname === l.href ? 600 : 400, fontSize: '1rem' }}>
                {l.label}
              </Link>
            ))}

            {/* Mobile Profil with accordion */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0', borderBottom: '1px solid var(--border)' }}>
                <Link href="/profil" onClick={() => setMenuOpen(false)}
                  style={{ color: isProfilActive ? 'var(--accent)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: isProfilActive ? 600 : 400, fontSize: '1rem' }}>
                  Profil
                </Link>
                {hasDropdown && (
                  <button onClick={() => setMobileProfilOpen(o => !o)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', display: 'flex' }}>
                    <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: mobileProfilOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                )}
              </div>
              {hasDropdown && mobileProfilOpen && (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, margin: '0.4rem 0', overflow: 'hidden' }}>
                  {dropdownItems.map(item => (
                    <a key={item.href} href={item.href}
                      onClick={() => { setMenuOpen(false); setMobileProfilOpen(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link href={SPMB_HREF} onClick={() => setMenuOpen(false)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.6rem 1.1rem', borderRadius: 8, border: '1px solid rgba(59,130,246,0.35)', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                SPMB
              </Link>
              {EXT.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.6rem 1.1rem', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
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
