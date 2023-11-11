<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { addSongToSetlist, createSong } from '$lib/firebase/client/firestore/songs'
	import { isValidUrl } from '$lib/util/urlValidation'
	import { Form, Grid, Row, Column, TextInput } from 'carbon-components-svelte'
	import CustomModal from './CustomModal.svelte'
	import { MusicAdd } from 'carbon-icons-svelte'
	import { emptyNewSong, type Song } from '$lib/types/domain/song'

	export let open = false
	export let onClose: () => void

	let song: Omit<Song, 'id'> = emptyNewSong

	let validLength = true
	let validLink = true

	/**
	 * Create the song and add it to the setlist.
	 * @returns Whether the song was successfully created and added to the setlist.
	 */
	async function createAndAddSongToSetlist() {
		// TODO: Show error if failed
		if (!isValidUrl(song.link)) {
			console.log('invalid')
			validLink = false
			return false
		}

		if (!/[0-9][0-9]:[0-6][0-9]/.test(song.length)) {
			console.log('invalid')
			validLength = false
			return false
		}

		try {
			// Create the song
			const songId = await createSong(song)

			// Add the song to the setlist
			await addSongToSetlist(songId)

			// Reset state
			song = emptyNewSong
			validLength = true
			validLink = true

			invalidateAll()
			return true
		} catch (error) {
			console.error(error) //TODO: handle error
			return false
		}
	}
</script>

<CustomModal
	modalHeading="Add to setlist"
	primaryButtonText="Add"
	primaryButtonIcon={MusicAdd}
	secondaryButtonText="Cancel"
	bind:open
	{onClose}
	onSubmit={createAndAddSongToSetlist}
	hasForm
	selectorPrimaryFocus="#name"
>
	<Form>
		<Grid>
			<Row padding>
				<Column>
					<TextInput
						id="name"
						labelText="Name*"
						placeholder="Name"
						bind:value={song.name}
						required
					/>
				</Column>
			</Row>
			<Row padding>
				<Column>
					<TextInput
						id="artist"
						labelText="Artist*"
						placeholder="Artist"
						bind:value={song.artist}
						required
					/>
				</Column>
			</Row>
			<Row padding>
				<Column>
					<TextInput
						id="link"
						labelText="Link*"
						placeholder="Link"
						bind:value={song.link}
						invalid={!validLink}
						invalidText={validLink ? undefined : 'Enter a valid link'}
					/>
				</Column>
			</Row>
			<Row padding>
				<Column>
					<TextInput
						id="genre"
						labelText="Genre*"
						placeholder="Genre"
						bind:value={song.genre}
						required
					/>
				</Column>
				<Column>
					<TextInput
						bind:value={song.length}
						labelText="Length* (mm:ss)"
						placeholder="Length"
						required
						invalid={!validLength}
						invalidText={validLength ? undefined : 'Format the length as mm:ss'}
					/>
				</Column>
			</Row>
		</Grid>
	</Form>
</CustomModal>
