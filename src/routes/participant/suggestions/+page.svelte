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

    export let toasts: string[] = []

    async function AddSuggestion() {
        let song: song = {
            name: title,
            artist: artist,
            length: "0",
            link: link,
            genre: genre,
            note: note,
            suggestionDate: Timestamp.now(),
            user: "Test"
        }

        const newSong = doc(collection(db, "songs"))

        toasts.push(title)
        toasts = toasts

        console.log(toasts)

        await setDoc(newSong, song)
    }
</script>

{#each toasts as toast, i}
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
    console.log("Clicked")
    e.preventDefault()
    AddSuggestion()
    title=""
    artist=""
    genre=""
    link=""
    note=""
    }}>
    <Grid padding>
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
                <TextInput bind:value={link} labelText="Link*" placeholder="Voer link in" required/>
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