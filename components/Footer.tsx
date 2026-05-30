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
    <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '3rem', paddingBottom: '3rem' }}>

          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.6rem' }}>
              {profile?.nama_sekolah || 'Portal Sekolah'}
            </div>
            {profile?.tagline && <p style={{ fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--text-dim)', marginBottom: '1rem' }}>{profile.tagline}</p>}
            {profile?.npsn && <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', padding: '0.3rem 0.7rem', border: '1px solid var(--border)', borderRadius: 6, display: 'inline-block' }}>NPSN: {profile.npsn}</div>}
          </div>

          <div>
            <div className="section-label" style={{ color: 'var(--text-dim)', marginBottom: '1.1rem' }}>Kontak</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {profile?.alamat && <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}><MapPin size={13} style={{ marginTop: 2, flexShrink: 0, color: 'var(--text-dim)' }} /><span>{profile.alamat}</span></div>}
              {profile?.telepon && <div style={{ display: 'flex', gap: '0.6rem' }}><Phone size={13} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: 2 }} /><span>{profile.telepon}</span></div>}
              {profile?.email && <div style={{ display: 'flex', gap: '0.6rem' }}><Mail size={13} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: 2 }} /><span>{profile.email}</span></div>}
            </div>
          </div>

          <div>
            <div className="section-label" style={{ color: 'var(--text-dim)', marginBottom: '1.1rem' }}>Navigasi</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[['/', 'Beranda'], ['/profil', 'Profil Sekolah'], ['/pengumuman', 'Pengumuman'], ['/galeri', 'Galeri']].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'}>{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label" style={{ color: 'var(--text-dim)', marginBottom: '1.1rem' }}>Layanan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[['https://spmb-smk1.vercel.app/', 'SPMB Online'], ['https://arsip-sekolah-peach.vercel.app/', 'Arsip File']].map(([href, label]) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'}>
                  {label} <ArrowUpRight size={11} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>© {new Date().getFullYear()} {profile?.nama_sekolah || 'Portal Sekolah'}</span>
          <Link href="/admin" style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'}>
            Admin ↗
          </Link>
        </div>
      </div>
    </footer>
  )
}
