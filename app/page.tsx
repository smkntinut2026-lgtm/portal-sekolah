'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, SchoolProfile, Announcement, GalleryItem } from '@/lib/supabase'
import { ArrowRight, Megaphone, Image as ImageIcon, BookOpen } from 'lucide-react'

export default function Home() {
  // Tambahkan di state (atas useEffect):
const [profile, setProfile] = useState<SchoolProfile | null>(null)
  // (sudah ada, pastikan SchoolProfile punya kepsek_nama, kepsek_foto_url, kepsek_sambutan)
  
  // Tambahkan section ini di antara quick links dan pengumuman terbaru:
  {profile?.kepsek_nama && profile?.kepsek_sambutan && (
    <section style={{ marginBottom: '3.5rem' }}>
      <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', background: 'linear-gradient(135deg, #f8f7f3 0%, #eef2f8 100%)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          {profile.kepsek_foto_url
            ? <Image src={profile.kepsek_foto_url} alt={profile.kepsek_nama} width={100} height={110} style={{ borderRadius: 12, objectFit: 'cover', display: 'block', margin: '0 auto' }} />
            : <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(26,58,92,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto' }}>👤</div>
          }
          <div style={{ marginTop: '0.6rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>{profile.kepsek_nama}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kepala Sekolah</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Sambutan Kepala Sekolah</div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            "{profile.kepsek_sambutan}"
          </p>
          <Link href="/profil" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.75rem', color: 'var(--primary-light)', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}>
            Baca selengkapnya <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  )}
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => data && setProfile(data))
    supabase.from('announcements').select('*').eq('status', 'published').order('tanggal', { ascending: false }).limit(3).then(({ data }) => data && setAnnouncements(data))
    supabase.from('gallery').select('*').order('urutan').limit(6).then(({ data }) => data && setGallery(data))
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0f2744 60%, #1a3a5c 100%)', color: 'white', padding: '5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(232,160,32,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37,99,168,0.15) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          {profile?.logo_url && (
            <Image src={profile.logo_url} alt="Logo" width={80} height={80} style={{ borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', marginBottom: '1.5rem', objectFit: 'cover' }} />
          )}
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
            {profile?.nama_sekolah || 'Portal Sekolah'}
          </h1>
          {profile?.tagline && (
            <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' }}>{profile.tagline}</p>
          )}
          {profile?.alamat && (
            <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '2rem' }}>📍 {profile.alamat}</p>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profil" style={{ background: 'var(--accent)', color: 'white', padding: '0.75rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Profil Sekolah <ArrowRight size={16} />
            </Link>
            <a href="https://spmb-smk1.vercel.app/" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.75rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              Daftar SPMB
            </a>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
          {[
            { icon: <BookOpen size={24} />, label: 'Profil Sekolah', href: '/profil', desc: 'Visi, misi & sejarah' },
            { icon: <Megaphone size={24} />, label: 'Pengumuman', href: '/pengumuman', desc: 'Info & berita terbaru' },
            { icon: <ImageIcon size={24} />, label: 'Galeri', href: '/galeri', desc: 'Foto kegiatan sekolah' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div style={{ color: 'var(--primary)', background: 'rgba(26,58,92,0.08)', borderRadius: 10, padding: '0.75rem' }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pengumuman terbaru */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>Pengumuman Terbaru</h2>
            <Link href="/pengumuman" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          {announcements.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Belum ada pengumuman</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {announcements.map(a => (
                <div key={a.id} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {a.gambar_url && (
                    <Image src={a.gambar_url} alt={a.judul} width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{a.judul}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Galeri preview */}
        {gallery.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>Galeri Kegiatan</h2>
              <Link href="/galeri" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {gallery.map(g => (
                <div key={g.id} style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '1', position: 'relative', background: '#e5e0d8' }}>
                  <Image src={g.foto_url} alt={g.caption || 'Galeri'} fill style={{ objectFit: 'cover' }} />
                  {g.caption && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '1rem 0.75rem 0.5rem', color: 'white', fontSize: '0.75rem' }}>
                      {g.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
