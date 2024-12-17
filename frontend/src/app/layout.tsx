import './globals.css'
import { Inter } from 'next/font/google'
import AntdRegistry from '@/components/AntdRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Excel2PPT',
  description: '一键将Excel转换为精美PPT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
