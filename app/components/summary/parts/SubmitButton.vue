<template>
    <Button class="form-btn sum-btn submit-btn" :text="submit_text" @tap="onSubmitTap" ></Button>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to generate PDF and to send email
     *  [Description] - used in Summary page
     *  @param {String} submit_text - the text appears on the submit button; will change if status of document change
     *  @param {Boolean} is_resubmit -  the variable records the current status of document
     *  @prop {String} log_id - the id of the current dociment
     *  @prop {Boolean} is_reviewed - the variable records whether this document can be submitted or not
     * 
     *  =============================================================
     * **/
    import Dashboard from '../../home/Dashboard.vue';
    import Reason from '../Reason.vue';

    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    import * as email from "nativescript-email";
    import { confirm, alert }  from "tns-core-modules/ui/dialogs";
    import { monthIndexToString } from '../../../scripts/common';
    import * as base64 from "base-64";
    import * as utf8 from "utf8";

    export default {
        data() {
            return {
                submit_text: 'Submit',
                is_resubmit: false,
            }
        },
        beforeCreate() {
            
        },
        mounted() {
            this.prepareText();
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            is_reviewed: {
                type: Boolean, 
                required: true
            }
        },
        computed: {
            ...mapGetters([
                'users',
                'logs',
                'intro',
                'protocols',
                'assessment_letters'
			])
		},
        methods: {
            ...mapActions([
                'changeChartStatus',
                'changeClientHistory'
            ]),
            /**
             *  Function to prepare the two component-level parameters
             * **/
            prepareText() {
                const status = this.logs.find(elem => { return elem.id === this.log_id; }).status;
                this.submit_text = status ? 'Re-submit' : 'Submit';
                this.is_resubmit = status;
            },
            /**
             *  Function to capture the current date and time
             *  [Description] - in format of XX:XX | DD MMM YYYY
             *  @return {String} dateTime - the current date and time
             * **/
            recordTime() {
                const today = new Date();
                const today_arr = today.toString().split(' ');
                const date = today_arr[2] + ' ' + today_arr[1] + ' ' + today_arr[3];
                const time = today_arr[4].substring(0, 5);
                const dateTime = time + ' | ' + date;
                return dateTime;
            },
            /**
             *  Function to capture the current date and time for generating PDF name
             *  [Description] - in format of YYYY-MM-DD_XXXX
             *  @return {String} dateTime - the current date and time
             * **/
            recordTimeForPDFName() {
                const today = new Date();
                const month = ((today.getMonth() + 1) < 10) ? ('0' + (today.getMonth() + 1)) : ('' + (today.getMonth() + 1));
                const day = (today.getDate() < 10) ? ('0' + today.getDate()) : ('' + today.getDate());
                const date = today.getFullYear() + '-' + month + '-' + day;
                const time = today.toString().split(' ')[4].substring(0, 5).split(":").join("");
                const dateTime =  date + '_' + time;
                console.log("for pdf - " + dateTime);
                return dateTime;
            },
            /**
             *  Function to capture the first and last name for generating PDF name
             *  [Description] - in format of firstname_lastname
             *  @return {String} full_name - the full name of client
             * **/
            recordClientForPDFName(curr_log) {
                const full_name = curr_log.client.split(' ').join('_');
                console.log(curr_log.client)
                return full_name;
            },
            /**
             *  Function to capture the current date and time for generating email name
             *  [Description] - in format of YYYY.MM.DD XX:XX
             *  @return {String} dateTime - the current date and time
             * **/
            recordTimeForEmailName() {
                const today = new Date();
                const month = ((today.getMonth() + 1) < 10) ? ('0' + (today.getMonth() + 1)) : ('' + (today.getMonth() + 1));
                const day = (today.getDate() < 10) ? ('0' + today.getDate()) : ('' + today.getDate());
                const date = today.getFullYear() + '.' + month + '.' + day;
                const time = today.toString().split(' ')[4].substring(0, 5);
                const dateTime =  date + ' ' + time;
                console.log("for email - " + dateTime);
                return dateTime;
            },
            /**
             *  Function to capture full name of client
             *  [Description] - in format of firstname lastname
             *  @return {String} full_name - first and last name of client
             * **/
            recordClientForEmailName(curr_log) {
                const full_name = curr_log.client;
                return full_name;
            },
            /**
             *  Function to generate PDF and send email when button is clicked
             *  [Description] - if the status of the document is already submitted, open modal to ask for reason of modification before submit
             *  [Related] - will call generate PDF is conditions met
             *  @event onClick - let the parent page Summary to know that the buttom is clicked
             * **/
            onSubmitTap() {
                this.$emit("onClick");

                if (this.is_reviewed) { // only proceed if the document is allowed to send
                    if (this.is_resubmit) { // if reason of modification needed
                        this.$showModal(Reason, {
                            fullscreen: false,
                            ios: {
                                presentationStyle: UIModalPresentationStyle.Popover
                            },
                            props: {
                                log_id: this.log_id,
                            }
                        }).then((resp) => { // after reasons being enterred
                            if (resp) {
                                confirm({
                                    title: "Send Document",
                                    message: "This summary will be sent to your email as a PDF for you to upload to PARIS.",
                                    okButtonText: "Send",
                                    cancelButtonText: "Cancel",
                                }).then((result) => {
                                    if (result || result === undefined) {
                                        this.generatePDF();
                                    } 
                                });
                            } 
                        });
                    } else { // if first time trying to send PDF
                        confirm({
                            title: "Send Document",
                            message: "This summary will be sent to your email as a PDF for you to upload to PARIS.",
                            okButtonText: "Send",
                            cancelButtonText: "Cancel",
                        }).then((result) => {
                            if (result || result === undefined) {
                                this.generatePDF();
                            } 
                        });
                    }
                } else { // do not send the document if not allowed
                    console.log("=== Submit === document not reviewed");
                }
            },
            /**
             *  Function to capture the current date and time for generating PDF name
             *  [Description] - in format of YYYY-MM-DD_XXXX
             *  @return {String} dateTime - the current date and time
             * **/
            onEmailSent() {
                this.changeChartStatus(this.log_id);
                this.backToHome();
            },
            /**
             *  Function to close the current page and return to Dashboard
             * **/
            backToHome() {
                this.$navigateTo(Dashboard, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slideBottom',
                        curve: 'easeIn',
                        duration: 300
                    }
                });
            },
            /**
             *  Function to prepare caller info table for PDF
             *  [Description] - caller info is a two columns table
             *      - a column - includes call starts and call ends time
             *      - b column - includes intake date, nurse id and nurse name
             *  @return {Array} info_body - the array with content to feed into the call info table
             * **/
            prepareInfo(curr_log) {
                let info_body = [];
                const nurse_id = curr_log.nurseID;
                const nurse_name = (curr_log.nurseFullname != '') ? curr_log.nurseFullname : "Unknown";
                const start_time = curr_log.startTime;
                const date = curr_log.date;
                const end_time = curr_log.endTime;
                info_body.push({
                    a: `Call Start: ${start_time}\nCall End: ${end_time}`, 
                    b: `Date: ${date}\nIntake Nurse ID: ${nurse_id}\nIntake Nurse Name: ${nurse_name}`,
                });
                return info_body;
            },
            /**
             *  Function to prepare introduction section table for PDF
             *  [Description] - introduction table has two columns
             *      - q column - question column, one question per row
             *      - a column - answer column, group answers for one question in one row
             *  @return {Array} intro_body - the array with content to feed into the introduction table
             * **/
            prepareIntro(curr_log) {
                let intro_body = [];
                this.intro.forEach(step => {
                    step.questions.forEach(q_obj => {
                        const r_obj = curr_log.intro_answers.find(elem => { return elem.q_id === q_obj.id; });
                        const a_obj = (r_obj) ? r_obj.a.join('\n') : 'N/A';
                        intro_body.push( {
                            q: q_obj.question,
                            a: (a_obj.trim() != '') ? a_obj.trim() : 'N/A'
                        });
                    });
                });
                return intro_body;
            },
            /**
             *  Function to prepare names of protocols for PDF
             *  [Description] - display names of all selected protocols as a line of text
             *  @return {String} titles - names of selected protocols
             * **/
            prepareProtocolsSummary(curr_log) {
                let protocol_titles = [];
                this.protocols.forEach(protocol => {
                    const items_idx = curr_log.items_answers.findIndex(elem => protocol.id === elem.id);
                    const others_idx = curr_log.others_answers.findIndex(elem => protocol.id === elem.id);
                    if ( items_idx != -1 || others_idx != -1) {
                        protocol_titles.push(protocol.name);
                    }
                });
                let titles = '';
                protocol_titles.forEach((title, index) => {
                    if (index === 0) {
                        titles = titles + title;
                    } else if (index % 3 === 0) {
                        titles = titles + "\n" + title;
                    } else {
                        titles = titles + ", " + title;
                    }
                });
                titles = (titles === '') ? 'N/A' : titles;
                return titles;
            },
            /**
             *  Function to prepare protocols table for PDF
             *  [Description] - protocols table has three columns. Assessment letters with no question attached will be ignored
             *      - t column - assessment letter or others column, questions with the same tag will be group into one cell in this column
             *      - q column - question column, one question per row
             *      - a column - answer column, group answers for one question in one row
             *  @return {Array} proto_bodies - the array with content to feed into the protocols table
             * **/
            prepareProtocols(curr_log) {
                let protocol_bodies = [];
                const other_title = 'Other';

                this.protocols.forEach(protocol => {
                    const items_idx = curr_log.items_answers.findIndex(elem => protocol.id === elem.id);
                    const others_idx = curr_log.others_answers.findIndex(elem => protocol.id === elem.id);
                    console.log("FLAG IN 1");
                    if ( items_idx != -1 || others_idx != -1) {
                        let items_body = [];
                        let info = [];
                        if (items_idx != -1) {
                            this.assessment_letters.forEach(letter => {
                                let count_letter = 0;
                                const l_objs = protocol.assessment_questions.filter(elem => {return elem.assessment_letter.id === letter.id});
                                if (l_objs) {
                                    l_objs.forEach(q_obj => {
                                        const r_obj = curr_log.items_answers[items_idx].a.find(elem => {return elem.q_id === q_obj.id});
                                        const a_obj = (r_obj) ? r_obj.a.join('\n') : 'N/A';
                                        
                                        items_body.push( {
                                            t: letter.title,
                                            q: q_obj.question,
                                            a: (a_obj.trim() != '') ? a_obj.trim() : 'N/A'
                                        });
                                        count_letter = count_letter + 1;
                                    });
                                    if (count_letter > 0) {
                                        info.push({
                                            t: letter.title,
                                            c: count_letter
                                        });
                                    }
                                }
                                count_letter = 0;
                            });
                        }
                        
                        console.log("FLAG IN 1");
                        
                        if (others_idx != -1) {
                            protocol.additional_questions.forEach(q_obj => {
                                const r_obj = curr_log.others_answers[others_idx].a.find(elem => {return elem.q_id === q_obj.id});
                                const a_obj = (r_obj) ? r_obj.a.join('\n') : 'N/A';
                                items_body.push({
                                    t: other_title,
                                    q: q_obj.question,
                                    a: (a_obj.trim() != '') ? a_obj.trim() : 'N/A'
                                });
                            });
                            info.push({
                                t: other_title,
                                c: protocol.additional_questions.length
                            });
                        }
                        console.log("FLAG IN 2");
                        info.forEach(info_item => {
                            if (info_item.c > 1) {
                                const item_to_change = items_body.find(item => { return item.t == info_item.t; });
                                
                                item_to_change['t'] = {
                                    rowSpan: info_item.c, 
                                    content: info_item.t
                                };
                            }
                        });
                        protocol_bodies.push({
                            name: protocol.name,
                            items: items_body,
                        });
                        
                    }
                }); 
                return protocol_bodies;
            },
            /**
             *  Function to prepare plans table for PDF
             *  [Description] - protocols table has one columns
             *      - a column - plan column, group all plans
             *  @return {Array} plans_body - the array with content to feed into the plans table
             * **/
            preparePlans(curr_log) {
                let plans_body = [];
                if (curr_log.plans_answers.join('').trim() != "") {
                    curr_log.plans_answers.forEach(plan => {
                        if (plan.trim() != "") {
                            plans_body.push({
                                a: `- ${plan}`
                            });
                        }
                    });
                } else {
                    plans_body.push({
                        a: 'N/A'
                    });
                }
                return plans_body;
            },
            /**
             *  Function to prepare notes table for PDF
             *  [Description] - protocols table has one columns
             *      - a column - note column, group all notes
             *  @return {Array} notes_body - the array with content to feed into the notes table
             * **/
            prepareNotes(curr_log) {
                let notes_body = [];
                notes_body.push({
                    a: (curr_log.notes.trim() != "") ? curr_log.notes.trim() : "N/A"
                });
                return notes_body;
            },
            /**
             *  Function to prepare edit history table for PDF
             *  [Description] - history table has three columns
             *      - n column - nurse column, name pr id of the nurse who made the edits
             *      - t column - time column, edit timestap
             *      - r column - reason column, group all reasons into string
             *  @return {Array} hist_body - the array with content to feed into the history table
             * **/
            prepareHistory(curr_log) {
                let hist_body = [];
                curr_log.editHistory.forEach((hist) => {
                    const nurse_obj = this.users.find(elem=> elem.id === hist.nurse);
                    hist_body.push({
                        n: nurse_obj ? nurse_obj.fullname : hist.nurse,
                        t: hist.recordTime,
                        r: hist.reason.join('\n')
                    });
                });
                return hist_body;
            },
            /**
             *  Function to generate PDF and send email
             * **/
            generatePDF() {
                // set up variables to import jsPDF library
                global['window'] = {
                    'document': {
                        'createElementNS': () => { return {} }
                    }
                };
                global['document'] = {
                    'createElement': (str) => { return {} }
                };
                global['navigator'] = {};
                
                global["btoa"] = str => {
                    return base64.encode(str);
                };
                global["atob"] = bytes => {
                    return base64.decode(bytes);
                };
                global["utf8"] = {};

                // require jsPDF library, if failed, try again util success
                let jsPDF;
                let lib_loaded = false;
                while(!lib_loaded) {
                    try {
                        lib_loaded = true;
                        jsPDF = require("jspdf");
                    }
                    catch(error) {
                        lib_loaded = false;
                    }
                }

                // import jsPDF auto-table library
                require("jspdf-autotable");
                
                // prepare basic settings for generating texts and tables
                var doc = new jsPDF();
                const end_of_line = 196.5;
                const start_of_text = 15;
                const title_font_size = 10;
                const table_font_size = 9;
                const cell_padding = 3;
                
                // retrieve necessary data from data storage
                // record final documentation/ modification end time
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                const info_body = this.prepareInfo(curr_log);
                const intro_body = this.prepareIntro(curr_log);
                const protocol_titles = this.prepareProtocolsSummary(curr_log);
                const protocol_bodies = this.prepareProtocols(curr_log);
                const plans_body = this.preparePlans(curr_log);
                const notes_body = this.prepareNotes(curr_log);
                const hist_body = this.prepareHistory(curr_log);
                const submit_time = this.recordTime();
                const client_info_for_pdf = this.recordClientForPDFName(curr_log);
                const submit_time_for_pdf = this.recordTimeForPDFName();
                const client_info_for_email = this.recordClientForEmailName(curr_log);
                const submit_time_for_email = this.recordTimeForEmailName();
                
                // generating the title
                doc.setFontSize(7);
                doc.setFontType('normal')
                doc.text("PALLIATIVE ASSESSMENT TOOL", 85, 18);

                // drawing separator
                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, 20, end_of_line, 20);

                // generating section title
                doc.setFontSize(title_font_size);
                doc.setFontType('bold');
                doc.text("Call Information", start_of_text, 20 + 6);
          
                // generating call info table
                doc.autoTable({
                    startY: 20 + 10,
                    theme: 'grid',
                    body: info_body,
                    columns: [{ dataKey: 'a' }, { dataKey: 'b'}],
                    columnStyles: {a: {cellWidth: 'auto', minCellWidth: 60},
                                   b: {cellWidth: 'auto', minCellWidth: 60}},
                    styles: {minCellHeight: 18, fontSize: table_font_size, cellPadding: cell_padding},
                });

                // drawing separator
                // generating protocol names preview line
                let finalY = doc.previousAutoTable.finalY;
                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, finalY, end_of_line, finalY);
                doc.setFontSize(title_font_size);
                doc.setFontType('bold');
                doc.text("Assessed Protocols", start_of_text, finalY + 6);
                doc.setFontSize(table_font_size);
                doc.setFontType('normal');
                doc.text(protocol_titles, start_of_text + 37, finalY + 6);
                
                // generating introduction table
                const intro_padding = 6 + 4 * Math.max(1, Math.ceil(protocol_bodies.length / 3));
                finalY = doc.previousAutoTable.finalY + intro_padding;
                const finalYInfo = doc.previousAutoTable.finalY + intro_padding;
                doc.autoTable({
                    startY: finalY,
                    theme: 'grid',
                    body: intro_body,
                    columns: [{ dataKey: 'q' }, { dataKey: 'a'}],
                    columnStyles: {q: {cellWidth: 65, minCellWidth: 65, fontStyle: 'bold'},
                                   a: {cellWidth: 'auto', minCellWidth: 50}},
                    styles: {minCellHeight: 10, fontSize: table_font_size, cellPadding: cell_padding},
                });

                // drawing separator
                // drawing protocol tables
                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, finalYInfo, end_of_line, finalYInfo);
                protocol_bodies.forEach(protocol_body => {
                    // generating current protocol title
                    finalY = doc.previousAutoTable.finalY;
                    doc.setLineWidth(0.25);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(start_of_text, finalY, end_of_line, finalY);
                    doc.setFontSize(title_font_size);
                    doc.setFontType('bold')
                    doc.text(protocol_body.name, start_of_text, finalY + 6);

                    // generating current protocol table
                    doc.autoTable({
                        startY: finalY + 10,
                        theme: 'grid',
                        body: protocol_body.items,
                        columns: [{ dataKey: 't' }, {dataKey: 'q' }, { dataKey: 'a' }],
                        columnStyles: {t: {cellWidth: 25, minCellWidth: 25, fontStyle: 'bold'},
                                       q: {cellWidth: 65, minCellWidth: 65, fontStyle: 'bold'},
                                       a: {cellWidth: 'auto', minCellWidth: 50}},
                        styles: {minCellHeight: 10, fontSize: table_font_size, cellPadding: cell_padding},
                    });
                });
                
                // drawing separator
                // generting plans title
                finalY = doc.previousAutoTable.finalY;
                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, finalY, end_of_line, finalY);
                doc.text("Plan", start_of_text, finalY + 6);
                doc.setLineWidth(0.1);
                doc.setDrawColor(200, 200, 200);
                doc.line(start_of_text, finalY + 10, end_of_line, finalY + 10);

                // generating plans table
                doc.autoTable({
                    startY: finalY + 10,
                    theme: 'plain',
                    body: plans_body,
                    columns: [{ dataKey: 'a' }],
                    columnStyles: {a: {cellWidth: 'auto'}},
                    styles: {fontSize: table_font_size, cellPadding: cell_padding},
                });

                // drawing separator
                // generating notes title
                finalY = doc.previousAutoTable.finalY;
                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, finalY, end_of_line, finalY);
                doc.text("Additional Notes", start_of_text, finalY + 6);

                // generating notes table
                doc.autoTable({
                    startY: finalY + 10,
                    theme: 'plain',
                    body: notes_body,
                    columns: [{ dataKey: 'a' }],
                    columnStyles: {a: {cellWidth: 'auto'}},
                    styles: {fontSize: table_font_size, cellPadding: cell_padding},
                });

                if (hist_body.length > 0) { // in edit history exists
                    // drawing separator
                    // generating history title
                    finalY = doc.previousAutoTable.finalY;
                    doc.setLineWidth(0.25);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(start_of_text, finalY, end_of_line, finalY);
                    doc.text("Edit History", start_of_text, finalY + 6);

                    // generating edit history table
                    doc.autoTable({
                        startY: finalY + 10,
                        theme: 'grid',
                        body: hist_body,
                        columns: [{ dataKey: 'n' }, { dataKey: 't' }, { dataKey: 'r' }],
                        columnStyles: {n: {cellWidth: 35, minCellWidth: 35},
                                    t: {cellWidth: 25, minCellWidth: 25},
                                    r: {cellWidth: 'auto', minCellWidth: 50}},
                        styles: {minCellHeight: 10, fontSize: table_font_size, cellPadding: cell_padding},
                    });
                }
                
                // generating footer
                finalY = doc.previousAutoTable.finalY;
                doc.setFontSize(7);
                doc.setFontType('normal')
                doc.text(`Phone assessment -Generated by Palliative Assessment Tool (PAT) at ${submit_time}`, start_of_text, finalY + 20);

                // marking all left and right border transparent
                let pageInfo = doc.internal.getCurrentPageInfo();
                for (var i = 1; i <= pageInfo.pageNumber; i++) {
                    doc.setPage(i);
                    doc.setLineWidth(1);
                    doc.setDrawColor(255, 255, 255);
                    doc.line(14, 0, 14, 300);
                    doc.setLineWidth(1);
                    doc.setDrawColor(255, 255, 255);
                    doc.line(196, 0, 196, 300);
                    doc.setLineWidth(2);
                    doc.setDrawColor(255, 255, 255);
                    doc.line(197, 0, 197, 300);
                }

                // modifying the PDF strings to be an email attachement
                var doc_64 = "base64://" + doc.output("datauristring").split(",")[1];

                // sending email
                email.available().then(avaialble => {
                    if (avaialble) {
                        // composing email
                        email.compose({
                            subject: `[PAT] ${client_info_for_email} - ${submit_time_for_email}`,
                            body: "This is a <strong>fake</strong> email template for a palliative document",
                            to: [],
                            cc: ['zhou.jiayi.1992@gmail.com'],
                            bcc: [],
                            attachments: [{
                                fileName: `${client_info_for_pdf}_PAT_${submit_time_for_pdf}.pdf`,
                                path: doc_64,
                                mimeType: 'application/pdf'
                            }]
                        }).then(() => {
                            // manually check if email sent, then set the status of the document
                            // go back home if email sent
                            confirm({
                                title: "Confirm Email Sent",
                                message: "Confirm that the email is sent?",
                                okButtonText: "Confirm",
                                cancelButtonText: "Not Sent",
                            }).then((result) => {
                                if (result) {
                                    this.onEmailSent();
                                } else {
                                    this.backToHome();
                                }
                            });
                        }, (error) => {
                            // mysterious error happens
                            alert({
                                title: "Fail to Email",
                                message: error,
                                okButtonText: "OK"
                            });
                        });
                    } else {
                        // if email client is not available
                        alert({
                            title: "Email Client not Available",
                            okButtonText: "OK"
                        });
                    }
                }).catch(error => {
                    // if other email client error is happending
                    alert({
                        title: "Email Client not Found",
                        message: error,
                        okButtonText: "OK"
                    });
                });
            }
        }
    }
</script>



