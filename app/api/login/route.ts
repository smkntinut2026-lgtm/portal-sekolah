import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const passwordHash = createHash('md5').update(password).digest('hex')

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username')
    .eq('username', username)
    .eq('password_hash', passwordHash)
    .single()

  if (error || !data) {
    return NextResponse.json({ success: false })
  }

  return NextResponse.json({ success: true, username: data.username })
}
