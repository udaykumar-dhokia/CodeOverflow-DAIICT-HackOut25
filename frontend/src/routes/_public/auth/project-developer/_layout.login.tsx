import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { axiosInstance } from '@/api/axiosInstance'
import { toast } from 'sonner'

export const Route = createFileRoute(
  '/_public/auth/project-developer/_layout/login',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = { email, password }
      const res = await axiosInstance.post(
        '/auth/project-developer/login',
        payload,
      )

      const { message } = res.data

      toast.success(message || 'Login successful')
      navigate({ to: '/project-developer/dashboard' })
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-none bg-white p-8 shadow-md">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">Login</h2>
        <p className="mb-6">
          Login to access the hydrogen ecosystem with our interactive mapping
          and analytics platform.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-none bg-primary hover:bg-primary/90 transition cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Continue'}
          </Button>

          <p className="text-center">
            Not a member?{' '}
            <Link
              to="/auth/project-developer/register"
              className="cursor-pointer text-primary"
            >
              Get Started
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
