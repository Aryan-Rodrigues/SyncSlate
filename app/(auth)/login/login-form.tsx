'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    // Wait a moment for the session to be established
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Verify the session is set
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Session not established. Please try again.')
    }
    
    // Use window.location for a full page reload to ensure server components get the session
    window.location.href = '/dashboard'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await handleLogin(formData.email, formData.password)
      // Don't show toast here since we're redirecting immediately
    } catch (error: any) {
      toast.error(error?.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-[rgba(61,90,128,1)]">Welcome back</CardTitle>
        <CardDescription>Sign in to your SyncSlate account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-card-foreground" htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-card-foreground" htmlFor="password">Password</Label>
              <Link
                href="/reset-password"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <Button 
            variant="default" 
            type="submit" 
            className="w-full bg-[rgba(61,90,128,1)]"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="hover:underline text-[rgba(61,90,128,1)] font-semibold">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

