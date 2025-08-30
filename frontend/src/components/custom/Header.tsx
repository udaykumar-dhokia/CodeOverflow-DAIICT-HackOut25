import { Icons } from '@/assets/icons'
import { Link } from '@tanstack/react-router'
import back from '/back.jpeg'

const links = [
  { name: 'Home', route: '/' },
  { name: 'Company', route: '/auth/company/login' },
  { name: 'Project Developer', route: '/auth/project-developer/login' },
  { name: 'Contact', route: '/contact' },
]

export default function Header() {
  return (
    <>
      <header className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <Link to="/" className="text-primary flex">
                <span className="sr-only">Home</span>
                <img src={back} alt="" className="w-15" />
                <h1 className="text-4xl font-bold">
                  H<sub>2</sub>Grid
                </h1>
              </Link>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  {links.map((link, index) => {
                    return (
                      <li key={index}>
                        <Link
                          className="text-gray-500 transition hover:text-gray-500/75"
                          to={link.route}
                        >
                          {link.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <Link
                  className="flex items-center rounded-none bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                  to="/auth/project-developer/login"
                >
                  <Icons.Plus /> Create New Project
                </Link>
              </div>

              <div className="block md:hidden">
                <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
