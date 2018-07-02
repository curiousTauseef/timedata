import millisecondsToReadable from './milliseconds-to-readable.js';

export default estimates => Object.keys(estimates).map(key => {
    const total = estimates[key].reduce((acc, ticket) => acc + ticket.totalDuration, 0);
    const numberOfTickets = estimates[key].length;
    const average = Math.floor(total / numberOfTickets);
    return {
        sp: key,
        average,
        readableAverage: millisecondsToReadable(average),
        numberOfTickets,
        total,
    };
});
