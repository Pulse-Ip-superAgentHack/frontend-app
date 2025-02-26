export default function MintIPPage() {
  if (process.env.ENABLE_MINT_IP === 'false') {
    return <div>Feature coming soon</div>
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-newsreader mb-4">Coming Soon</h1>
        <p className="text-gray-600 mb-6">
          The IP minting functionality is currently under development.
        </p>
      </div>
    </div>
  )
}