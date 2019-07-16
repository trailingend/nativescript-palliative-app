<template>
    <Page class="page new-client-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar>
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CancelButton />
        </ActionBar>
        <StackLayout :class="ctnrSetting.class" 
                     ref="newClientGridRef" 
                     @tap="clearTextfieldFocus"
                     @layoutChanged="onLayoutUpdate">
            <Label class="client-title" text="client Information" ></Label>       
            <PreviousNextView>             
            <GridLayout :rows="gridSetting.rows" :columns="gridSetting.columns">
                <Label :row="gridSetting.children.q1.row" 
                       :col="gridSetting.children.q1.col"
                       class="client-q client-q1" 
                       text="Callback #:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a1.row" 
                           :col="gridSetting.children.a1.col"
                           id="client-a1"
                           class="client-a client-a1" 
                           v-model="input_phone" 
                           keyboardType="phone"
                           @blur="onPhoneEntered"
                           editable="true" />
                <Label :row="gridSetting.children.q2.row" 
                       :col="gridSetting.children.q2.col"
                       class="client-q client-q2" 
                       text="Caller name:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a2.row" 
                           :col="gridSetting.children.a2.col"
                           id="client-a2"
                           class="client-a client-a2" 
                           v-model="c_caller" 
                           editable="true" />
                <Label :row="gridSetting.children.q3.row" 
                       :col="gridSetting.children.q3.col"
                       class="client-q client-q3" 
                       text="client name:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a3.row" 
                           :col="gridSetting.children.a3.col"
                           id="client-a3"
                           class="client-a client-a3" 
                           v-model="c_client" 
                           editable="true" />
                <Label :row="gridSetting.children.q4.row" 
                       :col="gridSetting.children.q4.col"
                       class="client-q client-q4" 
                       text="Relation to client:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a4.row" 
                           :col="gridSetting.children.a4.col"
                           id="client-a4"
                           class="client-a client-a4" 
                           v-model="c_relation" 
                           editable="true" />
            </GridLayout>
            </PreviousNextView>

            <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-between">
                <Label class="client-t" text="consent to have the call recorded" textWrap="true"/>
                <Switch class="client-switch" v-model="is_consented" />
            </FlexboxLayout>
                
            <StackLayout>
                <Label class="client-t" text="General Client Information" textWrap="true"/>
                <Label class="client-d" text="Ex. age, diagnosis, history, medical profile, care plan, GOC." textWrap="true"/>
                <TextViewWithHint v-model="c_info" 
                                  id="client-free"
                                  class="client-free"
                                  hint="Take notes here..."
                                  editable="true" />
            </StackLayout>
            <Button class="form-btn client-btn" text="Continue" @tap="onNavigateForward" />
        </StackLayout>
    </Page>
</template>

<script>
    import CancelButton from './parts/CancelButton.vue';
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
                c_client: '',
                c_caller: '',
                c_relation: '',
                c_info: '',
                created_time: '',
                is_consented: false,

                ctnrSetting: {
                    class: "client-ctnr",
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
            CancelButton
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
                    this.c_client = curr_log.client;
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
                    const client_name = (this.c_client === '') ? 'John Doe' : this.c_client;
                    const entry = {
                        id: this.c_id,
                        phone: client_phone,
                        caller: caller_name,
                        client: client_name,
                        relation: this.c_relation,
                        info: this.c_info,
                        createdTime: this.created_time,
                        status: false,
                        progress: -1,
                        intro_answers: [],
                        items_answers: [],
                        others_answers: [],
                        plans_answers: [],
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
                    console.log("=== New Client Logged ===");
                } else {
                    dialogConsent();
                }
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const a1Textfield = layoutView.getViewById("client-a1");
                const a2Textfield = layoutView.getViewById("client-a2");
                const a3Textfield = layoutView.getViewById("client-a3");
                const a4Textfield = layoutView.getViewById("client-a4");
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
                if (this.$refs.newClientGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.newClientGridRef.nativeView.getMeasuredWidth() );
                    if (width > 800) {
                        this.ctnrSetting.class = "client-ctnr tablet-landscape";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto",
                            columns: "auto, *",
                            children: newGridChildLandscape,
                        }
                    } else {
                        this.ctnrSetting.class = "client-ctnr";
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