<template>
    <Button class="form-btn sum-btn submit-btn" text="Submit" @tap="onSubmitTap" ></Button>
</template>

<script lang="ts">
    import * as email from "nativescript-email";
    import * as base64 from "base-64";
    import * as utf8 from "utf8";
    import { alert }  from "tns-core-modules/ui/dialogs";

    export default {
        methods: {
            onSubmitTap() {
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
                            to: ['joshua.stuible@vch.ca'],
                            cc: [],
                            bcc: [],
                            attachments: [{
                                fileName: 'test.pdf',
                                path: doc_64,
                                mimeType: 'application/pdf'
                            }]
                        }).then( function() {
                            console.log("Email composer closed");
                        }, function(error) {
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

                })
            },
        }
    }
</script>



