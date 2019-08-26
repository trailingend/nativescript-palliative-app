<template>
     <Page class="page add-user-page">
        <GridLayout rows="auto, auto, *, auto" columns="*" 
                    ref="addUserGridRef" 
                    :class="formSetting.class"
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            
            <Label row="1" col="0" class="add-user-title" :text="is_login ? 'sign in' : 'user information'" ></Label>  
               
            <GridLayout v-if="!is_login"
                        row="2" col="0" rowSpan="2" class="add-content-ctnr"
                        rows="auto, auto, auto, auto, auto, auto" columns="*">
                <Label row="0" col="0" class="add-q1 add-q" text="Full name:" textWrap="true"/>
                <TextField row="1" col="0" 
                            id="user-add-a1"
                            class="add-a1 add-a" 
                            ref="nameFieldAddUserRef"
                            v-model="u_name"
                            @textChange="checkNameError"
                            hint="Firstname Lastname"/>
                <Label row="2" col="0" class="add-e add-e1" 
                        text="Please enter your firstname and lastname" 
                        opacity="0" 
                        ref="nameErrorAddRef" />
                <Label row="3" col="0" class="add-q add-q2" text="Employee ID #:" textWrap="true"/>
                <MaskedTextField row="4" col="0"
                                id="user-add-a2"
                                class="add-a2 add-a" 
                                ref="idFieldAddUserRef"
                                mask="000000"
                                hint="######"
                                @textChange="checkIDError"
                                keyboardType="phone" />
                <Label row="5" col="0" class="add-e add-e2" 
                        text="Please enter a valid employee ID" 
                        opacity="0" 
                        ref="idErrorFieldAddUserRef"/>
            </GridLayout>

            <StackLayout v-else
                        row="2" col="0" rowSpan="2" class="add-content-ctnr">
                <!-- <Label row="0" col="0" class="add-e add-e3" text="Please select start time" opacity="0" ref="sErrorAddRef" /> -->
                <Label class="add-q" text="Shift Starts:" />
                <TimePicker class="add-picker" 
                            ref="sTimeAddRef"
                            @timeChange="onStartTimeChange" />
                <GridLayout rows="auto" columns="auto, *" >
                    <Label row="0" col="0" class="add-q" text="Shift Ends:" />
                    <Label row="0" col="1" class="add-e add-e4" text="Please select end time" opacity="0" ref="eErrorAddRef" />
                </GridLayout>
                <TimePicker class="add-picker" 
                            ref="eTimeAddRef"
                            @timeChange="onEndTimeChange"/>
            </StackLayout>

            <Button row="3" col="0" class="form-btn add-user-btn" :text="is_login ? 'Start' : 'Save'" @tap="onSaveTap" />
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import Tutorial from '../tutorials/Tutorial.vue';
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { confirm }  from "tns-core-modules/ui/dialogs";
    import { formatShiftTime, formatUsernameForDisplay, userColors } from '../../scripts/common';

    export default {
        data() {
            return {
                u_id: '',
                u_name: '',
                u_fullname: '',

                is_login: false,
                start_time_changed: true,
                end_time_changed: false,

                formSetting: {
                    class: "add-user-ctnr",
                },
            }
        },
        mounted() {
        },
        components: {
        },
        props: ['parent_modal'],
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
            prepareTutorial() {
                this.$showModal(Tutorial, { 
                    fullscreen: true,
                    props: {
                        is_first_time: true,
                    }
                }).then(() => {
                    this.parent_modal.close();
                });
            },
            parseIDInput() {
                let user_ID = '000000';
                if (this.$refs.idFieldAddUserRef) {
                    if (this.$refs.idFieldAddUserRef.nativeView.text != null 
                        && this.$refs.idFieldAddUserRef.nativeView.text != '') {
                        const curr_val = this.$refs.idFieldAddUserRef.nativeView.text;
                        user_ID = curr_val.replace(/\D/g, '').substring(0, 6);
                    }
                }
                return user_ID;
            },
            checkNameError(args) {
                if (args.oldValue.trim() != '') {
                    if (args.value.trim() === '') {
                        this.$refs.nameErrorAddRef.nativeView.opacity = 1;
                        this.$refs.nameFieldAddUserRef.nativeView.borderColor = '#ff1f00';
                    }
                } 
                if (args.oldValue.trim() === '') {
                    if (args.value.trim() != '') {
                        this.$refs.nameErrorAddRef.nativeView.opacity = 0;
                        this.$refs.nameFieldAddUserRef.nativeView.borderColor = '#dbdbdb';
                    }
                } 
            },
            checkIDError(args) {
                const id_to_check = this.parseIDInput();
                if (id_to_check.length != 6) {
                    this.$refs.idErrorFieldAddUserRef.nativeView.opacity = 1;
                    this.$refs.idFieldAddUserRef.nativeView.borderColor = '#ff1f00';
                } else {
                    this.$refs.idErrorFieldAddUserRef.nativeView.opacity = 0;
                    this.$refs.idFieldAddUserRef.nativeView.borderColor = '#dbdbdb';
                } 
            },
            onStartTimeChange() {
                if (! this.start_time_changed) {
                    this.start_time_changed = true;
                    // this.$refs.sErrorAddRef.nativeView.opacity = 0;
                }
            },
            onEndTimeChange() {
                if (! this.end_time_changed) {
                    this.end_time_changed = true;
                    this.$refs.eErrorAddRef.nativeView.opacity = 0;
                }
            },
            onSaveTap(args) {
                if (! this.is_login) { 
                    if (this.u_name.trim() === '') {
                        this.$refs.nameErrorAddRef.nativeView.opacity = 1;
                        this.$refs.nameFieldAddUserRef.nativeView.borderColor = '#ff1f00';
                    }
                    this.u_id = this.parseIDInput();
                    if (this.u_id.length != 6 || this.u_id == '000000') {
                        this.$refs.idErrorFieldAddUserRef.nativeView.opacity = 1;
                        this.$refs.idFieldAddUserRef.nativeView.borderColor = '#ff1f00';
                    }
                    if (this.u_name.trim() === '' || this.u_id.length != 6) {
                        return;
                    } else {
                        this.is_login = ! this.is_login;
                    }

                    const user_name = (this.u_name.trim() != '') ? this.u_name.trim() : 'Unknown';
                    let color_idx = userColors.findIndex((elem) => {
                        if (this.users.length === 0) return false;
                        else return elem === this.users[this.users.length - 1].color;
                    });
                    color_idx = (color_idx === userColors.length - 1) ? 0 : color_idx + 1;
                    console.log("in save tap of add user " + color_idx)
                    const item = {
                        id: this.parseIDInput(),
                        name: formatUsernameForDisplay(user_name),
                        fullname: user_name,
                        shift_start: '',
                        shift_end: '',
                        color: userColors[color_idx],
                    }
                    this.saveUserInfo(item);
                } else {
                    if (! this.start_time_changed) {
                        // this.$refs.sErrorAddRef.nativeView.opacity = 1;
                    }
                    if (! this.end_time_changed) {
                        this.$refs.eErrorAddRef.nativeView.opacity = 1;
                    }
                    if (! this.start_time_changed || ! this.end_time_changed) return;

                    const s_time_obj = this.$refs.sTimeAddRef.nativeView.time;
                    const e_time_obj = this.$refs.eTimeAddRef.nativeView.time;
                    let s_time = s_time_obj.toString().split(' ')[4].substring(0, 5);
                    let e_time = e_time_obj.toString().split(' ')[4].substring(0, 5);
                    const s_hour = s_time.split(":")[0];
                    const e_hour = e_time.split(":")[0];
                    let s_minute = s_time.split(":")[1];
                    let e_minute = e_time.split(":")[1];
                    
                    const item = {
                        id: this.u_id,
                        shift_start: s_hour + ":" + s_minute,
                        shift_end: e_hour + ":" + e_minute,
                    }

                    this.startTimerForUser(parseInt(s_hour), 
                                           parseInt(s_minute), 
                                           parseInt(e_hour), 
                                           parseInt(e_minute));
                    this.activateUser(item);
                    this.prepareTutorial();
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
                if (! this.is_login) {
                    const layoutView = args.object;
                    layoutView.getViewById("user-add-a1").dismissSoftInput();
                    layoutView.getViewById("user-add-a2").dismissSoftInput();
                }
            },
            onLayoutUpdate() {
                if (this.$refs.addUserGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.addUserGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.formSetting.class = "add-user-ctnr tablet-landscape";
                    } else {
                        this.formSetting.class = "add-user-ctnr";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>