'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, SchoolProfile, Announcement, GalleryItem } from '@/lib/supabase'
import { ArrowRight, ArrowUpRight, ChevronRight, Megaphone, Images, BookOpen } from 'lucide-react'

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

        {/* Background layers */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 40% at 80% 80%, rgba(245,158,11,0.06) 0%, transparent 60%)' }} />

        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />

        {/* Glowing orb top */}
        <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '6rem 1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 780 }}>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: 40, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', marginBottom: '2rem', animation: 'fadeUp 0.4s ease forwards' }}>
              {profile?.logo_url && <Image src={profile.logo_url} alt="Logo" width={18} height={18} style={{ borderRadius: 4, objectFit: 'cover' }} />}
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Portal Resmi Sekolah</span>
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem', letterSpacing: '-0.03em', lineHeight: 1.05, animation: 'fadeUp 0.5s 0.08s ease forwards', opacity: 0 }}>
              {profile?.nama_sekolah || 'Portal Sekolah'}
            </h1>

            {profile?.tagline && (
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.7, maxWidth: 540, animation: 'fadeUp 0.5s 0.16s ease forwards', opacity: 0 }}>
                {profile.tagline}
              </p>
            )}
            {profile?.alamat && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '2.75rem', animation: 'fadeUp 0.5s 0.22s ease forwards', opacity: 0 }}>
                📍 {profile.alamat}
              </p>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', animation: 'fadeUp 0.5s 0.28s ease forwards', opacity: 0 }}>
              <Link href="/profil" className="btn btn-primary" style={{ padding: '0.8rem 1.85rem', fontSize: '0.925rem' }}>
                Profil Sekolah <ArrowRight size={16} />
              </Link>
              <a href="https://spmb-smk1.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost" style={{ padding: '0.8rem 1.85rem', fontSize: '0.925rem' }}>
                Daftar SPMB <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent, var(--bg))' }} />
      </section>

      {/* ── NAV STRIP ── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { icon: <BookOpen size={16} />, label: 'Profil Sekolah', href: '/profil' },
            { icon: <Megaphone size={16} />, label: 'Pengumuman', href: '/pengumuman' },
            { icon: <Images size={16} />, label: 'Galeri', href: '/galeri' },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '1.1rem 1rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, borderRight: i < 2 ? '1px solid var(--border)' : 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text)'; el.style.background = 'var(--surface)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.background = 'transparent' }}>
              <span style={{ color: 'var(--accent)' }}>{item.icon}</span> {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 1.5rem', flex: 1, width: '100%' }}>

        {/* ── SAMBUTAN KEPSEK ── */}
        {profile?.kepsek_nama && profile?.kepsek_sambutan && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2.5rem', alignItems: 'center', padding: '2.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                {profile.kepsek_foto_url
                  ? <Image src={profile.kepsek_foto_url} alt={profile.kepsek_nama} width={96} height={112} style={{ borderRadius: 12, objectFit: 'cover', border: '1px solid var(--border-bright)', display: 'block' }} />
                  : <div style={{ width: 96, height: 96, borderRadius: 12, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>👤</div>
                }
                <div style={{ marginTop: '0.75rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>{profile.kepsek_nama}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Kepala Sekolah</div>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-label" style={{ marginBottom: '0.75rem' }}>Sambutan</div>
                <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--text-muted)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "{profile.kepsek_sambutan}"
                </p>
                <Link href="/profil" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                  Baca selengkapnya <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── PENGUMUMAN ── */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.4rem' }}>Terbaru</div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text)' }}>Pengumuman</h2>
            </div>
            <Link href="/pengumuman" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, border: '1px solid var(--border)', padding: '0.4rem 0.9rem', borderRadius: 8, transition: 'all 0.15s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--accent)'; el.style.borderColor = 'rgba(59,130,246,0.4)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.borderColor = 'var(--border)' }}>
              Lihat semua <ArrowRight size={13} />
            </Link>
          </div>

          {announcements.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem', fontSize: '0.9rem' }}>
              Belum ada pengumuman
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {announcements.map((a, i) => (
                <div key={a.id} className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', animationDelay: `${i * 0.06}s` }}>
                  {a.gambar_url && (
                    <Image src={a.gambar_url} alt={a.judul} width={68} height={68} style={{ borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.3rem', fontWeight: 500 }}>
                      {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.975rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text)' }}>{a.judul}</h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── GALERI ── */}
        {gallery.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '0.4rem' }}>Dokumentasi</div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text)' }}>Galeri Kegiatan</h2>
              </div>
              <Link href="/galeri" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, border: '1px solid var(--border)', padding: '0.4rem 0.9rem', borderRadius: 8, transition: 'all 0.15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--accent)'; el.style.borderColor = 'rgba(59,130,246,0.4)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.borderColor = 'var(--border)' }}>
                Lihat semua <ArrowRight size={13} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {gallery.map(g => (
                <div key={g.id} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', transition: 'transform 0.25s, border-color 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.03)'; el.style.borderColor = 'var(--border-bright)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1)'; el.style.borderColor = 'var(--border)' }}>
                  <Image src={g.foto_url} alt={g.caption || 'Galeri'} fill style={{ objectFit: 'cover' }} />
                  {g.caption && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))', padding: '1.75rem 0.75rem 0.65rem', color: 'white', fontSize: '0.72rem', fontWeight: 500 }}>
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
