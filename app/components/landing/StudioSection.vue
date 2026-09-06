<template>
	<section id="studio" class="studio section-gutter">
		<p class="studio-statement">
			We build brands that get chosen, not just seen. Sharp thinking, fast
			execution, numbers you can defend.
		</p>

		<div class="studio-grid">
			<div class="studio-column">
				<NuxtImg
					class="studio-portrait object-cover"
					src="/images/founder.jpg"
					alt="Founder of byroose against a blue sky"
					width="720"
					height="1280"
					sizes="100vw sm:448px"
					loading="lazy"
				/>
			</div>

			<div class="studio-column studio-copy">
				<p>
					Nine people in one room: strategists, designers, engineers
					and an AI pipeline that does the boring half. No account
					layer, no handoff tax. You talk to the people doing the
					work.
				</p>
				<p>
					Every engagement starts with a hypothesis and ends with a
					number. If a channel does not pay, we kill it and say so out
					loud, in the readout, with the maths attached.
				</p>
			</div>
		</div>
	</section>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.studio {
	@apply w-full py-section;
}

.studio-statement {
	@apply m-0 max-w-[22ch] text-statement font-semibold tracking-[-0.035em];
}

.studio-grid {
	@apply mt-12 flex flex-wrap items-center gap-8 md:mt-16 md:gap-12 xl:mt-20 xl:gap-18;
}

.studio-column {
	@apply min-w-0 flex-1 basis-80;
}

.studio-portrait {
	@apply aspect-4/5 w-full max-w-md overflow-hidden rounded-2xl;
}

.studio-copy {
	@apply space-y-6;
}

.studio-copy p {
	@apply m-0 max-w-[46ch] text-xl leading-snug tracking-tight font-bold first:mb-8 text-foreground md:text-2xl xl:text-4xl;
}
</style>
