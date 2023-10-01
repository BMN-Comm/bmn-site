<script lang="ts">
	import type { PageData } from './$types'
	import { Checkbox, Column, Grid, Row } from 'carbon-components-svelte'
	import SongList from '$lib/components/rehearsals/SongList.svelte'
	import { getTimeString } from '$lib/util/timeString'

	export let data: PageData

	let filterOwnSongs = false

	const { rehearsal, songs, musicians } = data
</script>

<Grid>
	<Row padding>
		<Column>
			<h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1>
			<Checkbox
				labelText="Show only my songs"
				on:change={() => {
					filterOwnSongs = !filterOwnSongs
				}}
			/>
		</Column>
	</Row>

	{#each rehearsal.rooms as room}
		<Row padding>
			<Column>
				<h2>{room.roomName}: {getTimeString(room.startTime)} - {getTimeString(room.endTime)}</h2>
			</Column>
		</Row>
		<SongList {filterOwnSongs} songsToRehearse={room.songsToRehearse} {songs} {musicians} />
	{/each}
	<SongList {filterOwnSongs} songsToRehearse={rehearsal.songsToRehearse} {songs} {musicians} />
</Grid>
