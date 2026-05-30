'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, GalleryItem } from '@/lib/supabase'

export default function GaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    supabase.from('gallery').select('*').order('urutan').then(({ data }) => {
      if (data) setGallery(data)
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
            <pattern id="galKawung" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <ellipse cx="30" cy="17" rx="9" ry="12" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="30" cy="43" rx="9" ry="12" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="17" cy="30" rx="12" ry="9" fill="none" stroke="white" strokeWidth="1"/>
              <ellipse cx="43" cy="30" rx="12" ry="9" fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="30" cy="30" r="3.5" fill="none" stroke="white" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="800" height="160" fill="url(#galKawung)" />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#fff9ee', position: 'relative', zIndex: 1 }}>
          Galeri Kegiatan
        </h1>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(45,26,6,0.4)', padding: '3rem' }}>Memuat...</div>
        ) : gallery.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'rgba(45,26,6,0.4)', padding: '3rem' }}>Belum ada foto galeri</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.map(g => (
              <div key={g.id} style={{
                borderRadius: 14, overflow: 'hidden', aspectRatio: '1', position: 'relative',
                background: 'rgba(184,121,26,0.08)',
                border: '1px solid rgba(184,121,26,0.15)',
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s',
              }}
                onClick={() => setLightbox(g)}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'scale(1.04)'
                  el.style.boxShadow = '0 8px 30px rgba(120,70,10,0.2)'
                  el.style.borderColor = 'rgba(184,121,26,0.4)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'scale(1)'
                  el.style.boxShadow = 'none'
                  el.style.borderColor = 'rgba(184,121,26,0.15)'
                }}>
                <Image src={g.foto_url} alt={g.caption || 'Galeri'} fill style={{ objectFit: 'cover', transition: 'transform 0.3s' }} />
                {g.caption && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(45,26,6,0.78))', padding: '2rem 0.75rem 0.75rem', color: '#fff9ee', fontSize: '0.8rem', fontWeight: 600 }}>
                    {g.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.88)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setLightbox(null)}>
          <div style={{ position: 'relative', maxWidth: 800, width: '100%' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: -44, right: 0, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: '#fff9ee', fontSize: '1.2rem', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            <Image src={lightbox.foto_url} alt={lightbox.caption || ''} width={800} height={600} style={{ width: '100%', height: 'auto', borderRadius: 14, objectFit: 'contain', maxHeight: '75vh', border: '1px solid rgba(184,121,26,0.3)' }} />
            {lightbox.caption && (
              <p style={{ color: 'rgba(255,249,238,0.75)', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
