'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { MapPin, Phone, Mail, ExternalLink, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => { if (data) setProfile(data) })
  }, [])

  return (
    <footer style={{ background: 'var(--primary)', color: 'rgba(255,255,255,0.75)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', paddingBottom: '3rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              {profile?.nama_sekolah || 'Portal Sekolah'}
            </div>
            {profile?.tagline && <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', opacity: 0.65 }}>{profile.tagline}</p>}
            {profile?.npsn && <div style={{ fontSize: '0.78rem', opacity: 0.45 }}>NPSN: {profile.npsn}</div>}
          </div>

          {/* Kontak */}
          <div>
            <div className="section-label" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Kontak</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              {profile?.alamat && <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}><MapPin size={14} style={{ marginTop: 2, flexShrink: 0, opacity: 0.5 }} /><span>{profile.alamat}</span></div>}
              {profile?.telepon && <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}><Phone size={14} style={{ opacity: 0.5 }} /><span>{profile.telepon}</span></div>}
              {profile?.email && <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}><Mail size={14} style={{ opacity: 0.5 }} /><span>{profile.email}</span></div>}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <div className="section-label" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Navigasi</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.875rem' }}>
              {[['/', 'Beranda'], ['/profil', 'Profil Sekolah'], ['/pengumuman', 'Pengumuman'], ['/galeri', 'Galeri']].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <div className="section-label" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Layanan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.875rem' }}>
              {[['https://spmb-smk1.vercel.app/', 'SPMB Online'], ['https://arsip-sekolah-peach.vercel.app/', 'Arsip File']].map(([href, label]) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>
                  {label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', opacity: 0.4 }}>© {new Date().getFullYear()} {profile?.nama_sekolah || 'Portal Sekolah'}. Semua hak dilindungi.</span>
          <Link href="/admin" style={{ fontSize: '0.75rem', opacity: 0.3, color: 'white', textDecoration: 'none', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.3'}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
