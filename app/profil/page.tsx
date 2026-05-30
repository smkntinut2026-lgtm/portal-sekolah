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

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0f2744 100%)', color: 'white', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>Profil Sekolah</h1>
        {profile?.nama_sekolah && <p style={{ opacity: 0.7, fontSize: '0.95rem' }}>{profile.nama_sekolah}</p>}
      </div>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>Memuat...</div>
        ) : (
          <>
            {/* Identitas */}
            <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {profile?.logo_url
                ? <Image src={profile.logo_url} alt="Logo" width={110} height={110} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 110, height: 110, borderRadius: 12, background: 'rgba(26,58,92,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, flexShrink: 0 }}>🏫</div>
              }
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.65rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{profile?.nama_sekolah || '-'}</h2>
                {profile?.tagline && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>"{profile.tagline}"</p>}
                <div style={{ display: 'grid', gap: '0.55rem' }}>
                  {profile?.npsn && <div style={{ fontSize: '0.88rem' }}><strong>NPSN:</strong> {profile.npsn}</div>}
                  {profile?.alamat && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.88rem' }}><MapPin size={14} style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />{profile.alamat}</div>}
                  {profile?.telepon && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem' }}><Phone size={14} style={{ color: 'var(--primary)' }} />{profile.telepon}</div>}
                  {profile?.email && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem' }}><Mail size={14} style={{ color: 'var(--primary)' }} />{profile.email}</div>}
                  {profile?.website && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem' }}><Globe size={14} style={{ color: 'var(--primary)' }} /><a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)' }}>{profile.website}</a></div>}
                </div>
              </div>
            </div>

            {/* Kepala Sekolah */}
            {(profile?.kepsek_nama || profile?.kepsek_sambutan) && (
              <div id="kepsek" className="card" style={{ marginBottom: '2rem', scrollMarginTop: '80px' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  👤 Kepala Sekolah
                </h2>
                <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    {profile.kepsek_foto_url
                      ? <Image src={profile.kepsek_foto_url} alt={profile.kepsek_nama || 'Kepala Sekolah'} width={120} height={140} style={{ borderRadius: 12, objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: 120, height: 140, borderRadius: 12, background: 'rgba(26,58,92,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
                    }
                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{profile.kepsek_nama}</div>
                      {profile.kepsek_nip && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>NIP: {profile.kepsek_nip}</div>}
                    </div>
                  </div>
                  {profile.kepsek_sambutan && (
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Sambutan</div>
                      <div style={{ fontSize: '0.925rem', lineHeight: 1.8, color: 'var(--text)', fontStyle: 'italic', borderLeft: '3px solid var(--accent)', paddingLeft: '1rem' }}>
                        "{profile.kepsek_sambutan}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visi & Misi */}
            {(profile?.visi || profile?.misi) && (
              <div id="visi-misi" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem', scrollMarginTop: '80px' }}>
                {profile.visi && (
                  <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>🎯 Visi</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text)' }}>{profile.visi}</p>
                  </div>
                )}
                {profile.misi && (
                  <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>📋 Misi</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text)', whiteSpace: 'pre-line' }}>{profile.misi}</p>
                  </div>
                )}
              </div>
            )}

            {/* Sejarah */}
            {profile?.sejarah && (
              <div id="sejarah" className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--primary-light)', scrollMarginTop: '80px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>📜 Sejarah Sekolah</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'var(--text)', whiteSpace: 'pre-line' }}>{profile.sejarah}</p>
              </div>
            )}

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
