<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { newRehearsalSong } from '$lib/types/domain/rehearsal'
	import type { song } from '$lib/types/domain/song'
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
		TimePicker
	} from 'carbon-components-svelte'
	import { Add, LogoDiscord } from 'carbon-icons-svelte'
	import { collection, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'

	import ScheduleTimeline from '$lib/components/scheduling/ScheduleTimeline.svelte'
	import SongAvailibilityTimeline from '$lib/components/scheduling/SongAvailibilityTimeline.svelte'

	export let data: PageData

	let { rehearsal, musiciansForSongs, songs, availabilityForMusicians } = data

	let openModal = false
	let startTime: string
	let endTime: string
	let songId: string

	async function addSong() {
		let rehearsalSong: newRehearsalSong

		if (!songs.some((s: song) => s.id == songId)) return

		let rehearsalDay = rehearsal.startTime.toDate()
		let startDate = new Date(rehearsalDay)
		let endDate = new Date(rehearsalDay)
		let start = startTime.split(':')
		let end = endTime.split(':')
		startDate.setHours(+start[0], +start[1])
		endDate.setHours(+end[0], +end[1])

		rehearsalSong = {
			song: doc(db, 'songs', songId),

			startTime: Timestamp.fromDate(startDate),
			endTime: Timestamp.fromDate(endDate)
		}

		const rehearsalSongDoc = doc(collection(db, 'rehearsals', rehearsal.id, 'songsToRehearse'))

		await setDoc(rehearsalSongDoc, rehearsalSong!)

		openModal = false
		startTime = ''
		endTime = ''
		songId = ''

		rehearsal.songsToRehearse = [
			...rehearsal.songsToRehearse,
			{ id: rehearsalSongDoc.id, ...rehearsalSong }
		]

		rehearsal = rehearsal
	}

	async function removeSong(songToDelete: string) {
		const docRef = doc(db, 'rehearsals', rehearsal.id, 'songsToRehearse', songToDelete)
		await deleteDoc(docRef)

		rehearsal.songsToRehearse = rehearsal.songsToRehearse.filter((x) => x.id !== songToDelete)
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Rehearsals {rehearsal.startTime.toDate().toDateString()}</h1></Column>
	</Row>
	<Row padding><Column>* = somebody did not fill in their availability</Column></Row>

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
	<hr />
	<ScheduleTimeline
		startTime={rehearsal.startTime.toDate()}
		endTime={rehearsal.endTime.toDate()}
		bind:songsToRehearse={rehearsal.songsToRehearse}
		{songs}
		deleteSong={(id) => removeSong(id)}
	/>
	<hr />

	{#if songs != undefined}
		{#each songs as song}
			<SongAvailibilityTimeline
				startTime={rehearsal.startTime.toDate()}
				endTime={rehearsal.endTime.toDate()}
				{song}
				musicians={musiciansForSongs[song.id]}
				musicianAvailabilities={availabilityForMusicians}
			/>
		{/each}
	{/if}
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
							items={songs.map((s) => ({ id: s.id, text: s.name }))}
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

<style>
	.modal {
		height: 500px;
	}
</style>
