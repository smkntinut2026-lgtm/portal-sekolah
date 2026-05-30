'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { School, Megaphone, Image, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ announcements: 0, gallery: 0, published: 0 })
  const [profileOk, setProfileOk] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('announcements').select('id, status'),
      supabase.from('gallery').select('id'),
      supabase.from('school_profile').select('nama_sekolah').single()
    ]).then(([ann, gal, prof]) => {
      const allAnn = ann.data || []
      setCounts({
        announcements: allAnn.length,
        gallery: (gal.data || []).length,
        published: allAnn.filter((a: { status: string }) => a.status === 'published').length
      })
      setProfileOk(!!(prof.data?.nama_sekolah && prof.data.nama_sekolah !== 'Nama Sekolah'))
    })
  }, [])

  const stats = [
    { label: 'Total Pengumuman', value: counts.announcements, sub: `${counts.published} dipublish`, icon: <Megaphone size={22} />, href: '/admin/pengumuman', color: '#1a3a5c' },
    { label: 'Foto Galeri', value: counts.gallery, sub: 'total foto', icon: <Image size={22} />, href: '/admin/galeri', color: '#e8a020' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Kelola konten portal sekolah kamu</p>

      {!profileOk && (
        <div style={{ background: '#fffbeb', border: '1px solid #f5c842', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#92400e', fontSize: '0.9rem' }}>⚠️ Profil sekolah belum diisi</div>
            <div style={{ color: '#b45309', fontSize: '0.8rem' }}>Lengkapi nama sekolah, logo, dan informasi lainnya</div>
          </div>
          <Link href="/admin/profil" style={{ background: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: 6, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
            Isi Sekarang →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
              <div style={{ background: s.color, color: 'white', borderRadius: 10, padding: '0.85rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text)', marginTop: '0.2rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1rem' }}>Aksi Cepat</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {[
          { label: 'Edit Profil Sekolah', href: '/admin/profil', icon: <School size={16} />, desc: 'Nama, logo, NPSN, alamat' },
          { label: 'Tambah Pengumuman', href: '/admin/pengumuman', icon: <Megaphone size={16} />, desc: 'Posting berita/pengumuman' },
          { label: 'Upload Foto Galeri', href: '/admin/galeri', icon: <Image size={16} />, desc: 'Tambah foto kegiatan' },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--primary)' }}>{a.icon}</div>
                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.75rem' }}>{a.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
