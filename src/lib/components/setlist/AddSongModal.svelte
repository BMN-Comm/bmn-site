<script lang="ts">
	import { invalidateAll } from "$app/navigation"
	import { addSongToSetlist, createSong } from "$lib/firebase/client/firestore/songs"
	import { isValidUrl } from "$lib/util/urlValidation"
	import { Modal, Form, Grid, Row, Column, TextInput } from "carbon-components-svelte"
	import { MusicAdd } from "carbon-icons-svelte"

	let addSongName: string
	let addSongArtist: string
	let addSongLink: string
	$: validLink = true

	export let openAddSong = false

	async function CreateAndAddSongToSetlist() {
		// TODO: Show error if failed
		if (!isValidUrl(addSongLink)) {
			console.log('invalid')
			validLink = false
			return
		}

		// Create the song
		const song = {
			name: addSongName,
			artist: addSongArtist,
			link: addSongLink
		}
		const songId = await createSong(song)

		// Add the song to the setlist
		await addSongToSetlist(songId)

		addSongName = ''
		addSongArtist = ''
		addSongLink = ''
		validLink = true

		invalidateAll()
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
		await CreateAndAddSongToSetlist()
		openAddSong = false
	}}
	on:click:button--secondary={() => {
		openAddSong = false
	}}
>
	<Form>
		<Grid>
			<Row padding>
				<Column>
					<TextInput
						id="name"
						labelText="Name"
						placeholder="Name"
						bind:value={addSongName}
						required
					/>
				</Column>
			</Row>
			<Row padding>
				<Column>
					<TextInput
						id="artist"
						labelText="Artist"
						placeholder="Artist"
						bind:value={addSongArtist}
						required
					/>
				</Column>
			</Row>
			<Row padding>
				<Column >
					<TextInput
					id="link"
					labelText="Link"
					placeholder="Link"
					bind:value={addSongLink}
					invalid={!validLink}
					invalidText={validLink ? undefined : 'Enter a valid link'}
				/>
				</Column>
			</Row>
		</Grid>
	</Form>
</Modal>