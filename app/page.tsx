'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, SchoolProfile, Announcement, GalleryItem } from '@/lib/supabase'
import { ArrowRight, ArrowUpRight, Megaphone, Images, BookOpen, ChevronRight } from 'lucide-react'

export default function Home() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
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

      {/* ── HERO ── */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }} className="fade-up">
          {profile?.logo_url && (
            <div style={{ marginBottom: '1.75rem' }}>
              <Image src={profile.logo_url} alt="Logo" width={72} height={72}
                style={{ borderRadius: 18, objectFit: 'cover', boxShadow: 'var(--shadow-md)' }} />
            </div>
          )}
          <div className="section-label" style={{ marginBottom: '1rem' }}>Portal Resmi</div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {profile?.nama_sekolah || 'Portal Sekolah'}
          </h1>
          {profile?.tagline && (
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.75rem', maxWidth: 540, margin: '0 auto 0.75rem' }}>
              {profile.tagline}
            </p>
          )}
          {profile?.alamat && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '2.5rem' }}>📍 {profile.alamat}</p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profil" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.925rem' }}>
              Profil Sekolah <ArrowRight size={16} />
            </Link>
            <a href="https://spmb-smk1.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost" style={{ padding: '0.75rem 1.75rem', fontSize: '0.925rem' }}>
              Daftar SPMB <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section style={{ background: 'var(--accent)', padding: '0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {[
            { icon: <BookOpen size={18} />, label: 'Profil Sekolah', href: '/profil' },
            { icon: <Megaphone size={18} />, label: 'Pengumuman', href: '/pengumuman' },
            { icon: <Images size={18} />, label: 'Galeri', href: '/galeri' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, borderRight: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.15s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.12)'; el.style.color = 'white' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'rgba(255,255,255,0.85)' }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </section>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem', flex: 1, width: '100%' }}>

        {/* ── SAMBUTAN KEPSEK ── */}
        {profile?.kepsek_nama && profile?.kepsek_sambutan && (
          <section style={{ marginBottom: '4rem' }}>
            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2.5rem', alignItems: 'center', padding: '2.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', border: '1px solid #dbeafe' }}>
              <div style={{ textAlign: 'center' }}>
                {profile.kepsek_foto_url
                  ? <Image src={profile.kepsek_foto_url} alt={profile.kepsek_nama} width={100} height={120}
                      style={{ borderRadius: 14, objectFit: 'cover', display: 'block', boxShadow: 'var(--shadow-md)' }} />
                  : <div style={{ width: 100, height: 100, borderRadius: 14, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👤</div>
                }
                <div style={{ marginTop: '0.75rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{profile.kepsek_nama}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Kepala Sekolah</div>
              </div>
              <div>
                <div className="section-label" style={{ marginBottom: '0.75rem' }}>Sambutan</div>
                <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-muted)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "{profile.kepsek_sambutan}"
                </p>
                <Link href="/profil" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                  Baca selengkapnya <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── PENGUMUMAN ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.4rem' }}>Terbaru</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>Pengumuman</h2>
            </div>
            <Link href="/pengumuman" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>
          {announcements.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '3rem', fontSize: '0.9rem' }}>Belum ada pengumuman</div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {announcements.map((a, i) => (
                <div key={a.id} className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', animationDelay: `${i * 0.05}s` }}>
                  {a.gambar_url && (
                    <Image src={a.gambar_url} alt={a.judul} width={72} height={72}
                      style={{ borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginBottom: '0.3rem', fontWeight: 500 }}>
                      {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text)' }}>{a.judul}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── GALERI ── */}
        {gallery.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '0.4rem' }}>Dokumentasi</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>Galeri Kegiatan</h2>
              </div>
              <Link href="/galeri" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                Lihat semua <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {gallery.map(g => (
                <div key={g.id} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', position: 'relative', background: '#f1f5f9', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                  <Image src={g.foto_url} alt={g.caption || 'Galeri'} fill style={{ objectFit: 'cover' }} />
                  {g.caption && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.65))', padding: '1.5rem 0.75rem 0.6rem', color: 'white', fontSize: '0.72rem', fontWeight: 500 }}>
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
