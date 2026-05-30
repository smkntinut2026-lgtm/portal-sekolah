'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function md5(str: string): string {
  // Simple MD5 via SubtleCrypto not available sync, use fetch to our API
  return str // placeholder, actual check done via API route
}

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()

      if (data.success) {
        sessionStorage.setItem('admin_logged_in', 'true')
        sessionStorage.setItem('admin_username', username)
        router.push('/admin/dashboard')
      } else {
        setError('Username atau password salah')
      }
    } catch {
      setError('Terjadi kesalahan, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, #0f2744 100%)', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 40, marginBottom: '0.5rem' }}>🏫</div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Portal Sekolah</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
              style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
          </div>

          {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            {loading ? 'Memproses...' : '🔐 Masuk'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>← Kembali ke Portal</a>
        </div>
      </div>
    </div>
  )
}
