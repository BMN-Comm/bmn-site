/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

i

declare namespace App {
	interface Locals {
		userid: string
		decodedToken: DecodedIdToken | null
		session: {
			user: (UserSession & { databaseId: string; admin: boolean; commissie: boolean }) | undefined
		}
	}
	// interface Platform {}

	interface PageData {
		user: import('./lib/types/myUserSession').MyUserInfo | undefined
	}
}

declare module 'svelte-carousel'
