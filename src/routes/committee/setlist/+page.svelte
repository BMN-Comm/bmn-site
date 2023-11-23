<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import { db } from '$lib/firebase/client/firebase'
	import type { PageData } from './$types'
	import {
		Button,
		Column,
		Grid,
		Modal,
		Row,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { Edit, MusicAdd, MusicRemove, UserFollow } from 'carbon-icons-svelte'
	import {
		arrayRemove,
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		updateDoc,
		where
	} from 'firebase/firestore'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import { editionId } from '$lib/types/domain/edition'
	import { getSuggestedSongs } from '$lib/firebase/client/firestore/songs'
	import AddSongModal from '$lib/components/setlist/AddSongModal.svelte'
	import EditSongModal from '$lib/components/setlist/EditSongModal.svelte'
	import AddMusiciansToSongModal from '$lib/components/setlist/AddMusiciansToSongModal.svelte'

	export let data: PageData

	let selectedSong: number
	let selectedUserEntry: number
	let selectedUser: string
	let selectedInstrument: string

	let openDelSong = false
	let openDelMusician = false
	let openAddMusician = false
	let openAddSong = false
	let openEditSong = false

	async function RemoveSongFromSetlist() {
		const selectedSongId = data.songs[selectedSong].id

		// Remove the song from the setlist
		const editionRef = doc(db, editionId)
		updateDoc(editionRef, {
			songs: arrayRemove(doc(db, 'songs', selectedSongId))
		})

		// If the song was not a suggestion (but added directly to the setlist), delete it from the database completely
		if ((await getSuggestedSongs([selectedSongId])).length === 0) {
			const songDoc = doc(db, 'songs', selectedSongId)
			await deleteDoc(songDoc)
		}

		invalidateAll()
	}

	async function RemoveParticipantFromSong() {
		const userQuery = query(collection(db, 'users'), where('name', '==', selectedUser))
		const userId = (await getDocs(userQuery)).docs[0].id
		const songRef = doc(db, 'songs', data.songs[selectedSong].id)

		const playsInQuery = query(
			collection(db, 'users', userId, 'playsSongs'),
			where('song', '==', songRef),
			where('part', '==', selectedInstrument)
		)
		const playsInDoc = (await getDocs(playsInQuery)).docs[0].ref

		await deleteDoc(playsInDoc)

		invalidateAll()
	}
</script>

<Grid>
	<Row>
		<Column><h1 class="titleText">Setlist</h1></Column>
		<Column>
			<Button
				class="alignRight"
				icon={MusicAdd}
				iconDescription={'Add song to setlist'}
				on:click={() => {
					openAddSong = true
				}}
			/>
		</Column>
	</Row>

	<ScrollableList condensed>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Genre</StructuredListCell>
				<StructuredListCell head>Length</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Line-up</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each data.songs as song, i}
			<StructuredListRow>
				<StructuredListCell>{song.name}</StructuredListCell>
				<StructuredListCell>{song.artist}</StructuredListCell>
				<StructuredListCell>{song.genre}</StructuredListCell>
				<StructuredListCell>{song.length}</StructuredListCell>
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
									openDelMusician = true
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
						iconDescription="Add musicians"
						icon={UserFollow}
						on:click={() => {
							selectedSong = i
							openAddMusician = true
						}}
					/>
					<Button
						kind="ghost"
						size="small"
						iconDescription="Edit"
						icon={Edit}
						on:click={() => {
							selectedSong = i
							openEditSong = true
						}}
					/>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Delete"
						icon={MusicRemove}
						on:click={() => {
							selectedSong = i
							openDelSong = true
						}}
					/>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</ScrollableList>
</Grid>

<AddSongModal bind:openAddSong />

{#if data.songs[selectedSong]}
	<EditSongModal bind:openEditSong song={data.songs[selectedSong]} />
{/if}

<Modal
	danger
	modalHeading="Delete from setlist"
	primaryButtonText="Delete"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDelSong}
	on:click:button--primary={() => {
		RemoveSongFromSetlist()
		openDelSong = false
	}}
	on:click:button--secondary={() => {
		openDelSong = false
	}}
>
	<p>Delete {data.songs[selectedSong]?.name}?</p>
</Modal>

{#if data.songs[selectedSong]}
	<AddMusiciansToSongModal
		bind:open={openAddMusician}
		song={data.songs[selectedSong]}
		users={data.users}
		participants={data.musiciansForSongs[data.songs[selectedSong].id].map((musician) => ({
			participantId: musician.participantId,
			instrument: musician.instrumentName
		}))}
	/>
{/if}

<Modal
	danger
	modalHeading="Remove from song"
	primaryButtonText="Remove"
	primaryButtonIcon={MusicRemove}
	secondaryButtonText="Cancel"
	bind:open={openDelMusician}
	on:click:button--primary={() => {
		RemoveParticipantFromSong()
		openDelMusician = false
	}}
	on:click:button--secondary={() => {
		openDelMusician = false
	}}
>
	<p>Remove {selectedUser} from {data.songs[selectedSong]?.name}?</p>
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

	:global(.alignRight) {
		float: right;
	}
</style>
