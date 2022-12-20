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
		ToastNotification,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		Modal
	} from 'carbon-components-svelte'
	import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
	import type { PageData } from './$types'
	import ScrollableList from '$lib/components/scrollableList.svelte'
	import PlayLinkButton from '$lib/components/playLinkButton.svelte'
	import { Chat } from 'carbon-icons-svelte'

	let title: string
	let artist: string
	let genre: string
	let link: string
	let remark: string
	let length: string

	let remarkText: string
	let openRemark: boolean = false

	$: validLink = true

	export let toasts: string[] = []
	export let data: PageData

	let { songDocs } = data

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

		const newSong = doc(collection(db, 'songs'))

		toasts.push(title)
		toasts = toasts

		await setDoc(newSong, song)

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

<Grid style="margin-top: 100px">
	<Row>
		<Column>
			<h1 class="titleText">Your previous suggestions</h1>
		</Column>
	</Row>

	<ScrollableList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Title</StructuredListCell>
				<StructuredListCell head>Artist</StructuredListCell>
				<StructuredListCell head>Genre</StructuredListCell>
				<StructuredListCell head>Link</StructuredListCell>
				<StructuredListCell head>Remarks</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		{#each songDocs as song}
			<StructuredListRow>
				<StructuredListCell>
					{song.name}
				</StructuredListCell>
				<StructuredListCell>
					{song.artist}
				</StructuredListCell>
				<StructuredListCell>
					{song.genre}
				</StructuredListCell>
				<StructuredListCell>
					<PlayLinkButton url={song.link} />
				</StructuredListCell>
				<StructuredListCell>
					{#if song.remark && song.remark.length > 0}
						<Button
							kind="tertiary"
							size="small"
							iconDescription="Remarks"
							icon={Chat}
							on:click={() => {
								remarkText = song.remark
								openRemark = true
							}}
						/>
					{/if}
				</StructuredListCell>
			</StructuredListRow>
		{/each}</ScrollableList
	>
</Grid>

<Modal passiveModal modalHeading="Remark" bind:open={openRemark}>
	<p>{remarkText}</p>
</Modal>

<style>
	:global(.textinput-column) {
		max-width: 300px;
	}
</style>
