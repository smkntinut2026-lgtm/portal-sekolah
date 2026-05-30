'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, Announcement } from '@/lib/supabase'

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Announcement | null>(null)

  useEffect(() => {
    supabase.from('announcements').select('*').eq('status', 'published').order('tanggal', { ascending: false }).then(({ data }) => {
      if (data) setAnnouncements(data)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #7c4a00 0%, #b8791a 60%, #d4921f 100%)',
        color: 'white', padding: '3rem 1.5rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15 }} viewBox="0 0 800 160" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pengKawung" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <ellipse cx="30" cy="17" rx="9" ry="12" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="30" cy="43" rx="9" ry="12" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="17" cy="30" rx="12" ry="9" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="43" cy="30" rx="12" ry="9" fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="30" cy="30" r="3.5" fill="none" stroke="white" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="800" height="160" fill="url(#pengKawung)" />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#fff9ee', position: 'relative', zIndex: 1 }}>
          Pengumuman & Berita
        </h1>
      </div>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(45,26,6,0.4)', padding: '3rem' }}>Memuat...</div>
        ) : announcements.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'rgba(45,26,6,0.4)', padding: '3rem' }}>Belum ada pengumuman</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {announcements.map(a => (
              <div key={a.id}
                style={{
                  background: 'rgba(255,252,245,0.72)', border: '1px solid rgba(184,121,26,0.18)',
                  borderRadius: 16, padding: '1.5rem',
                  backdropFilter: 'blur(12px)',
                  backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,245,210,0.15) 100%)',
                  boxShadow: '0 2px 12px rgba(120,70,10,0.07)',
                  cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                }}
                onClick={() => setSelected(a)}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = '0 8px 28px rgba(120,70,10,0.14)'
                  el.style.borderColor = 'rgba(184,121,26,0.35)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'none'
                  el.style.boxShadow = '0 2px 12px rgba(120,70,10,0.07)'
                  el.style.borderColor = 'rgba(184,121,26,0.18)'
                }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {a.gambar_url && (
                    <Image src={a.gambar_url} alt={a.judul} width={90} height={90} style={{ borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(184,121,26,0.15)' }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(45,26,6,0.4)', marginBottom: '0.3rem', fontWeight: 600 }}>
                      📅 {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: '#2d1a06' }}>{a.judul}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(45,26,6,0.55)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.isi}</p>
                    <span style={{ fontSize: '0.8rem', color: '#b8791a', fontWeight: 600, marginTop: '0.4rem', display: 'inline-block' }}>Baca selengkapnya →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal detail */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(45,26,6,0.45)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setSelected(null)}>
          <div style={{
            background: 'rgba(253,248,240,0.98)', borderRadius: 20, maxWidth: 650, width: '100%',
            maxHeight: '85vh', overflowY: 'auto', padding: '2rem',
            border: '1px solid rgba(184,121,26,0.2)',
            boxShadow: '0 20px 60px rgba(120,70,10,0.2)',
          }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ float: 'right', background: 'rgba(184,121,26,0.1)', border: '1px solid rgba(184,121,26,0.2)', borderRadius: 8, width: 32, height: 32, fontSize: '1rem', cursor: 'pointer', color: '#7c4a00', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            <div style={{ fontSize: '0.8rem', color: 'rgba(45,26,6,0.4)', marginBottom: '0.5rem', fontWeight: 600 }}>
              {new Date(selected.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#2d1a06', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>{selected.judul}</h2>
            {selected.gambar_url && (
              <Image src={selected.gambar_url} alt={selected.judul} width={600} height={300} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, marginBottom: '1.25rem', border: '1px solid rgba(184,121,26,0.15)' }} />
            )}
            <p style={{ lineHeight: 1.8, color: 'rgba(45,26,6,0.7)', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{selected.isi}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
