'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

// Reusable section heading that's always visible on dark background
function SectionTitle({ emoji, text }: { emoji: string; text: string }) {
  return (
    <h2 style={{
      fontSize: '1.2rem', fontWeight: 700,
      color: '#f0f4ff',
      marginBottom: '1.25rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      fontFamily: 'Syne, sans-serif',
    }}>
      <span>{emoji}</span> {text}
    </h2>
  )
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => {
      if (data) setProfile(data)
      setLoading(false)
    })
  }, [])

  // Card style consistent with dark theme
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '1.75rem',
    marginBottom: '1.5rem',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1a2e 0%, #0f2744 100%)',
        color: 'white', padding: '3.5rem 1.5rem', textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif' }}>
          Portal Sekolah
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>Profil Sekolah</h1>
        {profile?.nama_sekolah && <p style={{ opacity: 0.6, fontSize: '0.95rem', fontFamily: 'Space Grotesk, sans-serif' }}>{profile.nama_sekolah}</p>}
      </div>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(240,244,255,0.4)', padding: '4rem' }}>Memuat...</div>
        ) : (
          <>
            {/* Identitas */}
            <div style={{ ...cardStyle, display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {profile?.logo_url
                ? <Image src={profile.logo_url} alt="Logo" width={110} height={110} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }} />
                : <div style={{ width: 110, height: 110, borderRadius: 12, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, flexShrink: 0 }}>🏫</div>
              }
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.65rem', color: '#f0f4ff', marginBottom: '0.25rem', fontFamily: 'Syne, sans-serif' }}>{profile?.nama_sekolah || '-'}</h2>
                {profile?.tagline && <p style={{ color: 'rgba(240,244,255,0.5)', marginBottom: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>"{profile.tagline}"</p>}
                <div style={{ display: 'grid', gap: '0.55rem' }}>
                  {profile?.npsn && <div style={{ fontSize: '0.88rem', color: 'rgba(240,244,255,0.7)' }}><strong style={{ color: '#f0f4ff' }}>NPSN:</strong> {profile.npsn}</div>}
                  {profile?.alamat && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.88rem', color: 'rgba(240,244,255,0.7)' }}><MapPin size={14} style={{ color: '#3b82f6', marginTop: 2, flexShrink: 0 }} />{profile.alamat}</div>}
                  {profile?.telepon && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem', color: 'rgba(240,244,255,0.7)' }}><Phone size={14} style={{ color: '#3b82f6' }} />{profile.telepon}</div>}
                  {profile?.email && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem', color: 'rgba(240,244,255,0.7)' }}><Mail size={14} style={{ color: '#3b82f6' }} />{profile.email}</div>}
                  {profile?.website && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem' }}><Globe size={14} style={{ color: '#3b82f6' }} /><a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{profile.website}</a></div>}
                </div>
              </div>
            </div>

            {/* Kepala Sekolah */}
            {(profile?.kepsek_nama || profile?.kepsek_sambutan) && (
              <div id="kepsek" style={{ ...cardStyle, scrollMarginTop: '88px' }}>
                <SectionTitle emoji="👤" text="Kepala Sekolah" />
                <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    {profile!.kepsek_foto_url
                      ? <Image src={profile!.kepsek_foto_url} alt={profile!.kepsek_nama || 'Kepala Sekolah'} width={120} height={140} style={{ borderRadius: 12, objectFit: 'cover', display: 'block', border: '1px solid rgba(255,255,255,0.1)' }} />
                      : <div style={{ width: 120, height: 140, borderRadius: 12, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
                    }
                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f0f4ff' }}>{profile!.kepsek_nama}</div>
                      {profile!.kepsek_nip && <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.45)', marginTop: '0.2rem' }}>NIP: {profile!.kepsek_nip}</div>}
                    </div>
                  </div>
                  {profile!.kepsek_sambutan && (
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif' }}>Sambutan</div>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'rgba(240,244,255,0.75)', fontStyle: 'italic', borderLeft: '3px solid #3b82f6', paddingLeft: '1rem', whiteSpace: 'pre-line' }}>
                        {profile!.kepsek_sambutan}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visi & Misi */}
            {(profile?.visi || profile?.misi) && (
              <div id="visi-misi" style={{ scrollMarginTop: '88px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {profile!.visi && (
                    <div style={{ ...cardStyle, marginBottom: 0, borderTop: '3px solid #3b82f6' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                        🎯 Visi
                      </h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(240,244,255,0.75)' }}>{profile!.visi}</p>
                    </div>
                  )}
                  {profile!.misi && (
                    <div style={{ ...cardStyle, marginBottom: 0, borderTop: '3px solid #f59e0b' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                        📋 Misi
                      </h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'rgba(240,244,255,0.75)', whiteSpace: 'pre-line' }}>{profile!.misi}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sejarah */}
            {profile?.sejarah && (
              <div id="sejarah" style={{ ...cardStyle, borderTop: '3px solid #10b981', scrollMarginTop: '88px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                  📜 Sejarah Sekolah
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.9, color: 'rgba(240,244,255,0.75)', whiteSpace: 'pre-line' }}>{profile.sejarah}</p>
              </div>
            )}

            {!profile?.nama_sekolah && (
              <div style={{ ...cardStyle, textAlign: 'center', color: 'rgba(240,244,255,0.4)', padding: '3rem' }}>
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
