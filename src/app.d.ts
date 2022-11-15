/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare namespace App {
	interface Locals {
		userid: string
		decodedToken: import('firebase-admin/lib/auth/token-verifier').DecodedIdToken | null
		session: {
			user: import('./lib/types/myUserSession').MyUserInfo | undefined
		}
	}
	// interface Platform {}

	interface PageData {
		user: import('./lib/types/myUserSession').MyUserInfo | undefined
	}
}

declare module 'svelte-carousel'
