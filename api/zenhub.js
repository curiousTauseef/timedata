import ZenHub from 'zenhub-api';
import { ZENHUB_REPO_ID } from '../constants.js';

export default () => {
    const Client = new ZenHub(process.env.ZENHUB_API_TOKEN);
    return {
        getEstimateForPr: prNumber => Client.getIssueData({
            /* eslint-disable camelcase */
            issue_number: prNumber,
            repo_id: ZENHUB_REPO_ID,
            /* eslint-disable camelcase */
        }),
    };
};
