import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { axiosInstance } from '@/api/axiosInstance'
import Loader from '@/components/custom/Loader'

export const Route = createFileRoute(
  '/_public/auth/project-developer/_layout/register',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const payload = { name, email, password }
      const res = await axiosInstance.post(
        '/auth/project-developer/register',
        payload,
      )

      toast.success(res.data.message || 'Registered successfully!')

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      navigate({ to: '/project-developer/dashboard' })
    } catch (error: any) {
      console.error(error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left side form */}
      <div className="flex flex-1 justify-center items-center p-8">
        <div className="w-full max-w-md rounded-none bg-white p-8 shadow-md">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Register
          </h2>
          <p className="mb-6 text-gray-600">
            Register to access the hydrogen ecosystem with our interactive
            mapping and analytics platform.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="rounded-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className="rounded-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="rounded-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className="rounded-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-primary hover:bg-primary/90 transition cursor-pointer"
            >
              {loading ? <Loader /> : 'Continue'}
            </Button>

            <p className="text-center mt-2">
              Already a member?{' '}
              <Link
                to="/auth/project-developer/login"
                className="cursor-pointer text-primary"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side image */}
      <div
        className="hidden lg:flex flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/back.jpeg')" }}
      >
        <div className="flex flex-col justify-center items-center bg-black/30 w-full h-full">
          <h1 className="text-4xl font-bold text-white">Join the Future!</h1>
          <p className="text-white mt-2 text-center px-8">
            Start building and exploring the hydrogen ecosystem with interactive
            mapping and analytics.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RouteComponent
