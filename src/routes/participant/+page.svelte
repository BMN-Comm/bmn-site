<script>
	import { Grid, Row, Column } from 'carbon-components-svelte'
</script>

<Grid>
	<Row>
		<Column><h1>Welcome to the participants' page!</h1></Column>
	</Row>
	<Row>
		<Column class="participant-info">
			On this page you will find any information you need as a participant. Is this your first time
			here? Start with sending in some suggestions at the
			<strong> Suggestions </strong> button in the menu on the left. <br />
			When songs are selected by the committee you can find them at the
			<strong> Setlist </strong>, the songs you play in are found under
			<strong> My songs</strong>.<br />
			Check your next rehearsals on the <strong>Rehearsal</strong> page, and don't forget to submit
			your availability on the <strong>Availability</strong> page.<br />
			Announcements by the committee are of course found on the <strong>Announcements</strong> page
			:).
			<br /><br />
			Let's have a great year!
		</Column>
	</Row>
</Grid>

<style>
	:global(.participant-info) {
		margin-top: 10px;
		font-size: medium;
	}
</style>
