import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-[#e6f0fc] mb-8">Hồ sơ cá nhân</h1>
      <ProfileForm
        userId={session.user.id}
        email={session.user.email ?? ""}
        initialProfile={profile}
      />
    </div>
  );
}
