<script lang="ts">
	import type { Availability } from '$lib/types/domain/availability'
	import type { Rehearsal } from '$lib/types/domain/rehearsal'
	import { getTimeString } from '$lib/util/timeString'
	import {
		Modal,
		Grid,
		Row,
		Column,
		TextInput,
		Checkbox,
		TimePicker
	} from 'carbon-components-svelte'
	import { Edit } from 'carbon-icons-svelte'
	import { saveAvailability } from '$lib/components/availability/SaveAvailability'
	
	export let rehearsal: Rehearsal
	export let user: { id: string; name: string }
	export let availability: Availability | undefined = undefined

	export let userSubmitsOwnAvailability: boolean = false

	export let openSetAvailability = false
	export let onClose: () => void

	let setOrUpdate = availability ? 'Update' : 'Set'

	let available = availability?.available ?? true
	let remark: string | undefined = availability?.reason

	let startTimeString: string = getTimeString(availability?.startTime ?? rehearsal.startTime)
	let endTimeString: string = getTimeString(availability?.endTime ?? rehearsal.endTime)
	let startTimeInvalid: boolean = false
	let endTimeInvalid: boolean = false

	async function submitAvailability(): Promise<boolean> {
		const response = await saveAvailability(
			{
				id: availability?.id,
				startTimeString,
				endTimeString,
				isAvailable: available,
				remark
			},
			rehearsal,
			user.id
		)

		if (!response.isSuccess) {
			startTimeInvalid = response.startTimeInvalid
			endTimeInvalid = response.endTimeInvalid
		}

		return response.isSuccess
	}

	function toggleAvailable() {
		available = !available
		if (!available) {
			startTimeString = getTimeString(rehearsal.startTime)
			endTimeString = getTimeString(rehearsal.endTime)
		}
	}
</script>

<Modal
	modalHeading={`${setOrUpdate} availability`}
	bind:open={openSetAvailability}
	primaryButtonText="Submit"
	primaryButtonIcon={Edit}
	secondaryButtonText="Cancel"
	on:click:button--primary={async () => {
		const success = await submitAvailability()
		openSetAvailability = !success
	}}
	on:click:button--secondary={() => {
		openSetAvailability = false
	}}
	on:close={() => onClose()}
>
	<Grid>
		<Row padding>
			<Column>
				{`${setOrUpdate} ${
					userSubmitsOwnAvailability ? user.name + "'s" : 'your'
				} availability for ${rehearsal.startTime.toDate().toDateString()}`}
			</Column>
		</Row>
		<Row padding>
			<Column>
				<TimePicker
					labelText="Start time"
					bind:value={startTimeString}
					disabled={!available}
					required
					invalid={startTimeInvalid}
				/>
			</Column>
			<Column>
				<TimePicker
					labelText="End time"
					bind:value={endTimeString}
					disabled={!available}
					required
					invalid={endTimeInvalid}
				/>
			</Column>
		</Row>
		<Row>
			<Column>
				<Checkbox
					labelText="Not available"
					checked={!available}
					on:change={() => toggleAvailable()}
				/>
			</Column>
		</Row>
		<Row padding>
			<Column>
				<TextInput placeholder="Remark(s)" bind:value={remark} />
			</Column>
		</Row>
	</Grid>
</Modal>

<style>
	/* Make the time picker full width of the column */
	:global(.bx--time-picker__input-field, .bx--time-picker__input, .bx--time-picker) {
		width: 100% !important;
	}
</style>
