<script lang="ts">
	export let img_src: string
	export let title: string
	export let color: string
</script>

<div class="introduction-card-wrapper">
	<div class="introduction-card no-hover {color}">
		<!-- onerror hack to show the default picture when a file cannot be found because it does not exist -->
		<img
			class="introduction-img"
			src={img_src}
			width="100%"
			alt="Portrait"
			onerror="this.src='committeePhotos/unknown.png';"
		/>
		<p class="introduction-title">{title}</p>
		<slot />
	</div>
</div>

<style>
	.introduction-card-wrapper {
		margin: auto;
		width: 320px;
		margin-bottom: 40px;
		margin-top: 0px;
	}

	.introduction-card {
		padding: 10px;
		width: 100%;
		border: 2px;
		border-style: solid;
		border-radius: 18px;
	}

	.introduction-img {
		border-radius: 12px;
	}

	.introduction-title {
		font-size: 20pt;
		padding-top: 10px;
	}

	.no-hover:hover {
		cursor: default;
	}

	.red {
		border-color: #ff0000;
	}

	.green {
		border-color: #00ff00;
	}

	.blue {
		border-color: #0000ff;
	}
</style>
