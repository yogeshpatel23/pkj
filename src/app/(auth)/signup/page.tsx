import RegisterForm from "@/components/auth/registerForm";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="flex flex-col justify-center items-center pt-24">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <div className="w-96 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <RegisterForm />
      </div>
      <p className="text-sm text-white/50 mt-4">
        Have an account ?{" "}
        <Link href="/signin" className="text-blue-500">
          Login
        </Link>
      </p>
    </div>
  );
}
