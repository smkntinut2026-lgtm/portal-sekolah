'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => {
      if (data) setProfile(data)
    })
  }, [])

  return (
    <footer style={{ background: 'var(--primary)', color: 'rgba(255,255,255,0.85)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

          {/* Profil */}
          <div>
            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              {profile?.nama_sekolah || 'Portal Sekolah'}
            </h3>
            {profile?.tagline && <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.75rem' }}>{profile.tagline}</p>}
            {profile?.npsn && <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>NPSN: {profile.npsn}</p>}
          </div>

          {/* Kontak */}
          <div>
            <h4 style={{ color: 'var(--accent-light)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Kontak</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              {profile?.alamat && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <MapPin size={14} style={{ marginTop: 2, flexShrink: 0, opacity: 0.7 }} />
                  <span style={{ opacity: 0.8 }}>{profile.alamat}</span>
                </div>
              )}
              {profile?.telepon && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Phone size={14} style={{ opacity: 0.7 }} />
                  <span style={{ opacity: 0.8 }}>{profile.telepon}</span>
                </div>
              )}
              {profile?.email && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Mail size={14} style={{ opacity: 0.7 }} />
                  <span style={{ opacity: 0.8 }}>{profile.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 style={{ color: 'var(--accent-light)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Layanan</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Profil Sekolah', href: '/profil' },
                { label: 'Pengumuman', href: '/pengumuman' },
                { label: 'Galeri', href: '/galeri' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{l.label}</Link>
              ))}
              <a href="https://spmb-smk1.vercel.app/" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                SPMB <ExternalLink size={11} />
              </a>
              <a href="https://arsip-sekolah-peach.vercel.app/" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Arsip File <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', opacity: 0.5 }}>
          © {new Date().getFullYear()} {profile?.nama_sekolah || 'Portal Sekolah'}. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  )
}
