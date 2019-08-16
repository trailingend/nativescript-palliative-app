<template>
    <Button class="form-btn sum-btn submit-btn" :text="submit_text" @tap="onSubmitTap" ></Button>
</template>

<script lang="ts">
    import Dashboard from '../../home/Dashboard.vue';

    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    import * as email from "nativescript-email";
    import { confirm, alert }  from "tns-core-modules/ui/dialogs";
    import { logMonths } from '../../../scripts/common';
    import * as base64 from "base-64";
    import * as utf8 from "utf8";

    export default {
        data() {
            return {
                submit_text: 'Submit'
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
                'changeChartStatus'
            ]),
            prepareText() {
                const status = this.logs.find(elem => { return elem.id === this.log_id; }).status;
                this.submit_text = status ? 'Re-submit' : 'Submit';
            },
            recordTime() {
                const today = new Date();
                const date = today.getDate() + ' ' + logMonths(today.getMonth()) + ' ' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;
                return dateTime;
            },
            onSubmitTap() {
                this.$emit("onClick");
                console.log("check here ==========="  + this.is_reviewed);

                if (this.is_reviewed) {
                    confirm({
                        title: "Send Chart",
                        message: "This summary will be sent to your email as a PDF for you to upload to PARIS.",
                        okButtonText: "Send",
                        cancelButtonText: "Cancel",
                    }).then((result) => {
                        if (result || result === undefined) {
                            this.generatePDF();
                        } 
                    });
                } else {
                    console.log("TODO: if no time entered, scroll to top");
                }
            },
            onEmailSent() {
                this.changeChartStatus(this.log_id);
                this.backToHome();
            },
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
            prepareInfo(curr_log) {
                let info_body = [];
                const nurse_id = curr_log.nurse;
                const nurse_item = this.users.find(elem => elem.id === nurse_id);
                const nurse_name = nurse_item ? nurse_item.fullname : "Unknown";
                const start_time = curr_log.startTime;
                const date = curr_log.date;
                const end_time = curr_log.endTime;
                info_body.push({
                    a: `Call Start: ${start_time}\nCall End: ${end_time}`, 
                    b: `Date: ${date}\nIntake Nurse ID: ${nurse_id}\nIntake Nurse Name: ${nurse_name}`,
                });
                return info_body;
            },
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
                return titles;
            },
            prepareProtocols(curr_log) {
                let protocol_bodies = [];
                this.protocols.forEach(protocol => {
                    const items_idx = curr_log.items_answers.findIndex(elem => protocol.id === elem.id);
                    const others_idx = curr_log.others_answers.findIndex(elem => protocol.id === elem.id);
                    if ( items_idx != -1 || others_idx != -1) {
                        let items_body = [];
                        let others_body = [];
                        let info = [];
                        
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

                        info.forEach(info_item => {
                            if (info_item.c > 1) {
                                const item_to_change = items_body.find(item => item.t === info_item.t);
                                item_to_change['t'] = {
                                    rowSpan: info_item.c, 
                                    content: info_item.t
                                };
                            }
                        });

                        protocol.additional_questions.forEach(q_obj => {
                            if (others_idx != -1) {
                                const r_obj = curr_log.others_answers[others_idx].a.find(elem => {return elem.q_id === q_obj.id});
                                const a_obj = (r_obj) ? r_obj.a.join('\n') : 'N/A';
                                others_body.push({
                                    q: q_obj.question,
                                    a: (a_obj.trim() != '') ? a_obj.trim() : 'N/A'
                                });
                            }
                        });
                    
                        protocol_bodies.push({
                            name: protocol.name,
                            items: items_body,
                            others: others_body,
                        });
                        
                    }
                }); 
                return protocol_bodies;
            },
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
            prepareNotes(curr_log) {
                let notes_body = [];
                notes_body.push({
                    a: (curr_log.notes.trim() != "") ? curr_log.notes.trim() : "N/A"
                });
                return notes_body;
            },
            generatePDF() {
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

                require("jspdf-autotable");
                
                var doc = new jsPDF();
                const end_of_line = 196.5;
                const start_of_text = 15;
                const title_font_size = 10;
                const table_font_size = 9;
                const cell_padding = 3;

                const submit_time = this.recordTime();
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                const info_body = this.prepareInfo(curr_log);
                const intro_body = this.prepareIntro(curr_log);
                const protocol_titles = this.prepareProtocolsSummary(curr_log);
                const protocol_bodies = this.prepareProtocols(curr_log);
                const plans_body = this.preparePlans(curr_log);
                const notes_body = this.prepareNotes(curr_log);

                doc.setFontSize(7);
                doc.setFontType('normal')
                doc.text("PALLIATIVE ASSESSMENT TOOL", 85, 18);

                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, 20, end_of_line, 20);

                doc.setFontSize(title_font_size);
                doc.setFontType('bold');
                doc.text("Call Information", start_of_text, 20 + 6);
          
                doc.autoTable({
                    startY: 20 + 10,
                    theme: 'grid',
                    body: info_body,
                    columns: [{ dataKey: 'a' }, { dataKey: 'b'}],
                    columnStyles: {a: {cellWidth: 'auto', minCellWidth: 60},
                                   b: {cellWidth: 'auto', minCellWidth: 60}},
                    styles: {minCellHeight: 18, fontSize: table_font_size, cellPadding: cell_padding},
                });

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
                
                const intro_padding = 6 + 4 * Math.ceil(protocol_bodies.length / 3);
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
                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, finalYInfo, end_of_line, finalYInfo);
                protocol_bodies.forEach(protocol_body => {
                    finalY = doc.previousAutoTable.finalY;
                    doc.setLineWidth(0.25);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(start_of_text, finalY, end_of_line, finalY);
                    doc.setFontSize(title_font_size);
                    doc.setFontType('bold')
                    doc.text(protocol_body.name, start_of_text, finalY + 6);

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

                    finalY = doc.previousAutoTable.finalY;
                    doc.setLineWidth(0.25);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(start_of_text, finalY, end_of_line, finalY);
                    doc.text("Others", start_of_text, finalY + 6);

                    doc.autoTable({
                        startY: finalY + 10,
                        theme: 'grid',
                        body: protocol_body.others,
                        columns: [{ dataKey: 'q' }, { dataKey: 'a' }],
                        columnStyles: {q: {cellWidth: 65, minCellWidth: 65, fontStyle: 'bold'},
                                    a: {cellWidth: 'auto', minCellWidth: 50}},
                        styles: {minCellHeight: 10, fontSize: table_font_size, cellPadding: cell_padding},
                    });
                });
                

                finalY = doc.previousAutoTable.finalY;
                doc.setLineWidth(0.25);
                doc.setDrawColor(0, 0, 0);
                doc.line(start_of_text, finalY, end_of_line, finalY);
                doc.text("Plan", start_of_text, finalY + 6);
                doc.setLineWidth(0.1);
                doc.setDrawColor(200, 200, 200);
                doc.line(start_of_text, finalY + 10, end_of_line, finalY + 10);

                doc.autoTable({
                    startY: finalY + 10,
                    theme: 'plain',
                    body: plans_body,
                    columns: [{ dataKey: 'a' }],
                    columnStyles: {a: {cellWidth: 'auto'}},
                    styles: {fontSize: table_font_size, cellPadding: cell_padding},
                });

                finalY = doc.previousAutoTable.finalY;
                doc.text("Additional Notes", start_of_text, finalY + 6);

                doc.autoTable({
                    startY: finalY + 10,
                    theme: 'plain',
                    body: notes_body,
                    columns: [{ dataKey: 'a' }],
                    columnStyles: {a: {cellWidth: 'auto'}},
                    styles: {fontSize: table_font_size, cellPadding: cell_padding},
                });

                finalY = doc.previousAutoTable.finalY;
                doc.setFontSize(7);
                doc.setFontType('normal')
                doc.text(`Phone assessment -Generated by Palliative Assessment Tool (PAT) at ${submit_time}`, start_of_text, finalY + 20);

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

                var doc_64 = "base64://" + doc.output("datauristring").split(",")[1];

                email.available().then(avaialble => {
                    console.log("????" + avaialble)
                    if (avaialble) {
                        email.compose({
                            subject: "Email Template",
                            body: "This is a <strong>fake</strong> email template for a palliative chart",
                            to: ['zhou.jiayi.1992@gmail.com'],
                            cc: [],
                            bcc: [],
                            attachments: [{
                                fileName: 'test.pdf',
                                path: doc_64,
                                mimeType: 'application/pdf'
                            }]
                        }).then(() => {
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
                            alert({
                                title: "Fail to Email",
                                message: error,
                                okButtonText: "OK"
                            });
                        });
                    } else {
                        alert({
                            title: "Email Client not Available",
                            okButtonText: "OK"
                        });
                    }
                }).catch(error => {
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



