'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { Menu, X, ExternalLink } from 'lucide-react'

const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Pengumuman', href: '/pengumuman' },
  { label: 'Galeri', href: '/galeri' },
]
const EXT = [
  { label: 'SPMB', href: 'https://spmb-smk1.vercel.app/' },
  { label: 'Arsip File', href: 'https://arsip-sekolah-peach.vercel.app/' },
]

export default function Header() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => { if (data) setProfile(data) })
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

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
            {NAV.map(l => {
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
            <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 0.6rem' }} />
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
            {NAV.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '0.9rem 0', borderBottom: '1px solid var(--border)', color: pathname === l.href ? 'var(--accent)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: pathname === l.href ? 600 : 400, fontSize: '1rem' }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
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
