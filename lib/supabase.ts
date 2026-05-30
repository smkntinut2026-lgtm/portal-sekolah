import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export type SchoolProfile = {
  id: string
  nama_sekolah: string
  npsn: string
  alamat: string
  tagline: string
  logo_url: string
  email: string
  telepon: string
  website: string
  // === BARU ===
  kepsek_nama: string
  kepsek_nip: string
  kepsek_foto_url: string
  kepsek_sambutan: string
  visi: string
  misi: string
  sejarah: string
}
export type Announcement = {
  id: string
  judul: string
  isi: string
  gambar_url: string
  status: 'published' | 'draft'
  tanggal: string
  created_at: string
}

export type GalleryItem = {
  id: string
  caption: string
  foto_url: string
  urutan: number
  created_at: string
}
