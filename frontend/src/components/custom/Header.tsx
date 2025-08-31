import { useState } from 'react'
import { Icons } from '@/assets/icons'
import { Link } from '@tanstack/react-router'
import back from '/back.jpeg'

const links = [
  { name: 'Home', route: '/' },
  { name: 'Company', route: '/auth/company/login' },
  { name: 'Project Developer', route: '/auth/project-developer/login' },
  { name: 'Marketplace', route: '/marketplace' },
  { name: 'Contact', route: '/contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-primary flex items-center gap-2">
              <img src={back} alt="Logo" className="w-10 h-10 object-cover" />
              <h1 className="text-2xl sm:text-3xl font-bold">
                H<sub>2</sub>Grid
              </h1>
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-500 transition hover:text-gray-700"
                    to={link.route}
                  >
                    {link.name}
                    {link.name === 'Marketplace' && (
                      <sup className="text-primary ml-1">New</sup>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="flex items-center  bg-white border px-3 py-2 text-gray-700 hover:bg-gray-50"
              href="https://github.com/udaykumar-dhokia/CodeOverflow-DAIICT-HackOut25"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.GitHub />
            </a>
            <Link
              className="hidden sm:flex items-center gap-2  bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm"
              to="/auth/project-developer/login"
            >
              <Icons.Plus /> Create New Project
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="block md:hidden  bg-gray-100 p-2 text-gray-600 transition hover:text-gray-800"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <nav className="px-4 py-3">
            <ul className="flex flex-col gap-3">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-700 transition hover:text-primary"
                    to={link.route}
                  >
                    {link.name}
                    {link.name === 'Marketplace' && (
                      <sup className="text-primary ml-1">New</sup>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2  bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm"
                  to="/auth/project-developer/login"
                >
                  <Icons.Plus /> Create New Project
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
