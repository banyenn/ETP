import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center">
      <span className="text-purple-600">Excel</span>
      <span className="text-gray-600">2</span>
      <span className="text-purple-600">PPT</span>
    </Link>
  );
}; 