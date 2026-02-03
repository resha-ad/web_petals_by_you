import { handleWhoAmI } from "@/lib/actions/auth-action";
import UserProfileForm from "../_components/UserProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const result = await handleWhoAmI();
    console.log("[ProfilePage] whoAmI result:", result); //to debug

    if (!result.success || !result.data) {
        console.log("[ProfilePage] Redirecting to login - reason:", result.message);
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#FBF6F4] py-12 px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 border border-rose-100">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-10 text-center">
                    My Profile 🌸
                </h1>
                <UserProfileForm user={result.data} />
            </div>
        </div>
    );
}