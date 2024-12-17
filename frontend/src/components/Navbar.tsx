'use client';

import { Button } from 'antd';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="text-purple-600">Excel</span>
            <span className="text-gray-600">2</span>
            <span className="text-purple-600">PPT</span>
          </Link>
          <Link href="/convert">
            <Button 
              type="primary" 
              style={{ backgroundColor: '#9333ea' }}
              className="hover:bg-purple-700"
            >
              开始使用
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}; 