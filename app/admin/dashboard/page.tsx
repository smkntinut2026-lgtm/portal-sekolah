'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { School, Megaphone, Images, ArrowRight, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ announcements: 0, gallery: 0, published: 0 })
  const [profileOk, setProfileOk] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('announcements').select('id, status'),
      supabase.from('gallery').select('id'),
      supabase.from('school_profile').select('nama_sekolah').single()
    ]).then(([ann, gal, prof]) => {
      const all = ann.data || []
      setCounts({ announcements: all.length, gallery: (gal.data || []).length, published: all.filter((a: { status: string }) => a.status === 'published').length })
      setProfileOk(!!(prof.data?.nama_sekolah))
    })
  }, [])

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem', fontFamily: 'Space Grotesk, sans-serif' }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Selamat datang di panel admin portal sekolah</p>
      </div>

      {/* Alert profil */}
      {!profileOk && (
        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#92400e', fontSize: '0.875rem' }}>⚠️ Profil sekolah belum dilengkapi</div>
            <div style={{ color: '#b45309', fontSize: '0.78rem', marginTop: '0.15rem' }}>Isi nama sekolah, kepala sekolah, visi misi, dan informasi lainnya</div>
          </div>
          <Link href="/admin/profil" style={{ background: '#f59e0b', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Lengkapi Sekarang →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Pengumuman', value: counts.announcements, sub: `${counts.published} dipublikasikan`, icon: <Megaphone size={20} />, href: '/admin/pengumuman', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Foto Galeri', value: counts.gallery, sub: 'total foto', icon: <Images size={20} />, href: '/admin/galeri', color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Dipublikasikan', value: counts.published, sub: 'dari ' + counts.announcements + ' pengumuman', icon: <TrendingUp size={20} />, href: '/admin/pengumuman', color: '#10b981', bg: '#d1fae5' },
        ].map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="admin-card admin-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: s.bg, color: s.color, borderRadius: 12, padding: '0.85rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>{s.sub}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2563eb', marginBottom: '1rem', fontFamily: 'Space Grotesk, sans-serif' }}>Aksi Cepat</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Edit Profil Sekolah', href: '/admin/profil', icon: <School size={18} />, desc: 'Nama, logo, kepala sekolah, visi misi' },
            { label: 'Tambah Pengumuman', href: '/admin/pengumuman', icon: <Megaphone size={18} />, desc: 'Posting berita dan pengumuman baru' },
            { label: 'Upload Foto Galeri', href: '/admin/galeri', icon: <Images size={18} />, desc: 'Tambah dokumentasi kegiatan' },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
              <div className="admin-card admin-card-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ color: '#2563eb', background: '#dbeafe', borderRadius: 8, padding: '0.5rem' }}>{a.icon}</div>
                  <ArrowRight size={15} style={{ color: '#94a3b8', marginTop: 2 }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.2rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
