'use client';

import './globals.css'
import { Button } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-end items-center">
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

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a1f]/20 via-white/10 to-[#2ed62e]/20 -z-10"></div>
        
        <div className="pt-24 px-4">
          <div className="max-w-7xl mx-auto py-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="w-full md:w-[40%] text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-relaxed">
                  <span className="block mb-4">数据是冰冷的，</span>
                  <span className="block">我们来让它有温度</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  无需复杂操作，上传 Excel 文件，即可自动生成专业的演示文稿
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/convert">
                    <Button 
                      type="primary"
                      size="large"
                      style={{ backgroundColor: '#9333ea', height: '48px', padding: '0 32px' }}
                      className="hover:bg-purple-700 transition-all duration-300"
                    >
                      立即体验
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div 
                className="w-full md:w-[55%] mt-8 md:mt-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-white">
                  <div className="absolute inset-0 bg-white"></div>
                  <Image
                    src="/demo-ppt.png"
                    alt="Excel2PPT 效果展示"
                    fill
                    className="object-cover transform hover:scale-105 transition-transform duration-700 relative z-10"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    {index === 0 && (
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {index === 0 && "快速转换"}
                    {index === 1 && "专业模板"}
                    {index === 2 && "自定义选项"}
                  </h3>
                  <p className="text-gray-600">
                    {index === 0 && "只需几秒钟，即可将Excel数据转换为精美的PPT演示文稿"}
                    {index === 1 && "提供多种精美模板，让您的演示更加专业和吸引人"}
                    {index === 2 && "灵活的自定义选项，让您的演示文稿完全符合需求"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="max-w-7xl mx-auto text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              立即体验快速将Excel转换为PPT的便捷方式
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="primary"
                size="large"
                style={{ backgroundColor: '#9333ea', height: '48px', padding: '0 32px' }}
                className="hover:bg-purple-700 transition-all duration-300"
              >
                免费使用
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="relative bg-gray-50/90 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">
            <p>© 2024 Excel2PPT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 