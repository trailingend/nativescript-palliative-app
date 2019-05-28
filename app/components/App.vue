<template>
    <Page>
        <TabView>
            <TabViewItem title="Home">
                <Frame id="homeFrame">
                    <DashBoard />
                </Frame>
            </TabViewItem>
            <TabViewItem title="Log">
                <Frame id="logFrame">
                    <Placeholder />
                </Frame>
            </TabViewItem>
            <TabViewItem title="Resources">
                <GridLayout columns="*" rows="*">
                    <Label class="message" text="Placeholder for Resources" col="0" row="0"/>
                </GridLayout>
            </TabViewItem>
            <TabViewItem title="Glossary">
                <GridLayout columns="*" rows="*">
                    <Button class="message" text="Test PDF and Email" col="0" row="0" @tap="testEmail" />
                </GridLayout>
            </TabViewItem>
            <TabViewItem title="Settings">
                <GridLayout columns="*" rows="*">
                    <Label class="message" text="Placeholder for Settings" col="0" row="0"/>
                </GridLayout>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script lang="ts">
    import DashBoard from './homeTab/Dashboard.vue';
    import Placeholder from './logTab/Placeholder.vue';

    import * as email from "nativescript-email";
    import * as base64 from "base-64";
    import * as utf8 from "utf8";
    import { alert }  from "tns-core-modules/ui/dialogs";


    export default {
        data() {
            return {
                
            }
        },
        components: {
            DashBoard,
            Placeholder
        },
        methods: {
            testEmail() {
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

                const jsPDF = require("../scripts/jspdf@1.3.5");
                var doc = new jsPDF();
                doc.setFontSize(26);
                doc.text(40, 40, "My first PDF with NativeScript!");
                var doc_64 = "base64://" + doc.output("datauristring").split(",")[1];
           
                email.available().then(avaialble => {
                    if (avaialble) {
                            email.compose({
                            subject: "Yo",
                            body: "Hello <strong>dude</strong> :)",
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
            }
        }
    }
</script>

<style scoped>

</style>
