import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">chessGambit</div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/compete" className="hover:text-gray-400 transition-colors">
              Compete
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-400 transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/register" className="hover:text-gray-400 transition-colors">
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}