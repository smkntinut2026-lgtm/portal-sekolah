'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ExternalLink, UserPlus, Lock, ArrowRight } from 'lucide-react'

export default function SpmbPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>

        {/* Header text */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif' }}>
            SPMB Online
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.6rem', fontFamily: 'Syne, sans-serif' }}>
            SMK Negeri Tinangkung Utara
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(240,244,255,0.55)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Silakan pilih sesuai keperluan Anda
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', width: '100%', maxWidth: 520 }}>

          {/* Calon Siswa */}
          <a href="https://spmb-smk1.vercel.app?daftar" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: 18,
              padding: '2rem 1.5rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '1rem', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(59,130,246,0.12)'
              el.style.borderColor = 'rgba(59,130,246,0.5)'
              el.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(59,130,246,0.06)'
              el.style.borderColor = 'rgba(59,130,246,0.25)'
              el.style.transform = 'translateY(0)'
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={28} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.4rem', fontFamily: 'Syne, sans-serif' }}>
                  Calon Siswa
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(240,244,255,0.55)', lineHeight: 1.6, fontFamily: 'Space Grotesk, sans-serif' }}>
                  Isi formulir pendaftaran online di sini
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: '#60a5fa', fontFamily: 'Space Grotesk, sans-serif' }}>
                Daftar sekarang <ArrowRight size={14} />
              </div>
            </div>
          </a>

          {/* Admin */}
          <a href="https://spmb-smk1.vercel.app" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 18,
              padding: '2rem 1.5rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '1rem', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.06)'
              el.style.borderColor = 'rgba(255,255,255,0.2)'
              el.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.03)'
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.transform = 'translateY(0)'
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={28} color="rgba(240,244,255,0.5)" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.4rem', fontFamily: 'Syne, sans-serif' }}>
                  Admin / Panitia
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(240,244,255,0.55)', lineHeight: 1.6, fontFamily: 'Space Grotesk, sans-serif' }}>
                  Masuk ke panel pengelolaan SPMB
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(240,244,255,0.4)', fontFamily: 'Space Grotesk, sans-serif' }}>
                Login admin <ArrowRight size={14} />
              </div>
            </div>
          </a>

        </div>

        <p style={{ marginTop: '2.5rem', fontSize: '0.78rem', color: 'rgba(240,244,255,0.25)', fontFamily: 'Space Grotesk, sans-serif' }}>
          Tahun Pelajaran 2025 / 2026 · SMK Negeri Tinangkung Utara
        </p>

      </main>

      <Footer />
    </div>
  )
}
