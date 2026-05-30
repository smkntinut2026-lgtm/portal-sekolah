'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase, SchoolProfile } from '@/lib/supabase'
import { Upload, Save, User } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem',
  border: '1.5px solid var(--border)', borderRadius: 8,
  fontSize: '0.9rem', outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  background: 'white', transition: 'border-color 0.15s'
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle, resize: 'vertical', minHeight: 120, lineHeight: 1.7
}

function SectionCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>{label}</label>
      {children}
    </div>
  )
}

export default function AdminProfilPage() {
  const [form, setForm] = useState<Partial<SchoolProfile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [profileId, setProfileId] = useState<string>('')
  const logoRef = useRef<HTMLInputElement>(null)
  const kepsekFotoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('school_profile').select('*').single().then(({ data }) => {
      if (data) { setForm(data); setProfileId(data.id) }
      setLoading(false)
    })
  }, [])

  const handleUpload = async (file: File, folder: string, field: keyof SchoolProfile, setKey: string | null) => {
    setUploading(field)
    const ext = file.name.split('.').pop()
    const filename = `${folder}-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('portal-assets').upload(`${folder}s/${filename}`, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('portal-assets').getPublicUrl(`${folder}s/${filename}`)
      setForm(prev => ({ ...prev, [field]: urlData.publicUrl }))
    }
    setUploading(null)
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setMsg(null)
    const { error } = await supabase.from('school_profile').update({
      nama_sekolah: form.nama_sekolah, npsn: form.npsn, alamat: form.alamat,
      tagline: form.tagline, logo_url: form.logo_url, email: form.email,
      telepon: form.telepon, website: form.website,
      kepsek_nama: form.kepsek_nama, kepsek_nip: form.kepsek_nip,
      kepsek_foto_url: form.kepsek_foto_url, kepsek_sambutan: form.kepsek_sambutan,
      visi: form.visi, misi: form.misi, sejarah: form.sejarah,
    }).eq('id', profileId)
    setMsg(error
      ? { type: 'error', text: 'Gagal menyimpan: ' + error.message }
      : { type: 'success', text: '✅ Profil berhasil disimpan!' })
    setSaving(false)
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Memuat...</div>

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Profil Sekolah</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Kelola informasi sekolah, kepala sekolah, visi misi & sejarah</p>
      </div>

      {/* === IDENTITAS SEKOLAH === */}
      <SectionCard title="🏫 Identitas Sekolah">
        <Field label="Logo Sekolah">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, border: '2px dashed var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f3', flexShrink: 0 }}>
              {form.logo_url ? <Image src={form.logo_url} alt="Logo" width={80} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%' }} /> : <span style={{ fontSize: 32 }}>🏫</span>}
            </div>
            <div>
              <button onClick={() => logoRef.current?.click()} disabled={uploading === 'logo_url'} className="btn-primary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={13} /> {uploading === 'logo_url' ? 'Mengupload...' : 'Upload Logo'}
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>PNG/JPG • Maks 2MB • Rasio 1:1</p>
              <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'logo', 'logo_url', null) }} />
            </div>
          </div>
        </Field>
        {[
          { key: 'nama_sekolah', label: 'Nama Sekolah *', placeholder: 'SMK Negeri 1 ...' },
          { key: 'npsn', label: 'NPSN', placeholder: '10xxxxxx' },
          { key: 'tagline', label: 'Tagline / Motto', placeholder: 'Unggul dalam prestasi, mulia dalam akhlak' },
          { key: 'alamat', label: 'Alamat Sekolah', placeholder: 'Jl. ...' },
          { key: 'telepon', label: 'No. Telepon', placeholder: '0411-xxxxxx' },
          { key: 'email', label: 'Email Sekolah', placeholder: 'info@sekolah.sch.id' },
          { key: 'website', label: 'Website', placeholder: 'https://sekolah.sch.id' },
        ].map(f => (
          <Field key={f.key} label={f.label}>
            <input type="text" value={(form as Record<string, string>)[f.key] || ''} onChange={set(f.key)} placeholder={f.placeholder} style={inputStyle} />
          </Field>
        ))}
      </SectionCard>

      {/* === KEPALA SEKOLAH === */}
      <SectionCard title="👤 Kepala Sekolah">
        <Field label="Foto Kepala Sekolah">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', border: '2px dashed var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f3', flexShrink: 0 }}>
              {form.kepsek_foto_url
                ? <Image src={form.kepsek_foto_url} alt="Kepala Sekolah" width={90} height={90} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                : <User size={36} color="var(--text-muted)" />}
            </div>
            <div>
              <button onClick={() => kepsekFotoRef.current?.click()} disabled={uploading === 'kepsek_foto_url'} className="btn-primary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={13} /> {uploading === 'kepsek_foto_url' ? 'Mengupload...' : 'Upload Foto'}
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Format portrait disarankan</p>
              <input ref={kepsekFotoRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'kepsek', 'kepsek_foto_url', null) }} />
            </div>
          </div>
        </Field>
        <Field label="Nama Lengkap Kepala Sekolah">
          <input type="text" value={form.kepsek_nama || ''} onChange={set('kepsek_nama')} placeholder="Drs. Ahmad Fauzi, M.Pd." style={inputStyle} />
        </Field>
        <Field label="NIP">
          <input type="text" value={form.kepsek_nip || ''} onChange={set('kepsek_nip')} placeholder="19700101 199903 1 001" style={inputStyle} />
        </Field>
        <Field label="Sambutan Kepala Sekolah">
          <textarea value={form.kepsek_sambutan || ''} onChange={set('kepsek_sambutan')} placeholder="Tulis sambutan kepala sekolah di sini..." style={{ ...textareaStyle, minHeight: 160 }} />
        </Field>
      </SectionCard>

      {/* === VISI & MISI === */}
      <SectionCard title="🎯 Visi & Misi">
        <Field label="Visi">
          <textarea value={form.visi || ''} onChange={set('visi')} placeholder="Menjadi sekolah yang unggul, berkarakter, dan berdaya saing global..." style={textareaStyle} />
        </Field>
        <Field label="Misi">
          <textarea value={form.misi || ''} onChange={set('misi')} placeholder="1. Meningkatkan kualitas pembelajaran...\n2. Mengembangkan karakter siswa...\n3. ..." style={{ ...textareaStyle, minHeight: 180 }} />
        </Field>
      </SectionCard>

      {/* === SEJARAH === */}
      <SectionCard title="📜 Sejarah Sekolah">
        <Field label="Sejarah Singkat">
          <textarea value={form.sejarah || ''} onChange={set('sejarah')} placeholder="Sekolah ini didirikan pada tahun ... oleh ..." style={{ ...textareaStyle, minHeight: 200 }} />
        </Field>
      </SectionCard>

      {msg && (
        <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#16a34a' : '#dc2626', padding: '0.85rem 1rem', borderRadius: 10, fontSize: '0.875rem', marginBottom: '1rem', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
          {msg.text}
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
        <Save size={17} /> {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
      </button>
    </div>
  )
}
