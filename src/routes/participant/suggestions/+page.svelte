<script lang="ts">
	import { db } from '$lib/firebase/client/firebase'
	import type { song } from '$lib/types/domain/song'
	import { Grid, Row, Column, TextInput, Button, Form } from 'carbon-components-svelte'
	import { collection, doc, setDoc } from 'firebase/firestore'


    let title: string
    let artist: string
    let genre: string
    let link: string

    async function AddSuggestion() {
        let song: song = {
            name: title,
            artist: artist,
            length: "0",
            link: link,
            genre: genre,
            user: "Test"
        }

        const newSong = doc(collection(db, "songs"))

        await setDoc(newSong, song)
    }
</script>
<Form>
    <Grid padding>
        <Row>
            <Column><h1>Suggestie toevoegen</h1></Column>
        </Row>
        <Row>
            <Column>
                <TextInput bind:value={title} labelText="Titel" placeholder="Voer titel in" required/>
            </Column>
            <Column>
                <TextInput bind:value={artist} labelText="Artiest" placeholder="Voer artiest in" required/>
            </Column>
            <Column>
                <TextInput bind:value={genre} labelText="Genre" placeholder="Voer genre in" required/>
            </Column>
            <Column>
                <TextInput bind:value={link} labelText="Link" placeholder="Voer link in" required/>
            </Column>
        </Row>
        <Row>
            <Column>
                <Button on:click={AddSuggestion}>Insturen</Button>
            </Column>
        </Row>
    </Grid>
</Form>

<style>
    :global(.textinput-column) {
        max-width: 300px;
    }
</style>