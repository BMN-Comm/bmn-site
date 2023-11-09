<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { rehearsalRoomInfo, rehearsalSongInfo } from '$lib/types/domain/rehearsal'
	import type { Song } from '$lib/types/domain/song'
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
		TextInput,
		TimePicker
	} from 'carbon-components-svelte'
	import { Add, LogoDiscord, MusicAdd, TrashCan } from 'carbon-icons-svelte'
	import { collection, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'

	import ScheduleTimeline from '$lib/components/scheduling/ScheduleTimeline.svelte'
	import SongAvailibilityTimeline from '$lib/components/scheduling/SongAvailibilityTimeline.svelte'
	import { getTimeString } from '$lib/util/timeString'

	export let data: PageData

	let { rehearsal, musiciansForSongs, songs, availabilityForMusicians } = data

	let songModalOpen = false
	let startTime: string
	let endTime: string
	let songId: string
	let selectedRoom: string

	let roomModalOpen = false
	let roomName: string

	async function addSong() {
		let rehearsalSong: rehearsalSongInfo

		if (!songs.some((s: Song) => s.id == songId)) return

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

		const rehearsalSongDoc = doc(
			collection(db, 'rehearsals', rehearsal.id, 'rooms', selectedRoom, 'songsToRehearse')
		)

		await setDoc(rehearsalSongDoc, rehearsalSong!)

		songModalOpen = false
		startTime = ''
		endTime = ''
		songId = ''

		const roomIndex = rehearsal.rooms.findIndex((room) => room.id === selectedRoom)

		rehearsal.rooms[roomIndex].songsToRehearse = [
			...rehearsal.rooms[roomIndex].songsToRehearse,
			{ id: rehearsalSongDoc.id, ...rehearsalSong }
		]

		rehearsal = rehearsal
	}

	async function removeSong(songToDelete: string, roomId?: string) {
		const docRef = roomId
			? doc(db, 'rehearsals', rehearsal.id, 'rooms', roomId, 'songsToRehearse', songToDelete)
			: doc(db, 'rehearsals', rehearsal.id, 'songsToRehearse', songToDelete)
		await deleteDoc(docRef)

		rehearsal.songsToRehearse = rehearsal.songsToRehearse.filter((x) => x.id !== songToDelete)
		rehearsal.rooms.forEach(
			(room) => (room.songsToRehearse = room.songsToRehearse.filter((x) => x.id !== songToDelete))
		)
	}

	async function addRoom() {
		if (roomName?.trim().length === 0) return

		let rehearsalRoom: rehearsalRoomInfo

		let rehearsalDay = rehearsal.startTime.toDate()
		let startDate = new Date(rehearsalDay)
		let endDate = new Date(rehearsalDay)
		let start = startTime.split(':')
		let end = endTime.split(':')
		startDate.setHours(+start[0], +start[1])
		endDate.setHours(+end[0], +end[1])

		rehearsalRoom = {
			roomName: roomName,
			startTime: Timestamp.fromDate(startDate),
			endTime: Timestamp.fromDate(endDate),
			songsToRehearse: []
		}

		const rehearsalRoomDoc = doc(collection(db, 'rehearsals', rehearsal.id, 'rooms'))

		await setDoc(rehearsalRoomDoc, rehearsalRoom)

		roomModalOpen = false
		startTime = ''
		endTime = ''
		roomName = ''

		rehearsal.rooms = [...rehearsal.rooms, { id: rehearsalRoomDoc.id, ...rehearsalRoom }]

		rehearsal = rehearsal
	}

	async function removeRoom(roomToDelete: string) {
		const docRef = doc(db, 'rehearsals', rehearsal.id, 'rooms', roomToDelete)

		await deleteDoc(docRef)

		rehearsal.rooms = rehearsal.rooms.filter((x) => x.id !== roomToDelete)
	}
</script>

<Grid>
	<Row padding>
		<Column><h1>Rehearsals {rehearsal.startTime.toDate().toDateString()}</h1></Column>
		<Column class="control-button-collumn">
			<Button
				iconDescription="Send notification"
				icon={LogoDiscord}
				on:click={() => {
					newSchedule(rehearsal)
				}}
			/>
			<Button
				iconDescription="Add room"
				icon={Add}
				on:click={() => {
					startTime = getTimeString(rehearsal.startTime)
					endTime = getTimeString(rehearsal.endTime)
					roomModalOpen = true
				}}
			/>
		</Column>
	</Row>
	<Row padding><Column>* = somebody did not fill in their availability</Column></Row>
	<hr />

	{#each rehearsal.rooms as room, i}
		<Row>
			<Column>
				<h2>{room.roomName}</h2>
			</Column>
			<Column class="control-button-collumn">
				<Button
					size="small"
					iconDescription="Remove room"
					icon={TrashCan}
					kind="danger-tertiary"
					on:click={() => {
						removeRoom(room.id)
					}}
				/>
				<Button
					size="small"
					iconDescription="Add song"
					icon={MusicAdd}
					on:click={() => {
						selectedRoom = room.id
						songModalOpen = true
					}}
				/>
			</Column>
		</Row>
		<ScheduleTimeline
			roomStartTime={room.startTime.toDate()}
			roomEndTime={room.endTime.toDate()}
			startTime={rehearsal.startTime.toDate()}
			endTime={rehearsal.endTime.toDate()}
			bind:songsToRehearse={room.songsToRehearse}
			{songs}
			deleteSong={(id) => removeSong(id, room.id)}
		/>
		<hr />
	{/each}

	{#if rehearsal.songsToRehearse.length !== 0}
		<ScheduleTimeline
			startTime={rehearsal.startTime.toDate()}
			endTime={rehearsal.endTime.toDate()}
			roomEndTime={undefined}
			roomStartTime={undefined}
			bind:songsToRehearse={rehearsal.songsToRehearse}
			{songs}
			deleteSong={(id) => removeSong(id)}
		/>
		<hr />
	{/if}

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
	bind:open={songModalOpen}
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
							shouldFilterItem={(item, value) =>
								value ? item.text.toLowerCase().includes(value.toLowerCase()) : true}
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
	bind:open={roomModalOpen}
	modalHeading="Add a new room"
	primaryButtonIcon={Add}
	primaryButtonText="Add"
	hasScrollingContent
	hasForm
	on:submit={(e) => {
		e.preventDefault()
		addRoom()
	}}
>
	<div class="modal">
		<Form>
			<Grid>
				<Row padding>
					<Column>
						<TextInput title="Room name" bind:value={roomName} required />
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

	:global(.control-button-collumn) {
		display: flex;
		justify-content: flex-end;
		gap: 4px;
	}
</style>
