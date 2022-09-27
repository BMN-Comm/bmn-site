<script lang="ts">
	import { Button, Column, Grid, Modal, Row, StructuredList, StructuredListCell, StructuredListHead, StructuredListRow } from "carbon-components-svelte"
    import type { song } from "$lib/types/domain/song"
	import { Chat, Favorite, MusicRemove, PlayFilledAlt } from "carbon-icons-svelte"
	import { deleteDoc, doc } from "firebase/firestore"
	import { db } from "$lib/firebase/client/firebase"

    export let data: { suggestions: { id: string; song: song }[] }

    let openNote = false
    let openDel = false
    let noteText: string
    let delSong: string
    let selectedSong: number

    function RemoveSuggestion() {
        data.suggestions.splice(selectedSong, 1)
        data = data

        const docRef = doc(db, 'songs', data.suggestions[selectedSong].id)
        deleteDoc(docRef)
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

<Grid>
    <Row>
        <Column><h1 class="titleText">Suggesties</h1></Column>
    </Row>

    <StructuredList>
        <StructuredListHead>
            <StructuredListRow head>
                <StructuredListCell head>Titel</StructuredListCell>
                <StructuredListCell head>Artiest</StructuredListCell>
                <StructuredListCell head>Genre</StructuredListCell>
                <StructuredListCell head>Link</StructuredListCell>
                <StructuredListCell head>Favo</StructuredListCell>
                <StructuredListCell head>Opties</StructuredListCell>
            </StructuredListRow>
        </StructuredListHead>
        {#each data.suggestions as { song }, i}
            <StructuredListRow>
                <StructuredListCell>
                    {song.name}
                </StructuredListCell>
                <StructuredListCell>
                    {song.artist}
                </StructuredListCell>
                <StructuredListCell>
                    {song.genre}
                </StructuredListCell>
                <StructuredListCell>
                    {#if isValidUrl(song.link)}
                        <Button href={song.link} kind="ghost" size="small" iconDescription={song.link} icon={PlayFilledAlt} target="blank"/>
                    {:else}
                        <Button kind="ghost" size="small" iconDescription="Foute link" icon={PlayFilledAlt} disabled />
                    {/if}
                </StructuredListCell>
                <StructuredListCell>
                    <Button kind="danger-tertiary" size="small" iconDescription="Like" icon={Favorite}/>
                </StructuredListCell>
                <StructuredListCell>
                    <Button kind="danger-tertiary" size="small" iconDescription="Delete" icon={MusicRemove} on:click={() => { selectedSong = i; openDel = true }}/>
                    {#if song.note && song.note.length > 0}
                        <Button kind="tertiary" size="small" iconDescription="Opmerkingen" icon={Chat} on:click={() => {noteText = song.note; openNote = true}}/>
                    {/if}
                </StructuredListCell>
            </StructuredListRow>
        {/each}
    </StructuredList>
</Grid>

<Modal passiveModal modalHeading="Opmerking" bind:open={openNote}>
    <p>{noteText}</p>
</Modal>

<Modal danger modalHeading="Verwijder suggestie" primaryButtonText="Verwijder" primaryButtonIcon={MusicRemove} secondaryButtonText="Annuleer" bind:open={openDel}
    on:click:button--primary={() => {RemoveSuggestion(); openDel=false}} 
    on:click:button--secondary={() => {openDel=false}}>
    <p>Verwijder {delSong}?</p>
</Modal>

<style>
    .titleText {
        font-size: x-large;
    }
</style>