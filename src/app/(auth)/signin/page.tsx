import LoginForm from "@/components/auth/loginForm";
import Link from "next/link";

export default function Signin() {
  return (
    <div className="flex flex-col justify-center items-center pt-24">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <div className="w-96 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <LoginForm />
      </div>
      <p className="text-sm text-white/50 mt-4">
        Don't have an account ?{" "}
        <Link href="/signup" className="text-blue-500">
          Signup
        </Link>
      </p>
    </div>
  );
}
