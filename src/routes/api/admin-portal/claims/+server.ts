/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeUserClaim, setUserClaim } from '$lib/firebase/server/firebase'
import type { RequestHandler } from '@sveltejs/kit'

/** Set the given claim for the given user */
export const POST: RequestHandler = async ({ request }) => {
	const { id, claim }: { id: string; claim: string } = await request.json()

	try {
		await setUserClaim(id, claim)

		return new Response(undefined, { status: 200 })
	} catch (e: any) {
		return new Response(undefined, { status: 500, headers: { error: e.message } })
	}
}

/** Removed the given claim for the given user */
export const DELETE: RequestHandler = async ({ request }) => {
	const { id, claim }: { id: string; claim: string } = await request.json()

	try {
		await removeUserClaim(id, claim)

		return new Response(undefined, { status: 200 })
	} catch (e: any) {
		return new Response(undefined, { status: 500, headers: { error: e.message } })
	}
}
