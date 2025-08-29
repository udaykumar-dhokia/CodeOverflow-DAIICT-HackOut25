import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth/company/_layout/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Company login submitted:', { email, password })

    // TODO: Integrate with API for login
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white ">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">Login</h2>
        <p className="mb-6">
          Login to access hydrogen ecosystem with our interactive mapping and
          analytics platform.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              className="rounded-xl"
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
              className="rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-primary hover:bg-primary"
          >
            Continue
          </Button>

          <p className="text-center">
            Not a member?{' '}
            <Link
              to="/auth/company/register"
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
