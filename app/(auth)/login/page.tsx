import LoginForm from "../_components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">

                {/* Left side - Full image */}
                <div className="hidden md:block relative">
                    <Image
                        src="/images/bg3.png"
                        alt="Login illustration"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Right side - Form */}
                <div className="p-8 md:p-12 flex items-center">
                    <div className="w-full">
                        <LoginForm />
                    </div>
                </div>

            </div>
        </div>
    );
}
