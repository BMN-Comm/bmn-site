<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { newRehearsalSong, rehearsal, rehearsalSong } from '$lib/types/domain/rehearsal'
	import type { song } from '$lib/types/domain/song'
	import { getTimeString } from '$lib/util/timeString'
	import { newSchedule } from '$lib/util/webhook'
	import {
		Button,
		Column,
		ComboBox,
		Form,
		Grid,
		Modal,
		Row,
		StructuredList,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TimePicker
	} from 'carbon-components-svelte'
	import type { DropdownItem } from 'carbon-components-svelte/types/Dropdown/Dropdown.svelte'
	import { Add, Save } from 'carbon-icons-svelte'
	import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'

	export let data: {
		rehearsal: rehearsal
		rehearsalId: string
		rehearsalSongs: rehearsalSong[]
		songs: song[]
		musicians: { [songId: string]: [participantName: string, instrumentName: string][] }
		editionSongs: song[]
	}

	let openModal = false
	let startTime: string
	let endTime: string
	let songId: string

	let editionSongs: DropdownItem[] = data.editionSongs.map(
		(s) => ({ id: s.id, text: s.name } as DropdownItem)
	)

	async function addSong() {
		let rehearsalSong: newRehearsalSong

		if (!data.editionSongs.some((s: song) => s.id == songId)) return

		let rehearsalDay = data.rehearsal.startTime.toDate()
		let startDate = rehearsalDay
		let endDate = rehearsalDay
		let start = startTime.split(':')
		let end = endTime.split(':')
		startDate.setHours(+start[0], +start[1])
		endDate.setHours(+end[0], +end[1])

		rehearsalSong = {
			song: doc(db, 'songs', songId),

			startTime: Timestamp.fromDate(startDate),
			endTime: Timestamp.fromDate(endDate)
		}

		await setDoc(
			doc(collection(db, 'rehearsals', data.rehearsalId, 'songsToRehearse')),
			rehearsalSong!
		)
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Rehearsals {data.rehearsal.startTime.toDate().toDateString()}</h1></Column>
	</Row>
	<Row>
		<Column>
			<Button
				iconDescription="Add song"
				icon={Add}
				on:click={() => {
					openModal = true
				}}
			/>

			<!-- TODO: Zelf opslaan -->
			<Button
				iconDescription="Save schedule"
				icon={Save}
				on:click={() => {
					newSchedule(data.rehearsal)
				}}
			/>
		</Column>
	</Row>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#if data.songs != undefined}
				{#each data.songs as song, i}
					<StructuredListRow>
						<StructuredListCell>{song.name}</StructuredListCell>
						<StructuredListCell
							>{getTimeString(data.rehearsalSongs[i].startTime)} -
							{getTimeString(data.rehearsalSongs[i].endTime)}
						</StructuredListCell>
						<StructuredListCell>
							{#each Object.entries(data.musicians) as [key, value]}
								{#if key == song.id}
									{#each value as musician}
										{musician[0]} - {musician[1]}<br />
									{/each}
								{/if}
							{/each}
						</StructuredListCell>
					</StructuredListRow>
				{/each}
			{/if}
		</StructuredListBody>
	</StructuredList>
</Grid>

<Modal
	bind:open={openModal}
	modalHeading="Choose a song"
	primaryButtonIcon={Add}
	primaryButtonText="Add"
	hasScrollingContent
	hasForm
	on:submit={(e) => {
		e.preventDefault()
		addSong()
	}}
>
	<Form>
		<Grid>
			<Row padding>
				<Column>
					<ComboBox titleText="Song" items={editionSongs} bind:selectedId={songId} required />
				</Column>
			</Row>
			<Row>
				<Column>
					<TimePicker labelText="From" bind:value={startTime} required />
				</Column>
				<Column>
					<TimePicker labelText="Till" bind:value={endTime} required />
				</Column>
			</Row>
		</Grid>
	</Form>
</Modal>
