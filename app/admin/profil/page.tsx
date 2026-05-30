'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { Upload, Save } from 'lucide-react'

export default function AdminProfilPage() {
  const [form, setForm] = useState<Partial<SchoolProfile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [profileId, setProfileId] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => {
      if (data) { setForm(data); setProfileId(data.id) }
      setLoading(false)
    })
  }, [])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `logo-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('portal-assets').upload(`logos/${filename}`, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('portal-assets').getPublicUrl(`logos/${filename}`)
      setForm(prev => ({ ...prev, logo_url: urlData.publicUrl }))
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg(null)
    const { error } = await supabase.from('school_profile').update({
      nama_sekolah: form.nama_sekolah,
      npsn: form.npsn,
      alamat: form.alamat,
      tagline: form.tagline,
      logo_url: form.logo_url,
      email: form.email,
      telepon: form.telepon,
      website: form.website,
    }).eq('id', profileId)

    if (error) setMsg({ type: 'error', text: 'Gagal menyimpan: ' + error.message })
    else setMsg({ type: 'success', text: 'Profil berhasil disimpan!' })
    setSaving(false)
  }

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Memuat...</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Profil Sekolah</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Informasi yang tampil di header dan footer website</p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Logo */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Logo Sekolah</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, border: '2px dashed var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f3', flexShrink: 0 }}>
              {form.logo_url ? (
                <Image src={form.logo_url} alt="Logo" width={80} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              ) : <span style={{ fontSize: 32 }}>🏫</span>}
            </div>
            <div>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={14} /> {uploading ? 'Mengupload...' : 'Upload Logo'}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>PNG, JPG • Maks 2MB • Disarankan 1:1</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </div>
          </div>
        </div>

        {/* Fields */}
        {[
          { key: 'nama_sekolah', label: 'Nama Sekolah *', placeholder: 'SMK Negeri 1 ...' },
          { key: 'npsn', label: 'NPSN', placeholder: '10xxxxxx' },
          { key: 'tagline', label: 'Tagline', placeholder: 'Unggul dalam prestasi, mulia dalam akhlak' },
          { key: 'alamat', label: 'Alamat Sekolah', placeholder: 'Jl. ...' },
          { key: 'telepon', label: 'No. Telepon', placeholder: '0411-xxxxxx' },
          { key: 'email', label: 'Email Sekolah', placeholder: 'info@sekolah.sch.id' },
          { key: 'website', label: 'Website', placeholder: 'https://sekolah.sch.id' },
        ].map(f => (
          <div key={f.key}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>{f.label}</label>
            <input
              type="text"
              value={(form as Record<string, string>)[f.key] || ''}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
          </div>
        ))}

        {msg && (
          <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#16a34a' : '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.875rem' }}>
            {msg.text}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
          <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </div>
    </div>
  )
}
