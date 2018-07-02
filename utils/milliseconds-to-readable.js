export default milliseconds => {
    let h, m, s;
    s = Math.floor(milliseconds / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    h = h % 24;
    return `${h}:${m}:${s}`;
};
