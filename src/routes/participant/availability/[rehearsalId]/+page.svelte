<script lang="ts">
	import type { availability } from '$lib/types/domain/availability'
	import type { rehearsal } from '$lib/types/domain/rehearsal'

	export let data: { rehearsal: rehearsal; availability: availability }
</script>

{data.availability.available}
