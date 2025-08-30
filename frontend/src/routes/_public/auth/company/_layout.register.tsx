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
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { axiosInstance } from '@/api/axiosInstance'
import { toast } from 'sonner'

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
  const [loading, setLoading] = useState(false)
  const [companySize, setCompanySize] = useState('')

  const navigate = useNavigate()

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const formData = {
      name: companyName,
      website: website,
      GSTIN: gstin,
      location: address,
      contact: contact,
      asset_type: companyType,
      company_size: companySize,
      email: email,
      password: password,
      about_us: 'lfew',
    }

    try {
      setLoading(true)

      const res = await axiosInstance.post('/auth/company/register', formData)

      toast.success(res.data.message || 'Registered successfully!')

      navigate({ to: '/company/dashboard' })
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
      {/* Left Image Section */}
      <div className="hidden w-1/2 bg-gray-100 md:flex items-center justify-center">
        <img
          src="https://plus.unsplash.com/premium_photo-1673830981161-16872c70df8d?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Register Illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex w-full items-center justify-center bg-gray-50 md:w-1/2">
        <div className="w-full max-w-md rounded-none bg-white p-8 shadow-md">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Register
          </h2>
          <p className="mb-6">
            Register to access hydrogen ecosystem with our interactive mapping
            and analytics platform.
          </p>
          <p className="mb-6 text-gray-600">
            Step {step} of {totalSteps}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Step 1 */}
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

            {/* Step 2 */}
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

                {/* New Company Size Select */}
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger id="companySize" className="w-full">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-20">0 - 20</SelectItem>
                      <SelectItem value="21-50">21 - 50</SelectItem>
                      <SelectItem value="51-100">51 - 100</SelectItem>
                      <SelectItem value="101-500">101 - 500</SelectItem>
                      <SelectItem value="500+">500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 3 */}
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
                  className="rounded-none"
                  onClick={prevStep}
                >
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  className="ml-auto rounded-none bg-primary hover:bg-primary"
                  onClick={nextStep}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto rounded-none bg-primary hover:bg-primary"
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
    </div>
  )
}
