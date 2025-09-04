import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-black/40 flex justify-between p-4">
      <Link href="/">Feed</Link>
      <Link href="/admin">Admin</Link>
    </header>
  );
}
