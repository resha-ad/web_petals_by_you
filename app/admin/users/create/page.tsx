import CreateUserForm from "@/app/admin/users/_components/CreateUserForm";

export default function CreateUserPage() {
    return (
        <div>
            <h1 className="text-3xl font-serif text-[#6B4E4E] mb-8">Create New User</h1>
            <div className="bg-white rounded-xl shadow p-8 max-w-2xl">
                <CreateUserForm />
            </div>
        </div>
    );
}