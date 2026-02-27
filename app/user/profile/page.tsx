// app/user/profile/page.tsx
// This replaces the existing page.tsx.
// UserProfileForm.tsx is NOT changed — it's imported exactly as-is.

import { handleWhoAmI } from "@/lib/actions/auth-action";
import { redirect } from "next/navigation";
import ProfilePageClient from "./_components/ProfilePageClient";

export default async function ProfilePage() {
    const result = await handleWhoAmI();
    if (!result.success || !result.data) redirect("/login");

    return <ProfilePageClient user={result.data} />;
}