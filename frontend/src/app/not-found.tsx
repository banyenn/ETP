import Link from 'next/link';
import { Button } from 'antd';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-4">抱歉，您访问的页面不存在</p>
        <Link href="/">
          <Button type="primary" className="bg-purple-600 hover:bg-purple-700">
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
} 