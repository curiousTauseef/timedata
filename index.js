//  Load env vars, so that you can access them on process.env
import './load-env.js';
import togglApi from './api/toggl.js';
import zenhubApi from './api/zenhub.js';
import calculateAverages from './utils/calculate-averages.js';
import groupEntries from './utils/group-entries.js';
import groupByEstimate from './utils/group-by-estimate.js';

import fs from 'fs';

(async function () {
    try {
        const TogglApi = togglApi();
        const ZenHubApi = zenhubApi();
        //  1. Get ALL toggl entries (for Building and CR/testing)
        const report = await TogglApi.getAllDetailedReports();
        //  2. Smoosh toggl entries into array of unique entries
        const groupedTickets = groupEntries(report);
        //  3. Grab the SP estimate for each ticket
        const keyedTickets = Object.keys(groupedTickets);
        const zenhubPromises = keyedTickets.map(key => ZenHubApi.getEstimateForPr(groupedTickets[key].prNumber));
        const zenhubData = await Promise.all(zenhubPromises);
        //  4. Group all tickets by estimate
        const estimates = keyedTickets.map((key, index) => ({
            ...groupedTickets[key],
            estimate: zenhubData[index].estimate.value,
        })).reduce(groupByEstimate, {});
        //  5. Calculate average time for each estimate
        const averages = calculateAverages(estimates);

        console.log(averages);
        fs.writeFileSync('./output/averages.json', JSON.stringify(averages, null, 4), 'utf8');
        console.log('wrote yr shit!');

    } catch (e) {
        console.error('\nSomething has gone horribly wrong!\n', e.message);
    }
})();
//  3. Grab
//  4.
