<template>
    <Page class="page new-page">
        <ActionBar title="Patient Log"></ActionBar>
        <GridLayout rows="*" columns="*, auto" class="new-ctnr" ref="newGridRef" @layoutChanged="onLayoutUpdate">
            <StackLayout row="0" col="0" :class="formSetting.class">
                <Image class="new-head" src="~/assets/images/head2.png" stretch="aspectFit" ></Image>                    
                <GridLayout rows="auto, auto, auto, auto" columns="auto, *">
                    <Label row="0" col="0" class="new-q1 new-q" text="Callback #:" textWrap="true"/>
                    <TextField row="0" col="1" class="new-a1 new-a" v-model="c_phone" keyboardType="phone" />
                    <Label row="1" col="0" class="new-q2 new-q" text="Client name:" textWrap="true"/>
                    <TextField row="1" col="1" class="new-a2 new-a" v-model="c_client"  />
                    <Label row="2" col="0" class="new-q2 new-q" text="Patient name:" textWrap="true"/>
                    <TextField row="2" col="1" class="new-a2 new-a" v-model="c_patient"  />
                    <Label row="3" col="0" class="new-q3 new-q" text="Relation to client:" textWrap="true"/>
                    <TextField row="3" col="1" class="new-a3 new-a" v-model="c_relation"  />
                </GridLayout>
                <Label class="new-q new-consent-title" text="consent" textWrap="true"/>
                <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Label class="new-q new-consent-body" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." textWrap="true"/>
                    <Switch v-model="is_consented" />
                </FlexboxLayout>
                <Button class="new-btn" text="Continue" @tap="onNavigateForward" />
            </StackLayout>
            <StackLayout row="0" col="1" class="new-title-ctnr">
                <Label class="log-title" text="Patient" />
                <Label class="log-title" text="Log" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import Question from './Question.vue';

    import { mapActions } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
        
    export default {
        data() {
            return {
                c_phone: '',
                c_patient: '',
                c_client: '',
                c_relation: '',
                created_time: '',
                is_consented: false,

                formSetting: {
                    class: "new-form-ctnr",
                },
            }
        },
        mounted() {
        },
        methods: {
            ...mapActions([
                'saveClientInfo',
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;
                this.created_time = dateTime;
            },
            onNavigateForward(args) {
                this.recordTime();

                if (this.is_consented) {
                    const client_phone = (this.c_phone === '') ? '888-888-8888' : this.c_phone;
                    const client_name = (this.c_client === '') ? 'Anonymous Nobody' : this.c_client;
                    const patient_name = (this.c_patient === '') ? 'John Dow' : this.c_patient;
                    const entry = {
                        phone: client_phone,
                        client: client_name,
                        patient: patient_name,
                        createdTime: this.created_time,
                        relation: this.c_relation,
                        progressLoc: -1,
                        progress: []
                    };
                    this.saveClientInfo(entry);

                    this.$navigateTo(Question, {
                        frame: "logFrame",
                        animated: false
                    });
                    console.log("=== New Patient Logged ===");
                } else {
                    alert({
                        title: "Attention",
                        message: "Please agree to the terms first.",
                        okButtonText: "OK"
                    }).then(() => {
                        console.log("=== Do consent first ===");
                    });
                }
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.newGridRef.nativeView.getMeasuredWidth() );
                if (width > 1000) {
                    this.formSetting.class = "new-form-ctnr tablet-landscape";
                } else {
                    this.formSetting.class = "new-form-ctnr";
                }
            }
        }
        
    };
</script>

<style>
</style>