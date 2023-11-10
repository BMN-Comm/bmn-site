<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { db } from '$lib/firebase/client/firebase'
	import type { Song } from '$lib/types/domain/song'
	import { isValidUrl } from '$lib/util/urlValidation'
	import { Modal, Form, Grid, Row, Column, TextInput } from 'carbon-components-svelte'
	import { Edit } from 'carbon-icons-svelte'
	import { doc, updateDoc } from 'firebase/firestore'

	$: validLink = true
	$: validLength = true

	export let song: Song
	export let openEditSong = false

	/** Edit the song in the database */
	async function editSong() {
		if (!isValidUrl(song.link)) {
			console.log('invalid')
			validLink = false
			return false
		}

		if (!/[0-9][0-9]:[0-9][0-9]/.test(song.length)) {
			console.log('invalid')
			validLength = false
			return false
		}

		// Get the reference to the document
		const docRef = doc(db, 'songs', song.id)

		// And update it in the database
		await updateDoc(docRef, {
			name: song.name,
			artist: song.artist,
			genre: song.genre,
			length: song.length,
			link: song.link
		})

		invalidateAll()

		return true
	}
</script>

<Modal
	modalHeading="Edit song"
	bind:open={openEditSong}
	primaryButtonText="Edit"
	primaryButtonIcon={Edit}
	secondaryButtonText="Cancel"
	hasForm
	on:click:button--primary={async () => {
		const success = await editSong()
		openEditSong = !success
	}}
	on:click:button--secondary={() => {
		openEditSong = false
	}}
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
</Modal>
