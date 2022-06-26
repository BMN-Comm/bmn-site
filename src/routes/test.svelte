<script>
	import { onMount } from 'svelte';
	import { getDocs, snapshotEqual } from 'firebase/firestore/lite';
	import { songDoc, songsDocs } from '../scripts/firebase';
	async function f() {
		var s = songsDocs();
		var headText = document.getElementById('HeaderText');
		const snap = await getDocs(s);
		var st = '';
		snap.forEach((doc) => {
			st += doc.get('Name') + '<br>';
		});
		if (headText != null) headText.innerHTML = st;
	}
	onMount(f);
</script>

<svelte:head><h1>Dit is header</h1></svelte:head>

<h1 id="HeaderText">Welcome to test</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
