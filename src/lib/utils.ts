import type { DateTime } from "luxon";

export type Timestep = {
    type: 'top'|'sub',  // top for full-hours, sub for subdivisions
    hStart: number,     // starting hour
    mStart: number,     // starting minute
    hEnd: number,       // ending hour
    mEnd: number,       // ending minute
    datestamp: DateTime
}

/**
 * Helper to generate steps of time for booking view.
 */
export const makeTimesteps = (baseDate: DateTime) => {
    const hStart = 0;
    const hEnd = 23;
    const hDivisions = 2; // 60 should be cleanly dividable by this

    let output: Timestep[] = [];

    for (let hour = hStart; hour <= hEnd; hour++) {
        for (let minute = 0; minute < 60; minute += (60 / hDivisions)) {
            let thisHEnd = hour;
            let thisMEnd = minute + (60 / hDivisions);

            if(thisMEnd >= 60) {
                thisHEnd += 1;
                thisMEnd = 0;
            }


            output.push({
                type: minute == 0 ? 'top' : 'sub',
                hStart: hour,
                mStart: minute,
                hEnd: thisHEnd,
                mEnd: thisMEnd,
                datestamp: baseDate.set({ hour, minute })
            })
        
        }
    }

    return output;
}