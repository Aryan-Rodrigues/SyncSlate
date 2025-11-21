import { Metadata } from 'next'
import { ResetPasswordForm } from './reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password - SyncSlate',
  description: 'Reset your SyncSlate password',
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <ResetPasswordForm />
    </div>
  )
}
