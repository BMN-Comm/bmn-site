<script lang="ts">
	export let img_src: string
	export let title: string
	export let text: string | undefined = undefined
</script>

<div class="introduction-card">
	<div class="introduction-img-div">
		<!-- onerror hack to show the default picture when a file cannot be found because it does not exist -->
		<img
			class="introduction-img"
			src={img_src}
			width="100%"
			alt="Portrait"
			onerror="this.src='committeePhotos/unknown.png';"
		/>
	</div>
	<p class="introduction-title">{title}</p>
	<p class="introduction-text">
		{#if text}{text}{:else}
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum laoreet nisl, et
			vestibulum metus gravida vitae. Cras in erat venenatis, faucibus sem non, facilisis lacus.
			Donec pharetra quam ac massa dapibus laoreet. Vivamus ut lacus arcu. Pellentesque malesuada
			accumsan velit, nec facilisis est porta eget. Pellentesque aliquam risus id tellus
			pellentesque, vitae fringilla turpis luctus. Suspendisse cursus libero vel odio faucibus,
			ullamcorper iaculis sem varius. Pellentesque blandit ex ligula, id elementum libero commodo
			eget. Maecenas sed nibh odio. Cras id quam maximus justo consectetur scelerisque fermentum
			eget metus. Sed in auctor diam, nec porta massa. Proin consectetur diam orci, in pellentesque
			odio tempus vel. Morbi quis imperdiet turpis. Aliquam.
		{/if}
	</p>
</div>

<style>
	.introduction-card {
		margin: auto;
		margin-bottom: 40px;
		padding: 10px;
		width: 320px;
		height: 850px;
		background-color: var(--committee-colour-2023);
		color: black;
		border-radius: 18px;
	}

	.introduction-img-div {
		width: 100%;
		margin: auto;
		aspect-ratio: 3/4;
	}

	.introduction-img {
		border-radius: 12px;
	}

	.introduction-title {
		font-size: 20pt;
		padding-top: 10px;
	}

	.introduction-text {
		font-size: 10pt;
		padding-top: 10px;
	}
</style>
