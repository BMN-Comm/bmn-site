import { invalidateAll } from "$app/navigation"
import { db } from "$lib/firebase/client/firebase"
import type { NewAvailability } from "$lib/types/domain/availability"
import type { Rehearsal } from "$lib/types/domain/rehearsal"
import { newTimeOnDay } from "$lib/util/date"
import { isValidTimeString } from "$lib/util/timeInputValidation"
import { getTimeString } from "$lib/util/timeString"
import { doc, collection, setDoc, Timestamp } from "firebase/firestore"

type SubmitAvailabilityData = {
    id?: string, // Undefined if this is there is no previous availability data
    startTimeString: string,
    endTimeString: string,
    isAvailable: boolean,
    remark?: string
}

type SubmitAvailabilityResponse = {
    isSuccess: true
} | { isSuccess: false, startTimeInvalid: boolean, endTimeInvalid: boolean }

/**
 * Submit or update the availability in the database.
 * @returns `true` if the mutation was successful, `false` otherwise.
 */
export async function saveAvailability(availability: SubmitAvailabilityData, rehearsal: Rehearsal, userId: string): Promise<SubmitAvailabilityResponse> {
    // Time input validation
    let startTimeInvalid = !isValidTimeString(availability.startTimeString)
    let endTimeInvalid = !isValidTimeString(availability.endTimeString)
    if (startTimeInvalid || endTimeInvalid) return { isSuccess: false, startTimeInvalid, endTimeInvalid }

    // If the participant is not available, they are unavailable for the entire rehearsal
    if (!availability.isAvailable) {
        availability.startTimeString = getTimeString(rehearsal.startTime)
        availability.endTimeString = getTimeString(rehearsal.endTime)
    }

    // Check if the availability is within the rehearsal time and if the start time is before the end time
    const rehearsalStart = rehearsal.startTime.toDate()
    const rehearsalEnd = rehearsal.endTime.toDate()

    const start = availability.startTimeString.split(':')
    const end = availability.endTimeString.split(':')

    const availableStart = newTimeOnDay(rehearsalStart, parseInt(start[0]), parseInt(start[1]))
    const availableEnd = newTimeOnDay(rehearsalEnd, parseInt(end[0]), parseInt(end[1]))

    startTimeInvalid =
        rehearsalStart > availableStart ||
        rehearsalEnd < availableStart ||
        availableStart >= availableEnd
    endTimeInvalid =
        rehearsalStart > availableEnd || rehearsalEnd < availableEnd || availableStart >= availableEnd

    if (startTimeInvalid || endTimeInvalid) return { isSuccess: false, startTimeInvalid, endTimeInvalid }

    // Save the availability to the database
    const newAvailibilityDoc: NewAvailability = {
        available: availability.isAvailable,
        rehearsal: doc(db, 'rehearsals/' + rehearsal.id),
        reason: availability.remark,
        startTime: Timestamp.fromDate(availableStart),
        endTime: Timestamp.fromDate(availableEnd)
    }

    const availabilityRef =
        availability?.id !== undefined
            ? doc(db, 'users/' + userId + '/availability/' + availability.id)
            : doc(collection(db, 'users/' + userId + '/availability'))

    await setDoc(availabilityRef, newAvailibilityDoc)

    invalidateAll()

    return { isSuccess: true }
}