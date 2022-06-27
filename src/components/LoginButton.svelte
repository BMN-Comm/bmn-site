<script lang="ts">
	import {
		Button,
		FluidForm,
		InlineLoading,
		InlineNotification,
		Modal,
		PasswordInput,
		TextInput
	} from 'carbon-components-svelte'

	import authStore from '../scripts/firebase/authStore'
	import { auth } from '../scripts/firebase/auth'
	import SignoutForUser from './SignoutForUser.svelte'

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
</script>

<!-- The login component which is either loading, a login button, or a signout dropdown -->
<div class="login-wrapper">
	{#if !$authStore.isLoaded}
		<InlineLoading />
	{:else if $authStore.isLoggedIn}
		<SignoutForUser user={$authStore.user} />
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
			subtitle="De combinatie van email en wachtwoord klopt niet."
			on:close={() => (loginError = false)}
		/>
	{/if}
</Modal>

<style>
	.login-wrapper {
		margin-left: auto;
	}
</style>
