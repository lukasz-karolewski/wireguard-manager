import Link from "~/components/ui/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col bg-gray-50">
      <div className="mx-auto flex w-full max-w-md grow flex-col justify-center px-4 py-8">
        <Link className="mb-6 text-center text-2xl font-bold text-gray-900 no-underline hover:no-underline" href="/">
          Wireguard Manager
        </Link>
        {children}
      </div>
    </main>
  );
}
