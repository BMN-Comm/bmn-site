/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUser, removeUser } from '$lib/firebase/server/firebase'
import type { RequestHandler } from '@sveltejs/kit'

/** Create a new user */
export const POST: RequestHandler = async ({ request }) => {
	const { name, password, email }: { name: string; password: string; email: string } =
		await request.json()

	try {
		await createUser(name, password, email)

		return new Response(undefined, { status: 200 })
	} catch (e: any) {
		return new Response(undefined, { status: 500, headers: { error: e.message } })
	}
}

/** Remove the given user */
export const DELETE: RequestHandler = async ({ request }) => {
	const { dbUid, authUid }: { dbUid: string; authUid: string } = await request.json()

	try {
		await removeUser(dbUid, authUid)

		return new Response(undefined, { status: 200 })
	} catch (e: any) {
		return new Response(undefined, { status: 500, headers: { error: e.message } })
	}
}
