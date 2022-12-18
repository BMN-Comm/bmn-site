import { refreshToken } from '$lib/firebase/client/firebase'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async (props) => {
	const redirect = props.url.searchParams.get('redirect')
	await refreshToken(redirect!)
}
