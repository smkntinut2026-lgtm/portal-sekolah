'use client'
import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase, Jurusan } from '@/lib/supabase'
import { ArrowLeft, Target, Briefcase, CheckCircle, BookOpen, Images } from 'lucide-react'

export default function JurusanDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [jurusan, setJurusan] = useState<Jurusan | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeGaleri, setActiveGaleri] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    supabase.from('jurusan').select('*').eq('slug', slug).single().then(({ data }) => {
      setJurusan(data as Jurusan | null)
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(45,26,6,0.4)', fontSize: '0.9rem' }}>Memuat...</div>
    </div>
  )

  if (!jurusan) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ fontSize: 48 }}>🏫</div>
      <p style={{ color: 'rgba(45,26,6,0.5)', fontSize: '1rem' }}>Jurusan tidak ditemukan.</p>
      <Link href="/" style={{ color: '#7c4a00', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>← Kembali ke Beranda</Link>
    </div>
  )

  const kompetensiList = (jurusan.kompetensi || '').split('\n').map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
  const prospekList = (jurusan.prospek_kerja || '').split('\n').map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)

  return (
    <>
      <style>{`
        .jrs-card { background: rgba(253,248,240,0.7); border: 1px solid rgba(184,121,26,0.15); border-radius: 16px; padding: 1.75rem; }
        .jrs-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; }
        .galeri-thumb { cursor: pointer; border-radius: 10px; overflow: hidden; aspect-ratio: 4/3; position: relative; transition: transform 0.2s, box-shadow 0.2s; }
        .galeri-thumb:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(120,70,10,0.18); }
        .list-item { display: flex; align-items: flex-start; gap: 0.65rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(184,121,26,0.08); }
        .list-item:last-child { border-bottom: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease; }
      `}</style>

      {/* Hero */}
      <section style={{ position: 'relative', background: 'linear-gradient(135deg, #7c4a00 0%, #b8791a 50%, #e8a825 100%)', color: 'white', padding: '4rem 1.5rem 5rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
        {jurusan.foto_url && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image src={jurusan.foto_url} alt={jurusan.nama} fill style={{ objectFit: 'cover', opacity: 0.22 }} />
          </div>
        )}
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.82rem', marginBottom: '1.5rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'}>
            <ArrowLeft size={15} /> Kembali ke Beranda
          </Link>
          <div style={{ marginBottom: '0.75rem' }}>
            {jurusan.singkatan && (
              <span className="jrs-badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)', marginRight: '0.5rem' }}>
                {jurusan.singkatan}
              </span>
            )}
            <span className="jrs-badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
              Program Keahlian
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2, fontFamily: 'Bricolage Grotesque, Plus Jakarta Sans, sans-serif' }}>
            {jurusan.nama}
          </h1>
          {jurusan.deskripsi && (
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.88)', maxWidth: 680 }}>
              {jurusan.deskripsi}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="jrs-grid">

          {/* Visi */}
          {jurusan.visi && (
            <div className="jrs-card fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(184,121,26,0.15), rgba(232,168,37,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={16} color="#b8791a" />
                </div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c4a00', margin: 0 }}>Visi</h2>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(45,26,6,0.7)', margin: 0 }}>{jurusan.visi}</p>
            </div>
          )}

          {/* Misi */}
          {jurusan.misi && (
            <div className="jrs-card fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(184,121,26,0.15), rgba(232,168,37,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={16} color="#b8791a" />
                </div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c4a00', margin: 0 }}>Misi</h2>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(45,26,6,0.7)', margin: 0, whiteSpace: 'pre-line' }}>{jurusan.misi}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="jrs-grid">
          {/* Kompetensi */}
          {kompetensiList.length > 0 && (
            <div className="jrs-card fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(184,121,26,0.15), rgba(232,168,37,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={16} color="#b8791a" />
                </div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c4a00', margin: 0 }}>Kompetensi Keahlian</h2>
              </div>
              <div>
                {kompetensiList.map((item, i) => (
                  <div key={i} className="list-item">
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #b8791a, #e8a825)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'rgba(45,26,6,0.75)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prospek Kerja */}
          {prospekList.length > 0 && (
            <div className="jrs-card fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(184,121,26,0.15), rgba(232,168,37,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={16} color="#b8791a" />
                </div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c4a00', margin: 0 }}>Prospek Karir</h2>
              </div>
              <div>
                {prospekList.map((item, i) => (
                  <div key={i} className="list-item">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#b8791a', flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: '0.875rem', color: 'rgba(45,26,6,0.75)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Galeri */}
        {(jurusan.galeri || []).length > 0 && (
          <div className="jrs-card fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(184,121,26,0.15), rgba(232,168,37,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Images size={16} color="#b8791a" />
              </div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c4a00', margin: 0 }}>Galeri</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
              {(jurusan.galeri || []).map((url, i) => (
                <div key={i} className="galeri-thumb" onClick={() => setActiveGaleri(url)}>
                  <Image src={url} alt={`${jurusan.nama} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {activeGaleri && (
        <div
          onClick={() => setActiveGaleri(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', cursor: 'pointer' }}>
          <button onClick={() => setActiveGaleri(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', fontSize: 20 }}>✕</button>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh', width: '100%', height: '100%' }}>
            <Image src={activeGaleri} alt="Foto" fill style={{ objectFit: 'contain' }} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .jrs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
