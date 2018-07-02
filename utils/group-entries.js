import { getPrNumber } from './get-pr-number.js';

export default unsorted => unsorted.reduce((entries, entry) => {
    const key = getPrNumber(entry.description);
    // Ignore entries where I didn't provide a "#1234" in the description
    if (key === null) return entries;
    const currentEntry = entries[key];
    if (!currentEntry) {
        return {
            ...entries,
            [key]: {
                pr: key,
                prNumber: parseInt(key.substring(1)),
                description: entry.description,
                totalDuration: entry.dur,
                entries: [entry],
            },
        };
    }
    return {
        ...entries,
        [key]: {
            ...currentEntry,
            totalDuration: currentEntry.totalDuration + entry.dur,
            entries: [
                ...currentEntry.entries,
                entry,
            ],
        },
    };
}, {});
