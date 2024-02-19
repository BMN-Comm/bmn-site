<script>
	import { Row, Column, Grid } from 'carbon-components-svelte'
</script>

<Grid class="legend-grid">
	<Row padding>
		<Column><h3>Legend</h3></Column>
	</Row>
	<Row>
		<Column sm={1} md={2} lg={4}>
			<div class="legend-block green-cell" />
		</Column>
		<Column sm={3} md={6} lg={12}>
			<p>
				There are no musicians playing in both songs, so these songs can be scheduled at the same
				time.
			</p>
		</Column>
	</Row>
	<Row>
		<Column sm={1} md={2} lg={4}>
			<div class="legend-block orange-cell" />
		</Column>
		<Column sm={3} md={6} lg={12}>
			<p>
				All musicians can be scheduled at the same time, but there is a collision for just the
				bandcoaches in either of the song.
			</p>
		</Column>
	</Row>
	<Row>
		<Column sm={1} md={2} lg={4}>
			<div class="legend-block red-cell" />
		</Column>
		<Column sm={3} md={6} lg={12}>
			<p>
				There is at least one musician playing in both songs, so these songs cannot be scheduled at
				the same time.
			</p>
		</Column>
	</Row>
	<Row class="row-with-bottom-padding">
		<Column sm={1} md={2} lg={4}>
			<div class="legend-block black-cell" />
		</Column>
		<Column sm={3} md={6} lg={12}>
			<p>The songs are the same.</p>
		</Column>
	</Row>
</Grid>

<style>
	:global(.legend-grid) {
		padding: 0;
	}

	:global(.legend-block) {
		padding: 10px;
		border: 1px solid rgb(57, 57, 57);
	}
</style>
