'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => { if (data) setProfile(data) })
  }, [])

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #f9f0e0 0%, #f5e8cc 100%)',
      borderTop: '1px solid rgba(184,121,26,0.2)',
      marginTop: 'auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Batik SVG background inside footer */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.5 }} viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="footerBatik" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <ellipse cx="30" cy="17" rx="9" ry="12" fill="none" stroke="rgba(184,121,26,0.12)" strokeWidth="0.9"/>
            <ellipse cx="30" cy="43" rx="9" ry="12" fill="none" stroke="rgba(184,121,26,0.12)" strokeWidth="0.9"/>
            <ellipse cx="17" cy="30" rx="12" ry="9" fill="none" stroke="rgba(184,121,26,0.12)" strokeWidth="0.9"/>
            <ellipse cx="43" cy="30" rx="12" ry="9" fill="none" stroke="rgba(184,121,26,0.12)" strokeWidth="0.9"/>
            <circle cx="30" cy="30" r="3.5" fill="none" stroke="rgba(184,121,26,0.15)" strokeWidth="0.8"/>
            <circle cx="30" cy="30" r="1.2" fill="rgba(184,121,26,0.1)"/>
          </pattern>
        </defs>
        <rect width="1200" height="300" fill="url(#footerBatik)" />
      </svg>

      {/* Gold top stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(184,121,26,0.5) 20%, rgba(232,168,37,0.8) 50%, rgba(184,121,26,0.5) 80%, transparent)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '3rem', paddingBottom: '3rem' }}>

          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#2d1a06', marginBottom: '0.6rem' }}>
              {profile?.nama_sekolah || 'Portal Sekolah'}
            </div>
            {profile?.tagline && <p style={{ fontSize: '0.82rem', lineHeight: 1.65, color: 'rgba(45,26,6,0.45)', marginBottom: '1rem' }}>{profile.tagline}</p>}
            {profile?.npsn && <div style={{ fontSize: '0.72rem', color: 'rgba(45,26,6,0.45)', padding: '0.3rem 0.7rem', border: '1px solid rgba(184,121,26,0.22)', borderRadius: 6, display: 'inline-block', background: 'rgba(255,252,245,0.5)' }}>NPSN: {profile.npsn}</div>}
          </div>

          <div>
            <div className="section-label" style={{ marginBottom: '1.1rem' }}>Kontak</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: 'rgba(45,26,6,0.55)' }}>
              {profile?.alamat && <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}><MapPin size={13} style={{ marginTop: 2, flexShrink: 0, color: '#b8791a' }} /><span>{profile.alamat}</span></div>}
              {profile?.telepon && <div style={{ display: 'flex', gap: '0.6rem' }}><Phone size={13} style={{ color: '#b8791a', flexShrink: 0, marginTop: 2 }} /><span>{profile.telepon}</span></div>}
              {profile?.email && <div style={{ display: 'flex', gap: '0.6rem' }}><Mail size={13} style={{ color: '#b8791a', flexShrink: 0, marginTop: 2 }} /><span>{profile.email}</span></div>}
            </div>
          </div>

          <div>
            <div className="section-label" style={{ marginBottom: '1.1rem' }}>Navigasi</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[['/', 'Beranda'], ['/profil', 'Profil Sekolah'], ['/pengumuman', 'Pengumuman'], ['/galeri', 'Galeri']].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: '0.82rem', color: 'rgba(45,26,6,0.45)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#7c4a00'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(45,26,6,0.45)'}>{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label" style={{ marginBottom: '1.1rem' }}>Layanan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[['https://spmb-smk1.vercel.app/', 'SPMB Online'], ['https://arsip-sekolah-peach.vercel.app/', 'Arsip File']].map(([href, label]) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'rgba(45,26,6,0.45)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#7c4a00'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(45,26,6,0.45)'}>
                  {label} <ArrowUpRight size={11} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(184,121,26,0.15)', padding: '1.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(45,26,6,0.38)' }}>© {new Date().getFullYear()} {profile?.nama_sekolah || 'Portal Sekolah'}</span>
          <Link href="/admin" style={{ fontSize: '0.72rem', color: 'rgba(45,26,6,0.38)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#7c4a00'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(45,26,6,0.38)'}>
            Admin ↗
          </Link>
        </div>
      </div>
    </footer>
  )
}
