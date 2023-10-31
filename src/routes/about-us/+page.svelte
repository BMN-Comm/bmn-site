<script>
	import { Grid, Row } from 'carbon-components-svelte'
	import IntroductionCard from '$lib/components/introductionCard.svelte'
</script>

<Grid>
	<Row>
		<div class="committee-header">
			<h1>The 9th BMN committee (2022-2023)</h1>
			<img
				class="committee-picture"
				src="committeePhotos/2023/committee2023.jpg"
				alt="Committee 2023"
			/>
		</div>
	</Row>
	<Row>
		<h1 style="margin-bottom: 20px;">The members</h1>
	</Row>
	<Row>
		<IntroductionCard img_src="committeePhotos/2023/roos.png" title="Babysitter (Voorzitter)" />
		<IntroductionCard img_src="committeePhotos/2023/sebastian.png" title="Mail master" />
		<IntroductionCard img_src="committeePhotos/2023/buse.png" title="Content captain" />
		<IntroductionCard img_src="committeePhotos/2023/bjorn.png" title="Sfeerbeheer" />
		<IntroductionCard img_src="committeePhotos/2023/raoul.png" title="Money man/roadie" />
		<IntroductionCard img_src="committeePhotos/2023/bernd.png" title="Melody maestro" />
		<IntroductionCard img_src="committeePhotos/2023/luuk.png" title="Lijstenbrijer" />
		<IntroductionCard img_src="committeePhotos/2023/annemarijn.png" title="Time lord" />
	</Row>
</Grid>

<style>
	.committee-header {
		width: 100%;
		margin-bottom: 40px;
	}

	.committee-picture {
		margin-top: 10px;
		border-radius: 24px;
		width: 100%;
	}
</style>
