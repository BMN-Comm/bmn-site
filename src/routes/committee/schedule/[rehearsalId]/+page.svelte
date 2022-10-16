<script lang="ts">
	import { db } from "$lib/firebase/client/firebase"
	import type { rehearsal, rehearsalSong } from "$lib/types/domain/rehearsal"
	import type { song } from "$lib/types/domain/song"
	import { Button, Column, ComboBox, DatePicker, DatePickerInput, Dropdown, Form, Grid, Modal, Row, StructuredList, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow, TextInput, TimePicker, TooltipDefinition } from "carbon-components-svelte"
	import type { DropdownItem } from "carbon-components-svelte/types/Dropdown/Dropdown.svelte"
	import { Add, ShoppingCartPlus, SortAscending } from "carbon-icons-svelte"
	import { collection, doc, setDoc, Timestamp } from "firebase/firestore"
	import { get } from "svelte/store"


	export let data: { rehearsal: rehearsal, rehearsalId: string, rehearsalSongs: rehearsalSong[], songs: song[], musicians: {[songId: string]: [string, string][]}, editionSongs: song[]}

    let openModal = false
    let startTime: string
    let endTime: string
    let songId: string

    let editionSongs: DropdownItem[] = data.editionSongs.map((s) => 
        ({id: s.id, text: s.name}) as DropdownItem
    )

    async function addSong() {
        
        let rehearsalSong: rehearsalSong

		if (!data.editionSongs.some((s: song) => s.id == songId)) return

		let rehearsalDay = data.rehearsal.startTime.toDate()

		rehearsalSong = {
			song: doc(db, 'songs', songId),
			
			startTime: Timestamp.fromDate(new Date(rehearsalDay.getFullYear(), rehearsalDay.getMonth(), rehearsalDay.getDate(), +startTime.split(':')[0], +startTime.split(':')[1])),
			endTime: Timestamp.fromDate(new Date(rehearsalDay.getFullYear(), rehearsalDay.getMonth(), rehearsalDay.getDate(), +endTime.split(':')[0], +endTime.split(':')[1]))
		}

        await setDoc(doc(collection(db, 'rehearsals', data.rehearsalId, 'songsToRehearse')), rehearsalSong!)
        
    }
    
</script>

<Grid>
	<Row padding>
		<Column><h1>Repetities {data.rehearsal.startTime.toDate().toDateString()}</h1></Column>
	</Row>
    <Row>
        <Column>
			<Button iconDescription="Voeg nummer toe" icon={Add} on:click={() => {openModal = true}}/>
        </Column>
    </Row>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>Titel</StructuredListCell>
				<StructuredListCell head>Tijd</StructuredListCell>
				<StructuredListCell head>Bezetting</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
            {#if data.songs != undefined}
                {#each data.songs as song, i}
                    <StructuredListRow>
                        <StructuredListCell>{song.name}</StructuredListCell>
                        <StructuredListCell>{data.rehearsalSongs[i].startTime.toDate().getHours()}:{String(
                                            data.rehearsalSongs[i].startTime.toDate().getMinutes()).padStart(2, '0')} - 
                                            {data.rehearsalSongs[i].endTime.toDate().getHours()}:{String(
                                            data.rehearsalSongs[i].endTime.toDate().getMinutes()).padStart(2, '0')}
                        </StructuredListCell>
                        <StructuredListCell>
                            {#each Object.entries(data.musicians) as [key, value]}
                                {#if key == song.id}
                                    {#each value as musician}
                                        {musician[0]} - {musician[1]}<br>
                                    {/each}
                                {/if}
                            {/each}
                        </StructuredListCell>
                    </StructuredListRow>
                {/each}
            {/if}
		</StructuredListBody>
	</StructuredList>
</Grid>

<Modal 
	bind:open={openModal}
	modalHeading="Kies nummer"
	primaryButtonIcon={Add}
	primaryButtonText="Voeg toe"
	hasScrollingContent
	hasForm
	on:submit={(e) => {
		e.preventDefault()
		addSong()
	}}
>
	<Form>
		<Grid>
			<Row padding>
				<Column>
					<ComboBox
                        titleText="Nummer"
                        items={editionSongs}
                        bind:selectedId={songId}
                        required
                    />
				</Column>
			</Row>
			<Row>
				<Column>
					<TimePicker
						labelText="Van"
						bind:value={startTime}
						required
					/>
				</Column>
				<Column>
					<TimePicker
						labelText="Tot"
						bind:value={endTime}
						required
					/>
				</Column>
			</Row>
		</Grid>
	</Form>
</Modal>