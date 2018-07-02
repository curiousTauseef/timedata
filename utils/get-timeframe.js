import moment from 'moment';

export default () => ({
    since: moment().subtract(1, 'y').format(),
    until: moment().format(),
})
