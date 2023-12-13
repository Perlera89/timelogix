'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Layout, Menu } from 'antd'
import { useRouter } from 'next/navigation'

const { Header } = Layout

const layout = ({ children }) => {
  const router = useRouter()

  const menuItems = [
    { key: '1', label: <Link href="/auth/login">Login</Link> },
    { key: '2', label: <Link href="/auth/register">Register</Link> }
  ]
  return (
    <div className="bg-[#191919] max-h-screen overflow-hidden">
      <Header className="text-ghost-white bg-poor-black flex py-8 justify-between items-center">
        <div
          className="flex gap-4 items-center cursor-pointer"
          onClick={() => {
            router.push('/auth/login')
          }}
        >
          <Image
            className="cursor-pointer hover:opacity-50 transition-opacity duration-300 ease-in-out"
            src="/logo.svg"
            alt="dynamite"
            width={50}
            height={50}
          />
          <h2 className="text-2xl">Timelogix</h2>
        </div>
        <Menu
          theme="dark"
          className="bg-poor-black w-48 flex justify-end text-center"
          defaultSelectedKeys={['1']}
          items={menuItems}
        />
      </Header>
      <div className="bg-[#191919] mx-auto flex items-center h-[calc(100vh-4rem)]">
        {children}
      </div>
    </div>
  )
}

export default layout
