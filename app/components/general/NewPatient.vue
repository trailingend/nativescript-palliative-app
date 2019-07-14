<template>
    <Page class="page new-patient-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar>
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
        </ActionBar>
        <StackLayout :class="ctnrSetting.class" 
                     ref="newPatientGridRef" 
                     @tap="clearTextfieldFocus"
                     @layoutChanged="onLayoutUpdate">
            <Label class="patient-title" text="Patient log" ></Label>                    
            <GridLayout :rows="gridSetting.rows" :columns="gridSetting.columns">
                <Label :row="gridSetting.children.q1.row" 
                       :col="gridSetting.children.q1.col"
                       class="patient-q patient-q1" 
                       text="Callback #:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a1.row" 
                           :col="gridSetting.children.a1.col"
                           id="patient-a1"
                           class="patient-a patient-a1" 
                           v-model="input_phone" 
                           keyboardType="phone"
                           @blur="onPhoneEntered"
                           editable="true" />
                <Label :row="gridSetting.children.q2.row" 
                       :col="gridSetting.children.q2.col"
                       class="patient-q patient-q2" 
                       text="Caller name:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a2.row" 
                           :col="gridSetting.children.a2.col"
                           id="patient-a2"
                           class="patient-a patient-a2" 
                           v-model="c_caller" 
                           editable="true" />
                <Label :row="gridSetting.children.q3.row" 
                       :col="gridSetting.children.q3.col"
                       class="patient-q patient-q3" 
                       text="Patient name:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a3.row" 
                           :col="gridSetting.children.a3.col"
                           id="patient-a3"
                           class="patient-a patient-a3" 
                           v-model="c_patient" 
                           editable="true" />
                <Label :row="gridSetting.children.q4.row" 
                       :col="gridSetting.children.q4.col"
                       class="patient-q patient-q4" 
                       text="Relation to Patient:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a4.row" 
                           :col="gridSetting.children.a4.col"
                           id="patient-a4"
                           class="patient-a patient-a4" 
                           v-model="c_relation" 
                           editable="true" />
            </GridLayout>
            
            <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-between">
                <Label class="patient-t" text="consent to have the call recorded" textWrap="true"/>
                <Switch class="patient-switch" v-model="is_consented" />
            </FlexboxLayout>
                
            <StackLayout>
                <Label class="patient-t" text="General Client Information" textWrap="true"/>
                <Label class="patient-d" text="Ex. age, diagnosis, history, medical profile, care plan, GOC." textWrap="true"/>
                <TextView v-model="c_info" 
                            id="patient-free"
                            class="patient-free"
                            hint="Take notes here..."
                            editable="true" />
            </StackLayout>
            <Button class="form-btn patient-btn" text="Continue" @tap="onNavigateForward" />
        </StackLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import Dashboard from '../home/Dashboard.vue';
    import Diagnose from "./Diagnose.vue";

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { confirm }  from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";
    import { dialogConsent, 
             logMonths, 
             formatPhoneNum, 
             newGridChildPortrait, 
             newGridChildLandscape } from '../../scripts/common';
    
    export default {
        data() {
            return {
                c_id: '',
                c_phone: '',
                c_patient: '',
                c_caller: '',
                c_relation: '',
                c_info: '',
                created_time: '',
                is_consented: false,

                ctnrSetting: {
                    class: "patient-ctnr",
                },
                gridSetting: {
                    rows: "auto, auto, auto, auto, auto, auto, auto, auto,",
                    columns: "*",
                    children: newGridChildPortrait,
                }
            }
        },
        created() {
        },
        mounted() {
        },
        components: {
            CloseButton
        },
        props: {
            log_id: {
                type: String,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'intro_questions'
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
                'saveActiveLog',
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getDate() + ' / ' + logMonths(today.getMonth()) + ' / ' + today.getFullYear();
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
                    this.c_caller = curr_log.client;
                    this.c_relation = curr_log.relation;
                    this.is_consented = true;
                }
            },
            onNavigateForward(args) {
                this.recordTime(); 

                if (this.is_consented) {
                    const client_id = this.c_id;
                    const client_phone = (this.c_phone === '') ? '8888888888' : this.c_phone;
                    const caller_name = (this.c_caller === '') ? 'Anonymous Nobody' : this.c_caller;
                    const patient_name = (this.c_patient === '') ? 'John Doe' : this.c_patient;
                    const entry = {
                        id: this.c_id,
                        phone: client_phone,
                        caller: caller_name,
                        patient: patient_name,
                        relation: this.c_relation,
                        info: this.c_info,
                        createdTime: this.created_time,
                        status: false,
                        progress: -1,
                        intro_answers: [],
                        protocol_answers: [],
                    };
                    this.saveClientInfo(entry);
                    this.saveActiveLog(this.c_id);

                    let q_ids = [];
                    this.intro_questions.forEach(elem => { q_ids.push(elem.id); });
                    this.$navigateTo(Diagnose, {
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'fade',
                            curve: 'easeIn',
                            duration: 300
                        },
                        props: {
                            log_id: client_id,
                            question_ids: q_ids,
                            question_idx: 0
                        }
                    });
                    console.log("=== New Patient Logged ===");
                } else {
                    dialogConsent();
                }
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const a1Textfield = layoutView.getViewById("patient-a1");
                const a2Textfield = layoutView.getViewById("patient-a2");
                const a3Textfield = layoutView.getViewById("patient-a3");
                const a4Textfield = layoutView.getViewById("patient-a4");
                a1Textfield.dismissSoftInput();
                a2Textfield.dismissSoftInput();
                a3Textfield.dismissSoftInput();
                a4Textfield.dismissSoftInput();
            },
            onPhoneEntered() {
                this.input_phone = formatPhoneNum(this.c_phone.replace(/\D/g, ''));
            },
            onBackToHome(args) {
                console.log("=== Navigate Back To Home ===");
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
            onNavigatingFrom() {
                
            },
            onLayoutUpdate() {
                if (this.$refs.newPatientGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.newPatientGridRef.nativeView.getMeasuredWidth() );
                    if (width > 800) {
                        this.ctnrSetting.class = "patient-ctnr tablet-landscape";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto",
                            columns: "auto, *",
                            children: newGridChildLandscape,
                        }
                    } else {
                        this.ctnrSetting.class = "patient-ctnr";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto, auto, auto, auto, auto,",
                            columns: "*",
                            children: newGridChildPortrait,
                        }
                    }
                }
            },
            
        }
        
    };
</script>

<style>
</style>