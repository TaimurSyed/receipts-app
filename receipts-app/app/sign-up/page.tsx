import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10 lg:px-8">
      <AuthForm mode="sign-up" />
    </main>
  );
}
