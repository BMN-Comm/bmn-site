<script lang="ts">
	import type { song } from '$lib/types/domain/song'
	import { isValidUrl } from '$lib/util/urlValidation'
	import {
		Button,
		Column,
		Grid,
		Row,
		StructuredList,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { PlayFilledAlt } from 'carbon-icons-svelte'

	export let data: {
		songs: song[]
		musiciansForSongs: Map<string, [string, string][]>
	}
</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Setlist</h1></Column>
	</Row>

	<StructuredList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.songs as song, i}
			<StructuredListRow>
				<StructuredListCell>{song.name}</StructuredListCell>
				<StructuredListCell>{song.artist}</StructuredListCell>
				<StructuredListCell
					>{@const validUrl = isValidUrl(song.link)}
					<Button
						href={validUrl ? song.link : undefined}
						target="blank"
						kind="ghost"
						size="small"
						iconDescription={validUrl ? song.link : 'Invalid URL'}
						icon={PlayFilledAlt}
						disabled={!validUrl}
					/></StructuredListCell
				>
				<StructuredListCell>
					{#each Object.entries(data.musiciansForSongs) as [key, value]}
						{#if key == song.id}
							{#each value as musician}
								{musician[0]} - {musician[1]}<br />
							{/each}
						{/if}
					{/each}
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredList>
</Grid>
