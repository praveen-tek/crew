import { cn } from "@/lib/utils"

export function CornerDot({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"absolute h-5 w-5 rounded-full border-[3px] border-blue-600 bg-white",
				className,
			)}
		/>
	)
}