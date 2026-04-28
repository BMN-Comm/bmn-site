<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import { page } from '$app/stores'
	import { isValidUrl } from '$lib/util/urlValidation'
	import {
		Grid,
		Row,
		Column,
		TextInput,
		Button,
		Form,
		TextArea,
		ToastNotification
	} from 'carbon-components-svelte'
	import { doc, Timestamp } from 'firebase/firestore'
	import { createSongFromSuggestion } from '$lib/firebase/client/firestore/songs'

	let title: string
	let artist: string
	let genre: string
	let link: string
	let remark: string
	let length: string

	$: validLink = true

	export let toasts: string[] = []

	async function AddSuggestion() {
		// TODO: Show error if failed
		if (!isValidUrl(link)) {
			console.log('invalid')
			validLink = false
			return
		}

		let song = {
			name: title,
			artist,
			length,
			link,
			genre,
			remark,
			suggestionDate: Timestamp.now(),
			user: doc(db, 'users', $page.data.user!.databaseId)
		}

		createSongFromSuggestion(song)
		
		toasts.push(title)
		toasts = toasts
		
		title = ''
		artist = ''
		genre = ''
		link = ''
		remark = ''
		length = ''
		validLink = true
	}
</script>

{#each toasts as toast, i}
	<!-- TODO: Toasts are badly implemented -->
	<ToastNotification
		lowContrast
		timeout={5000}
		kind="success"
		title="Success"
		subtitle="Song added:"
		caption={toast}
		on:close={(e) => {
			toasts = toasts.splice(i, 1)
		}}
	/>
{/each}

<Form
	on:submit={(e) => {
		e.preventDefault()
		AddSuggestion()
	}}
>
	<Grid padding>
		<Row>
			<Column><h1>Add a suggestion</h1></Column>
		</Row>
		<Row>
			<Column sm={4} md={8} lg={5}>
				<TextInput bind:value={title} labelText="Title*" placeholder="Title" required />
			</Column>
			<Column sm={4} md={8} lg={6}>
				<TextInput bind:value={artist} labelText="Artist*" placeholder="Artist" required />
			</Column>
			<Column sm={4} md={8} lg={5}>
				<TextInput bind:value={genre} labelText="Genre*" placeholder="Genre" required />
			</Column>
		</Row>
		<Row>
			<Column sm={4} md={4} lg={10}>
				<TextInput
					bind:value={link}
					labelText="Link*"
					placeholder="Song link"
					required
					invalid={!validLink}
					invalidText={validLink ? undefined : 'Enter a valid link'}
				/>
			</Column>
			<Column sm={4} md={4} lg={6}>
				<TextInput
					bind:value={length}
					labelText="Length (mm:ss)*"
					placeholder="Enter the length of the song"
					required
					pattern="[0-9][0-9]:[0-9][0-9]"
				/>
			</Column>
		</Row>
		<Row>
			<Column>
				<TextArea
					bind:value={remark}
					labelText="Remarks"
					placeholder="Room for remarks"
					maxCount={255}
				/>
			</Column>
		</Row>
		<Row>
			<Column>* is required</Column>
		</Row>
		<Row>
			<Column>
				<Button type="submit">submit</Button>
			</Column>
		</Row>
	</Grid>
</Form>

<style>
	:global(.textinput-column) {
		max-width: 300px;
	}
</style>
