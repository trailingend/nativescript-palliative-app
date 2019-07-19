<template>
    <Button class="form-btn sum-btn submit-btn" text="Submit" @tap="onSubmitTap" ></Button>
</template>

<script lang="ts">
    import Dashboard from '../../home/Dashboard.vue';

    import { mapActions } from 'vuex';
    import * as email from "nativescript-email";
    import * as base64 from "base-64";
    import * as utf8 from "utf8";
    import { confirm, alert }  from "tns-core-modules/ui/dialogs";

    export default {
        props: {
            log_id: {
                type: String,
                required: true,
            },
        },
        methods: {
            ...mapActions([
                'changeChartStatus'
            ]),
            onSubmitTap() {
                confirm({
                    title: "Attention",
                    message: "Do you want send this chart via email now?",
                    okButtonText: "Send",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result || result === undefined) {
                        this.generatePDF();
                        // this.onEmailSent();
                    } 
                });
            },
            onEmailSent() {
                console.log("=== Navigate Back To Home ===");
                this.changeChartStatus(this.log_id);
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

                const jsPDF = require("../../../scripts/jspdf@1.3.5");
                var doc = new jsPDF();
                doc.setFontSize(26);
                doc.text(40, 40, "This is an pdf sample.");
                var doc_64 = "base64://" + doc.output("datauristring").split(",")[1];
           
                email.available().then(avaialble => {
                    if (avaialble) {
                        email.compose({
                            subject: "Email Template",
                            body: "This is a <strong>fake</strong> email template for a palliative chart",
                            to: ['josh.stuible@gmail.com'],
                            cc: [],
                            bcc: [],
                            attachments: [{
                                fileName: 'test.pdf',
                                path: doc_64,
                                mimeType: 'application/pdf'
                            }]
                        }).then(() => {
                            alert({
                                title: "Email Sent",
                                okButtonText: "Back to home"
                            }).then((result) => {
                                this.onEmailSent();
                            });
                        }, (error) => {
                            alert({
                                title: "Fail to Email",
                                message: error,
                                okButtonText: "OK"
                            });
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



