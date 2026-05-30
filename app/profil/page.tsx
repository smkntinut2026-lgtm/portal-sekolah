'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

export default function ProfilPage() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => {
      if (data) setProfile(data)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ background: 'var(--primary)', color: 'white', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>Profil Sekolah</h1>
      </div>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Memuat...</div>
        ) : (
          <>
            {/* Info utama */}
            <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {profile?.logo_url ? (
                <Image src={profile.logo_url} alt="Logo" width={120} height={120} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: 12, background: 'rgba(26,58,92,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, flexShrink: 0 }}>🏫</div>
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{profile?.nama_sekolah || '-'}</h2>
                {profile?.tagline && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{profile.tagline}</p>}
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  {profile?.npsn && <div style={{ fontSize: '0.9rem' }}><strong>NPSN:</strong> {profile.npsn}</div>}
                  {profile?.alamat && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                      <MapPin size={15} style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
                      {profile.alamat}
                    </div>
                  )}
                  {profile?.telepon && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                      <Phone size={15} style={{ color: 'var(--primary)' }} />
                      {profile.telepon}
                    </div>
                  )}
                  {profile?.email && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                      <Mail size={15} style={{ color: 'var(--primary)' }} />
                      {profile.email}
                    </div>
                  )}
                  {profile?.website && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                      <Globe size={15} style={{ color: 'var(--primary)' }} />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)' }}>{profile.website}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!profile?.nama_sekolah && (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                <p>Profil sekolah belum diisi.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Login sebagai admin untuk mengisi profil sekolah.</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
