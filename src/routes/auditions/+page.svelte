<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        goto('https://docs.google.com/forms/d/e/1FAIpQLScEYMh_8NQjmhXgH652kz7H8GZ98nTbTpPfRLGJAW7HiWRBng/viewform?usp=sf_link');
    });
</script>