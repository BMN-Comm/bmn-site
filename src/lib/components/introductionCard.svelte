<script lang="ts">
	export let img_src: string
	export let title: string
</script>

<div class="introduction-card-wrapper">
	<div class="introduction-card no-hover">
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
        border-color: #644ba0;
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
</style>
