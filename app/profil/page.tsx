'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

function SectionTitle({ emoji, text }: { emoji: string; text: string }) {
  return (
    <h2 style={{
      fontSize: '1.2rem', fontWeight: 700,
      color: '#2d1a06',
      marginBottom: '1.25rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid rgba(184,121,26,0.15)',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      fontFamily: "'Outfit', sans-serif",
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

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,252,245,0.72)',
    border: '1px solid rgba(184,121,26,0.18)',
    borderRadius: 16,
    padding: '1.75rem',
    marginBottom: '1.5rem',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 2px 16px rgba(120,70,10,0.07)',
    backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,245,210,0.15) 100%)',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #7c4a00 0%, #b8791a 60%, #d4921f 100%)',
        color: 'white', padding: '3.5rem 1.5rem', textAlign: 'center',
        borderBottom: '1px solid rgba(184,121,26,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Batik overlay in hero */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15 }} viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroKawung" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <ellipse cx="30" cy="17" rx="9" ry="12" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="30" cy="43" rx="9" ry="12" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="17" cy="30" rx="12" ry="9" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="43" cy="30" rx="12" ry="9" fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="30" cy="30" r="3.5" fill="none" stroke="white" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="800" height="200" fill="url(#heroKawung)" />
        </svg>
        {/* Glossy top stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,252,210,0.85)', marginBottom: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Portal Sekolah
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#fff9ee' }}>Profil Sekolah</h1>
          {profile?.nama_sekolah && <p style={{ color: 'rgba(255,249,238,0.7)', fontSize: '0.95rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profile.nama_sekolah}</p>}
        </div>
      </div>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(45,26,6,0.4)', padding: '4rem' }}>Memuat...</div>
        ) : (
          <>
            {/* Identitas */}
            <div style={{ ...cardStyle, display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {profile?.logo_url
                ? <Image src={profile.logo_url} alt="Logo" width={110} height={110} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(184,121,26,0.2)', boxShadow: '0 2px 10px rgba(120,70,10,0.12)' }} />
                : <div style={{ width: 110, height: 110, borderRadius: 12, background: 'rgba(184,121,26,0.1)', border: '1px solid rgba(184,121,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, flexShrink: 0 }}>🏫</div>
              }
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.65rem', color: '#2d1a06', marginBottom: '0.25rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>{profile?.nama_sekolah || '-'}</h2>
                {profile?.tagline && <p style={{ color: 'rgba(45,26,6,0.5)', marginBottom: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>&ldquo;{profile.tagline}&rdquo;</p>}
                <div style={{ display: 'grid', gap: '0.55rem' }}>
                  {profile?.npsn && <div style={{ fontSize: '0.88rem', color: 'rgba(45,26,6,0.65)' }}><strong style={{ color: '#2d1a06' }}>NPSN:</strong> {profile.npsn}</div>}
                  {profile?.alamat && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.88rem', color: 'rgba(45,26,6,0.65)' }}><MapPin size={14} style={{ color: '#b8791a', marginTop: 2, flexShrink: 0 }} />{profile.alamat}</div>}
                  {profile?.telepon && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem', color: 'rgba(45,26,6,0.65)' }}><Phone size={14} style={{ color: '#b8791a' }} />{profile.telepon}</div>}
                  {profile?.email && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem', color: 'rgba(45,26,6,0.65)' }}><Mail size={14} style={{ color: '#b8791a' }} />{profile.email}</div>}
                  {profile?.website && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.88rem' }}><Globe size={14} style={{ color: '#b8791a' }} /><a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#7c4a00', fontWeight: 600 }}>{profile.website}</a></div>}
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
                      ? <Image src={profile!.kepsek_foto_url} alt={profile!.kepsek_nama || 'Kepala Sekolah'} width={120} height={140} style={{ borderRadius: 12, objectFit: 'cover', display: 'block', border: '2px solid rgba(184,121,26,0.25)', boxShadow: '0 4px 16px rgba(120,70,10,0.15)' }} />
                      : <div style={{ width: 120, height: 140, borderRadius: 12, background: 'rgba(184,121,26,0.08)', border: '1px solid rgba(184,121,26,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
                    }
                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2d1a06' }}>{profile!.kepsek_nama}</div>
                      {profile!.kepsek_nip && <div style={{ fontSize: '0.75rem', color: 'rgba(45,26,6,0.4)', marginTop: '0.2rem' }}>NIP: {profile!.kepsek_nip}</div>}
                    </div>
                  </div>
                  {profile!.kepsek_sambutan && (
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, background: 'linear-gradient(135deg,#7c4a00,#b8791a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sambutan</div>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'rgba(45,26,6,0.65)', fontStyle: 'italic', borderLeft: '3px solid #b8791a', paddingLeft: '1rem', whiteSpace: 'pre-line' }}>
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
                    <div style={{ ...cardStyle, marginBottom: 0, borderTop: '3px solid #b8791a' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2d1a06', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Outfit', sans-serif" }}>
                        🎯 Visi
                      </h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(45,26,6,0.65)' }}>{profile!.visi}</p>
                    </div>
                  )}
                  {profile!.misi && (
                    <div style={{ ...cardStyle, marginBottom: 0, borderTop: '3px solid #d4921f' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2d1a06', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Outfit', sans-serif" }}>
                        📋 Misi
                      </h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'rgba(45,26,6,0.65)', whiteSpace: 'pre-line' }}>{profile!.misi}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sejarah */}
            {profile?.sejarah && (
              <div id="sejarah" style={{ ...cardStyle, borderTop: '3px solid #7c4a00', scrollMarginTop: '88px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2d1a06', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Outfit', sans-serif" }}>
                  📜 Sejarah Sekolah
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.9, color: 'rgba(45,26,6,0.65)', whiteSpace: 'pre-line' }}>{profile.sejarah}</p>
              </div>
            )}

            {!profile?.nama_sekolah && (
              <div style={{ ...cardStyle, textAlign: 'center', color: 'rgba(45,26,6,0.4)', padding: '3rem' }}>
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
