//  Load env vars, so that you can access them on process.env
import './load-env.js';
import fs from 'fs';
import moment from 'moment';
import togglApi from './api/toggl.js';
import zenhubApi from './api/zenhub.js';
import calculateAverages from './utils/calculate-averages.js';
import getTimeframe from './utils/get-timeframe.js';
import groupEntries from './utils/group-entries.js';
import groupByEstimate from './utils/group-by-estimate.js';
import writeReport from './utils/write-report.js';


//  Needed because we're rate-limited to 100 reqs/minute
const doZenHubFetches = groupedTickets => new Promise(async (resolve, reject) => {
    const ZenHubApi = zenhubApi();
    const keyedTickets = Object.keys(groupedTickets).reduce((acc, ticket, index) => {
        if (index < 100) {
            const firstHundred = [...acc[0], ticket];
            return [firstHundred, []];
        }
        const nextHundred = [...acc[1], ticket];
        return [acc[0], nextHundred];
    }, [[], []]);
    const doFetch = ticket => ZenHubApi.getEstimateForPr(ticket.prNumber)
                            .then(data => ({
                                ...ticket,
                                estimate: data && data.estimate && data.estimate.value,
                            }))
                            .catch(reject);

    console.log('Fetching first hundred...');
    //  Do the first hundred, then wait a minute, then do the rest
    const firstHundred = await Promise.all(
        keyedTickets[0].map(ticket => doFetch(groupedTickets[ticket]))
    );
    console.log('Got first hundred...');
    const counter = setInterval(() => console.log('Getting closer!'), 10000);
    setTimeout(() => {
        clearInterval(counter);
        console.log('Fetching next hundred...');
        const nextHundred = Promise.all(
            keyedTickets[1].map(ticket => doFetch(groupedTickets[ticket]))
        );
        resolve([
            ...firstHundred,
            ...nextHundred
        ]);
    }, 60001);
// };
});

(async function () {
    try {
        const timeframe = getTimeframe();
        const TogglApi = togglApi(timeframe.since, timeframe.until);
        //  1. Get ALL toggl entries (for Building and CR/testing)
        const togglReport = await TogglApi.getAllDetailedReports();
        //  2. Smoosh toggl entries into array of unique entries
        const groupedTickets = groupEntries(togglReport);
        //  3. Grab the SP estimate for each ticket
        const zenhubData = await doZenHubFetches(groupedTickets);
        //  4. Calculate average time for each estimate
        const averages = calculateAverages(zenhubData.reduce(groupByEstimate, {}));
        //  5. Write report.md file
        writeReport(averages, timeframe);
    } catch (e) {
        console.error('\nSomething has gone horribly wrong!\n', e.message, e);
    }
})();
//  3. Grab
//  4.
