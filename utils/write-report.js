import fs from 'fs';
import path from 'path';
import moment from 'moment';

const formatter = {
    pretty: time => moment(time).format('MMM Do/YYYY'),
    filename: time => moment(time).format('MM-DD-YYYY'),
};

const getFilename = timeframe => {
    const sinceDate = formatter.filename(timeframe.since);
    const untilDate = formatter.filename(timeframe.until);
    return `report__${sinceDate}_${untilDate}.md`;
};

export default (averages, timeframe) => {
    const sinceDate = formatter.pretty(timeframe.since);
    const untilDate = formatter.pretty(timeframe.until);
    const report = averages.reduce((md, estimate) => {
        if (estimate.sp === 'undefined') return md;
        return `${md}\n- Based on an average of **${estimate.numberOfTickets} tickets**, an **SP${estimate.sp}** takes me **${estimate.readableAverage}**.`;
    }, `### Report\n\n> _Data based on Toggl entries from **${sinceDate}** to **${untilDate}**_\n\nHere's a rundown of how long it takes me on average to complete various story point estimates:\n`);
    const fileName = getFilename(timeframe);
    const filePath = path.resolve(process.cwd(), 'reports', fileName);
    fs.writeFileSync(filePath, report, 'utf8');
    console.log(`Wrote report to /reports/${fileName}`);
};
