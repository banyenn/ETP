'use client';

import { useEffect } from 'react';
import { Button } from 'antd';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">出错了</h2>
        <p className="text-gray-600 mb-4">抱歉，加载过程中出现了问题</p>
        <Button
          onClick={reset}
          type="primary"
          className="bg-purple-600 hover:bg-purple-700"
        >
          重试
        </Button>
      </div>
    </div>
  );
} 