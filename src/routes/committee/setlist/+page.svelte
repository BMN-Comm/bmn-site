<script lang="ts">
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import type { PageData } from './$types'
	import {
		Button,
		Column,
		Grid,
		Row,
		StructuredListCell,
		StructuredListHead,
		StructuredListRow
	} from 'carbon-components-svelte'
	import { Edit, LogicalPartition, MusicAdd, MusicRemove, UserFollow } from 'carbon-icons-svelte'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import AddSongModal from '$lib/components/setlist/AddSongModal.svelte'
	import EditSongModal from '$lib/components/setlist/EditSongModal.svelte'
	import DeleteSongModal from '$lib/components/setlist/DeleteSongModal.svelte'
	import AddParticipantToSongModal from '$lib/components/setlist/AddParticipantToSongModal.svelte'
	import RemoveParticipantFromSongModal from '$lib/components/setlist/RemoveParticipantFromSongModal.svelte'
	import { unknownUser, type user } from '$lib/types/domain/user'
	import type { Song } from '$lib/types/domain/song'

	type ModalState = { state: 'closed' } | (OpenModalState & { open: boolean })

	type OpenModalState =
		| { state: 'addSong' }
		| { state: 'editSong'; song: Song }
		| { state: 'deleteSong'; song: Song }
		| { state: 'addMusician'; song: Song }
		| {
				state: 'deleteMusician'
				song: Song
				user: user
				instrument: string
		  }

	let modalState: ModalState = { state: 'closed' }

	export let data: PageData

	/** Opens the modal with a slight delay so the opening animation is not cut off. */
	function openModal(state: OpenModalState) {
		modalState = { ...state, open: false }
		setTimeout(() => {
			modalState = { ...state, open: true }
		}, 50)
	}

	/** Closes the modal. */
	function closeModal() {
		modalState = { state: 'closed' }
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
				on:click={() => openModal({ state: 'addSong' })}
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
						{#each musicians as musician}
							{musician.participantName} - {musician.instrumentName}
							<Button
								size="small"
								kind="danger-ghost"
								class="removePerson"
								on:click={() =>
									openModal({
										state: 'deleteMusician',
										song,
										user:
											data.users.find((user) => user.id === musician.participantId) ?? unknownUser,
										instrument: musician.instrumentName
									})}
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
						on:click={() => openModal({ state: 'addMusician', song })}
					/>
					<Button
						kind="ghost"
						size="small"
						iconDescription="Edit"
						icon={Edit}
						on:click={() => openModal({ state: 'editSong', song })}
					/>
					<Button
						kind="danger-tertiary"
						size="small"
						iconDescription="Delete"
						icon={MusicRemove}
						on:click={() => openModal({ state: 'deleteSong', song })}
					/>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</ScrollableList>
</Grid>

{#if modalState.state === 'addSong'}
	<AddSongModal {...modalState} onClose={() => closeModal()} />
{:else if modalState.state === 'editSong'}
	<EditSongModal {...modalState} onClose={() => closeModal()} />
{:else if modalState.state === 'deleteSong'}
	<DeleteSongModal {...modalState} onClose={() => closeModal()} />
{:else if modalState.state === 'addMusician'}
	<AddParticipantToSongModal {...modalState} users={data.users} onClose={() => closeModal()} />
{:else if modalState.state === 'deleteMusician'}
	<RemoveParticipantFromSongModal {...modalState} onClose={() => closeModal()} />
{/if}

<style>
	:global(.removePerson) {
		min-height: 1rem !important;
		max-height: 1rem !important;
		padding: 2px !important;
		margin: 2px 0px !important;
		border: 0px !important;
	}

	:global(.alignRight) {
		float: right;
	}
</style>
