import { LoginForm } from "@/components/auth/login-form";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const resolvedParams = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div
        className="max-w-md w-full space-y-8 p-8 bg-[#e6f0fc] rounded-lg
shadow"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-gray-900">
            Đăng nhập để quản lý blog của bạn
          </p>
        </div>

        {resolvedParams?.message && (
          <div
            className="bg-green-50 text-green-700 p-3 rounded-md
text-sm"
          >
            {resolvedParams.message}
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
