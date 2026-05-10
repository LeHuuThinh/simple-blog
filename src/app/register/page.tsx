import { RegisterForm } from "@/components/auth/register-form";
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div
        className="max-w-md w-full space-y-8 p-8 bg-[#e6f0fc] rounded-lg
shadow"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-gray-900">
            Tạo tài khoản để bắt đầu viết blog
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
