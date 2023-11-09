<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { addSongToSetlist, createSong } from '$lib/firebase/client/firestore/songs'
	import { isValidUrl } from '$lib/util/urlValidation'
	import { Modal, Form, Grid, Row, Column, TextInput } from 'carbon-components-svelte'
	import { MusicAdd } from 'carbon-icons-svelte'

	let name: string
	let artist: string
	let genre: string
	let length: string
	$: validLength = true
	let link: string
	$: validLink = true

	export let openAddSong = false

	/**
	 * Create the song and add it to the setlist.
	 * @returns Whether the song was successfully created and added to the setlist.
	 */
	async function CreateAndAddSongToSetlist() {
		// TODO: Show error if failed
		if (!isValidUrl(link)) {
			console.log('invalid')
			validLink = false
			return false
		}

		if (!/[0-9][0-9]:[0-9][0-9]/.test(length)) {
			console.log('invalid')
			validLength = false
			return false
		}

		// Create the song
		const song = {
			name,
			artist,
			link,
			genre,
			length
		}
		const songId = await createSong(song)

		// Add the song to the setlist
		await addSongToSetlist(songId)

		name = ''
		artist = ''
		genre = ''
		length = ''
		validLength = true
		link = ''
		validLink = true

		invalidateAll()

		return true
	}
</script>

<Modal
	modalHeading="Add to setlist"
	bind:open={openAddSong}
	primaryButtonText="Add"
	primaryButtonIcon={MusicAdd}
	secondaryButtonText="Cancel"
	hasForm
	selectorPrimaryFocus="#name"
	on:click:button--primary={async () => {
		const success = await CreateAndAddSongToSetlist()
		openAddSong = !success
	}}
	on:click:button--secondary={() => {
		openAddSong = false
	}}
>
	<Form>
		<Grid>
			<Row padding>
				<Column>
					<TextInput id="name" labelText="Name*" placeholder="Name" bind:value={name} required />
				</Column>
			</Row>
			<Row padding>
				<Column>
					<TextInput
						id="artist"
						labelText="Artist*"
						placeholder="Artist"
						bind:value={artist}
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
						bind:value={link}
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
						bind:value={genre}
						required
					/>
				</Column>
				<Column>
					<TextInput
						bind:value={length}
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
</Modal>
