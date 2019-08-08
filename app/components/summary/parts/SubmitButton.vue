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
        mounted() {
            this.prepareText();
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
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
                const date = today.getDate() + ' / ' + logMonths(today.getMonth()) + ' / ' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;
                return dateTime
            },
            onSubmitTap() {
                const submit_time = this.recordTime();
                console.log("TODO load submit time into pdf " + submit_time);
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
            prepareProtocols(curr_log) {
                let protocol_bodies = [];
                this.protocols.forEach(protocol => {
                    const items_idx = curr_log.items_answers.findIndex(elem => protocol.id === elem.id);
                    const others_idx = curr_log.others_answers.findIndex(elem => protocol.id === elem.id);
                    if ( items_idx != -1 || others_idx != -1) {
                        let items_body = [];
                        let others_body = [];
                        let info = [];
                        let contents = [];
                        
                        this.assessment_letters.forEach(letter => {
                            let count_letter = 0;
                            const l_objs = protocol.assessment_questions.filter(elem => {return elem.assessment_letter.id === letter.id});
                            if (l_objs) {
                                l_objs.forEach(q_obj => {
                                    const r_obj = curr_log.items_answers[items_idx].a.find(elem => {return elem.q_id === q_obj.id});
                                    const a_obj = (r_obj) ? r_obj.a.join('\n') : 'N/A';
                                    
                                    contents.push( {
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

                        items_body.push({
                            info: info,
                            content: contents
                        });

                        protocol.additional_questions.forEach(q_obj => {
                            const r_obj = curr_log.others_answers[others_idx].a.find(elem => {return elem.q_id === q_obj.id});
                            const a_obj = (r_obj) ? r_obj.a.join('\n') : 'N/A';
                            others_body.push({
                                q: q_obj.question,
                                a: (a_obj.trim() != '') ? a_obj.trim() : 'N/A'
                            });
                        });
                    
                        protocol_bodies.push({
                            name: protocol.name,
                            items: items_body,
                            others: others_body,
                        });
                    }
                });
                
                // console.dir(protocol_bodies[0].items);
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
                console.dir(notes_body);
                return notes_body;
            },
            generatePDF() {
                // global['window'] = {
                //     'document': {
                //         'createElementNS': () => { return {} }
                //     }
                // };
                // global['document'] = {
                //     'createElement': (str) => { return {} }
                // };
                // global['navigator'] = {};
                // global["btoa"] = str => {
                //     return base64.encode(str);
                // };
                // global["atob"] = bytes => {
                //     return base64.decode(bytes);
                // };
                // global["utf8"] = {};

                // const jsPDF = require("jspdf");
                // require("jspdf-autotable");

                // var doc = new jsPDF();
                const end_of_line = 196.5;
                const start_of_text = 15;
                const title_font_size = 10;
                const table_font_size = 9;
                const cell_padding = 3;

                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                const intro_body = this.prepareIntro(curr_log);
                const protocol_bodies = this.prepareProtocols(curr_log);
                const plan_body = this.preparePlans(curr_log);
                const notes_body = this.prepareNotes(curr_log);

                // doc.setFontSize(7);
                // doc.setFontType('normal')
                // doc.text("PALLIATIVE ASSESSMENT TOOL", 85, 8);

                // doc.setLineWidth(0.25);
                // doc.setDrawColor(0, 0, 0);
                // doc.line(start_of_text, 10, end_of_line, 10);

                // doc.setFontSize(title_font_size);
                // doc.setFontType('bold')
                // doc.text("Client Information", start_of_text, 10 + 6);
          
                // doc.autoTable({
                //     startY: 10 + 10,
                //     theme: 'grid',
                //     body: [{
                //             a: 'Call-back Number: 604.777.5885\nClient’s Name: Jon Stevenson\nCaller’s Name:\nCaller’s Relationship to Client:', 
                //             b: 'Date: 05 May 2019\nCall Start: 5:43\nCall End: 5:51',
                //         }],
                //     columns: [{
                //             dataKey: 'a'
                //         }, {
                //             dataKey: 'b'
                //         }],
                //     columnStyles: {a: {cellWidth: 'auto', minCellWidth: 60},
                //                    b: {cellWidth: 'auto', minCellWidth: 60}},
                //     styles: {minCellHeight: 18, fontSize: table_font_size, cellPadding: cell_padding},
                // });
                
                // let finalY = doc.previousAutoTable.finalY;
                // doc.setLineWidth(0.5);
                // doc.setDrawColor(0, 0, 0);
                // doc.line(start_of_text, finalY, end_of_line, finalY);
                // doc.autoTable({
                //     startY: finalY,
                //     theme: 'grid',
                //     body: intro_body,
                //     columns: [{
                //             dataKey: 'q'
                //         }, {
                //             dataKey: 'a'
                //         }],
                //     columnStyles: {q: {cellWidth: 65, minCellWidth: 65, fontStyle: 'bold'},
                //                    a: {cellWidth: 'auto', minCellWidth: 50}},
                //     styles: {minCellHeight: 10, fontSize: table_font_size, cellPadding: cell_padding},
                // });

                // finalY = doc.previousAutoTable.finalY;
                // doc.setLineWidth(0.25);
                // doc.setDrawColor(0, 0, 0);
                // doc.line(start_of_text, finalY, end_of_line, finalY);
                // doc.setFontSize(title_font_size);
                // doc.setFontType('bold')
                // doc.text("Nausea and Vomiting", start_of_text, finalY + 6);

                // doc.autoTable({
                //     startY: finalY + 10,
                //     theme: 'grid',
                //     body: [{
                //             t: 'ONSET', 
                //             q: 'When did it begin?\nHow long does it last?\nHow often does it occur?', 
                //             a: 'Yes - new symptom. Shankle burgdoggen shoulder, ball tip swine short ribs ground.'
                //         }, {
                //             t: 'PROVOKING\nPALLIATIVE', 
                //             q: 'What brings it on?\nWhat makes it better?\nWhat makes it worse?', 
                //             a: 'Picanha chuck pancetta porchetta kevin, pork chop meatball biltong cow shank tongue doner. Porchetta alcatra t-bone.'
                //         }, {
                //             t: 'VALUES',
                //             q: 'Review Goals of Care\nOverall goals to keep in mind while managing this symptom? Acceptable level for this symptom (0-10)? Are there any beliefs, views or feelings about this symptom that are important to keep in mind?',
                //             a: 'Beef ribs shoulder landjaeger corned beef. Turducken kevin ground round, tenderloin spare ribs frankfurter.'
                //         }],
                //     columns: [{
                //             dataKey: 't'
                //         }, {
                //             dataKey: 'q'
                //         }, {
                //             dataKey: 'a'
                //         }],
                //     columnStyles: {t: {cellWidth: 25, minCellWidth: 25, fontStyle: 'bold'},
                //                    q: {cellWidth: 65, minCellWidth: 65, fontStyle: 'bold'},
                //                    a: {cellWidth: 'auto', minCellWidth: 50}},
                //     styles: {minCellHeight: 10, fontSize: table_font_size, cellPadding: cell_padding},
                // });

                // finalY = doc.previousAutoTable.finalY;
                // doc.setLineWidth(0.25);
                // doc.setDrawColor(0, 0, 0);
                // doc.line(start_of_text, finalY, end_of_line, finalY);
                // doc.text("Others", start_of_text, finalY + 6);

                // doc.autoTable({
                //     startY: finalY + 10,
                //     theme: 'grid',
                //     body: [{
                //             q: 'Who is present and capable of managing care meds and potential urgency of situation for the next 24hrs or longer if necessary?', 
                //             a: 'Yes - new symptom. '
                //         }, {
                //             q: 'Is the client safe?\nIf no, explain.', 
                //             a: 'Yes.'
                //         }, {
                //             q: 'Is the client still eating/drinking? Are there signs of dehydration?',
                //             a: 'Beef ribs shoulder landjaeger corned beef. Turducken kevin ground round, tenderloin spare ribs frankfurter.'
                //         }],
                //     columns: [{
                //             dataKey: 'q'
                //         }, {
                //             dataKey: 'a'
                //         }],
                //     columnStyles: {q: {cellWidth: 65, minCellWidth: 65, fontStyle: 'bold'},
                //                    a: {cellWidth: 'auto', minCellWidth: 50}},
                //     styles: {minCellHeight: 10, fontSize: table_font_size, cellPadding: cell_padding},
                // });

                // finalY = doc.previousAutoTable.finalY;
                // doc.setLineWidth(0.25);
                // doc.setDrawColor(0, 0, 0);
                // doc.line(start_of_text, finalY, end_of_line, finalY);
                // doc.text("Plan", start_of_text, finalY + 6);
                // doc.setLineWidth(0.1);
                // doc.setDrawColor(200, 200, 200);
                // doc.line(start_of_text, finalY + 10, end_of_line, finalY + 10);

                // doc.autoTable({
                //     startY: finalY + 10,
                //     theme: 'plain',
                //     body: [{
                //             a: '- Reach out for medical support (e.g. MRP)'
                //         }, {
                //             a: '- Recommend going to UPCC (Urgent Primary Care Center)* if appropriate and unable to manage symptoms at home and if ambulatory and within client’s goals of care'
                //         }],
                //     columns: [{
                //             dataKey: 'a'
                //         }],
                //     columnStyles: {a: {cellWidth: 'auto'}},
                //     styles: {fontSize: table_font_size, cellPadding: cell_padding},
                // });

                // finalY = doc.previousAutoTable.finalY;
                // doc.text("Additional Notes", start_of_text, finalY + 6);

                // doc.autoTable({
                //     startY: finalY + 10,
                //     theme: 'plain',
                //     body: [{
                //             a: 'Picanha chuck pancetta porchetta kevin, pork chop meatball biltong cow shank tongue doner. Porchetta alcatra t-bone.'
                //         }],
                //     columns: [{
                //             dataKey: 'a'
                //         }],
                //     columnStyles: {a: {cellWidth: 'auto'}},
                //     styles: {fontSize: table_font_size, cellPadding: cell_padding},
                // });

                // doc.setLineWidth(1);
                // doc.setDrawColor(255, 255, 255);
                // doc.line(14, 0, 14, 300);
                // doc.setLineWidth(1);
                // doc.setDrawColor(255, 255, 255);
                // doc.line(196, 0, 196, 300);
                // doc.setLineWidth(2);
                // doc.setDrawColor(255, 255, 255);
                // doc.line(197, 0, 197, 300);

                // var doc_64 = "base64://" + doc.output("datauristring").split(",")[1];

                // email.available().then(avaialble => {
                //     if (avaialble) {
                //         email.compose({
                //             subject: "Email Template",
                //             body: "This is a <strong>fake</strong> email template for a palliative chart",
                //             to: ['josh.stuible@gmail.com'],
                //             cc: [],
                //             bcc: [],
                //             attachments: [{
                //                 fileName: 'test.pdf',
                //                 path: doc_64,
                //                 mimeType: 'application/pdf'
                //             }]
                //         }).then(() => {
                //             confirm({
                //                 title: "Confirm Email Sent",
                //                 message: "Confirm that the email is sent?",
                //                 okButtonText: "Confirm",
                //                 cancelButtonText: "Not Sent",
                //             }).then((result) => {
                //                 if (result) {
                //                     this.onEmailSent();
                //                 } else {
                //                     this.backToHome();
                //                 }
                //             });
                //         }, (error) => {
                //             alert({
                //                 title: "Fail to Email",
                //                 message: error,
                //                 okButtonText: "OK"
                //             });
                //         });
                //     } 
                // }).catch(error => {
                //     alert({
                //         title: "Email Client not Found",
                //         message: error,
                //         okButtonText: "OK"
                //     });

                // });
            }
        }
    }
</script>



