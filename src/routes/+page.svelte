<!-- Homepage -->
<script>
	import { Button, Column, Grid, Row } from 'carbon-components-svelte'
	import { onMount } from 'svelte'

	// Importing carousel in a tragic way because the
	// author forgot that typescript is superior...
	// He forgor 💀

	/** @type {any} **/
	let Carousel
	onMount(async () => {
		const module = await import('svelte-carousel')
		Carousel = module.default
	})

	// Add carousel photos here
	const carouselPhotos = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg']
</script>

<content>
	<svelte:component this={Carousel} autoplay>
		{#each carouselPhotos as foto}
			<div class="carouselDiv">
				<img class="BMNLogoCarousel" src="BMN2023.png" alt="BMNLogo" />
				<img class="carouselPhoto" src="carouselPhotos/{foto}" alt={foto} />
			</div>
		{/each}
	</svelte:component>

	<div class="watBMN">
		<h1>Wat is de Bèta Music Night?</h1>
		<p>
			De Bèta Music Night (BMN) is een jaarlijks terugkerend concert, georganiseerd door de
			gelijknamige commissie van studievereniging A–Eskwadraat. De eerste editie was in 2013, en
			hierop volgden al acht edities. Ondertussen is de Bèta Music Night uitgegroeid tot één van de
			grootste activiteiten van A–Eskwadraat. We zijn alweer druk bezig met het organiseren van de
			negende editie.
		</p>
		<p>
			Voor de BMN worden de beste muzikanten van A–Eskwadraat bij elkaar gebracht. Ook dit jaar gaan
			we weer een groep van ongeveer dertig muzikanten bij elkaar te vinden. De setlist bestaat
			volledig uit covers van bekende en wat minder bekende nummers. De bezetting per nummer is
			steeds anders, zo staat er bij geen enkele twee nummers precies dezelfde groep op het podium.
			Op deze manier leren de muzikanten samenspelen met veel verschillende mensen en doen hierbij
			heel nuttige bandervaring op. Het is ook mooi om te zien dat wij als echte bèta-vereniging
			naast onze exacte kwaliteiten ons ook van een een andere kant kunnen laten zien.
		</p>
	</div>

	<Grid class="sponsors" padding>
		<Row>
			<Column>
				<a href="https://www.dehelling.nl/" target="blank">
					<img class="sponsorImg" src="sponsors/de-helling.png" alt="DeHelling" />
				</a>
			</Column>
			<Column>
				<a href="https://www.uu.nl/organisatie/alumni/utrechts-universiteitsfonds" target="blank">
					<img class="sponsorImg" src="sponsors/u-fonds.jpg" alt="UFonds" />
				</a>
			</Column>
			<Column>
				<a href="https://www.a-eskwadraat.nl/Home" target="blank">
					<img class="sponsorImg" src="sponsors/a-eslogo.png" alt="A-eskwadraat" />
				</a>
			</Column>
		</Row>
	</Grid>

	<div class="footer">
		<h1>© Bèta Music Night 2023</h1>
		<a href="mailto:bmn@a-eskwadraat.nl">Contact</a>
	</div>
</content>

<style>
	.carouselPhoto {
		width: 100%;
		background-size: contain;
		background-repeat: no-repeat;
	}
	.carouselDiv {
		width: 100%;
		max-height: calc(100vh - 48px);
	}
	.BMNLogoCarousel {
		width: 25%;
		display: block;
		margin-left: 37.5%;
		margin-right: 37.5%;
		top: 70%;
		opacity: 0.5;
		position: fixed;
	}
	.watBMN {
		margin: 2% 25%;
		text-align: center;
	}

	.watBMN p {
		margin-top: 20px;
	}

	.sponsorImg {
		width: auto;
		height: 10vh;
		margin: auto;
		display: block;
	}

	.footer {
		text-align: center;
		margin: 2.5%;
	}
</style>
