import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth/company/_layout/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  // 🔹 State for form fields
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [gstin, setGstin] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [companyType, setCompanyType] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      companyName,
      website,
      gstin,
      address,
      contact,
      companyType,
      email,
      password,
      confirmPassword,
    }

    console.log('Submitted Data:', formData)

    // ✅ TODO: Call your API to register the company
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">Register</h2>
        <p className="mb-6">
          Register to access hydrogen ecosystem with our interactive mapping and
          analytics platform.
        </p>
        <p className="mb-6 text-gray-600">
          Step {step} of {totalSteps}
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="John Doe Pvt. Ltd."
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="www.xyz.com"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  placeholder="GSTWJBN234KJV"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="New York"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  placeholder="9527662626"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type</Label>
                <Select value={companyType} onValueChange={setCompanyType}>
                  <SelectTrigger id="companyType" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plant">Plant</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="pipeline">Pipeline</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={prevStep}
              >
                Back
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                className="ml-auto rounded-xl bg-primary hover:bg-primary"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto rounded-xl bg-primary hover:bg-primary"
              >
                Submit
              </Button>
            )}
          </div>

          <p className="text-center">
            Already a member?{' '}
            <Link
              to="/auth/company/login"
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
