<script lang="ts">
	import type { PageData } from './$types'
	import { Grid, Row, Column, TextInput, Form, Button } from 'carbon-components-svelte'

	let newPassword: string
	let newPasswordRepeated: string
	$: passwordsDontMatch = false
	$: showError = false

	export let data: PageData

	async function ChangePassword() {
		if (newPassword !== newPasswordRepeated) {
			passwordsDontMatch = true
			return
		}

		const result = await fetch(
			new Request('/api/user/change-password', {
				method: 'POST',
				body: JSON.stringify({
					uid: data.user?.uid,
					newPassword
				})
			})
		)

		if (result.ok) window.location.assign('/user')

		showError = true
	}
</script>

<Form
	on:submit={(e) => {
		e.preventDefault()
		ChangePassword()
	}}
>
	<Grid padding>
		<Row>
			<Column><h1>Change your password</h1></Column>
		</Row>
		<Row>
			<Column sm={4} md={4} lg={8}>
				<TextInput
					bind:value={newPassword}
					type="password"
					labelText="New password*"
					placeholder="Enter a new password"
					required
					minlength={6}
				/>
			</Column>
			<Column sm={4} md={4} lg={8}>
				<TextInput
					bind:value={newPasswordRepeated}
					type="password"
					labelText="Repeat password*"
					placeholder="Repeat the new password"
					required
					invalid={passwordsDontMatch}
					invalidText="Passwords do not match"
					minlength={6}
				/>
			</Column>
		</Row>
		<Row>
			<Column>
				<Button type="submit">Submit</Button>
			</Column>
		</Row>
		{#if showError}
			Something went wrong :/ please contact the web administrators.
		{/if}
	</Grid>
</Form>
