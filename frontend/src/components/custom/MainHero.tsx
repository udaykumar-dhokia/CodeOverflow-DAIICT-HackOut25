import { Icons } from '@/assets/icons'
import { motion } from 'motion/react'
const MainHero = () => {
  return (
    <div className="flex justify-center items-center min-h-[700px]">
      <motion.div
        className="text-center flex flex-col items-center space-y-3"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className=""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p className="underline text-xl">
            Now Analyse for{' '}
            <span className="text-primary font-bold">Future Plans</span> with AI
          </p>
        </motion.div>

        <motion.h1
          className="text-4xl lg:text-7xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Build the Future of <span className="text-primary">Hydrogen</span>
        </motion.h1>

        <motion.p
          className="text-gray-600 text-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Visualize assets, optimize investments, and accelerate <br /> the
          hydrogen ecosystem with our interactive mapping and analytics
          platform.
        </motion.p>

        {/* Bouncing Arrow */}
        <motion.div
          className="mt-4"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: 1, // start after content appears
          }}
        >
          <Icons.ArrowDown />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MainHero
