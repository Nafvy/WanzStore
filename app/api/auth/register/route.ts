import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(72),
  username: z.string().trim().min(3).max(30),
});

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Periksa kembali email, nama pengguna, dan password. Password minimal 8 karakter." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json({ error: "Konfigurasi autentikasi server belum lengkap." }, { status: 500 });
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const auth = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { email, password, username } = parsed.data;

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (createError) {
    if (!/already (been )?registered|already exists|user already/i.test(createError.message)) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    let existingUser = null;
    for (let page = 1; page <= 20; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) {
        return NextResponse.json({ error: "Tidak dapat memeriksa akun yang sudah terdaftar." }, { status: 500 });
      }
      existingUser = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
      if (existingUser || data.users.length < 1000) break;
    }

    if (!existingUser) {
      return NextResponse.json({ error: "Akun sudah terdaftar. Silakan login." }, { status: 409 });
    }
    if (existingUser.email_confirmed_at) {
      return NextResponse.json({ error: "Email sudah terdaftar. Silakan login." }, { status: 409 });
    }

    const { error } = await admin.auth.admin.updateUserById(existingUser.id, { email_confirm: true });
    if (error) {
      return NextResponse.json({ error: "Akun lama belum dapat diaktifkan. Coba lagi nanti." }, { status: 500 });
    }
  }

  const { data: signedIn, error: signInError } = await auth.auth.signInWithPassword({ email, password });
  if (signInError || !signedIn.session) {
    return NextResponse.json(
      { error: "Akun sudah diproses, tetapi login gagal. Periksa password lalu coba login." },
      { status: 401 },
    );
  }

  return NextResponse.json({ session: signedIn.session, user: created?.user ?? signedIn.user });
}
