import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold text-white">This route isn&apos;t mapped.</h1>
        <p className="mt-4 text-zinc-400">The page moved or never existed. Pick a world from the index.</p>
        <Link href="/" className="focus-ring mt-8 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-black">
          Go to the index
        </Link>
      </div>
    </main>
  );
}
