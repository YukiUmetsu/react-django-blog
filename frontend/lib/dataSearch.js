import matchSorter from "match-sorter";
import Moment from 'moment';
import {extendMoment} from "moment-range";
const moment = extendMoment(Moment);

export const performTextSearch = (givenData, key, value, searchType = 'match') => {
    if(searchType === 'equal'){
        return matchSorter(givenData, value, {keys: [key], threshold: matchSorter.rankings.CONTAINS});
    }
    return matchSorter(givenData, value, {keys: [key]})
};

export const performDateRangeSearch = (givenData, key, [dateStart, dateEnd]) => {
    const range = moment.range(
        moment(dateStart).startOf('day'),
        moment(dateEnd).endOf('day')
    );
    return givenData.filter(item => {
        let target = moment(item[key]);
        return target.within(range);
    });
};

export const performYesNoSearch = (givenData, key, value) => {
    return givenData.filter(item => {
        return item[key] === value;
    });
};