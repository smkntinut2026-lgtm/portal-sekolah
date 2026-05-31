'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase, Jurusan } from '@/lib/supabase'
import { Plus, Trash2, Save, Upload, ChevronDown, ChevronUp, X, Edit3, Images } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem',
  border: '1.5px solid var(--border)', borderRadius: 8,
  fontSize: '0.9rem', outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  background: 'white', transition: 'border-color 0.15s',
  boxSizing: 'border-box',
}
const textareaStyle: React.CSSProperties = {
  ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.7,
}

const emptyForm = (): Partial<Jurusan> => ({
  nama: '', singkatan: '', slug: '', deskripsi: '', visi: '', misi: '',
  kompetensi: '', prospek_kerja: '', foto_url: '', galeri: [], urutan: 0,
})

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>{label}</label>
      {children}
    </div>
  )
}

export default function AdminJurusanPage() {
  const [list, setList] = useState<Jurusan[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Jurusan>>(emptyForm())
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fotoRef = useRef<HTMLInputElement>(null)
  const galeriRef = useRef<HTMLInputElement>(null)

  const load = () => {
    supabase.from('jurusan').select('*').order('urutan').then(({ data }) => {
      if (data) setList(data as Jurusan[])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value
    setForm(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'nama') next.slug = slugify(val)
      return next
    })
  }

  const handleOpen = (j: Jurusan) => {
    setIsNew(false)
    setOpenId(j.id)
    setForm({ ...j })
    setMsg(null)
  }

  const handleNew = () => {
    setIsNew(true)
    setOpenId('__new__')
    setForm({ ...emptyForm(), urutan: list.length + 1 })
    setMsg(null)
  }

  const handleClose = () => {
    setOpenId(null)
    setIsNew(false)
    setForm(emptyForm())
    setMsg(null)
  }

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('foto')
    const filename = `jurusan-cover-${Date.now()}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage.from('portal-assets').upload(`jurusan/${filename}`, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('portal-assets').getPublicUrl(`jurusan/${filename}`)
      setForm(prev => ({ ...prev, foto_url: urlData.publicUrl }))
    }
    setUploading(null)
  }

  const handleUploadGaleri = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading('galeri')
    const urls: string[] = []
    for (const file of files) {
      const filename = `jurusan-galeri-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage.from('portal-assets').upload(`jurusan/${filename}`, file, { upsert: true })
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('portal-assets').getPublicUrl(`jurusan/${filename}`)
        urls.push(urlData.publicUrl)
      }
    }
    setForm(prev => ({ ...prev, galeri: [...(prev.galeri || []), ...urls] }))
    setUploading(null)
  }

  const removeGaleri = (idx: number) => {
    setForm(prev => ({ ...prev, galeri: (prev.galeri || []).filter((_, i) => i !== idx) }))
  }

  const handleSave = async () => {
    if (!form.nama?.trim()) { setMsg({ type: 'error', text: 'Nama jurusan wajib diisi!' }); return }
    if (!form.slug?.trim()) { setMsg({ type: 'error', text: 'Slug wajib diisi!' }); return }
    setSaving(true); setMsg(null)

    const payload = {
      nama: form.nama, singkatan: form.singkatan, slug: form.slug,
      deskripsi: form.deskripsi, visi: form.visi, misi: form.misi,
      kompetensi: form.kompetensi, prospek_kerja: form.prospek_kerja,
      foto_url: form.foto_url, galeri: form.galeri || [], urutan: form.urutan,
    }

    let error
    if (isNew) {
      ({ error } = await supabase.from('jurusan').insert([payload]))
    } else {
      ({ error } = await supabase.from('jurusan').update(payload).eq('id', openId!))
    }

    setMsg(error
      ? { type: 'error', text: 'Gagal menyimpan: ' + error.message }
      : { type: 'success', text: '✅ Jurusan berhasil disimpan!' })
    setSaving(false)
    if (!error) { load(); if (isNew) handleClose() }
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus jurusan "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) return
    await supabase.from('jurusan').delete().eq('id', id)
    if (openId === id) handleClose()
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Jurusan</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kelola daftar jurusan dan informasinya</p>
        </div>
        <button onClick={handleNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Tambah Jurusan
        </button>
      </div>

      {/* Form tambah/edit */}
      {openId && (
        <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 14, marginBottom: '2rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ background: isNew ? '#f0fdf4' : '#f8faff', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
              {isNew ? '➕ Tambah Jurusan Baru' : `✏️ Edit — ${form.nama || 'Jurusan'}`}
            </h2>
            <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}><X size={18} /></button>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Foto cover */}
            <Field label="Foto Cover Jurusan">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: 120, height: 80, borderRadius: 10, border: '2px dashed var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f3', flexShrink: 0 }}>
                  {form.foto_url
                    ? <Image src={form.foto_url} alt="Cover" width={120} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    : <span style={{ fontSize: 28 }}>🏫</span>}
                </div>
                <div>
                  <button onClick={() => fotoRef.current?.click()} disabled={uploading === 'foto'} className="btn-primary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={13} /> {uploading === 'foto' ? 'Mengupload...' : 'Upload Foto Cover'}
                  </button>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>PNG/JPG • Disarankan 16:9</p>
                  <input ref={fotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadFoto} />
                </div>
              </div>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Nama Jurusan *">
                <input type="text" value={form.nama || ''} onChange={set('nama')} placeholder="Teknik Komputer dan Jaringan" style={inputStyle} />
              </Field>
              <Field label="Singkatan">
                <input type="text" value={form.singkatan || ''} onChange={set('singkatan')} placeholder="TKJ" style={inputStyle} />
              </Field>
            </div>

            <Field label="Slug (URL)">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>/jurusan/</span>
                <input type="text" value={form.slug || ''} onChange={set('slug')} placeholder="teknik-komputer-jaringan" style={inputStyle} />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Otomatis dari nama. Gunakan huruf kecil dan tanda hubung.</p>
            </Field>

            <Field label="Deskripsi Singkat">
              <textarea value={form.deskripsi || ''} onChange={set('deskripsi')} placeholder="Deskripsi singkat jurusan ini..." style={textareaStyle} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Visi">
                <textarea value={form.visi || ''} onChange={set('visi')} placeholder="Visi jurusan..." style={textareaStyle} />
              </Field>
              <Field label="Misi">
                <textarea value={form.misi || ''} onChange={set('misi')} placeholder="Misi jurusan..." style={textareaStyle} />
              </Field>
            </div>

            <Field label="Kompetensi Keahlian">
              <textarea value={form.kompetensi || ''} onChange={set('kompetensi')} placeholder="- Instalasi Jaringan&#10;- Pemrograman Web&#10;- ..." style={textareaStyle} />
            </Field>

            <Field label="Prospek Kerja / Karir">
              <textarea value={form.prospek_kerja || ''} onChange={set('prospek_kerja')} placeholder="- Network Engineer&#10;- Web Developer&#10;- ..." style={textareaStyle} />
            </Field>

            <Field label="Urutan Tampil">
              <input type="number" value={form.urutan || 0} onChange={set('urutan')} style={{ ...inputStyle, width: 120 }} min={1} />
            </Field>

            {/* Galeri jurusan */}
            <Field label="Galeri Foto Jurusan">
              <button onClick={() => galeriRef.current?.click()} disabled={uploading === 'galeri'} className="btn-primary" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Images size={13} /> {uploading === 'galeri' ? 'Mengupload...' : 'Upload Foto Galeri'}
              </button>
              <input ref={galeriRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUploadGaleri} />
              {(form.galeri || []).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                  {(form.galeri || []).map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: '#f0ede8' }}>
                      <Image src={url} alt={`Galeri ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                      <button onClick={() => removeGaleri(i)}
                        style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220,38,38,0.9)', border: 'none', borderRadius: 5, padding: '0.2rem', cursor: 'pointer', color: 'white', display: 'flex' }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>

            {msg && (
              <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#16a34a' : '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.875rem', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
                {msg.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}>
                <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={handleClose} style={{ padding: '0.75rem 1.25rem', borderRadius: 8, border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#64748b' }}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daftar jurusan */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Memuat...</div>
      ) : list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>🏫</div>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Belum ada jurusan</p>
          <p style={{ fontSize: '0.875rem' }}>Klik "Tambah Jurusan" untuk memulai</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {list.map(j => (
            <div key={j.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {j.foto_url && (
                <div style={{ width: 60, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={j.foto_url} alt={j.nama} width={60} height={44} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{j.nama}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {j.singkatan && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.1rem 0.4rem', borderRadius: 4, marginRight: '0.5rem', fontWeight: 600 }}>{j.singkatan}</span>}
                  /jurusan/{j.slug}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => handleOpen(j)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.85rem', borderRadius: 8, border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--primary)', fontWeight: 500 }}>
                  <Edit3 size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(j.id, j.nama)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.85rem', borderRadius: 8, border: '1.5px solid #fecaca', background: '#fef2f2', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#dc2626', fontWeight: 500 }}>
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
