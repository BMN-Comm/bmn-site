<script lang="ts">
	import { Button, Column, Form, Grid, Row, TextInput } from 'carbon-components-svelte'

	let email: string
	let password: string
	let name: string

	/** Add a new user to the database and the auth system */
	async function AddUser() {
		const response = await fetch('/api/admin-portal/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, name })
		})
		if (response.status === 200) window.location.replace('/admin-portal/users')
		else {
			// TODO: Make something more visually pleasing
			alert(response.statusText)
		}
	}
</script>

<Form
	on:submit={(e) => {
		e.preventDefault()
		AddUser()
	}}
>
	<Grid padding>
		<Row>
			<Column>
				<h1>Add new user</h1>
			</Column>
		</Row>
		<Row>
			<Column>
				<TextInput
					bind:value={email}
					type="email"
					labelText="Email"
					placeholder="Enter user email"
					required
				/>
			</Column>
		</Row>
		<Row>
			<Column>
				<TextInput
					bind:value={password}
					labelText="Password"
					placeholder="Enter initial password"
					required
				/>
				<br />
				Make sure you save this password somewhere, and send it to the participant after creating this
				user!
			</Column>
		</Row>
		<Row>
			<Column>
				<TextInput bind:value={name} labelText="Name" placeholder="Enter name of user" required />
			</Column>
		</Row>
		<Row>
			<Column>
				<Button type="submit">Submit</Button>
			</Column>
		</Row>
	</Grid>
</Form>
