import { NextResponse } from 'next/server'

type InviteBody = {
  name?: string
  phone?: string
  experience?: string
}

export async function POST(request: Request) {
  let body: InviteBody

  try {
    body = (await request.json()) as InviteBody
  } catch {
    return NextResponse.json({ detail: 'Некорректный запрос' }, { status: 400 })
  }

  const name = body.name?.trim() ?? ''
  const phone = body.phone?.trim() ?? ''
  const experience = body.experience?.trim() ?? ''

  if (!name || name.length < 2) {
    return NextResponse.json({ detail: 'Укажите имя' }, { status: 400 })
  }
  if (!phone || phone.length < 6) {
    return NextResponse.json({ detail: 'Укажите телефон' }, { status: 400 })
  }
  if (!experience || experience.length < 3) {
    return NextResponse.json({ detail: 'Укажите опыт работы' }, { status: 400 })
  }

  // Stub: ready to wire CRM / email. Payload validated and accepted.
  console.info('[invite]', { name, phone, experience: experience.slice(0, 120) })

  return NextResponse.json({ ok: true })
}
