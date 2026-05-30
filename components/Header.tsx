'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { Menu, X, ExternalLink } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Pengumuman', href: '/pengumuman' },
  { label: 'Galeri', href: '/galeri' },
]

const EXT_LINKS = [
  { label: 'SPMB', href: 'https://spmb-smk1.vercel.app/', color: '#e8a020' },
  { label: 'Arsip File', href: 'https://arsip-sekolah-peach.vercel.app/', color: '#1a3a5c' },
]

export default function Header() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => {
      if (data) setProfile(data)
    })
  }, [])

  return (
    <header style={{ background: 'var(--primary)', color: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>

        {/* Logo + Nama */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white' }}>
          {profile?.logo_url ? (
            <Image src={profile.logo_url} alt="Logo" width={44} height={44} style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏫</div>
          )}
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
              {profile?.nama_sekolah || 'Portal Sekolah'}
            </div>
            {profile?.npsn && (
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>NPSN: {profile.npsn}</div>
            )}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '0.4rem 0.85rem', borderRadius: 6, fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.target as HTMLElement).style.color = 'white' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.85)' }}>
              {link.label}
            </Link>
          ))}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)', margin: '0 0.5rem' }} />
          {EXT_LINKS.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: link.color, color: 'white', textDecoration: 'none', padding: '0.4rem 0.85rem', borderRadius: 6, fontSize: '0.875rem', fontWeight: 600, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
              {link.label} <ExternalLink size={12} />
            </a>
          ))}
        </nav>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'none' }} className="mobile-burger">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'var(--primary)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem' }}>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.9rem' }}>
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {EXT_LINKS.map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: link.color, color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600 }}>
                {link.label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: block !important; }
        }
      `}</style>
    </header>
  )
}
