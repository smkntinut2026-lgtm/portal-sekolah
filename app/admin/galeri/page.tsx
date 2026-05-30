'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase, GalleryItem } from '@/lib/supabase'
import { Upload, Trash2, GripVertical } from 'lucide-react'

export default function AdminGaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    supabase.from('gallery').select('*').order('urutan').then(({ data }) => {
      if (data) setGallery(data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true); setMsg(null)

    for (const file of files) {
      const filename = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage.from('portal-assets').upload(`gallery/${filename}`, file, { upsert: true })
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('portal-assets').getPublicUrl(`gallery/${filename}`)
        await supabase.from('gallery').insert([{ foto_url: urlData.publicUrl, caption: '', urutan: gallery.length + 1 }])
      }
    }
    setMsg({ type: 'success', text: `${files.length} foto berhasil diupload!` })
    setUploading(false)
    load()
  }

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Hapus foto ini?')) return
    await supabase.from('gallery').delete().eq('id', item.id)
    load()
  }

  const handleCaption = async (id: string, caption: string) => {
    await supabase.from('gallery').update({ caption }).eq('id', id)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Galeri Foto</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kelola foto kegiatan sekolah</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Upload size={16} /> {uploading ? 'Mengupload...' : 'Upload Foto'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      {msg && (
        <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#16a34a' : '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {msg.text}
        </div>
      )}

      {/* Upload area */}
      <div onClick={() => fileRef.current?.click()}
        style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: '2.5rem', textAlign: 'center', marginBottom: '2rem', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.background = 'rgba(26,58,92,0.03)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
        <div style={{ fontSize: 32, marginBottom: '0.5rem' }}>🖼️</div>
        <div style={{ fontWeight: 500, color: 'var(--primary)' }}>Klik atau seret foto ke sini</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PNG, JPG • Bisa pilih banyak sekaligus</div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Memuat...</div>
      ) : gallery.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Belum ada foto</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {gallery.map(item => (
            <div key={item.id} className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: '#f0ede8' }}>
                <Image src={item.foto_url} alt={item.caption || 'Foto'} fill style={{ objectFit: 'cover' }} />
                <button onClick={() => handleDelete(item)}
                  style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(220,38,38,0.9)', border: 'none', borderRadius: 6, padding: '0.3rem', cursor: 'pointer', color: 'white', display: 'flex' }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                defaultValue={item.caption}
                onBlur={e => handleCaption(item.id, e.target.value)}
                placeholder="Tambah keterangan..."
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid var(--border)', borderRadius: 6, fontSize: '0.8rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
