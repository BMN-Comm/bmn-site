<script lang="ts">
	import {
		Button,
		FluidForm,
		InlineNotification,
		Modal,
		PasswordInput,
		TextInput
	} from 'carbon-components-svelte'

	import { auth } from '$lib/firebase/client/firebase'
	import UserDropdown from '$lib/components/userDropdown.svelte'

	let modalOpen = false
	$: loginError = false

	let email: string
	let password: string

	/** Login using the email and password provided by the user*/
	async function LoginWithEmailAndPassword() {
		try {
			await auth.signIn(email, password)
			modalOpen = false
		} catch (_) {
			loginError = true
		}
	}

	import { page } from '$app/stores'
</script>

<!-- The login component which is a login button, or a signout dropdown -->
<div class="login-wrapper">
	{#if $page.data.user}
		<UserDropdown user={$page.data.user} />
	{:else}
		<Button class="login-button" on:click={() => (modalOpen = true)}>Login</Button>
	{/if}
</div>

<!-- The modal used to login the user -->
<Modal
	bind:open={modalOpen}
	modalHeading="Login"
	primaryButtonText="Confirm"
	on:click:button--primary={LoginWithEmailAndPassword}
>
	<FluidForm>
		<TextInput bind:value={email} required type="email" labelText="Email" />
		<PasswordInput
			bind:value={password}
			required
			type="password"
			labelText="Password"
			tooltipPosition="left"
		/>
	</FluidForm>
	{#if loginError}
		<InlineNotification
			subtitle="The email and password combination is incorrect."
			on:close={() => (loginError = false)}
		/>
	{/if}
</Modal>

<style>
	.login-wrapper {
		margin-left: auto;
	}
</style>
