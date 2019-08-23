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
                start_time_changed: true, //Disabled checking for start_time input
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
            onStartTimeChange() {
                if (! this.start_time_changed) {
                    this.start_time_changed = true;
                    this.$refs.sErrorLoginRef.nativeView.opacity = 0;
                }
            },
            onEndTimeChange() {
                if (! this.end_time_changed) {
                    this.end_time_changed = true;
                    this.$refs.eErrorLoginRef.nativeView.opacity = 0;
                }
            },
            onSaveTap(args) {
                if (! this.is_passed) { 
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
                } else {
                    if (! this.start_time_changed) {
                        this.$refs.sErrorLoginRef.nativeView.opacity = 1;
                    }
                    if (! this.end_time_changed) {
                        this.$refs.eErrorLoginRef.nativeView.opacity = 1;
                    }
                    if (! this.start_time_changed || ! this.end_time_changed) return;

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
            forceEndTimerForUser() {
                clearInterval(this.timer_obj);
                this.deactivateUser();
                console.log("=== Login === second timer stopped, logging out now");
            },
            onCloseTap() {
                this.onBackHome();
            },
            onBackHome() {
                this.parent_modal.close();
            },
            clearTextfieldFocus(args) {
                if (! this.is_passed) {
                    const layoutView = args.object;
                    layoutView.getViewById("user-login-a2").dismissSoftInput();
                }
            },
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