<template>
    <Page class="page new-client-page" @navigatingFrom="onNavigatingFrom">
        <GridLayout rows="auto, *, auto" columns="*" :class="ctnrSetting.class" 
                     ref="newClientGridRef" 
                     @tap="clearTextfieldFocus"
                     @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" />

            <ScrollView row="1" col="0" rowSpan="2" >
                <StackLayout class="client-main-ctnr">
                    <Label class="client-title" text="client Information" ></Label>       
                    <!-- <PreviousNextView>              -->
                        <GridLayout :rows="gridSetting.rows" :columns="gridSetting.columns" >
                            <Label :row="gridSetting.children.q1.row" 
                                    :col="gridSetting.children.q1.col"
                                    class="client-q client-q1" 
                                    text="Call-back #:" 
                                    textWrap="true"/>
                            <MaskedTextField :row="gridSetting.children.a1.row" 
                                            :col="gridSetting.children.a1.col"
                                            id="client-a1"
                                            class="client-a client-a1" 
                                            v-model="c_phone"
                                            ref="phoneFieldRef"
                                            mask="(000) 000-0000"
                                            hint="(###) ###-####"
                                            keyboardType="phone" />
                            <Label :row="gridSetting.children.e1.row" 
                                    :col="gridSetting.children.e1.col"
                                    :colSpan="gridSetting.children.e1.colSpan"
                                    class="client-e client-e1" 
                                    text="Please enter a callback number" 
                                    opacity="0" />
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
                            <Label :row="gridSetting.children.e2.row" 
                                    :col="gridSetting.children.e2.col"
                                    :colSpan="gridSetting.children.e2.colSpan"
                                    class="client-e client-e2" 
                                    text="Please enter a client name" 
                                    opacity="0" />
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
                            <Label :row="gridSetting.children.e3.row" 
                                    :col="gridSetting.children.e3.col"
                                    :colSpan="gridSetting.children.e3.colSpan"
                                    class="client-e client-e3" 
                                    text="Please enter a caller name" 
                                    opacity="0" />
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
                            <Label :row="gridSetting.children.e4.row" 
                                    :col="gridSetting.children.e4.col"
                                    :colSpan="gridSetting.children.e4.colSpan"
                                    class="client-e client-e4" 
                                    text="Please enter a relationship" 
                                    opacity="0" />
                        </GridLayout>
                    <!-- </PreviousNextView> -->

                    <FlexboxLayout class="client-switch-ctnr" flexDirection="row" alignItems="center" justifyContent="space-between">
                        <StackLayout>
                            <Label class="client-t client-t-consent" text="consent to documente call" />
                            <Label class="client-t client-t-consent" text="and to represent client" />
                        </StackLayout>
                        <Switch class="client-switch" v-model="is_consented" @checkedChange="checkConsentError" />
                    </FlexboxLayout>

                    <StackLayout class="client-switch-error" opacity="0" ref="consentErrorRef">
                        <Label class="client-e client-e5" text="Please obtain consent" />
                    </StackLayout>                    
                    <StackLayout>
                        <Label class="client-t client-t-info" text="General Client Information" textWrap="true"/>
                        <Label class="client-d" text="Ex. age, diagnosis, history, medical profile, care plan, GOC."/>
                        <StackLayout class="client-free-ctnr">
                            <TextView id="client-free"
                                    class="client-free"
                                    hint="Ex. age, diagnosis, history, medical profile, care plan, GOC."
                                    @textChange="resetTextviewModel"
                                    editable="true" />
                        </StackLayout>
                    </StackLayout>

                    <!-- <Button class="form-btn client-btn" text="Next" @tap="onNextTap" /> -->
                </StackLayout>
            </ScrollView>

            <Button row="2" col="0" class="next-btn" text="Next" @tap="onNextTap" />
            
        </GridLayout>
    </Page>
</template>

<script>
    import NavBar from '../general/parts/NavBar.vue';
    import Dashboard from '../home/Dashboard.vue';
    import Introduction from "./Introduction.vue";

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
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
                    rows: "auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto,",
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
            NavBar
        },
        props: {
            log_id: {
                type: String,
                required: false,
            }
        },
        watch: {
            c_phone(val) {
                console.log("=== in watch === " + val)
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'intro'
            ]),
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
            parsePhoneInput() {
                let client_phone = '8888888888';
                if (this.$refs.phoneFieldRef) {
                    if (this.$refs.phoneFieldRef.nativeView.text != null 
                        && this.$refs.phoneFieldRef.nativeView.text != '') {
                        const curr_val = this.$refs.phoneFieldRef.nativeView.text;
                        client_phone = curr_val.replace(/\D/g, '').substring(0, 10);
                    }
                }
                return client_phone;
            },
            checkConsentError(args) {
                if (args.oldValue === true) {
                    if (args.value === false) {
                        this.$refs.consentErrorRef.nativeView.opacity = 1;
                    }
                } 
                if (args.oldValue === false) {
                    if (args.value === true) {
                        this.$refs.consentErrorRef.nativeView.opacity = 0;
                    }
                } 
            },
            onNextTap(args) {
                this.recordTime(); 
                let client_phone = this.parsePhoneInput();

                if (this.is_consented) {
                    const client_id = this.c_id;
                    const caller_name = (this.c_caller === '') ? 'Anonymous' : this.c_caller;
                    const client_name = (this.c_client === '') ? 'John Doe' : this.c_client;
                    const client_relation = (this.c_relation === '') ? 'Unknown' : this.c_relation;
                                        
                    const entry = {
                        id: this.c_id,
                        phone: client_phone,
                        caller: caller_name,
                        client: client_name,
                        relation: client_relation,
                        info: this.c_info,
                        notes: '',
                        nurse: '',
                        createdTime: this.created_time,
                        status: false,
                        progress: [-1, -1, -1, -1, 0], // intro[step id], proto[protocol id], items[letter id], others[Tri-state], plans[Bool]
                        intro_answers: [],
                        items_answers: [],
                        others_answers: [],
                        plans_answers: [],
                    };
                    this.saveClientInfo(entry);
                    // this.saveActiveChart(this.c_id);

                    let steps_ids = [];
                    this.intro.forEach(elem => { steps_ids.push(elem.id); });
                    this.$navigateTo(Introduction, {
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'fade',
                            curve: 'easeIn',
                            duration: 300
                        },
                        props: {
                            log_id: client_id,
                            step_ids: steps_ids,
                            step_idx: 0
                        }
                    });
                    console.log("=== New Client Logged ===");
                } else {
                    this.$refs.consentErrorRef.nativeView.opacity = 1;
                }
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                for (let i = 1; i <= 4; i++) {
                    const aTextfield = layoutView.getViewById(`client-a${i}`);
                    aTextfield.dismissSoftInput();
                }
                const freeTextView = layoutView.getViewById(`client-free`);
                freeTextView.dismissSoftInput();
            },
            // onPhoneEntered() {
            //     this.input_phone = formatPhoneNum(this.c_phone);
            // },
            onBackToHome(args) {
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
                            rows: "auto, auto, auto, auto, auto, auto, auto, auto,",
                            columns: "auto, *",
                            children: newGridChildLandscape,
                        }
                    } else {
                        this.ctnrSetting.class = "client-ctnr";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto,",
                            columns: "*",
                            children: newGridChildPortrait,
                        }
                    }
                }
            },
            
        }
        
    };
</script>