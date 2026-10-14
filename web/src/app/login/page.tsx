'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    const supabase = createClient();
    const { error } =
      mode === 'in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}/auth/callback` },
          });
    setBusy(false);
    if (error) return setMessage(error.message);
    if (mode === 'up') return setMessage('확인 메일을 보냈습니다. 메일의 링크를 눌러 주세요.');
    router.push('/');
    router.refresh();
  }

  async function google() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setMessage(error.message);
  }

  return (
    <main style={{ maxWidth: 360, margin: '12vh auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>오늘한장</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input type="email" required placeholder="이메일" value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <input type="password" required minLength={6} placeholder="비밀번호" value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
        <button type="submit" disabled={busy}>{mode === 'in' ? '로그인' : '회원가입'}</button>
        <button type="button" onClick={google}>Google로 계속하기</button>
        <button type="button" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
          {mode === 'in' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있습니다. 로그인'}
        </button>
        {message && <p role="alert">{message}</p>}
      </form>
    </main>
  );
}
