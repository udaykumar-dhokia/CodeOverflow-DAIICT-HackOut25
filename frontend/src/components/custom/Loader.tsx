import { Icons } from '@/assets/icons'
import { motion } from 'motion/react'

const Loader = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: 'anticipate',
        duration: 1,
      }}
      className="flex items-center justify-center"
    >
      <Icons.Loading />
    </motion.div>
  )
}

export default Loader
