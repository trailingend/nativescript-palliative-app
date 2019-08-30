<template>
     <Page class="page login-user-page">
        <GridLayout rows="auto, auto, *, auto" columns="*" 
                    ref="loginUserGridRef" 
                    :class="formSetting.class"
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            
            <Label row="1" col="0" class="login-user-title" :text="is_passed ? 'sign in' : 'enter employee id'" ></Label>  
               
            <GridLayout v-if="!is_passed"
                        row="2" col="0" rowSpan="2" class="login-content-ctnr login-content-ctnr-id"
                        rows="auto, auto, auto" columns="*">
                <StackLayout row="0" col="0">
                    <StackLayout class="login-head" :background="selected_user.color" ></StackLayout>
                    <Label class="login-text login-name" :text="selected_user.name" textWrap="true"></Label>
                </StackLayout>
                <MaskedTextField row="1" col="0"
                                id="user-login-a2"
                                class="login-a login-a2" 
                                ref="idFieldRef"
                                mask="000000"
                                hint="######"
                                @textChange="checkIDError"
                                keyboardType="phone" />
                <Label row="2" col="0" class="login-e login-e2" 
                        text="Please enter a valid employee ID" 
                        opacity="0" 
                        ref="idErrorFieldRef"/>
            </GridLayout>

            <GridLayout v-else
                        row="2" col="0" rowSpan="2" class="login-content-ctnr"
                        rows="auto, auto, auto, auto, auto" columns="*">
                <StackLayout row="0" col="0">
                    <StackLayout class="login-head" :background="selected_user.color" ></StackLayout>
                    <Label class="login-text login-name" :text="selected_user.name" textWrap="true"></Label>
                </StackLayout>
                <Label row="1" col="0" class="login-e login-e3" text="Please select start time" opacity="0" ref="sErrorLoginRef" />
                <Label row="1" col="0" class="login-q" text="Shift Starts:" />
                <TimePicker row="2" col="0" 
                            class="login-picker" 
                            ref="sTimeLoginRef"
                            @timeChange="onStartTimeChange" />
                <Label row="3" col="0" class="login-e login-e4" text="Please select end time" opacity="0" ref="eErrorLoginRef" />
                <Label row="3" col="0" class="login-q" text="Shift Ends:" />
                <TimePicker row="4" col="0" 
                            class="login-picker" 
                            ref="eTimeLoginRef"
                            @timeChange="onEndTimeChange"/>
            </GridLayout>

            <Button row="3" col="0" class="form-btn login-user-btn" :text="is_passed ? 'start' : 'submit'" @tap="onSaveTap" />
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Modal to login an existing user
     *  [Description] - called in SelectUser page, note that this page cannot solely exists without a pop-up frame
     *  [Related] - styles in user.scss
     *  @param {String} u_id - user's VCH employee id, the null state is 000000, the id should be a 6-digit number
     *  @param {String} u_name - user's first name and initial of last name
     *  @param {String} u_fullname - user's full name
     *  @param {Boolean} is_passed - variable indicating whether the user has enterred their ID correctly
     *  @param {Boolean} end_time_changed - variable indicating whether the shift end time has been changed
     *  @param {Object} formSetting - variable to store screen-size sensitive GridLayout information 
     *  @prop {Object} parent_modal - the parent modal
     *  @prop {Object} selected_user - the user object selected
     * 
     *  =============================================================
     * **/

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { alert, confirm }  from "tns-core-modules/ui/dialogs";
    import { formatShiftTime, formatUsernameForDisplay, userColors } from '../../scripts/common';

    export default {
        data() {
            return {
                u_id: '',
                u_name: '',
                u_fullname: '',

                is_passed: false,
                end_time_changed: false,

                timer_obj: undefined,

                formSetting: {
                    class: "login-user-ctnr",
                },
            }
        },
        mounted() {},
        components: {
        },
        props: {
            parent_modal: {
                type: Object,
                required: true,
            },
            selected_user: {
                type: Object,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'users'
			]),
		},
        methods: {
            ...mapActions([
                'saveUserInfo',
                'activateUser',
                'deactivateUser',
                'startTimer'
            ]),
            /**
             *  Function to parse user_ID in format of XXXXXX
             * **/
            parseIDInput() {
                let user_ID = '000000';
                if (this.$refs.idFieldRef) {
                    if (this.$refs.idFieldRef.nativeView.text != null 
                        && this.$refs.idFieldRef.nativeView.text != '') {
                        const curr_val = this.$refs.idFieldRef.nativeView.text;
                        user_ID = curr_val.replace(/\D/g, '').substring(0, 6);
                    }
                }
                return user_ID;
            },
            /**
             *  Function to check whether the user ID enterred matched whats in the record
             * **/
            checkIDError(args) {
                const id_to_check = this.parseIDInput();
                if (id_to_check.length != 6) {
                    this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                } else {
                    this.$refs.idErrorFieldRef.nativeView.opacity = 0;
                    this.$refs.idFieldRef.nativeView.borderColor = '#dbdbdb';
                } 
            },
            /**
             *  Function to check whether the shift end time has been enterred and display error accordingly
             * **/
            onEndTimeChange() {
                if (! this.end_time_changed) {
                    this.end_time_changed = true;
                    this.$refs.eErrorLoginRef.nativeView.opacity = 0;
                }
            },
            /**
             *  Function to check if all required field being filled correctly. Save the user info to date storage if the user is not in users array yet. Log in user if the user is created
             * **/
            onSaveTap(args) {
                if (! this.is_passed) { // to check whether the user has enterred the correct id
                    this.u_id = this.parseIDInput();
                    if (this.u_id.length != 6 || this.u_id == '000000') {
                        this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                        this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                        return;
                    } else {
                        if (this.u_id === this.selected_user.id) {
                            this.is_passed = ! this.is_passed;
                        } else {
                            alert({
                                title: "ID not match",
                                message: "The ID you entered does not match our record.",
                                okButtonText: "OK",
                            });
                        }
                    }
                } else { // to check whether the user has enterred shift end time
                    if (! this.end_time_changed) {
                        this.$refs.eErrorLoginRef.nativeView.opacity = 1;
                        return;
                    }

                    const s_time_obj = this.$refs.sTimeLoginRef.nativeView.time;
                    const e_time_obj = this.$refs.eTimeLoginRef.nativeView.time;
                    let s_time = s_time_obj.toString().split(' ')[4].substring(0, 5);
                    let e_time = e_time_obj.toString().split(' ')[4].substring(0, 5);
                    const s_hour = s_time.split(":")[0];
                    const e_hour = e_time.split(":")[0];
                    let s_minute = s_time.split(":")[1];
                    let e_minute = e_time.split(":")[1];

                    const item = {
                        id: this.u_id,
                        shift_start: s_time,
                        shift_end: e_time,
                    };

                    this.startTimerForUser(parseInt(s_hour), 
                                           parseInt(s_minute), 
                                           parseInt(e_hour), 
                                           parseInt(e_minute));
                    this.activateUser(item);
                    this.parent_modal.close();
                }
            },
            /**
             *  Function to start timer when a user is loggied in
             *  [Description] - by deafult the timer will use the same date as the user creation date. 
             *                  However, if the shift end time has a smaller value than shift start time, increment the date by 1
             *  @param {Number} s_hour - the start hour in format of an int
             *  @param {Number} s_minute - the start minute in format of an int
             *  @param {Number} e_hour - the end hour in format of an int
             *  @param {Number} e_minute - the end minute in format of an int
             * **/
            startTimerForUser(s_hour, s_minute, e_hour, e_minute) {
                const today = new Date();
                let tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                const s_date = today.getDate();
                let e_date;
                if (e_hour > s_hour) { // no date change
                    e_date = today.getDate();
                } else if (e_hour == s_hour) {
                    if (e_minute > s_minute) { // no date change
                        e_date = today.getDate();
                    } else { // date change
                        e_date = tomorrow.getDate();
                    }
                } else { // date change
                    e_date = tomorrow.getDate();
                }
                
                console.log("=== Timer init === " + e_date + ' ' + e_hour + ' ' + e_minute);

                this.timer_obj = setInterval(() => {
                    const current = new Date();
                    const c_date = current.getDate();
                    const c_hour = current.getHours();
                    const c_minute = current.getMinutes();
                    
                    console.log("=== Timer running === " + c_date + ' ' + c_hour + ' ' + c_minute);
                    let user_time_up = false;
                    if (c_date > e_date) {
                        user_time_up = true;
                    } else if (c_date === e_date){
                        if (c_hour > e_hour) {
                            user_time_up = true;
                        } else if (c_hour === e_hour){
                            user_time_up = (c_minute >= e_minute);
                        }
                    }
                    if (user_time_up) {
                        this.endTimerForUser();

                    }
                }, 10000);

                this.startTimer(this.timer_obj);
            },
            /**
             *  Function to reset timer if user choose to extend timer by an hour
             *  @param {Number} duration - the total duration of the time interval in seconds
             * **/
            resetTimerForUser(duration) {
                let start = Date.now();
                console.log("=== Timer init === " + start);

                this.timer_obj = setInterval(() => {
                    const diff = duration - (((Date.now() - start) / 1000) | 0);
                    console.log("=== Timer running === " + diff / 60);

                    if (diff <= 0) {
                        start = Date.now() + 1000;
                    }
                    
                    if (Math.round(diff / 60) === 0) {
                        this.forceEndTimerForUser();
                    }
                }, 10000);

                this.startTimer(this.timer_obj);
            },
            /**
             *  Function to terminate timer. The user can choose to terminate immediately or to extend another hour
             * **/
            endTimerForUser() {
                const minutes_to_delay = 60;
                clearInterval(this.timer_obj);
                const user = this.users.find(elem => elem.id === this.curr_user_id);
                console.log("=== Login === timer stopped, check if logout");
                confirm({
                    message: `Your shift is ending. Comfirm automatic logout.`,
                    okButtonText: "Logout",
                    cancelButtonText: `Wait another ${minutes_to_delay} minutes`,
                }).then((result) => {
                    if (result) {
                        this.deactivateUser();
                        console.log("=== Login === timer stopped, logging out now");
                    } else {
                        this.resetTimerForUser(60 * minutes_to_delay);
                        console.log("=== Login === timer stopped, reset");
                    }
                });
                
            },
            /**
             *  Function to terminate the timer after user already extended the timer
             * **/
            forceEndTimerForUser() {
                clearInterval(this.timer_obj);
                this.deactivateUser();
                console.log("=== Login === second timer stopped, logging out now");
            },
            /**
             *  Function to close the current modal and return back to Dashboard
             * **/
            onCloseTap() {
                this.onBackHome();
            },
            /**
             *  Function to close current modal
             * **/
            onBackHome() {
                this.parent_modal.close();
            },
            /**
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                if (! this.is_passed) {
                    const layoutView = args.object;
                    layoutView.getViewById("user-login-a2").dismissSoftInput();
                }
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                if (this.$refs.loginUserGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.loginUserGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.formSetting.class = "login-user-ctnr tablet-landscape";
                    } else {
                        this.formSetting.class = "login-user-ctnr";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>