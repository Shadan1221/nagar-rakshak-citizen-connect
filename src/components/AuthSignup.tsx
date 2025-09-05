import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { ArrowLeft, Phone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AuthSignupProps {
  onBack: () => void
  onSuccess: () => void
}

const AuthSignup = ({ onBack, onSuccess }: AuthSignupProps) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone')
  const [loading, setLoading] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string, password: string} | null>(null)
  const { toast } = useToast()

  const handleSendOtp = async () => {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')
    if (!normalizedPhone) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Check if user already exists (using normalized phone)
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', normalizedPhone)
        .maybeSingle()

      if (existingUser) {
        toast({
          title: "Account Exists",
          description: "An account already exists with this phone number. Please log in instead.",
          variant: "destructive"
        })
        return
      }

      // Generate and store OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

      const { error } = await supabase
        .from('otp_verifications')
        .insert({
          phone_number: normalizedPhone,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString()
        })

      if (error) throw error

      toast({
        title: "OTP Sent",
        description: `OTP: ${otpCode} (Demo mode - via SMS in production)`,
        duration: 10000
      })

      setStep('otp')
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerification = async () => {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Check for test account bypass
      if (normalizedPhone === '1223334444' && otp === '123456') {
        // Test account - bypass OTP and directly log in
        setGeneratedCredentials({ username: 'citizenUser01', password: 'password123' })
        toast({
          title: "Test Account Login",
          description: "Using test account: citizenUser01 / password123",
          duration: 15000
        })
        setStep('success')
        return
      }

      // Normal OTP verification for real accounts
      const { data: otpData, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone_number', normalizedPhone)
        .eq('otp_code', otp)
        .gt('expires_at', new Date().toISOString())
        .eq('is_verified', false)
        .maybeSingle()

      if (otpError || !otpData) {
        toast({
          title: "Error",
          description: "Invalid or expired OTP",
          variant: "destructive"
        })
        return
      }

      // Mark OTP as verified
      await supabase
        .from('otp_verifications')
        .update({ is_verified: true })
        .eq('id', otpData.id)

      // Generate password
      const generatedPassword = Math.random().toString(36).slice(-8).toUpperCase()

      // Use secure function to create account
      const { data: accountData, error: accountError } = await supabase.rpc('create_citizen_account', {
        p_phone: normalizedPhone,
        p_password: generatedPassword
      })

      if (accountError) throw accountError

      const { username } = accountData[0]
      setGeneratedCredentials({ username, password: generatedPassword })

      toast({
        title: "Account Created",
        description: `Username: ${username}, Password: ${generatedPassword} (Demo mode)`,
        duration: 15000
      })

      setStep('success')
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto pt-16">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Enter your phone number to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSendOtp} 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={loading}
              >
                <Phone className="w-4 h-4 mr-2" />
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our terms and conditions. 
                Your username and password will be automatically generated and sent to your phone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto pt-16">
          <Button variant="ghost" onClick={() => setStep('phone')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to {phoneNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button 
                onClick={handleOtpVerification} 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Creating Account..." : "Verify & Create Account"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto pt-16">
          <Card className="shadow-lg border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-700">Account Created!</CardTitle>
              <CardDescription>Your account has been successfully created</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedCredentials && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Your Login Credentials:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-green-700">Username:</span> {generatedCredentials.username}
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Password:</span> {generatedCredentials.password}
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Keep these credentials safe. In production, they would be sent to your phone via SMS.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Button 
                  onClick={onSuccess} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continue to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}

export default AuthSignup