<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { song } from '$lib/types/domain/song'
	import { Grid, Row, Column, TextInput, Button, Form, TextArea, ToastNotification } from 'carbon-components-svelte'
	import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'


    let title: string
    let artist: string
    let genre: string
    let link: string
    let note: string
    let validLink: boolean = true

    export let toasts: string[] = []

    async function AddSuggestion() { // TODO: Show error if failed

        if (!isValidUrl(link)) {
            validLink = false
            return
        }

        let song: song = {
            name: title,
            artist,
            length: "0", // TODO: Maybe do something with this
            link,
            genre,
            note,
            suggestionDate: Timestamp.now(),
            user: "Test" // TODO: Link current user
        }

        const newSong = doc(collection(db, "songs"))

        toasts.push(title)
        toasts = toasts

        await setDoc(newSong, song)

        title=""
        artist=""
        genre=""
        link=""
        note=""
    }

    const isValidUrl = (urlString: string) => {
        var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	  return !!urlPattern.test(urlString);
    }

</script>

{#each toasts as toast, i} <!-- TODO: Toasts are badly implemented -->
    <ToastNotification
        lowContrast
        timeout={5000}
        kind="success"
        title="Success"
        subtitle="Nummer toegevoegd:"
        caption={toast}
        on:close={(e) =>{
            toasts = toasts.splice(i, 1)
        }}
    />
{/each}

<Form on:submit={(e) => {
    e.preventDefault()
    AddSuggestion()
    
    }}>
    <Grid padding> <!-- TODO: scuffed on mobile -->
        <Row>
            <Column><h1>Suggestie toevoegen</h1></Column>
        </Row>
        <Row>
            <Column>
                <TextInput bind:value={title} labelText="Titel*" placeholder="Voer titel in" required/>
            </Column>
            <Column>
                <TextInput bind:value={artist} labelText="Artiest*" placeholder="Voer artiest in" required/>
            </Column>
            <Column>
                <TextInput bind:value={genre} labelText="Genre*" placeholder="Voer genre in" required/>
            </Column>
            <Column>
                {#if validLink}
                    <TextInput bind:value={link} labelText="Link*" placeholder="Voer link in" required/>
                {:else}
                    <TextInput bind:value={link} labelText="Link*" placeholder="Voer link in" required invalid invalidText="Voer een geldige link in"/>
                {/if}
            </Column>
        </Row>
        <Row>
            <Column>
                <TextArea bind:value={note} labelText="Opmerkingen" placeholder="Ruimte voor opmerkingen" maxCount={255}/>
            </Column>
        </Row>
        <Row>
            <Column>
                * is vereist
            </Column>
        </Row>
        <Row>
            <Column>
                <Button type="submit">Insturen</Button>
            </Column>
        </Row>
    </Grid>
</Form>

<style>
    :global(.textinput-column) {
        max-width: 300px;
    }
</style>