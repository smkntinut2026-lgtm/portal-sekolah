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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ background: 'var(--primary)', color: 'white', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>Galeri Kegiatan</h1>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Memuat...</div>
        ) : gallery.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Belum ada foto galeri</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.map(g => (
              <div key={g.id} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', position: 'relative', background: '#e5e0d8', cursor: 'pointer' }}
                onClick={() => setLightbox(g)}>
                <Image src={g.foto_url} alt={g.caption || 'Galeri'} fill style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'} />
                {g.caption && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.65))', padding: '2rem 0.75rem 0.75rem', color: 'white', fontSize: '0.8rem' }}>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setLightbox(null)}>
          <div style={{ position: 'relative', maxWidth: 800, width: '100%' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: 'white', fontSize: '1.75rem', cursor: 'pointer' }}>✕</button>
            <Image src={lightbox.foto_url} alt={lightbox.caption || ''} width={800} height={600} style={{ width: '100%', height: 'auto', borderRadius: 12, objectFit: 'contain', maxHeight: '75vh' }} />
            {lightbox.caption && (
              <p style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
