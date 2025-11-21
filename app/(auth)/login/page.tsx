import { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Login - SyncSlate',
  description: 'Sign in to your SyncSlate account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <LoginForm />
    </div>
  )
}
