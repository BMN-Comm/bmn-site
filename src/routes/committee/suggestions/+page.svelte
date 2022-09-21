<script lang="ts">
	import { Button, Column, Grid, Modal, ModalHeader, Row, StructuredList, StructuredListCell, StructuredListRow } from "carbon-components-svelte"
    import type { song } from "$lib/types/domain/song"
	import { Chat, Favorite, MusicRemove, PlayFilledAlt, TrashCan } from "carbon-icons-svelte"
	import { DeleteSuggestion } from "./+page"

    export let data: {suggestions: song[]}

    let openNote = false
    let openDel = false
    let noteText = "Test"
    let delSong = "Test"
    let selectedSong:[string, number]

    function RemoveSuggestion(id: string, i: number) {
        data.suggestions.splice(i, 1)
        data = data
        DeleteSuggestion(id)
    }

</script>

<Grid>
    <Row>
        <Column>Suggesties</Column>
    </Row>

    <StructuredList>
        {#each data.suggestions as suggestion, i}
            <StructuredListRow>
                <StructuredListCell>
                    {suggestion.name}
                </StructuredListCell>
                <StructuredListCell>
                    {suggestion.artist}
                </StructuredListCell>
                <StructuredListCell>
                    {suggestion.genre}
                </StructuredListCell>
                <StructuredListCell>
                    <Button href={suggestion.link} kind="ghost" size="small" iconDescription={suggestion.link} icon={PlayFilledAlt} target="blank"/>
                </StructuredListCell>
                <StructuredListCell>
                    <Button kind="danger-tertiary" size="small" iconDescription="Like" icon={Favorite}/>
                </StructuredListCell>
                <StructuredListCell>
                    <Button kind="danger-tertiary" size="small" iconDescription="Delete" icon={MusicRemove} on:click={() => { selectedSong=[suggestion.id, i]; openDel = true }}/>
                    {#if suggestion.note != undefined && suggestion.note.length > 0}
                        <Button kind="tertiary" size="small" iconDescription="Opmerkingen" icon={Chat} on:click={() => {noteText = suggestion.note; openNote = true}}/>
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
    on:click:button--primary={() => {RemoveSuggestion(selectedSong[0], selectedSong[1]); openDel=false}} 
    on:click:button--secondary={() => {openDel=false}}>
    <p>Verwijder {delSong}?</p>
</Modal>