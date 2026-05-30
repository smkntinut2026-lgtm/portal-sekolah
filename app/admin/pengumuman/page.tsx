'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase, Announcement } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, Save, X } from 'lucide-react'

const emptyForm = { judul: '', isi: '', tanggal: new Date().toISOString().split('T')[0], status: 'draft' as 'draft' | 'published', gambar_url: '' }

export default function AdminPengumumanPage() {
  const [list, setList] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    supabase.from('announcements').select('*').order('tanggal', { ascending: false }).then(({ data }) => {
      if (data) setList(data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const filename = `ann-${Date.now()}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage.from('portal-assets').upload(`announcements/${filename}`, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('portal-assets').getPublicUrl(`announcements/${filename}`)
      setForm(prev => ({ ...prev, gambar_url: urlData.publicUrl }))
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.judul || !form.isi) { setMsg({ type: 'error', text: 'Judul dan isi wajib diisi' }); return }
    setSaving(true); setMsg(null)
    if (editId) {
      const { error } = await supabase.from('announcements').update(form).eq('id', editId)
      if (error) setMsg({ type: 'error', text: 'Gagal menyimpan' })
      else { setMsg({ type: 'success', text: 'Berhasil diperbarui!' }); resetForm(); load() }
    } else {
      const { error } = await supabase.from('announcements').insert([form])
      if (error) setMsg({ type: 'error', text: 'Gagal menyimpan' })
      else { setMsg({ type: 'success', text: 'Pengumuman ditambahkan!' }); resetForm(); load() }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return
    await supabase.from('announcements').delete().eq('id', id)
    load()
  }

  const handleToggleStatus = async (item: Announcement) => {
    await supabase.from('announcements').update({ status: item.status === 'published' ? 'draft' : 'published' }).eq('id', item.id)
    load()
  }

  const handleEdit = (item: Announcement) => {
    setForm({ judul: item.judul, isi: item.isi, tanggal: item.tanggal, status: item.status, gambar_url: item.gambar_url || '' })
    setEditId(item.id); setShowForm(true); setMsg(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => { setForm({ ...emptyForm }); setEditId(null); setShowForm(false) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Pengumuman</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kelola berita dan pengumuman sekolah</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Tambah Pengumuman
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{editId ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</h2>
            <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Judul *</label>
              <input type="text" value={form.judul} onChange={e => setForm(p => ({ ...p, judul: e.target.value }))}
                placeholder="Judul pengumuman"
                style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Isi / Konten *</label>
              <textarea value={form.isi} onChange={e => setForm(p => ({ ...p, isi: e.target.value }))} rows={5}
                placeholder="Tulis isi pengumuman di sini..."
                style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Tanggal</label>
                <input type="date" value={form.tanggal} onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))}
                  style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                  style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                  <option value="draft">Draft (tidak tampil)</option>
                  <option value="published">Published (tampil publik)</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Gambar (opsional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {form.gambar_url && <Image src={form.gambar_url} alt="Preview" width={80} height={60} style={{ borderRadius: 6, objectFit: 'cover' }} />}
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={14} /> {uploading ? 'Mengupload...' : 'Upload Gambar'}
                </button>
                {form.gambar_url && <button onClick={() => setForm(p => ({ ...p, gambar_url: '' }))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus gambar</button>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>

            {msg && (
              <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#16a34a' : '#dc2626', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem' }}>{msg.text}</div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={resetForm} style={{ background: 'none', border: '1.5px solid var(--border)', padding: '0.6rem 1.2rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem' }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Memuat...</div>
      ) : list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Belum ada pengumuman</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {list.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {item.gambar_url && <Image src={item.gambar_url} alt={item.judul} width={60} height={60} style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.judul}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <span style={{ padding: '0.25rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500, background: item.status === 'published' ? '#dcfce7' : '#f3f4f6', color: item.status === 'published' ? '#16a34a' : '#6b7280' }}>
                  {item.status === 'published' ? '● Publish' : '○ Draft'}
                </span>
                <button onClick={() => handleToggleStatus(item)} title="Toggle status" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '0.35rem 0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {item.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => handleEdit(item)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '0.35rem 0.5rem', cursor: 'pointer', color: 'var(--primary)' }}><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '0.35rem 0.5rem', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
