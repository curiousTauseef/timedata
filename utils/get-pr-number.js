export const parsePrNumber = (str = '') => /#\d+/g.exec(str);

export const getPrNumber = (str = '') => {
    const pr = parsePrNumber(str);
    return (pr && pr[0]) || null;
};
