import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to CareeroAI</h1>
      <p className="text-slate-600 mb-8">
        AI-powered career guidance and recruitment platform
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
