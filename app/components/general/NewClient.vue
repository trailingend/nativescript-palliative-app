<template>
    <Page class="page new-client-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar title="Chart">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CancelButton />
        </ActionBar>
        <GridLayout rows="*, auto" columns="*" :class="ctnrSetting.class" 
                     ref="newClientGridRef" 
                     @tap="clearTextfieldFocus"
                     @layoutChanged="onLayoutUpdate">
            <ScrollView >
            <StackLayout row="0" col="0" rowSpan="2" class="client-main-ctnr">
                <Label class="client-title" text="client Information" ></Label>       
                <PreviousNextView>             
                    <GridLayout :rows="gridSetting.rows" :columns="gridSetting.columns" >
                        <Label :row="gridSetting.children.q1.row" 
                                :col="gridSetting.children.q1.col"
                                class="client-q client-q1" 
                                text="Call-back #:" 
                                textWrap="true"/>
                        <TextField :row="gridSetting.children.a1.row" 
                                    :col="gridSetting.children.a1.col"
                                    id="client-a1"
                                    class="client-a client-a1" 
                                    v-model="input_phone" 
                                    hint="(888) 888-8888"
                                    keyboardType="phone"
                                    @blur="onPhoneEntered"
                                    editable="true" />
                        <Label :row="gridSetting.children.q2.row" 
                                :col="gridSetting.children.q2.col"
                                class="client-q client-q2" 
                                text="client's name:" 
                                textWrap="true"/>
                        <TextField :row="gridSetting.children.a2.row" 
                                    :col="gridSetting.children.a2.col"
                                    id="client-a2"
                                    class="client-a client-a2" 
                                    v-model="c_client" 
                                    hint="Firstname Lastname"
                                    editable="true" />
                        <Label :row="gridSetting.children.q3.row" 
                                :col="gridSetting.children.q3.col"
                                class="client-q client-q3" 
                                text="Caller's name:" 
                                textWrap="true"/>
                        <TextField :row="gridSetting.children.a3.row" 
                                    :col="gridSetting.children.a3.col"
                                    id="client-a3"
                                    class="client-a client-a3" 
                                    v-model="c_caller" 
                                    hint="Firstname Lastname"
                                    editable="true" />
                        <Label :row="gridSetting.children.q4.row" 
                                :col="gridSetting.children.q4.col"
                                class="client-q client-q4" 
                                text="Relationship to client:" 
                                textWrap="true"/>
                        <TextField :row="gridSetting.children.a4.row" 
                                    :col="gridSetting.children.a4.col"
                                    id="client-a4"
                                    class="client-a client-a4" 
                                    v-model="c_relation" 
                                    hint="i.e. Daughter"
                                    editable="true" />
                    </GridLayout>
                </PreviousNextView>

                <FlexboxLayout class="client-switch-ctnr" flexDirection="row" alignItems="flex-start" justifyContent="space-between">
                    <Label class="client-t" text="consent to have call recorded" textWrap="true"/>
                    <Switch class="client-switch" v-model="is_consented" />
                </FlexboxLayout>
                    
                <StackLayout>
                    <Label class="client-t" text="General Client Information" textWrap="true"/>
                    <TextViewWithHint id="client-free"
                                      class="client-free"
                                      @textChange="resetTextviewModel"
                                      hint="Ex. age, diagnosis, history, medical profile, care plan, GOC."
                                      editable="true" />
                </StackLayout>

                <Button class="form-btn client-btn" text="Next" @tap="onNextTap" />
            </StackLayout>
            </ScrollView>
            <!-- <Button row="1" col="0" class="next-btn" text="Next" @tap="onNextTap" /> -->
            
        </GridLayout>
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
                'saveActiveChart',
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getDate() + ' / ' + logMonths(today.getMonth()) + ' / ' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;

                this.created_time = dateTime;
                this.c_id = '' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes();
            },
            resetTextviewModel(args) {
                this.c_info = args.value;
            },
            onNextTap(args) {
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
                        nurse: '',
                        createdTime: this.created_time,
                        status: false,
                        progress: -1,
                        intro_answers: [],
                        items_answers: [],
                        others_answers: [],
                        plans_answers: [],
                    };
                    this.saveClientInfo(entry);
                    // this.saveActiveChart(this.c_id);

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
                for (let i = 1; i <= 4; i++) {
                    const aTextfield = layoutView.getViewById(`client-a${i}`);
                    aTextfield.dismissSoftInput();
                }
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