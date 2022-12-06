<script lang="ts">
	import {
		Grid,
		Row,
		Column,
		StructuredList,
		StructuredListCell,
		StructuredListRow,
		Button,
		Modal,
		Form,
		TextInput,
		TextArea
	} from 'carbon-components-svelte'
	import type { announcement, newAnnouncement } from '$lib/types/domain/announcement'
	import { Add, TrashCan } from 'carbon-icons-svelte'
	import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore'
	import { page } from '$app/stores'
	import { db } from '$lib/firebase/client/firebase'
	import { Timestamp } from 'firebase/firestore'
	import { newNewsPost } from '$lib/util/webhook'
	import type { PageData } from './$types'
	import { invalidateAll } from '$app/navigation'
	import { prevent_default } from 'svelte/internal'

	export let data: PageData

	let openNew = false
	let openDel = false
	let title: string
	let message: string
	let selectedAnnouncement: number = 0

	async function AddAnnouncement() {
		const user = doc(db, 'users', $page.data.user!.databaseId)

		// TODO: use current edition
		const edition = doc(db, 'editions', 'ZI3Eab1mXjHvCUS47o40')
		const publishDate = Timestamp.fromDate(new Date())

		const newAnnouncement: newAnnouncement = {
			edition,
			publishDate,
			title,
			content: message,
			authorUser: user
		}

		await addDoc(collection(db, 'announcements'), newAnnouncement)

		newNewsPost(newAnnouncement)

		invalidateAll()
	}

	async function RemoveAnnouncement() {
		const announcementRef = doc(db, 'announcements', data.announcements[selectedAnnouncement].id)
		await deleteDoc(announcementRef)

		invalidateAll()
	}
</script>

<Grid>
	<Row>
		<Column>
			<h1>Announcements</h1>
			<Button
				icon={Add}
				iconDescription="New Announcement"
				on:click={() => {
					openNew = true
				}}
			/>
		</Column>
	</Row>

	<StructuredList>
		{#each data.announcements as announcement, i}
			<StructuredListRow>
				<StructuredListCell>
					<Button
						size="small"
						kind="ghost"
						class="removeAnnouncement"
						on:click={() => {
							selectedAnnouncement = i
							openDel = true
						}}>X</Button
					>
					{announcement.publishDate.toDate().toLocaleDateString()}
				</StructuredListCell>
				<StructuredListCell>
					<h2>{announcement.title}</h2>
					<span class="announcementMessage">{announcement.content}</span>
				</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredList>
</Grid>

<Modal
	bind:open={openNew}
	modalHeading="New Announcement"
	primaryButtonIcon={Add}
	primaryButtonText="Send"
	hasScrollingContent
	hasForm
	preventCloseOnClickOutside={true}
	shouldSubmitOnEnter={false}
	selectorPrimaryFocus="#title"
	on:click:button--primary={(e) => {
		e.preventDefault()
		AddAnnouncement()
		openNew = false
	}}
>
	<Form>
		<Grid>
			<Row padding>
				<Column>
					<TextInput labelText="Title*" bind:value={title} required id="title" />
				</Column>
			</Row>
			<Row>
				<Column>
					<TextArea labelText="Announcement*" bind:value={message} required />
				</Column>
			</Row>
		</Grid>
	</Form>
</Modal>

<Modal
	danger
	modalHeading="Remove announcement"
	primaryButtonText="Remove"
	primaryButtonIcon={TrashCan}
	secondaryButtonText="Cancel"
	bind:open={openDel}
	on:click:button--primary={() => {
		RemoveAnnouncement()
		openDel = false
	}}
	on:click:button--secondary={() => {
		openDel = false
	}}
>
	<p>Remove announcement {data.announcements[selectedAnnouncement]?.title}?</p>
</Modal>

<style>
	:global(.removeAnnouncement) {
		color: red !important;
		min-height: 1rem !important;
		max-height: 1rem !important;
		padding: 0px !important;
		margin: 2px 0px !important;
		border: 0px;
	}

	:global(.announcementMessage) {
		white-space: pre-wrap;
	}
</style>
