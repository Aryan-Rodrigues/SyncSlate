import { Metadata } from 'next'
import { SignUpForm } from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up - SyncSlate',
  description: 'Create your SyncSlate account',
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <SignUpForm />
    </div>
  )
}
