<template>
    <Page class="page new-client-page">
        <GridLayout rows="auto, *, auto" columns="*" :class="ctnrSetting.class" 
                     ref="newClientGridRef" 
                     @tap="clearTextfieldFocus"
                     @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" :is_close="false"/>

            <ScrollView row="1" col="0" rowSpan="2" >
                <StackLayout class="client-main-ctnr">
                    <Label class="client-title" text="client Information" ></Label>       
                    <!-- <PreviousNextView>              -->
                        <GridLayout :rows="gridSetting.rows" :columns="gridSetting.columns" >
                            <Label :row="gridSetting.children.q1.row" 
                                    :col="gridSetting.children.q1.col"
                                    class="client-q client-q1" 
                                    text="Call-back Number:" 
                                    textWrap="true"/>
                            <MaskedTextField :row="gridSetting.children.a1.row" 
                                            :col="gridSetting.children.a1.col"
                                            id="client-a1"
                                            class="client-a client-a1" 
                                            v-model="c_phone"
                                            ref="phoneFieldRef"
                                            mask="(000) 000-0000"
                                            hint="(###) ###-####"
                                            @textChange="onPhoneTextChange"
                                            keyboardType="phone" />
                            <Label :row="gridSetting.children.e1.row" 
                                    :col="gridSetting.children.e1.col"
                                    :colSpan="gridSetting.children.e1.colSpan"
                                    class="client-e client-e1" 
                                    text="Please enter a callback number" 
                                    ref="phoneErrorFieldRef"
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
                                    text="Caller's relationship to client:" 
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
                            <Label class="client-t client-t-consent" text="consent to care given and" />
                            <Label class="client-t client-t-consent" text="to speak on behalf of client" />
                        </StackLayout>
                        <Switch class="client-switch" v-model="is_consented" @checkedChange="checkConsentError" offBackgroundColor="#e5e5e5"/>
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
    /**
     *  =============================================================
     * 
     *  Page to create a new client
     *  [Description] - can be opened from Dashboard/ or any client related page
     *  [Related] - styles in client.scss
     *  @param {String} c_id - client id, auto-generated by the time the log is created
     *  @param {String} c_phone - client call-back number
     *  @param {String} c_client - client full name
     *  @param {String} c_caller - caller's full name
     *  @param {String} c_relation - relationship of caller to client
     *  @param {String} c_info - client general infomation
     *  @param {String} created_date - the date that the log is created, in format of DD MM YYYY
     *  @param {String} created_time - the time that the log is created, in format of XX:XX
     *  @param {Boolean} is_consented - variable indicates whether the caller agrees to the consents
     *  @param {Object} formatSetting - variable to store screen-size sensitive classnames
     *  @param {Object} gridSetting - variable to store GridLayout settings
     *  @prop {Number} log_id - the id of the current document
     * 
     *  =============================================================
     * **/

    import NavBar from '../general/parts/NavBar.vue';
    import Dashboard from '../home/Dashboard.vue';
    import Introduction from "./Introduction.vue";

    import { mapActions, mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { dialogConsent, 
             monthIndexToString, 
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
                created_date: '',
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
            this.recordTime();
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
                'intro',
                'users',
                'curr_user_id',
            ]),
		},
        methods: {
            ...mapActions([
                'saveClientInfo',
                'saveActiveLog',
                'saveIntroProgress'
            ]),
            /**
             *  Function to capture the date and time of document creation
             * **/
            recordTime() {
                const today = new Date();
                const today_arr = today.toString().split(' ');
                this.created_date = today_arr[2] + ' ' + today_arr[1] + ' ' + today_arr[3];
                this.created_time = today_arr[4].substring(0, 5);
                this.c_id = '' + today.getTime();
            },
            /**
             *  Function to capture the general info enterred
             *  @return {Object} args - text change event object
             * **/
            resetTextviewModel(args) {
                this.c_info = args.value;
            },
            /**
             *  Function to parse phone infomation enterred
             *  [Description] - in format of XXXXXXXXXX
             * **/
            parsePhoneInput() {
                let client_phone = '0000000000';
                if (this.$refs.phoneFieldRef) {
                    if (this.$refs.phoneFieldRef.nativeView.text != null 
                        && this.$refs.phoneFieldRef.nativeView.text != '') {
                        const curr_val = this.$refs.phoneFieldRef.nativeView.text;
                        client_phone = curr_val.replace(/\D/g, '').substring(0, 10);
                    }
                }
                return client_phone;
            },
            /**
             *  Function to check if the consent switch has been agreed by caller
             * **/
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
            /**
             *  Function to check status of the phoen textfield when the textfield has been modified
             * **/
            onPhoneTextChange() {
                let client_phone = this.parsePhoneInput();
                if (client_phone.length != 10) {
                    this.$refs.phoneErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.phoneFieldRef.nativeView.borderColor = '#ff1f00';
                } else {
                    this.$refs.phoneErrorFieldRef.nativeView.opacity = 0;
                    this.$refs.phoneFieldRef.nativeView.borderColor = '#dbdbdb';
                }
            },
            /**
             *  Function to create client, save client info to dat storage and move on to Introduction section
             * **/
            onNextTap(args) {
                // parse phone input
                let client_phone = this.parsePhoneInput();

                // Stop proceeding if any of the conditions does not met
                if (client_phone.length != 10) {
                    this.$refs.phoneErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.phoneFieldRef.nativeView.borderColor = '#ff1f00';
                    return;
                }

                if (this.is_consented) {
                    // prepare all response enterred
                    const client_id = this.c_id;
                    const caller_name = this.c_caller.trim();
                    const client_name = this.c_client.trim();
                    const client_relation = this.c_relation.trim();
                    const nurse_id = (this.curr_user_id != -1 && this.curr_user_id.length === 6) ? this.curr_user_id : '';
                    let nurse_fullname = '';
                    if ((this.curr_user_id != -1 && this.curr_user_id.length === 6)) {
                        const user_obj = this.users.find((elem) => { return elem.id === nurse_id; });
                        nurse_fullname = (user_obj) ? user_obj.fullname : '';
                    }

                    // prepare a basic log object to pass to data storage
                    const entry = {
                        id: this.c_id,
                        phone: client_phone,
                        caller: caller_name,
                        client: client_name,
                        relation: client_relation,
                        info: this.c_info,
                        notes: '',
                        nurseID: nurse_id,
		                nurseFullname: nurse_fullname,
                        date: this.created_date,
                        startTime: this.created_time,
                        endTime: '',
                        status: false,
                        progress: [-1, -2, 0, 0, 0, 0, 0], // intro[step id], proto[protocol id], items[Binary], others[Binary], recommendations[Binary], plans[Binary], summary[Binary]
                        editHistory: [],
                        intro_answers: [],
                        items_answers: [],
                        others_answers: [],
                        recommendations: '',
                        plans_answers: [],
                    };
                    this.saveClientInfo(entry);

                    // prepare to navigate into step one of Introduction section
                    let steps_ids = [];
                    this.intro.forEach(elem => { steps_ids.push(elem.id); });
                    this.$navigateTo(Introduction, {
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'fade',
                            curve: 'easeIn',
                            duration: 300,
                        },
                        props: {
                            log_id: client_id,
                            step_ids: steps_ids,
                            step_idx: 0,
                            from_summary: false
                        }
                    });

                    // log progress to the data storage
                    const progress = {
                        log_id: client_id,
                        s_id: steps_ids[0],
                    }
                    this.saveIntroProgress(progress);
                } else {
                    this.$refs.consentErrorRef.nativeView.opacity = 1;
                }
            },
            /**
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                for (let i = 1; i <= 4; i++) {
                    const aTextfield = layoutView.getViewById(`client-a${i}`);
                    aTextfield.dismissSoftInput();
                }
                const freeTextView = layoutView.getViewById(`client-free`);
                freeTextView.dismissSoftInput();
            },
            /**
             *  Function to navigate back to Dashboard
             * **/
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
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
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