//  Load env vars, so that you can access them on process.env
import './load-env.js';
import togglApi from './api/toggl.js';
import groupEntries from './utils/group-entries.js';

(async function () {
    try {
        //  1. Get ALL toggl entries (for Building and CR/testing)
        const TogglApi = togglApi();
        const report = await TogglApi.getAllDetailedReports();
        //  2. Smoosh toggl entries into array of unique entries
        const grouped = groupEntries(report);

        // const done = fs.writeFileSync('./grouped.json', JSON.stringify(grouped, null, 4), 'utf-8');
        // console.log('really done!', done);
    } catch (e) {
        console.error('\nSomething has gone horribly wrong!\n', e.message);
    }
})();
//  3. Grab
//  4.
