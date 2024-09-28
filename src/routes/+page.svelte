<!-- Homepage -->
<script>
    import { db } from '$lib/firebase/client/firebase'
    import {collection, getDocs, query, orderBy, addDoc, setDoc, doc} from 'firebase/firestore';
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

    let watBMN_NL_ID = ''
    let watBMN_EN_ID = ''

    let editingNL = false
    let editingEN = false

    /** @type {any} **/
	let Carousel
	onMount(async () => {
		const module = await import('svelte-carousel')
		Carousel = module.default

        const q = query(collection(db, 'text'))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            if (doc.data().name === 'watBMN_NL') {
                watBMN_NL = doc.data().content
                watBMN_NL_ID = doc.id
            } else if (doc.data().name === 'watBMN_EN') {
                watBMN_EN = doc.data().content
                watBMN_EN_ID = doc.id
            }
        })
	})

    async function saveText()
    {
        const docRefNL = doc(db, 'text', watBMN_NL_ID)
        const docRefEN = doc(db, 'text', watBMN_EN_ID)
        if (editingNL) {
            await setDoc(docRefNL, {
                name: 'watBMN_NL',
                content: watBMN_NL
            })
        }
        if (editingEN) {
            await setDoc(docRefEN, {
                name: 'watBMN_EN',
                content: watBMN_EN
            })
        }

        editingEN = false
        editingNL = false
        await goto('/')
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
		{#if editingNL}
            <textarea id="editNL" bind:value={watBMN_NL} rows=30 cols=80 />
            <Button
                kind="primary"
                size="small"
                iconDescription="Save"
                icon={Save}
                on:click={saveText}
            />
        {:else}{@html watBMN_NL}{/if}
        {#if $page.data.user?.commissie}<Button
                kind="primary"
                size="small"
                iconDescription="Edit"
                icon={Edit}
                on:click={() => { editingNL = !editingNL }}
        />{/if}
    </div>

	<div class="watBMN" id="watBMN_EN">
        {#if editingEN}
            <textarea id="editEN" bind:value={watBMN_EN} rows=30 cols=80 />
            <Button
                    kind="primary"
                    size="small"
                    iconDescription="Save"
                    icon={Save}
                    on:click={saveText}
            />
            {:else}{@html watBMN_EN}{/if}
            {#if $page.data.user?.commissie}<Button
                    kind="primary"
                    size="small"
                    iconDescription="Edit"
                    icon={Edit}
                    on:click={() => { editingEN = !editingEN }}
            />{/if}
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
		bottom: 0;
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
