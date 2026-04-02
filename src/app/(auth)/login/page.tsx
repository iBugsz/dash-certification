'use client';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h1 className="text-xl mb-4">Login</h1>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-purple-600 text-white p-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
