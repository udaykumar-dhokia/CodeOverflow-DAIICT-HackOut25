import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { axiosInstance } from '@/api/axiosInstance'

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
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-none bg-white p-8 shadow-md">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">Register</h2>
        <p className="mb-6">
          Register to access the hydrogen ecosystem with our interactive mapping
          and analytics platform.
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
            className="w-full rounded-none bg-primary hover:bg-primary/90"
          >
            {loading ? 'Registering...' : 'Continue'}
          </Button>

          <p className="text-center">
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
  )
}
