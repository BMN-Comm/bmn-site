<!-- Homepage -->
<script>
    import {Button, Column, Grid, Row} from 'carbon-components-svelte'
	import { onMount } from 'svelte'
    import { page } from '$app/stores'
    import {Edit, MusicRemove, Save} from "carbon-icons-svelte";
    import fs from 'fs'
    import path from 'path'
    import {goto} from "$app/navigation";

	// Importing carousel in a tragic way because the
	// author forgot that typescript is superior...
	// He forgor 💀

    let watBMN_NL = ''
    let watBMN_EN = ''

    let editingNL = false
    let editingEN = false

    /** @type {any} **/
	let Carousel
	onMount(async () => {
		const module = await import('svelte-carousel')
		Carousel = module.default

        const resp1 = await fetch('/text/frontpage/watBMN_NL.txt')
        watBMN_NL = await resp1.text()
        const resp2 = await fetch('/text/frontpage/watBMN_EN.txt')
        watBMN_EN = await resp2.text()
	})

    function saveFile(dest, text)
    {
        fetch('/api/storage/save_text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filepath: dest,
                content: text,
            }),
        })
            .then((data) => {
                console.log('Success:', data); // Handle the response data
            })
            .catch((error) => {
                console.error('Error:', error); // Handle any errors
            });
    }

    function saveText()
    {
        saveFile('././static/text/frontpage/watBMN_NL.txt', watBMN_NL)
        saveFile('././static/text/frontpage/watBMN_EN.txt', watBMN_EN)
        editingEN = false
        editingNL = false
        goto('/')
    }

	// Add carousel photos here
    // Foto1 en Foto4 awaiting approval van gefotografeerden
	const carouselPhotos = ['foto2.jpg', 'foto3.jpg', 'foto5.jpg', 'foto6.jpg']
</script>

<content>
	<svelte:component this={Carousel} autoplay>
		{#each carouselPhotos as foto}
			<div class="carouselDiv">
				<img class="BMNLogoCarousel" src="BMN2024.png" alt="BMNLogo" />
				<img class="carouselPhoto" src="carouselPhotos/{foto}" alt={foto} />
			</div>
		{/each}
	</svelte:component>

	<div class="watBMN" id="watBMN_NL">
		<h1>Wat is de Bèta Music Night? {#if $page.data.user?.commissie}<Button
            kind="primary"
            size="small"
            iconDescription="Edit"
            icon={Edit}
            on:click={() => {
								editingNL = !editingNL
							}}
            />{/if}</h1>
        <p>{#if editingNL}
            <textarea id="editNL" bind:value={watBMN_NL} rows=30 cols=80 /><br>
            <Button
                kind="primary"
                size="small"
                iconDescription="Save"
                icon={Save}
                on:click={saveText}
            />
        {:else}{@html watBMN_NL}{/if}</p>
    </div>

	<div class="watBMN" id="watBMN_EN">
		<h1>What is the Bèta Music Night? {#if $page.data.user?.commissie}<Button
                kind="primary"
                size="small"
                iconDescription="Edit"
                icon={Edit}
                on:click={() => {
								editingEN = !editingEN
							}}
        />{/if}</h1>
        <p>{#if editingEN}
            <textarea id="editEN" bind:value={watBMN_EN} rows=30 cols=80 /><br>
            <Button
                    kind="primary"
                    size="small"
                    iconDescription="Save"
                    icon={Save}
                    on:click={saveText}
            />
            {:else}{@html watBMN_EN}{/if}</p>
	</div>

	<Grid class="sponsors" padding>
		<Row>
			<Column>
				<a href="https://www.dehelling.nl/" target="blank">
					<img class="sponsorImg" src="sponsors/de-helling.png" alt="DeHelling" />
				</a>
			</Column>
			<Column>
				<a href="https://www.uu.nl/organisatie/alumni/utrechts-universiteitsfonds" target="blank">
					<img class="sponsorImg" src="sponsors/u-fonds.jpg" alt="UFonds" />
				</a>
			</Column>
			<Column>
				<a href="https://www.a-eskwadraat.nl/Home" target="blank">
					<img class="sponsorImg" src="sponsors/a-eslogo.png" alt="A-eskwadraat" />
				</a>
			</Column>
		</Row>
	</Grid>

	<div class="footer">
		<h1>© Bèta Music Night 2024</h1>
		<a href="mailto:bmn@a-eskwadraat.nl">Contact</a>
	</div>
</content>

<style>
	.carouselPhoto {
		width: 100%;
		background-size: contain;
		background-repeat: no-repeat;
	}
	.carouselDiv {
		width: 100%;
		max-height: calc(100vh - 48px);
	}
	.BMNLogoCarousel {
		width: 25%;
		display: block;
		margin-left: 37.5%;
		margin-right: 37.5%;
		top: 70%;
		opacity: 0.5;
		position: fixed;
	}
	.watBMN {
		margin: 2% 25%;
		text-align: center;
	}

	.watBMN p {
		margin-top: 20px;
	}

	.sponsorImg {
		width: auto;
		height: 10vh;
		margin: auto;
		display: block;
	}

	.footer {
		text-align: center;
		margin: 2.5%;
	}
</style>
