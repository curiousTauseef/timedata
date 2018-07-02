export default milliseconds => {
    let h;
    let m;
    let s;
    s = Math.floor(milliseconds / 1000);
    m = Math.floor(s / 60);
    s %= 60;
    h = Math.floor(m / 60);
    m %= 60;
    h %= 24;
    return `${h}:${m}:${s}`;
};
