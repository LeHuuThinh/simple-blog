import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header className="bg-[#e6f0fc] shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Thịnh Blog
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray900">
              Trang chủ
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/profile"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Hồ sơ của tôi
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Đăng xuất
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-slate-900 text-[#e6f0fc] px-4 py-2 rounded-md hover:bg-slate-800"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
