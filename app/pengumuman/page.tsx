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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ background: 'var(--primary)', color: 'white', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>Pengumuman & Berita</h1>
      </div>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Memuat...</div>
        ) : announcements.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Belum ada pengumuman</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {announcements.map(a => (
              <div key={a.id} className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => setSelected(a)}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {a.gambar_url && (
                    <Image src={a.gambar_url} alt={a.judul} width={90} height={90} style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      📅 {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--primary)' }}>{a.judul}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.isi}</p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', marginTop: '0.4rem', display: 'inline-block' }}>Baca selengkapnya →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal detail */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: 'white', borderRadius: 16, maxWidth: 650, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>✕</button>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {new Date(selected.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>{selected.judul}</h2>
            {selected.gambar_url && (
              <Image src={selected.gambar_url} alt={selected.judul} width={600} height={300} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10, marginBottom: '1.25rem' }} />
            )}
            <p style={{ lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{selected.isi}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
