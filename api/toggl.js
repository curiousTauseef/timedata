import moment from 'moment';
import toggl from 'toggl-api';
import { TOGGL_WORKSPACE_ID, TOGGL_PROJECT_IDS } from '../constants.js';

export default () => {
    const Client = new toggl({ apiToken: process.env.TOGGL_API_TOKEN });
    const baseConfig = {
        workspace_id: TOGGL_WORKSPACE_ID,
        user_agent: 'dave-lunny__personal-script',
        without_description: false,
        // since: moment().subtract(1, 'y').format(),
        //  Make testing easier by only jumping back 2 months
        since: moment().subtract(2, 'month').format(),
        until: moment().format(),
        project_ids: [
            TOGGL_PROJECT_IDS.BUILDING,
            TOGGL_PROJECT_IDS.FIXING_CR,
        ].toString(),
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
                    page = page + 1;
                    results = [
                        ...results,
                        ...reportData.data
                    ];
                    if (results.length < totalCount) {
                        return fetchReport();
                    }
                    console.log('We done!');
                    resolve(results);
                } catch (e) {
                    return reject(e);
                }
            };
            return fetchReport();
        }),
    };
};
