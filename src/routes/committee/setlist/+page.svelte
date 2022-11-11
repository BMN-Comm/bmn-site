<script lang="ts">
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import { db } from '$lib/firebase/client/firebase'
	import type { song } from '$lib/types/domain/song'
	import type { user } from '$lib/types/domain/user'
	import {
		Button,
		Column,
		ComboBox,
		Form,
		Grid,
		Modal,
		Row,
		StructuredList,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow,
		TextInput
	} from 'carbon-components-svelte'
	import type { DropdownItem } from 'carbon-components-svelte/types/Dropdown/Dropdown.svelte'
	import { MusicRemove, UserFollow } from 'carbon-icons-svelte'
	import {
		addDoc,
		arrayRemove,
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		updateDoc,
		where
	} from 'firebase/firestore'

	export let data: {
		songs: song[]
		// Een goed tijdje bezig geweest dit om te schrijven, maar gaf steeds problemen
		// dus als je iets weet laat maar weten xd
		musiciansForSongs: {
			[songId: string]: { participantName: string; instrumentName: string }[]
		}
		users: user[]
		namesMap: { [userId: string]: { participantName: string } }
	}

	console.log(data.musiciansForSongs)

	let selectedSong: number
	let selectedUserEntry: number
	let selectedUser: string
	let selectedInstrument: string
	let openDel = false
	let openDelUser = false
	let openAdd = false

	let participantListItems: DropdownItem[] = data.users.map(
		(user) => ({ id: user.id, text: user.name } as DropdownItem)
	)

	let participant: string
	let instrument: string

	async function RemoveSongFromSetlist() {
		// TODO: use current edition
		const editionRef = doc(db, 'editions', 'ZI3Eab1mXjHvCUS47o40')
		updateDoc(editionRef, {
			songs: arrayRemove(doc(db, 'songs', data.songs[selectedSong].id))
		})
		data.songs.splice(selectedSong, 1)
		data.songs = data.songs
	}

	async function AddParticipantToSong() {
		await addDoc(collection(db, 'users/' + participant + '/playsSongInEdition'), {
			edition: doc(db, 'editions', 'ZI3Eab1mXjHvCUS47o40'),
			part: instrument,
			song: doc(db, 'songs', data.songs[selectedSong].id)
		})
		data.musiciansForSongs[data.songs[selectedSong].id] = [
			...data.musiciansForSongs[data.songs[selectedSong].id],
			{ participantName: data.namesMap[participant].participantName, instrumentName: instrument }
		]
	}

	async function RemoveParticipantFromSong() {
		const userQuery = query(collection(db, 'users'), where('name', '==', selectedUser))
		const userId = (await getDocs(userQuery)).docs[0].id
		const songRef = doc(db, 'songs', data.songs[selectedSong].id)

		const playsInQuery = query(
			collection(db, 'users', userId, 'playsSongInEdition'),
			where('song', '==', songRef),
			where('part', '==', selectedInstrument)
		)
		const playsInDoc = (await getDocs(playsInQuery)).docs[0].ref

		await deleteDoc(playsInDoc)

		data.musiciansForSongs = data.musiciansForSongs
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
				<StructuredListCell>
					<PlayLinkButton url={song.link} />
				</StructuredListCell>
				<StructuredListCell>
					{@const musicians = data.musiciansForSongs[song.id]}
					{#if musicians !== undefined}
						{#each musicians as musician, j}
							{musician.participantName} - {musician.instrumentName}
							<Button
								size="small"
								kind="ghost"
								class="removePerson"
								on:click={() => {
									selectedSong = i
									selectedUser = musician.participantName
									selectedInstrument = musician.instrumentName
									selectedUserEntry = j
									openDelUser = true
								}}
							>
								X
							</Button>
							<br />
						{/each}
					{/if}
				</StructuredListCell>
				<StructuredListCell>
					<Button
						kind="ghost"
						size="small"
						iconDescription="Add musician"
						icon={UserFollow}
						on:click={() => {
							selectedSong = i
							openAdd = true
						}}
					/>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Delete"
						icon={MusicRemove}
						on:click={() => {
							selectedSong = i
							openDel = true
						}}
					/>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredList>
</Grid>

<Modal
	danger
	modalHeading="Delete from setlist"
	primaryButtonText="Delete"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDel}
	on:click:button--primary={() => {
		RemoveSongFromSetlist()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Delete {data.songs[selectedSong]?.name}?</p>
</Modal>

<Modal
	danger
	modalHeading="Remove from song"
	primaryButtonText="Remove"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDelUser}
	on:click:button--primary={() => {
		RemoveParticipantFromSong()
		openDelUser = false
	}}
	on:click:button--secondary={() => {
		openDelUser = false
	}}
>
	<p>Remove {selectedUser} from {data.songs[selectedSong]?.name}?</p>
</Modal>

<Modal
	bind:open={openAdd}
	modalHeading="Add participant to line-up"
	primaryButtonText="Confirm"
	on:click:button--primary={() => {
		AddParticipantToSong()
		openAdd = false
	}}
	hasScrollingContent
	class="addParticipantModal"
>
	<Form>
		<ComboBox
			titleText="Participant"
			bind:selectedId={participant}
			items={participantListItems}
			required
		/>
		<br />
		<TextInput bind:value={instrument} required labelText="Instrument" />
	</Form>
</Modal>

<style>
	:global(.removePerson) {
		color: red !important;
		min-height: 1rem !important;
		max-height: 1rem !important;
		padding: 0px !important;
		margin: 2px 0px !important;
		border: 0px;
	}

	:global(.addParticipantModal .bx--modal-content) {
		height: 30rem;
	}
</style>
