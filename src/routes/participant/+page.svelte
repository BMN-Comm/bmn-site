<script>
	import { Grid, Row, Column } from 'carbon-components-svelte'
</script>

<Grid>
	<Row>
		<Column><h1>Welkom op de deelnemerspagina!</h1></Column>
	</Row>
	<Row>
		<Column class="participant-info">
			Op deze pagina kun je alle informatie vinden die je als deelnemer nodig hebt. Ben je hier voor
			het eerst? Begin dan alvast met wat suggesties insturen via de
			<strong> Suggesties </strong> knop in het menu aan de linkerkant. <br />
			Zodra er nummers gekozen zijn door de commissie kun je deze vinden in de
			<strong> Setlist </strong>, de nummers waar jij ook in speelt staan onder
			<strong> Mijn nummers</strong>.<br />
			Check jouw aankomende repetitietijden op de <strong>Rooster</strong> pagina, en vergeet niet
			je beschikbaarheid in te vullen op de <strong>Beschikbaarheid</strong> pagina.<br />
			Verdere mededelingen zijn natuurlijk te vinden op de <strong>Mededelingen</strong> pagina :).
			<br /><br />
			Laten we er een mooi jaar van maken!
		</Column>
	</Row>
</Grid>

<style>
	:global(.participant-info) {
		margin-top: 10px;
		font-size: medium;
	}
</style>
