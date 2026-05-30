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
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'white',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            {profile?.logo_url
              ? <Image src={profile.logo_url} alt="Logo" width={40} height={40} style={{ borderRadius: 10, objectFit: 'cover' }} />
              : <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏫</div>
            }
            <div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.2 }}>
                {profile?.nama_sekolah || 'Portal Sekolah'}
              </div>
              {profile?.npsn && <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: 1 }}>NPSN {profile.npsn}</div>}
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {NAV.map(l => {
              const active = pathname === l.href
              return (
                <Link key={l.href} href={l.href} style={{
                  padding: '0.45rem 0.9rem', borderRadius: var(--radius-sm),
                  fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}>
                  {l.label}
                </Link>
              )
            })}
            <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 0.5rem' }} />
            {EXT.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.85rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', border: '1.5px solid var(--border)', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-muted)' }}>
                {l.label} <ExternalLink size={11} />
              </a>
            ))}
          </nav>

          {/* Mobile burger */}
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
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} onClick={() => setMenuOpen(false)} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'white', borderRadius: '0 0 20px 20px', padding: '5rem 1.5rem 2rem', boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.2s ease' }}>
            {NAV.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '0.85rem 0', borderBottom: '1px solid var(--border)', color: pathname === l.href ? 'var(--accent)' : 'var(--text)', textDecoration: 'none', fontWeight: pathname === l.href ? 600 : 400, fontSize: '1rem' }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              {EXT.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.6rem 1.1rem', borderRadius: 8, border: '1.5px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                  {l.label} <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
