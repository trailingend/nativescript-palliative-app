<template>
    <Page class="page new-page">
        <ActionBar title="Patient Log"></ActionBar>
        <GridLayout rows="*" columns="*, auto" class="new-ctnr" 
                    ref="newGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <StackLayout row="0" col="0" :class="formSetting.class">
                <Image class="new-head" src="~/assets/images/head2.png" stretch="aspectFit" ></Image>                    
                <GridLayout rows="auto, auto, auto, auto" columns="auto, *">
                    <Label row="0" col="0" class="new-q1 new-q" text="Callback #:" textWrap="true"/>
                    <TextField row="0" col="1" 
                               id="new-a1"
                               class="new-a new-a1" 
                               v-model="c_phone" 
                               keyboardType="phone"
                               editable="true" />
                    <Label row="1" col="0" class="new-q2 new-q" text="Client name:" textWrap="true"/>
                    <TextField row="1" col="1" 
                               id="new-a2"
                               class="new-a new-a2" 
                               v-model="c_client"
                               editable="true" />
                    <Label row="2" col="0" class="new-q2 new-q" text="Patient name:" textWrap="true"/>
                    <TextField row="2" col="1" 
                               id="new-a3"
                               class="new-a new-a3" 
                               v-model="c_patient"
                               editable="true" />
                    <Label row="3" col="0" class="new-q3 new-q" text="Relation to client:" textWrap="true"/>
                    <TextField row="3" col="1"
                               id="new-a4"
                               class="new-a new-a4"
                               v-model="c_relation"
                               editable="true" />
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
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { dialogConsent, logMonths } from '../../scripts/common';
        
    export default {
        data() {
            return {
                c_id: '',
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
        props: {
            log_id: {
                type: String,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'intro_question_id',
                'logs'
			])
		},
        methods: {
            ...mapActions([
                'saveClientInfo',
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getDate() + '/' + logMonths(today.getMonth()) + '/' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;

                this.created_time = dateTime;
                this.c_id = '' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes();
            },
            loadExistingInfo() {
                if (this.log_id) {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    this.c_phone = curr_log.phone;
                    this.c_patient = curr_log.patient;
                    this.c_client = curr_log.client;
                    this.c_relation = curr_log.relation;
                    this.is_consented = true;
                }
            },
            onNavigateForward(args) {
                this.recordTime();

                if (this.is_consented) {
                    const client_id = this.c_id;
                    const client_phone = (this.c_phone === '') ? '888-888-8888' : this.c_phone;
                    const client_name = (this.c_client === '') ? 'Anonymous Nobody' : this.c_client;
                    const patient_name = (this.c_patient === '') ? 'John Dow' : this.c_patient;
                    const entry = {
                        id: this.c_id,
                        phone: client_phone,
                        client: client_name,
                        patient: patient_name,
                        relation: this.c_relation,
                        createdTime: this.created_time,
                        timer: 0,
                        status: false,
                        progressLoc: -1,
                        progress: [],
                    };
                    this.saveClientInfo(entry);

                    this.$navigateTo(Question, {
                        frame: "logFrame",
                        animated: false,
                        props: {
                            log_id: client_id,
                            intro_question_id: this.intro_question_id
                        }
                    });
                    console.log("=== New Patient Logged ===");
                } else {
                    dialogConsent();
                }
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const a1Textfield = layoutView.getViewById("new-a1");
                const a2Textfield = layoutView.getViewById("new-a2");
                const a3Textfield = layoutView.getViewById("new-a3");
                const a4Textfield = layoutView.getViewById("new-a4");
                a1Textfield.dismissSoftInput();
                a2Textfield.dismissSoftInput();
                a3Textfield.dismissSoftInput();
                a4Textfield.dismissSoftInput();
            },
            onLayoutUpdate() {
                if (this.$refs.newGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.newGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.formSetting.class = "new-form-ctnr tablet-landscape";
                    } else {
                        this.formSetting.class = "new-form-ctnr";
                    }
                }
            }
        }
        
    };
</script>

<style>
</style>