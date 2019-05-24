export const homeGridChildLandscape = {
                logoSec: {
                    row: "0",
                    col: "0",
                    rowSpan: "2"
                },
                userSec: {
                    row: "0",
                    col: "1",
                    rowSpan: "2"
                },
                titleSec: {
                    row: "0",
                    col: "2",
                    colSpan: "1"
                },
                logSec: {
                    row: "1",
                    col: "2",
                    rowSpan: "2",
                    colSpan: "1"
                },
                btnSec: {
                    row: "3",
                    col: "0",
                    colSpan: "2"
                }
            };

export const homeGridChildPortrait = {
                logoSec: {
                    row: "0",
                    col: "0",
                    rowSpan: "1"
                },
                userSec: {
                    row: "0",
                    col: "1",
                    rowSpan: "1"
                },
                titleSec: {
                    row: "1",
                    col: "0",
                    colSpan: "2"
                },
                logSec: {
                    row: "2",
                    col: "0",
                    rowSpan: "1",
                    colSpan: "2"
                },
                btnSec: {
                    row: "3",
                    col: "0",
                    colSpan: "2"
                }
            };
            
export const dialogLogDelete = (id) => {
    confirm({
        title: "Attention",
        message: "Confirm you want to delete this patient log?",
        okButtonText: "Yes",
        cancelButtonText: "Cancel"
    }).then(isConfirmed => {
        if (isConfirmed) {
            console.dir("=== Delete patient === " + id);
        }
    });
};

export const dialogConsent = () => {
    alert({
        title: "Attention",
        message: "Please agree to the terms first.",
        okButtonText: "OK"
    }).then(() => {
        console.log("=== Do consent first ===");
    });
};

export const logMonths = (month_unformatted) => {
    const month_num =  parseInt(month_unformatted);
    let month_formated = '';
    const month_titles = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return month_titles[month_num];
};