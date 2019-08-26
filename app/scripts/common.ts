import { alert, confirm, prompt, login, action, inputType }  from "tns-core-modules/ui/dialogs";

/**
 *  Variable to hold landscape grid settings of Dashboard page
 *  Description - used in GridLayout children
 * **/
export const homeGridChildLandscape = {
    logoSec: { row: "0", col: "0" },
    userSec: { row: "0", col: "2" },
    unionSec: { row: "0", col: "1"},
    titleSec: { row: "1", col: "0"},
    logSec: { row: "2", col: "0", rowSpan: "2", colSpan: "3" },
    btnSec: { row: "3", col: "0", colSpan: "3" },
};

/**
 *  Variable to hold portrait grid settings of Dashboard page
 *  Description - used in GridLayout children
 * **/
export const homeGridChildPortrait = {
    logoSec: { row: "0", col: "0" },
    userSec: { row: "0", col: "2" },
    unionSec: { row: "0", col: "1"},
    titleSec: { row: "1", col: "0"},
    logSec: { row: "2", col: "0", rowSpan: "2", colSpan: "3" },
    btnSec: { row: "3", col: "0", colSpan: "3" },
};

/**
 *  Variable to hold landscape grid settings of NewClient page
 *  Description - used in GridLayout children
 * **/
export const newGridChildLandscape = {
    q1: { row: "0", col: "0", },
    a1: { row: "0", col: "1", },
    e1: { row: "1", col: "0", colSpan: "2"},
    q2: { row: "2", col: "0", },
    a2: { row: "2", col: "1", },
    e2: { row: "3", col: "0", colSpan: "2"},
    q3: { row: "4", col: "0", },
    a3: { row: "4", col: "1", },
    e3: { row: "5", col: "0", colSpan: "2"},
    q4: { row: "6", col: "0", },
    a4: { row: "6", col: "1", },
    e4: { row: "7", col: "0", colSpan: "2"},
};

/**
 *  Variable to hold portrait grid settings of NewClient page
 *  Description - used in GridLayout children
 * **/
export const newGridChildPortrait = {
    q1: { row: "0", col: "0", },
    a1: { row: "1", col: "0", },
    e1: { row: "2", col: "0", colSpan: "1"},
    q2: { row: "3", col: "0", },
    a2: { row: "4", col: "0", },
    e2: { row: "5", col: "0", colSpan: "1"},
    q3: { row: "6", col: "0", },
    a3: { row: "7", col: "0", },
    e3: { row: "8", col: "0", colSpan: "1"},
    q4: { row: "9", col: "0", },
    a4: { row: "10", col: "0", },
    e4: { row: "11", col: "0", colSpan: "1"},
};

/**
 *  Variable to hold landscape grid settings of EditClient
 *  Description - used in GridLayout children
 * **/
export const editGridChildLandscape = {
    q1: { row: "0", col: "0", },
    a1: { row: "0", col: "1", },
    e1: { row: "1", col: "0", colSpan: "2"},
    q2: { row: "2", col: "0", },
    a2: { row: "2", col: "1", },
    e2: { row: "3", col: "0", colSpan: "2"},
    q3: { row: "4", col: "0", },
    a3: { row: "4", col: "1", },
    e3: { row: "5", col: "0", colSpan: "2"},
    q4: { row: "6", col: "0", },
    a4: { row: "6", col: "1", },
    e4: { row: "7", col: "0", colSpan: "2"},
    q5: { row: "8", col: "0", },
    a5: { row: "8", col: "1", },
    e5: { row: "9", col: "0", colSpan: "2"},
};

/**
 *  Variable to hold portrait grid settings of EditClient
 *  Description - used in GridLayout children
 * **/
export const editGridChildPortrait = {
    q1: { row: "0", col: "0", },
    a1: { row: "1", col: "0", },
    e1: { row: "2", col: "0", colSpan: "1"},
    q2: { row: "3", col: "0", },
    a2: { row: "4", col: "0", },
    e2: { row: "5", col: "0", colSpan: "1"},
    q3: { row: "6", col: "0", },
    a3: { row: "7", col: "0", },
    e3: { row: "8", col: "0", colSpan: "1"},
    q4: { row: "9", col: "0", },
    a4: { row: "10", col: "0", },
    e4: { row: "11", col: "0", colSpan: "1"},
    q5: { row: "12", col: "0", },
    a5: { row: "13", col: "0", },
    e5: { row: "14", col: "0", colSpan: "1"},
};

