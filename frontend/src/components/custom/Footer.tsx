import { Link } from '@tanstack/react-router'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex justify-center text-primary">
            <span className="sr-only">Home</span>
            <h1 className="text-4xl font-bold">
              H<sub>2</sub>Grid
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
            Visualize assets, optimize investments, and accelerate the hydrogen
            ecosystem with our interactive mapping and analytics platform.
          </p>

          <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            <li>
              <Link
                className="text-gray-700 transition hover:text-gray-700/75"
                to="/"
              >
                Home{' '}
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-700 transition hover:text-gray-700/75"
                to="/auth/project-developer/login"
              >
                Product Developer{' '}
              </Link>
            </li>

            <li>
              <Link
                className="text-gray-700 transition hover:text-gray-700/75"
                to="/marketplace"
              >
                {' '}
                Marketplace{' '}
              </Link>
            </li>

            <li>
              <Link
                className="text-gray-700 transition hover:text-gray-700/75"
                to="/contact"
              >
                {' '}
                Contact{' '}
              </Link>
            </li>
          </ul>
          <p className="mt-12 text-center text-sm text-gray-500 lg:text-center">
            Copyright &copy; 2025. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
