import { alert, confirm, prompt, login, action, inputType }  from "tns-core-modules/ui/dialogs";

export const homeGridChildLandscape = {
    logoSec:    { row: "0", col: "0", rowSpan: "2" },
    userSec:    { row: "0", col: "1", rowSpan: "2" },
    titleSec:   { row: "0", col: "2", colSpan: "1" },
    logSec:     { row: "1", col: "2", rowSpan: "2", colSpan: "1" },
    btnSec:     { row: "3", col: "0", colSpan: "2" },
};

export const homeGridChildPortrait = {
    logoSec: { row: "0", col: "0", rowSpan: "1" },
    userSec: { row: "0", col: "1", rowSpan: "1" },
    titleSec: { row: "1", col: "0", colSpan: "2" },
    logSec: { row: "2", col: "0", rowSpan: "2", colSpan: "2" },
    btnSec: { row: "3", col: "0", colSpan: "2" },
};

export const newGridChildLandscape = {
    q1: { row: "0", col: "0", },
    a1: { row: "0", col: "1", },
    q2: { row: "1", col: "0", },
    a2: { row: "1", col: "1", },
    q3: { row: "2", col: "0", },
    a3: { row: "2", col: "1", },
    q4: { row: "3", col: "0", },
    a4: { row: "3", col: "1", },
};

export const newGridChildPortrait = {
    q1: { row: "0", col: "0", },
    a1: { row: "1", col: "0", },
    q2: { row: "2", col: "0", },
    a2: { row: "3", col: "0", },
    q3: { row: "4", col: "0", },
    a3: { row: "5", col: "0", },
    q4: { row: "6", col: "0", },
    a4: { row: "7", col: "0", },
};

export const editGridChildLandscape = {
    q1: { row: "0", col: "0", },
    a1: { row: "0", col: "1", },
    q2: { row: "1", col: "0", },
    a2: { row: "1", col: "1", },
    q3: { row: "2", col: "0", },
    a3: { row: "2", col: "1", },
    q4: { row: "3", col: "0", },
    a4: { row: "3", col: "1", },
    q5: { row: "4", col: "0", },
    a5: { row: "4", col: "1", },
};

export const editGridChildPortrait = {
    q1: { row: "0", col: "0", },
    a1: { row: "1", col: "0", },
    q2: { row: "2", col: "0", },
    a2: { row: "3", col: "0", },
    q3: { row: "4", col: "0", },
    a3: { row: "5", col: "0", },
    q4: { row: "6", col: "0", },
    a4: { row: "7", col: "0", },
    q5: { row: "8", col: "0", },
    a5: { row: "9", col: "0", },
};

export const userColors = ['#7ca8ea', '#a57ed7', '#dc9078', '#3956a0', '#007c7c'];

export const dialogLogDelete = async (id) => {
    let willDelete = false;
    await confirm({
        title: "Attention",
        message: "Confirm you want to delete this patient log?",
        okButtonText: "Yes",
        cancelButtonText: "Cancel"
    }).then(isConfirmed => {
        willDelete = isConfirmed;
        if (isConfirmed) {
            console.log("=== Delete patient === " + id);
        }
    });
    return willDelete;
    // alert({
    //     title: "Attention",
    //     message: "Confirm you want to delete this patient log?",
    //     okButtonText: "OK"
    // });
};

export const dialogConsent = () => {
    alert({
        title: "Attention",
        message: "Please agree to the terms first.",
        okButtonText: "OK"
    });
};

export const logMonths = (month_unformatted) => {
    const month_num =  parseInt(month_unformatted);
    let month_formated = '';
    const month_titles = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return month_titles[month_num];
};

export const formatPhoneNum = (phone_unformatted) => {
    let formatted_input = '';
    const input = phone_unformatted;
    const len = phone_unformatted.length;
    if (len > 2) {
        const area_code = input.substring(0, Math.min(3, input.length));
        const first_part = input.substring(3, Math.min(6, input.length));
        const second_part = input.substring(6, Math.min(9, input.length));
        const hasSecond = second_part != '';
        formatted_input = hasSecond ? `(${area_code}) ${first_part}-${second_part}` : `(${area_code}) ${first_part}`;
    }
    return formatted_input;
};

export const formatPhoneForDisplay = (input) => {
    return `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, input.length)}`;
};

export const formatShiftTime = (input) => {
    console.log(" input ====" + input)
    const millitary = input.toString().split(" ");
    const time = millitary[4];
    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];
    const suffix = hours >= 12 ? "PM":"AM"; 
    return `${((hours + 11) % 12 + 1)}:${minutes}${suffix}`; 
};