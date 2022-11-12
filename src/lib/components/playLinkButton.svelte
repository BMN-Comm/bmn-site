<script lang="ts">
	import { isValidUrl } from '$lib/util/urlValidation'

	import { Button } from 'carbon-components-svelte'
	import { PlayFilledAlt } from 'carbon-icons-svelte'
	export let url: string

	const validUrl = isValidUrl(url)
</script>

<Button
	href={validUrl ? url : undefined}
	target="blank"
	kind="ghost"
	size="small"
	iconDescription={validUrl ? url : 'Invalid URL'}
	icon={PlayFilledAlt}
	disabled={!validUrl}
/>
