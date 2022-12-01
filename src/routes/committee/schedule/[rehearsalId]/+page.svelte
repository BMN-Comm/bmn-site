<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { newRehearsalSong } from '$lib/types/domain/rehearsal'
	import type { song } from '$lib/types/domain/song'
	import { getTimeString } from '$lib/util/timeString'
	import { newSchedule } from '$lib/util/webhook'
	import type { PageData } from './$types'
	import {
		Button,
		Column,
		ComboBox,
		Form,
		Grid,
		Modal,
		Row,
		StructuredListBody,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TimePicker
	} from 'carbon-components-svelte'
	import { Add, MusicRemove, LogoDiscord } from 'carbon-icons-svelte'
	import { collection, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import { invalidateAll } from '$app/navigation'

	export let data: PageData

	const { rehearsal, songs, musicians, editionSongs } = data

	let openModal = false
	let startTime: string
	let endTime: string
	let songId: string

	let selectedSong: number
	let openDel = false

	async function addSong() {
		let rehearsalSong: newRehearsalSong

		if (!editionSongs.some((s: song) => s.id == songId)) return

		let rehearsalDay = rehearsal.startTime.toDate()
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

		await setDoc(doc(collection(db, 'rehearsals', rehearsal.id, 'songsToRehearse')), rehearsalSong!)

		openModal = false
		startTime = ''
		endTime = ''
		songId = ''

		invalidateAll()
	}

	async function removeSong() {
		if (songs != undefined) {
			const docRef = doc(
				db,
				'rehearsals',
				rehearsal.id,
				'songsToRehearse',
				rehearsal.songsToRehearse[selectedSong].id
			)
			await deleteDoc(docRef)

			invalidateAll()
		}
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Rehearsals {rehearsal.startTime.toDate().toDateString()}</h1></Column>
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

			<Button
				iconDescription="Send notification"
				icon={LogoDiscord}
				on:click={() => {
					newSchedule(rehearsal)
				}}
			/>
		</Column>
	</Row>
	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#if songs != undefined}
				{#each songs as song, i}
					<StructuredListRow>
						<StructuredListCell>{song.name}</StructuredListCell>
						<StructuredListCell>
							{getTimeString(rehearsal.songsToRehearse[i].startTime)} -
							{getTimeString(rehearsal.songsToRehearse[i].endTime)}
						</StructuredListCell>
						<StructuredListCell>
							{@const musiciansForSong = musicians[song.id]}
							{#if musicians !== undefined}
								{#each musiciansForSong as musician}
									{musician.participantName} - {musician.instrumentName}<br />
								{/each}
							{/if}
						</StructuredListCell>
						<StructuredListCell>
							<Button
								kind="danger-tertiary"
								size="small"
								iconDescription="Remove song"
								icon={MusicRemove}
								on:click={() => {
									selectedSong = i
									openDel = true
								}}
							/>
						</StructuredListCell>
					</StructuredListRow>
				{/each}
			{/if}
		</StructuredListBody>
	</ScrollableList>
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
	<div class="modal">
		<Form>
			<Grid>
				<Row padding>
					<Column>
						<ComboBox
							titleText="Song"
							items={editionSongs.map((s) => ({ id: s.id, text: s.name }))}
							bind:selectedId={songId}
							required
						/>
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
	</div>
</Modal>

<Modal
	danger
	modalHeading="Remove song"
	primaryButtonText="Remove"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDel}
	on:click:button--primary={() => {
		removeSong()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Remove song?</p>
</Modal>

<style>
	.modal {
		height: 500px;
	}
</style>
