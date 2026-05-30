'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase, SchoolProfile, Announcement, GalleryItem } from '@/lib/supabase'
import { ArrowRight, ArrowUpRight, ChevronRight, Megaphone, Images, BookOpen, Sparkles, MapPin } from 'lucide-react'

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
      <section style={{ position: 'relative', minHeight: '95vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

        {/* SVG background: batik-inspired patterns + golden geometric */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Warm gold gradient orbs */}
            <radialGradient id="orb1" cx="50%" cy="0%" r="60%">
              <stop offset="0%" stopColor="#d4921f" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#d4921f" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orb2" cx="85%" cy="70%" r="40%">
              <stop offset="0%" stopColor="#e8a825" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#e8a825" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orb3" cx="10%" cy="80%" r="35%">
              <stop offset="0%" stopColor="#7c4a00" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7c4a00" stopOpacity="0" />
            </radialGradient>

            {/* Batik pattern definition (parang/kawung inspired) */}
            <pattern id="batikKawung" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              {/* Kawung: 4-petal oval shapes */}
              <ellipse cx="30" cy="15" rx="10" ry="13" fill="none" stroke="rgba(184,121,26,0.13)" strokeWidth="1"/>
              <ellipse cx="30" cy="45" rx="10" ry="13" fill="none" stroke="rgba(184,121,26,0.13)" strokeWidth="1"/>
              <ellipse cx="15" cy="30" rx="13" ry="10" fill="none" stroke="rgba(184,121,26,0.13)" strokeWidth="1"/>
              <ellipse cx="45" cy="30" rx="13" ry="10" fill="none" stroke="rgba(184,121,26,0.13)" strokeWidth="1"/>
              <circle cx="30" cy="30" r="4" fill="none" stroke="rgba(184,121,26,0.16)" strokeWidth="0.8"/>
              <circle cx="30" cy="30" r="1.5" fill="rgba(184,121,26,0.12)"/>
            </pattern>

            {/* Parang pattern (diagonal repeat) */}
            <pattern id="batikParang" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <path d="M0 12 Q12 6 24 12 Q36 18 48 12" fill="none" stroke="rgba(184,121,26,0.09)" strokeWidth="1.2"/>
              <path d="M0 36 Q12 30 24 36 Q36 42 48 36" fill="none" stroke="rgba(184,121,26,0.09)" strokeWidth="1.2"/>
              <path d="M12 0 Q18 12 12 24 Q6 36 12 48" fill="none" stroke="rgba(212,146,31,0.07)" strokeWidth="1"/>
            </pattern>

            {/* Bottom fade - warm */}
            <linearGradient id="btmFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdf8f0" stopOpacity="0" />
              <stop offset="100%" stopColor="#fdf8f0" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Gradient orbs */}
          <rect width="1440" height="900" fill="url(#orb1)" />
          <rect width="1440" height="900" fill="url(#orb2)" />
          <rect width="1440" height="900" fill="url(#orb3)" />

          {/* Batik kawung pattern overlay — large area, faded */}
          <rect width="1440" height="900" fill="url(#batikKawung)" opacity="0.9" />

          {/* Batik parang in corner regions */}
          <rect x="900" y="0" width="540" height="500" fill="url(#batikParang)" opacity="0.7" />
          <rect x="0" y="600" width="400" height="300" fill="url(#batikParang)" opacity="0.5" />

          {/* Subtle grid */}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 96} y1="0" x2={i * 96} y2="900" stroke="rgba(184,121,26,0.035)" strokeWidth="1" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 100} x2="1440" y2={i * 100} stroke="rgba(184,121,26,0.035)" strokeWidth="1" />
          ))}

          {/* Golden hexagon top-right */}
          <polygon points="1200,0 1360,90 1360,270 1200,360 1040,270 1040,90"
            fill="none" stroke="rgba(184,121,26,0.12)" strokeWidth="1.5" />
          <polygon points="1220,30 1340,100 1340,240 1220,310 1100,240 1100,100"
            fill="none" stroke="rgba(212,146,31,0.08)" strokeWidth="1" />
          {/* Hexagon inner shimmer fill */}
          <polygon points="1200,0 1360,90 1360,270 1200,360 1040,270 1040,90"
            fill="rgba(232,168,37,0.025)" />

          {/* Diagonal accent lines */}
          <line x1="0" y1="600" x2="400" y2="0" stroke="rgba(184,121,26,0.07)" strokeWidth="1" />
          <line x1="50" y1="650" x2="450" y2="50" stroke="rgba(184,121,26,0.04)" strokeWidth="1" />

          {/* Decorative small shapes */}
          <rect x="900" y="120" width="40" height="40" rx="6" fill="none" stroke="rgba(232,168,37,0.2)" strokeWidth="1.5" transform="rotate(20 920 140)" />
          <rect x="1300" y="400" width="28" height="28" rx="4" fill="none" stroke="rgba(184,121,26,0.18)" strokeWidth="1.5" transform="rotate(35 1314 414)" />
          <circle cx="180" cy="700" r="40" fill="none" stroke="rgba(184,121,26,0.1)" strokeWidth="1.5" />
          <circle cx="160" cy="700" r="22" fill="none" stroke="rgba(184,121,26,0.07)" strokeWidth="1" />
          <circle cx="1380" cy="180" r="30" fill="none" stroke="rgba(232,168,37,0.14)" strokeWidth="1.5" />

          {/* Triangle bottom-left */}
          <polygon points="0,750 120,900 0,900" fill="rgba(184,121,26,0.05)" />
          <polygon points="0,820 60,900 0,900" fill="rgba(184,121,26,0.07)" />

          {/* Gold dot grid top-right */}
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <circle key={`dot-${row}-${col}`} cx={1050 + col * 32} cy={50 + row * 32} r="1.5" fill="rgba(184,121,26,0.22)" />
            ))
          )}

          {/* Bottom gradient fade */}
          <rect y="700" width="1440" height="200" fill="url(#btmFade)" />
        </svg>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '6rem 1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 820 }}>

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem 0.4rem 0.5rem', borderRadius: 50,
              border: '1px solid rgba(184,121,26,0.3)',
              background: 'rgba(255,252,245,0.65)',
              backdropFilter: 'blur(12px)',
              marginBottom: '2.25rem',
              animation: 'fadeUp 0.5s ease forwards',
              boxShadow: '0 2px 12px rgba(184,121,26,0.12)',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 50,
                background: 'linear-gradient(135deg, #7c4a00, #b8791a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 8px rgba(184,121,26,0.4)',
              }}>
                <Sparkles size={11} color="#fff9ee" />
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, background: 'linear-gradient(135deg, #7c4a00, #b8791a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Portal Resmi Sekolah</span>
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900,
              color: '#2d1a06',
              marginBottom: '1.25rem', letterSpacing: '-0.04em', lineHeight: 1.0,
              animation: 'fadeUp 0.6s 0.08s ease forwards', opacity: 0,
            }}>
              {profile?.nama_sekolah
                ? profile.nama_sekolah.split(' ').slice(0, 2).join(' ') + '\n' + profile.nama_sekolah.split(' ').slice(2).join(' ')
                : 'Portal Sekolah'}
            </h1>

            {/* Golden gradient line decoration */}
            <div style={{
              width: 80, height: 4,
              background: 'linear-gradient(90deg, #7c4a00, #b8791a, #e8a825)',
              borderRadius: 2, marginBottom: '1.5rem',
              animation: 'fadeUp 0.6s 0.14s ease forwards', opacity: 0,
              boxShadow: '0 0 12px rgba(184,121,26,0.35)',
            }} />

            {profile?.tagline && (
              <p style={{ fontSize: '1.15rem', color: 'rgba(45,26,6,0.6)', marginBottom: '0.85rem', lineHeight: 1.75, maxWidth: 560, animation: 'fadeUp 0.6s 0.18s ease forwards', opacity: 0, fontWeight: 400 }}>
                {profile.tagline}
              </p>
            )}
            {profile?.alamat && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'rgba(45,26,6,0.4)', marginBottom: '3rem', animation: 'fadeUp 0.6s 0.22s ease forwards', opacity: 0 }}>
                <MapPin size={13} style={{ flexShrink: 0 }} />
                {profile.alamat}
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.28s ease forwards', opacity: 0 }}>
              <Link href="/profil" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '0.925rem', borderRadius: 12 }}>
                Profil Sekolah <ArrowRight size={16} />
              </Link>
              <Link href="/spmb"
                className="btn btn-ghost" style={{ padding: '0.9rem 2rem', fontSize: '0.925rem', borderRadius: 12 }}>
                Daftar SPMB <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK NAV STRIP ── */}
      <div style={{
        borderTop: '1px solid rgba(184,121,26,0.15)',
        borderBottom: '1px solid rgba(184,121,26,0.15)',
        background: 'rgba(255,252,245,0.75)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 2px 20px rgba(120,70,10,0.07)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { icon: <BookOpen size={17} />, label: 'Profil Sekolah', href: '/profil', color: '#7c4a00' },
            { icon: <Megaphone size={17} />, label: 'Pengumuman', href: '/pengumuman', color: '#b8791a' },
            { icon: <Images size={17} />, label: 'Galeri', href: '/galeri', color: '#d4921f' },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', padding: '1.15rem 1rem', color: 'rgba(45,26,6,0.5)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, borderRight: i < 2 ? '1px solid rgba(184,121,26,0.1)' : 'none', transition: 'all 0.2s', letterSpacing: '0.01em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = item.color; el.style.background = 'rgba(184,121,26,0.06)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(45,26,6,0.5)'; el.style.background = 'transparent' }}>
              <span style={{ color: item.color }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 1.5rem', flex: 1, width: '100%' }}>

        {/* ── SAMBUTAN KEPSEK ── */}
        {profile?.kepsek_nama && profile?.kepsek_sambutan && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2.5rem', alignItems: 'center', padding: '2.5rem', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(184,121,26,0.2)', boxShadow: '0 4px 30px rgba(120,70,10,0.1)' }}>
              {/* Card gradient bg */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,252,245,0.95) 0%, rgba(253,248,240,0.98) 60%, rgba(255,248,225,0.9) 100%)', zIndex: 0 }} />
              {/* Batik kawung SVG inside card */}
              <svg style={{ position: 'absolute', right: 0, top: 0, width: 280, height: '100%', opacity: 0.5, zIndex: 0 }} viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 4 }).map((_, row) =>
                  Array.from({ length: 5 }).map((_, col) => {
                    const cx = col * 56 + 28; const cy = row * 50 + 25
                    return (
                      <g key={`kw-${row}-${col}`}>
                        <ellipse cx={cx} cy={cy - 13} rx="8" ry="11" fill="none" stroke="rgba(184,121,26,0.18)" strokeWidth="0.8" />
                        <ellipse cx={cx} cy={cy + 13} rx="8" ry="11" fill="none" stroke="rgba(184,121,26,0.18)" strokeWidth="0.8" />
                        <ellipse cx={cx - 13} cy={cy} rx="11" ry="8" fill="none" stroke="rgba(184,121,26,0.18)" strokeWidth="0.8" />
                        <ellipse cx={cx + 13} cy={cy} rx="11" ry="8" fill="none" stroke="rgba(184,121,26,0.18)" strokeWidth="0.8" />
                        <circle cx={cx} cy={cy} r="3.5" fill="none" stroke="rgba(184,121,26,0.2)" strokeWidth="0.8" />
                      </g>
                    )
                  })
                )}
              </svg>
              {/* Glossy top stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, rgba(184,121,26,0.4), rgba(232,168,37,0.7), rgba(184,121,26,0.4), transparent)', borderRadius: '20px 20px 0 0', zIndex: 1 }} />

              <div style={{ textAlign: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {profile.kepsek_foto_url
                    ? <Image src={profile.kepsek_foto_url} alt={profile.kepsek_nama} width={100} height={118} style={{ borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(184,121,26,0.4)', display: 'block', boxShadow: '0 4px 20px rgba(120,70,10,0.2)' }} />
                    : <div style={{ width: 100, height: 100, borderRadius: 14, background: 'linear-gradient(135deg, rgba(184,121,26,0.15), rgba(212,146,31,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, border: '2px solid rgba(184,121,26,0.2)' }}>👤</div>
                  }
                  <div style={{ position: 'absolute', bottom: -5, right: -5, width: 22, height: 22, borderRadius: 50, background: 'linear-gradient(135deg, #7c4a00, #b8791a)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fdf8f0', boxShadow: '0 2px 8px rgba(184,121,26,0.4)' }}>
                    <Sparkles size={10} color="#fff9ee" />
                  </div>
                </div>
                <div style={{ marginTop: '0.85rem', fontWeight: 800, fontSize: '0.82rem', color: '#2d1a06' }}>{profile.kepsek_nama}</div>
                <div style={{ fontSize: '0.67rem', color: 'rgba(45,26,6,0.4)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Kepala Sekolah</div>
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-label" style={{ marginBottom: '0.85rem' }}>Sambutan Kepala Sekolah</div>
                <p style={{ fontSize: '1rem', lineHeight: 1.9, color: 'rgba(45,26,6,0.6)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 400 }}>
                  &ldquo;{profile.kepsek_sambutan}&rdquo;
                </p>
                <Link href="/profil" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.1rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', background: 'linear-gradient(135deg, #7c4a00, #b8791a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Baca selengkapnya <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── PENGUMUMAN ── */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.25rem' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>Terbaru</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1a06', letterSpacing: '-0.03em' }}>Pengumuman</h2>
            </div>
            <Link href="/pengumuman" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(45,26,6,0.5)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(184,121,26,0.18)', padding: '0.45rem 1rem', borderRadius: 10, transition: 'all 0.2s', background: 'rgba(255,252,245,0.6)', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#7c4a00'; el.style.borderColor = 'rgba(184,121,26,0.4)'; el.style.background = 'rgba(184,121,26,0.08)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(45,26,6,0.5)'; el.style.borderColor = 'rgba(184,121,26,0.18)'; el.style.background = 'rgba(255,252,245,0.6)' }}>
              Lihat semua <ArrowRight size={13} />
            </Link>
          </div>

          {announcements.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem', fontSize: '0.9rem', borderRadius: 20 }}>
              Belum ada pengumuman
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.7rem' }}>
              {announcements.map((a, i) => (
                <div key={a.id} className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', borderRadius: 16, animationDelay: `${i * 0.06}s` }}>
                  {a.gambar_url && (
                    <Image src={a.gambar_url} alt={a.judul} width={72} height={72} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(184,121,26,0.2)', boxShadow: '0 2px 8px rgba(120,70,10,0.1)' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(45,26,6,0.35)', marginBottom: '0.35rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#2d1a06', letterSpacing: '-0.01em' }}>{a.judul}</h3>
                    <p style={{ fontSize: '0.83rem', color: 'rgba(45,26,6,0.5)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── GALERI ── */}
        {gallery.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.25rem' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '0.5rem' }}>Dokumentasi</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1a06', letterSpacing: '-0.03em' }}>Galeri Kegiatan</h2>
              </div>
              <Link href="/galeri" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(45,26,6,0.5)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(184,121,26,0.18)', padding: '0.45rem 1rem', borderRadius: 10, transition: 'all 0.2s', background: 'rgba(255,252,245,0.6)', backdropFilter: 'blur(8px)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#7c4a00'; el.style.borderColor = 'rgba(184,121,26,0.4)'; el.style.background = 'rgba(184,121,26,0.08)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(45,26,6,0.5)'; el.style.borderColor = 'rgba(184,121,26,0.18)'; el.style.background = 'rgba(255,252,245,0.6)' }}>
                Lihat semua <ArrowRight size={13} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {gallery.map(g => (
                <div key={g.id} style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '1', position: 'relative', background: 'rgba(184,121,26,0.06)', border: '1px solid rgba(184,121,26,0.15)', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.04)'; el.style.borderColor = 'rgba(184,121,26,0.4)'; el.style.boxShadow = '0 0 30px rgba(184,121,26,0.18)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1)'; el.style.borderColor = 'rgba(184,121,26,0.15)'; el.style.boxShadow = 'none' }}>
                  <Image src={g.foto_url} alt={g.caption || 'Galeri'} fill style={{ objectFit: 'cover' }} />
                  {g.caption && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(45,26,6,0.8))', padding: '2rem 0.75rem 0.65rem', color: '#fff9ee', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.02em' }}>
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
