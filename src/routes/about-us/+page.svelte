<script>
	import { Grid, Row } from 'carbon-components-svelte'
	import IntroductionCard from '$lib/components/introductionCards.svelte'
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
		<IntroductionCard img_src="committeePhotos/2023/famke.png" title="Babysitter (Voorzitter)" />
		<IntroductionCard img_src="committeePhotos/2023/annemarijn.png" title="Mail master" />
		<IntroductionCard img_src="committeePhotos/2023/buse.png" title="Content captain" />
		<IntroductionCard img_src="committeePhotos/2023/emma.png" title="Sfeerbeheer" />
		<IntroductionCard img_src="committeePhotos/2023/raoul.png" title="Money man/roadie" />
		<IntroductionCard img_src="committeePhotos/2023/rienk.png" title="Melody maestro" />
		<IntroductionCard img_src="committeePhotos/2023/roos.png" title="Lijstenbrijer" />
		<IntroductionCard
			img_src="committeePhotos/2023/tim.png"
			title="Time lord"
			text="Hoihoii, ik ben Tim! Ik speel piano en drums en dit jaar ben ik de Time Lord. Ik maak dus alle roosters voor de repetities en zit mensen achter hun broek aan om hun beschikbaarheid in te vullen! Ik heb vorig jaar mijn bachelor Natuurkunde afgerond en ga volgend jaar beginnen aan de master Computing Science. Buiten de studie vind ik het erg leuk om een stukje te gaan skeeleren, samen film te kijken of een biertje te doen. In het algemeen ben ik eigenlijk altijd wel te porren voor gezelligheid. Ik doe dit jaar ook een cursus meubelmaken en heb dan ook altijd wel een of ander project(je) waar ik mijn weinige overige vrije tijd mee kan verdoen. Tot op de BMN!"
		/>
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
