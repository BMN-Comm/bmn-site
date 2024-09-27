<script>
	import { Grid, Row } from 'carbon-components-svelte'
	import IntroductionCard from '$lib/components/introductionCard.svelte'
</script>

<p>OmgoshAPAge</p>

<style>
	@property --red-angle {
		syntax: '<angle>';
		inherits: false;
		initial-value: 10deg;
	}

	.committee-header {
		width: 100%;
		margin-bottom: 40px;
		display: flex;
		flex-direction: column;
	}

	.committee-picture-gradient {
		--red-angle: 0deg;
		width: 100%;
		max-width: 800px;
		margin: auto;
		margin-top: 10px;
		padding: 5px;
		background: conic-gradient(
			#ff0000 calc(var(--red-angle) - 360deg),
			#00ff00 calc(var(--red-angle) - 240deg),
			#0000ff calc(var(--red-angle) - 120deg),
			#ff0000 var(--red-angle),
			#00ff00 calc(var(--red-angle) + 120deg),
			#0000ff calc(var(--red-angle) + 240deg),
			#ff0000 calc(var(--red-angle) + 360deg)
		);
		animation: rotate-red 10s linear infinite;
		border-radius: 39px;
	}

	.committee-picture-wrapper {
		margin: auto;
		padding: 10px;
		background-color: #161616;
		border-radius: 34px;
	}
	.committee-picture {
		border-radius: 24px;
		max-width: 100%;
	}

	@keyframes rotate-red {
		0% {
			--red-angle: 0deg;
		}
		100% {
			--red-angle: 360deg;
		}
	}
</style>
