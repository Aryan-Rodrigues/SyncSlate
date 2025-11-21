export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4">
        <h1 className="text-xl font-bold text-[rgba(61,90,128,1)]">SyncSlate</h1>
      </div>
      {children}
    </div>
  )
}
