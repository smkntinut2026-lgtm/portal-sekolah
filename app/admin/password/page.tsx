'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { createHash } from 'crypto'
import { KeyRound } from 'lucide-react'

export default function AdminPasswordPage() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setMsg(null)
    if (!form.oldPassword || !form.newPassword || !form.confirm) {
      setMsg({ type: 'error', text: 'Semua field wajib diisi' }); return
    }
    if (form.newPassword !== form.confirm) {
      setMsg({ type: 'error', text: 'Konfirmasi password tidak cocok' }); return
    }
    if (form.newPassword.length < 6) {
      setMsg({ type: 'error', text: 'Password minimal 6 karakter' }); return
    }
    setSaving(true)

    const oldHash = createHash('md5').update(form.oldPassword).digest('hex')
    const { data } = await supabase.from('admin_users').select('id').eq('username', 'admin').eq('password_hash', oldHash).single()

    if (!data) {
      setMsg({ type: 'error', text: 'Password lama tidak benar' }); setSaving(false); return
    }

    const newHash = createHash('md5').update(form.newPassword).digest('hex')
    await supabase.from('admin_users').update({ password_hash: newHash }).eq('id', data.id)
    setMsg({ type: 'success', text: 'Password berhasil diubah!' })
    setForm({ oldPassword: '', newPassword: '', confirm: '' })
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Ganti Password</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Pastikan segera ganti password default!</p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { key: 'oldPassword', label: 'Password Lama' },
          { key: 'newPassword', label: 'Password Baru' },
          { key: 'confirm', label: 'Konfirmasi Password Baru' },
        ].map(f => (
          <div key={f.key}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>{f.label}</label>
            <input type="password" value={(form as Record<string, string>)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
          </div>
        ))}

        {msg && (
          <div style={{ background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: msg.type === 'success' ? '#16a34a' : '#dc2626', padding: '0.75rem', borderRadius: 8, fontSize: '0.875rem' }}>
            {msg.text}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
          <KeyRound size={16} /> {saving ? 'Menyimpan...' : 'Ubah Password'}
        </button>
      </div>
    </div>
  )
}
