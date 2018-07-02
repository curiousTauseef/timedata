export default (tickets, ticket) => {
    if (!tickets[ticket.estimate]) {
        return {
            ...tickets,
            [ticket.estimate]: [ticket]
        };
    }
    return {
        ...tickets,
        [ticket.estimate]: [
            ...tickets[ticket.estimate],
            ticket,
        ],
    };
};
