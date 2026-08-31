import { cn } from "@/lib/utils"

export function EdgeHandle({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"absolute rounded-full border-[3px] border-blue-600 bg-white",
				className,
			)}
		/>
	)
}