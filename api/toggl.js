// import moment from 'moment';
import Toggl from 'toggl-api';
import { TOGGL_WORKSPACE_ID, TOGGL_PROJECT_IDS } from '../constants.js';

export default (since, until) => {
    const Client = new Toggl({ apiToken: process.env.TOGGL_API_TOKEN });
    const baseConfig = {
        /* eslint-disable camelcase */
        workspace_id: TOGGL_WORKSPACE_ID,
        user_agent: 'dave-lunny__personal-script',
        without_description: false,
        since,
        until,
        // since: moment().subtract(1, 'y').format(),
        // until: moment().format(),
        project_ids: [
            TOGGL_PROJECT_IDS.BUILDING,
            TOGGL_PROJECT_IDS.FIXING_CR,
        ].toString(),
        /* eslint-enable camelcase */
    };
    const getDetailedReport = (page = 0) => new Promise((resolve, reject) => {
        const config = {
            ...baseConfig,
            page,
        };
        Client.detailedReport(config, (error, data) => {
            if (error) return reject(error);
            return resolve(data);
        });
    });
    return {
        getDetailedReport,
        getAllDetailedReports: () => new Promise((resolve, reject) => {
            let page = 0;
            let totalCount = 0;
            let results = [];
            const fetchReport = async () => {
                console.log(`Fetching page ${page + 1}...`);
                try {
                    const reportData = await getDetailedReport(page);
                    if (totalCount === 0) totalCount = reportData.total_count;
                    page += 1;
                    results = [
                        ...results,
                        ...reportData.data,
                    ];
                    if (results.length < totalCount) {
                        return fetchReport();
                    }
                    console.log('We done!');
                    return resolve(results);
                } catch (e) {
                    return reject(e);
                }
            };
            return fetchReport();
        }),
    };
};
