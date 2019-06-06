<template>
    <Page class="page new-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar title="Patient Log"></ActionBar>
        <StackLayout>
            <Progress v-show="timer_status" class="time-progress"                     
                      :value="curr_time"
                      :minValue="min_time"
                      :maxValue="max_time"
                      :color="color"
                      @loaded="onProgressLoaded" />
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
                                v-model="input_phone" 
                                keyboardType="phone"
                                @blur="onPhoneEntered"
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
        </StackLayout>
    </Page>
</template>

<script>
    import QuestionPhase2 from './QuestionPhase2.vue';
    
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { Progress } from 'tns-core-modules/ui/progress';
    import { isIOS } from "platform";
    import { dialogConsent, logMonths, formatPhoneNum } from '../../scripts/common';
    
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

                curr_time: "0",
                min_time: "0", 
                max_time: "10", 
                color: "#adebad",
                timer: null,

                formSetting: {
                    class: "new-form-ctnr",
                },
            }
        },
        mounted() {
            if (this.timer_status) {
                this.tick();
            }
        },
        props: {
            timer_status: {
                type: Boolean,
                required: true
            },
            log_id: {
                type: String,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'phase_2_question_id',
                'logs'
            ]),
            input_phone: {
                get: function() {                    
                    return formatPhoneNum(this.c_phone);
                },
                set: function (new_input) {
                    this.c_phone = new_input.replace(/\D/g, '').substring(0, Math.min(10, new_input.length));
                    console.log("in setter " + this.c_phone);
                }
            }
		},
        methods: {
            ...mapActions([
                'saveClientInfo',
                'saveActiveLog'
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
                    const client_phone = (this.c_phone === '') ? '8888888888' : this.c_phone;
                    const client_name = (this.c_client === '') ? 'Anonymous Nobody' : this.c_client;
                    const patient_name = (this.c_patient === '') ? 'John Doe' : this.c_patient;
                    const entry = {
                        id: this.c_id,
                        phone: client_phone,
                        client: client_name,
                        patient: patient_name,
                        relation: this.c_relation,
                        createdTime: this.created_time,
                        timer: 0,
                        status: false,
                        intro_progress: [],
                        intro_outcome: -1,
                        intro_action: -1,
                        protocol_id: -1,
                    };
                    this.saveClientInfo(entry);
                    this.saveActiveLog(this.c_id);

                    this.$navigateTo(QuestionPhase2, {
                        frame: "logFrame",
                        animated: false,
                        props: {
                            log_id: client_id,
                            initial_question_id: this.phase_2_question_id
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
            onPhoneEntered() {
                this.input_phone = formatPhoneNum(this.c_phone.replace(/\D/g, ''));
            },
            onProgressLoaded(args) {
                let progress = args.object;
                if (isIOS) {
                    let transform = CGAffineTransformMakeScale(1.0, 5.0);  
                    progress.ios.transform = transform; // progress.ios === UIProgressView
                }
            },
            tick() {
                this.timer = setInterval(() => {
                    const max_time_val = parseInt(this.max_time);
                    let curr_time_val = parseInt(this.curr_time);
                    curr_time_val++;
                    this.curr_time = '' + curr_time_val;
                    console.log("=== in timer ===" + this.curr_time)
                    if (curr_time_val >= max_time_val) {
                        this.color = '#ffcccc';
                        clearInterval(this.timer);
                    } else if (curr_time_val >= max_time_val / 2) {
                        this.color = '#ffdd99';
                    }
                }, 1000);
            },
            onNavigatingFrom() {
                if (this.timer_status) {
                    clearInterval(this.timer);
                }
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
            },
            
        }
        
    };
</script>

<style>
</style>