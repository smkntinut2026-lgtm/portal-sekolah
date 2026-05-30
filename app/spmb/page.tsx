'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ExternalLink, UserPlus, Lock, ArrowRight } from 'lucide-react'

export default function SpmbPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>

        {/* Batik background SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="spmbBatik" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <ellipse cx="30" cy="17" rx="9" ry="12" fill="none" stroke="rgba(184,121,26,0.1)" strokeWidth="0.9"/>
              <ellipse cx="30" cy="43" rx="9" ry="12" fill="none" stroke="rgba(184,121,26,0.1)" strokeWidth="0.9"/>
              <ellipse cx="17" cy="30" rx="12" ry="9" fill="none" stroke="rgba(184,121,26,0.1)" strokeWidth="0.9"/>
              <ellipse cx="43" cy="30" rx="12" ry="9" fill="none" stroke="rgba(184,121,26,0.1)" strokeWidth="0.9"/>
              <circle cx="30" cy="30" r="3.5" fill="none" stroke="rgba(184,121,26,0.13)" strokeWidth="0.8"/>
              <circle cx="30" cy="30" r="1.2" fill="rgba(184,121,26,0.09)"/>
            </pattern>
            <radialGradient id="spmbOrb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e8a825" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e8a825" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" fill="url(#spmbBatik)" />
          <rect width="800" height="600" fill="url(#spmbOrb)" />
        </svg>

        {/* Header text */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #7c4a00, #b8791a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            SPMB Online
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, color: '#2d1a06', marginBottom: '0.6rem', fontFamily: "'Outfit', sans-serif" }}>
            SMK Negeri Tinangkung Utara
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(45,26,6,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Silakan pilih sesuai keperluan Anda
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>

          {/* Calon Siswa */}
          <a href="https://spmb-smk1.vercel.app?daftar" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,252,245,0.75)',
              border: '1px solid rgba(184,121,26,0.3)',
              borderRadius: 18,
              padding: '2rem 1.5rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '1rem', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(120,70,10,0.1)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,252,245,0.95)'
              el.style.borderColor = 'rgba(184,121,26,0.55)'
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 8px 30px rgba(120,70,10,0.18)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,252,245,0.75)'
              el.style.borderColor = 'rgba(184,121,26,0.3)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 4px 20px rgba(120,70,10,0.1)'
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(184,121,26,0.15), rgba(212,146,31,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(184,121,26,0.2)' }}>
                <UserPlus size={28} color="#b8791a" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d1a06', marginBottom: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
                  Calon Siswa
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(45,26,6,0.55)', lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Isi formulir pendaftaran online di sini
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: '#7c4a00', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Daftar sekarang <ArrowRight size={14} />
              </div>
            </div>
          </a>

          {/* Admin */}
          <a href="https://spmb-smk1.vercel.app" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,252,245,0.55)',
              border: '1px solid rgba(184,121,26,0.15)',
              borderRadius: 18,
              padding: '2rem 1.5rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '1rem', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 12px rgba(120,70,10,0.06)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,252,245,0.85)'
              el.style.borderColor = 'rgba(184,121,26,0.3)'
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 8px 30px rgba(120,70,10,0.12)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,252,245,0.55)'
              el.style.borderColor = 'rgba(184,121,26,0.15)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 2px 12px rgba(120,70,10,0.06)'
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(45,26,6,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(45,26,6,0.1)' }}>
                <Lock size={28} color="rgba(45,26,6,0.4)" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d1a06', marginBottom: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
                  Admin / Panitia
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(45,26,6,0.55)', lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Masuk ke panel pengelolaan SPMB
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(45,26,6,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Login admin <ArrowRight size={14} />
              </div>
            </div>
          </a>

        </div>

        <p style={{ marginTop: '2.5rem', fontSize: '0.78rem', color: 'rgba(45,26,6,0.28)', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>
          Tahun Pelajaran 2025 / 2026 · SMK Negeri Tinangkung Utara
        </p>

      </main>

      <Footer />
    </div>
  )
}