/**
 *  Variable to hold possible colors for nurse user avatar
 *  Description - used in AddUser popup and EditCallInfo popup
 * **/
export const userColors = ['#7ca8ea', '#a57ed7', '#dc9078', '#3956a0', '#007c7c'];

export const dialogConsent = () => {
    alert({
        title: "Confirm Consent",
        message: "The caller must consent to have their call recorded first before continuing.",
        okButtonText: "OK"
    });
};

/**
 *  Function to convert month index to month string
 *  @param {Number} month_unformatted - index of month, e.g. Janurary is 0 
 *  @return {String} - name of month, e.g. Jan
 * **/
export const monthIndexToString = (month_unformatted) => {
    const month_num =  parseInt(month_unformatted);
    let month_formated = '';
    const month_titles = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return month_titles[month_num];
};

/**
 *  Function to convert month string to month index
 *  @param {String} month_unformatted - name of month, e.g. Jan
 *  @return {Number} - index of month, e.g. Janurary is 0
 * **/
export const monthStringToNumber = (month_unformatted) => {
    const month_titles = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const index = month_titles.findIndex(elem => elem === month_unformatted);
    return index;
};

/**
 *  Function to get numbers of days in every month
 *  @param {Number} year - year in XXXX format
 * **/
export const numDaysInMon = (year) => {
    const num_feb = (year % 4 === 0) ? 30 : 29;
    const month_day_nums = [31, num_feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return month_day_nums;
};

/**
 *  Function to format phone number to XXX-XXX-XXXX 
 *  @param {Number} phone_unformatted - phone number in XXXXXXXXXX
 * **/
export const formatPhoneNum = (phone_unformatted) => {
    let formatted_input = phone_unformatted.replace(/\D/g, '');
    const input = phone_unformatted;
    const len = phone_unformatted.length;
    if (len > 2) {
        const area_code = input.substring(0, Math.min(3, input.length));
        const first_part = input.substring(3, Math.min(6, input.length));
        const second_part = input.substring(6, Math.min(10, input.length));
        const hasSecond = second_part != '';
        formatted_input = hasSecond ? `(${area_code}) ${first_part}-${second_part}` : `(${area_code}) ${first_part}`;
    }
    return formatted_input;
};

/**
 *  Function to format phone number to XXX-XXX-XXXX 
 *  @param {Number} - phone number in XXXXXXXXXX
 * **/
export const formatPhoneForDisplay = (input) => {
    return `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, input.length)}`;
};

export const formatUsernameForDisplay = (input) => {
    if (input != undefined) {
        const name_segments = input.trim().split(' ');
        const firstname = name_segments[0];
        if (name_segments.length - 1 === 0) {
            return (firstname != '') ? firstname : 'Unknown';
        } else {
            const lastname = name_segments[name_segments.length - 1];
            return `${firstname} ${lastname.substring(0, 1)}.`
        }
    }
};

/**
 *  Function to format time to millitary time
 *  @param {Number} - phone number in XX:XX
 * **/
export const formatShiftTime = (input) => {
    const millitary = input.toString().split(" ");
    const time = millitary[4];
    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];
    return `${hours}:${minutes}`;
};

/**
 *  Function to animate titles
 *  @param {Object} elem - elem to animate
 *  @param {String} new_title -  new title text to add
 * **/
export const animateSubTitle = function(elem, new_title) {
    elem.animate({
        translate: { x: 0, y: -5 },
        duration: 100,
        opacity: 0
    }).then(() => {
        elem.text = new_title;
        return elem.animate({
            translate: { x: 0, y: 5 },
            duration: 0,
            opacity: 0
        })
    }).then(() => {
        return elem.animate({
            translate: { x: 0, y: 0 },
            duration: 100,
            opacity: 1
        })
    });
};