'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('admin_logged_in', 'true')
        sessionStorage.setItem('admin_username', username)
        router.push('/admin/dashboard')
      } else { setError('Username atau password salah') }
    } catch { setError('Terjadi kesalahan, coba lagi') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="login-page">
      {/* Left panel */}
      <div style={{ background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }} className="login-left">
        <div style={{ color: 'white', maxWidth: 380 }}>
          <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>🏫</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Panel Admin<br />Portal Sekolah
          </h1>
          <p style={{ opacity: 0.55, fontSize: '0.925rem', lineHeight: 1.7 }}>
            Kelola konten website sekolah — profil, pengumuman, galeri, dan kepala sekolah dari satu tempat.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'var(--bg)' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '2.5rem' }}>
            <ArrowLeft size={14} /> Kembali ke Portal
          </Link>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>Masuk</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Gunakan akun admin untuk melanjutkan</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                placeholder="Masukkan username" className="input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Masukkan password" className="input" style={{ paddingRight: '2.8rem' }} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.7rem 1rem', borderRadius: 8, fontSize: '0.82rem', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ padding: '0.8rem', fontSize: '0.925rem', marginTop: '0.5rem', justifyContent: 'center' }}>
              {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .login-page { grid-template-columns: 1fr !important; }
          .login-left { display: none !important; }
        }
      `}</style>
    </div>
  )
}
