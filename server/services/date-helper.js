let moment = require('moment');

module.exports.compareDates = function(date1, date2) {
    let isoDateString1 = moment(date1).toISOString();
    let isoDateString2 = moment(date2).toISOString();
    let momentDate1 = moment(isoDateString1);
    let momentDate2 = moment(isoDateString2);
    if (momentDate1.isSame(momentDate2)) {
        return 0;
    } else if (momentDate1.isBefore(momentDate2)) {
        return -1;
    } else if (momentDate1.isAfter(momentDate2)) {
        return 1;
    }
};
