interface InfoCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="bg-primary flex p-4 items-center gap-4 text-black border w-full max-w-96 min-h-32 rounded-xl">
      <div className="flex size-16 rounded-full items-center shrink-0 justify-center bg-black">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}