<template>
     <Page class="page call-page">
        <GridLayout rows="auto, *" columns="*" 
                    ref="callGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <StackLayout row="0" col="0" rowSpan="2" :class="formSetting.class">
                <Label class="call-title" text="call information" ></Label>    
                <!-- <PreviousNextView> -->
                <GridLayout rows="auto, auto, auto, auto, auto, auto, auto, auto, auto, auto" columns="*">
                    <Label row="0" col="0" class="call-q1 call-q" text="Intake Nurse Name:" textWrap="true"/>
                    <TextField row="1" col="0" 
                               id="call-a1"
                               class="call-a1 call-a" 
                               ref="nameCallInfoRef"
                               v-model="u_name"
                               @textChange="checkNameError"
                               hint="Enter your first and last name"/>
                    <Label row="2" col="0" class="call-e call-e1" 
                           text="Please enter first and last name" 
                           opacity="0" 
                           ref="nameECallInfoRef" />
                    <Label row="3" col="0" class="call-q2 call-q" text="Intake Nurse ID #:" textWrap="true"/>
                    <TextField row="4" col="0"
                                id="call-a2"
                                class="call-a call-a2" 
                                hint="Enter your six digit ID number"
                                ref="idCallInfoRef"
                                @textChange="checkIDError"
                                keyboardType="phone"
                                editable="true" />
                    <Label row="5" col="0" class="call-e call-e2" 
                           text="Please enter a valid employee ID" 
                           opacity="0" 
                           ref="idECallInfoRef"/>
                    <Label row="6" col="0" class="call-q3 call-q" text="Call Starts:" textWrap="true"/>
                    <TimePicker row="7" col="0" 
                                class="call-picker" 
                                :hour="u_call_s_h" :minute="u_call_s_m"
                                ref="sTimeCallInfoRef" />
                    <Label row="8" col="0" class="call-q4 call-q" text="Call Ends:" textWrap="true" />
                    <Label row="8" col="0" class="call-e call-e4" text="Please select end time" opacity="0" ref="timeECallInfoRef" />
                    <TimePicker row="9" col="0" 
                                class="call-picker" 
                                :hour="u_call_e_h" :minute="u_call_e_m" 
                                ref="eTimeCallInfoRef"
                                @timeChange="onTimeChange"/>
                </GridLayout>
                <!-- </PreviousNextView> -->
                <Button class="form-btn call-btn" text="Save" @tap="onSaveTap" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Modal to allow user to enter or to modify call infomation
     *  [Description] - called from Summary page
     *  @param {String} u_id - intake user id, the null state is empty string
     *  @param {String} u_name - intake user name with shortened last name, the null state is empty string
     *  @param {String} u_fullname - intake nurse full name, the null state is empty string
     *  @param {Number} u_call_s_h - the call start hour
     *  @param {Number} u_call_s_m - the call start minute
     *  @param {Number} u_call_e_h - the call end hour
     *  @param {Number} u_call_e_m - the call end minute
     *  @param {Boolean} end_time_changed - variable to check whether the end time has been changed
     *  @param {Object} formSetting - variable to store screen-size sensitive classnames
     *  @prop {String} log_id - the id of the current dociment
     * 
     *  =============================================================
     * **/

    import Tutorial from '../tutorials/Tutorial.vue';
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { formatShiftTime, formatUsernameForDisplay, userColors } from '../../scripts/common';

    export default {
        data() {
            return {
                u_id: '',
                u_name: '',
                u_fullname: '',
                u_call_s_h: 0,
                u_call_s_m: 0,
                u_call_e_h: 0,
                u_call_e_m: 0,
                end_time_changed: false,

                formSetting: {
                    class: "call-ctnr",
                },
            }
        },
        mounted() {
            this.prepareCallInfo();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'logs',
                'users'
			]),
		},
        methods: {
            ...mapActions([
                'saveCallInfo',
                'saveUserInfo'
            ]),
            /**
             *  Function to retrieve call info from data storage
             * **/
            prepareCallInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.u_id = curr_log.nurseID;
                    this.u_name = curr_log.nurseFullname;
                    this.u_fullname = curr_log.nurseFullname;
                    this.u_call_s_h = parseInt(curr_log.startTime.split(":")[0]);
                    this.u_call_s_m = parseInt(curr_log.startTime.split(":")[1]);
                    if (curr_log.endTime != '') {
                        this.u_call_e_h = parseInt(curr_log.endTime.split(":")[0]);
                        this.u_call_e_m = parseInt(curr_log.endTime.split(":")[1]);
                        this.end_time_changed = true;
                    }
                    this.$refs.idCallInfoRef.nativeView.text = this.u_id;
                }
            },
            /**
             *  Function to check whether the user name is filled and decide whether to show error message
             * **/
            checkNameError(args) {
                if (args.oldValue.trim() != '') {
                    if (args.value.trim() === '') {
                        this.$refs.nameECallInfoRef.nativeView.opacity = 1;
                        this.$refs.nameCallInfoRef.nativeView.borderColor = '#ff1f00';
                    }
                } 
                if (args.oldValue.trim() === '') {
                    if (args.value.trim() != '') {
                        this.$refs.nameECallInfoRef.nativeView.opacity = 0;
                        this.$refs.nameCallInfoRef.nativeView.borderColor = '#dbdbdb';
                    }
                } 
            },
            /**
             *  Function to check whether the user ID is filled and decide whether to show error message
             * **/
            checkIDError(args) {
                if (args.value) {
                    const new_input = args.value.replace(/\D/g, '');
                    this.u_id = new_input.substring(0, Math.min(6, new_input.length));
                    this.$refs.idCallInfoRef.nativeView.text = this.u_id;

                    if (this.u_id.length != 6) {
                        this.$refs.idECallInfoRef.nativeView.opacity = 1;
                        this.$refs.idCallInfoRef.nativeView.borderColor = '#ff1f00';
                    } else {
                        this.$refs.idECallInfoRef.nativeView.opacity = 0;
                        this.$refs.idCallInfoRef.nativeView.borderColor = '#dbdbdb';
                    } 
                }
            },
            /**
             *  Function to save edited info to data storage
             *  [Description] - will only proceed if the user full name is not empty, if the user id is valid and if the call end time has been manually set
             *                - if the user does not exist in users array in data storage, then the user info will automatically added to the list
             *                - the user will take the intake nurse instead of the logged-in user
             * **/
            onSaveTap(args) {
                if (this.u_name.trim() === '') {
                    this.$refs.nameECallInfoRef.nativeView.opacity = 1;
                    this.$refs.nameCallInfoRef.nativeView.borderColor = '#ff1f00';
                }
                if (this.u_id.length != 6) {
                    this.$refs.idECallInfoRef.nativeView.opacity = 1;
                    this.$refs.idCallInfoRef.nativeView.borderColor = '#ff1f00';
                }
                if (! this.end_time_changed) {
                    this.$refs.timeECallInfoRef.nativeView.opacity = 1;
                }
                if (this.u_name.trim() === '' || this.u_id.length != 6 || !this.end_time_changed) return;

                // passed all conditions, proceed
                const s_time_obj = this.$refs.sTimeCallInfoRef.nativeView.time;
                const e_time_obj = this.$refs.eTimeCallInfoRef.nativeView.time;
                let s_time = s_time_obj.toString().split(' ')[4].substring(0, 5);
                let e_time = e_time_obj.toString().split(' ')[4].substring(0, 5);
                const call_item = {
                    id: this.log_id,
                    nurse_id: this.u_id,
                    nurse_name: formatUsernameForDisplay(this.u_name.trim()),
                    nurse_fullname: this.u_name.trim(),
                    call_start: s_time,
                    call_end: e_time,
                }
               
                this.saveCallInfo(call_item);

                // check whether the user need to be saved
                if (this.users.find(elem => elem.id === this.u_id) === undefined) {
                    let color_idx = userColors.findIndex(elem => {
                        if (this.users.length === 0) return false;
                        else return elem === this.users[this.users.length - 1].color;
                    });
                    color_idx = (color_idx === userColors.length - 1) ? 0 : color_idx + 1;
                    const user_item = {
                        id: this.u_id,
                        name: formatUsernameForDisplay(this.u_name),
                        fullname: this.u_name.trim(),
                        shift_start: '',
                        shift_end: '',
                        color: userColors[color_idx],
                    }
                    this.saveUserInfo(user_item);
                }

                // automatically close the modal
                this.$modal.close();
            },
            /**
             *  Function to close this reason editing pop-up
             * **/
            onCloseTap() {
                this.$modal.close();
            },
            /**
             *  Function to confirm that call end time has been set
             * **/
            onTimeChange() {
                if (! this.end_time_changed) {
                    this.end_time_changed = true;
                    this.$refs.timeECallInfoRef.nativeView.opacity = 0;
                }
            },
            /**
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                layoutView.getViewById("call-a1").dismissSoftInput();
                layoutView.getViewById("call-a2").dismissSoftInput();
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                if (this.$refs.callGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.callGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.formSetting.class = "call-ctnr tablet-landscape";
                    } else {
                        this.formSetting.class = "call-ctnr";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>