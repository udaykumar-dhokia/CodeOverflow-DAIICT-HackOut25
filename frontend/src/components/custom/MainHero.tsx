import { Icons } from '@/assets/icons'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'

const MainHero = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center flex flex-col items-center space-y-5 max-w-3xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p className="underline text-lg sm:text-xl text-gray-700">
            Smarter Planning with{' '}
            <span className="text-primary font-semibold">AI Insights</span>
          </p>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Accelerate the Future of{' '}
          <span className="text-primary">Green Hydrogen</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Explore renewable energy potential with interactive maps, real-time
          data, and AI-powered analytics. Identify the best sites, optimize
          investments, and shape a sustainable hydrogen ecosystem.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Link
            to="/auth/project-developer/login"
            className="px-6 py-3 bg-primary text-white font-medium shadow hover:bg-primary/90 transition"
          >
            Get Started
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3  bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 transition"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Bouncing Arrow */}
        <motion.div
          className="mt-8"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: 1,
          }}
        >
          <Icons.ArrowDown />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MainHero
