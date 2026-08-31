const steps = [
	{
		title: "Describe your interests",
		body: "Tell us what you're into, in your own words. No forms, no dropdowns.",
	},
	{
		title: "Get matched",
		body: "We surface the Aatmoday groups and events that actually fit you, with reasoning.",
	},
	{
		title: "Break the ice",
		body: "Get a personalized icebreaker so starting the conversation isn't the hard part.",
	},
]

export function HowItWorks() {
	return (
		<section
			id="how-it-works"
			className="relative z-10 w-full max-w-5xl px-6 py-24"
		>
			<h2 className="text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
				How it works
			</h2>
			<div className="mt-16 grid gap-10 sm:grid-cols-3">
				{steps.map((step) => (
					<div key={step.title} className="text-center">
						<h3 className="text-xl font-semibold text-foreground">
							{step.title}
						</h3>
						<p className="mt-3 text-base leading-relaxed text-muted-foreground">
							{step.body}
						</p>
					</div>
				))}
			</div>
		</section>
	)
}