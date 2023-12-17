<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import CustomModal from '$lib/components/setlist/CustomModal.svelte'
	import { db } from '$lib/firebase/client/firebase'
	import type { Song } from '$lib/types/domain/song'
	import { isValidUrl } from '$lib/util/urlValidation'
	import { Form, Grid, Row, Column, TextInput } from 'carbon-components-svelte'
	import { Edit } from 'carbon-icons-svelte'
	import { doc, updateDoc } from 'firebase/firestore'

	export let open = false
	export let onClose: () => void

	export let song: Song

	let validLength = true
	let validLink = true

	/** Edit the song in the database */
	async function editSong() {
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
			// Get the reference to the document
			const docRef = doc(db, 'songs', song.id)

			// And update it in the database
			await updateDoc(docRef, song)

			invalidateAll()
			return true
		} catch (error) {
			console.error(error) //TODO: handle error
			return false
		}
	}
</script>

<CustomModal
	modalHeading="Edit song"
	primaryButtonText="Edit"
	primaryButtonIcon={Edit}
	secondaryButtonText="Cancel"
	bind:open
	{onClose}
	onSubmit={editSong}
	hasForm
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
