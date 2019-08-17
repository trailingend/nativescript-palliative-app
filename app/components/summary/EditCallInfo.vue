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
                               ref="nameFieldRef"
                               v-model="u_name"
                               @textChange="checkNameError"
                               hint="Enter your first and last name"/>
                    <Label row="2" col="0" class="call-e call-e1" 
                           text="Please enter first and last name" 
                           opacity="0" 
                           ref="nameErrorFieldRef" />
                    <Label row="3" col="0" class="call-q2 call-q" text="Intake Nurse ID #:" textWrap="true"/>
                    <TextField row="4" col="0"
                                id="call-a2"
                                class="call-a call-a2" 
                                hint="Enter your six digit ID number"
                                ref="idFieldRef"
                                @textChange="checkIDError"
                                keyboardType="phone"
                                editable="true" />
                    <Label row="5" col="0" class="call-e call-e2" 
                           text="Please enter a valid employee ID" 
                           opacity="0" 
                           ref="idErrorFieldRef"/>
                    <Label row="6" col="0" class="call-q3 call-q" text="Call Starts:" textWrap="true"/>
                    <TimePicker row="7" col="0" 
                                class="call-picker" 
                                :hour="u_call_s_h" :minute="u_call_s_m"
                                ref="sTimeFieldRef" />
                    <Label row="8" col="0" class="call-q4 call-q" text="Call Ends:" textWrap="true" />
                    <Label row="8" col="0" class="call-e call-e4" text="Please select end time" opacity="0" ref="timeErrorFieldRef" />
                    <TimePicker row="9" col="0" 
                                class="call-picker" 
                                :hour="u_call_e_h" :minute="u_call_e_m" 
                                ref="eTimeFieldRef"
                                @timeChange="onTimeChange"/>
                </GridLayout>
                <!-- </PreviousNextView> -->
                <Button class="form-btn call-btn" text="Save" @tap="onSaveTap" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
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

                call_s_time: '',
                call_e_time: '',
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
            prepareCallInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    const curr_user = this.users.find((elem) => { return elem.id === curr_log.nurse; });
                    this.u_id = curr_log.nurse;
                    this.u_name = (curr_user) ? curr_user.fullname : '';
                    this.u_fullname = (curr_user) ? curr_user.fullname : '';
                    this.u_call_s_h = curr_log.startTime.split(":")[0];
                    this.u_call_s_m = curr_log.startTime.split(":")[1];
                    this.$refs.idFieldRef.nativeView.text = this.u_id;
                }
            },
            checkNameError(args) {
                if (args.oldValue != '') {
                    if (args.value === '') {
                        this.$refs.nameErrorFieldRef.nativeView.opacity = 1;
                        this.$refs.nameFieldRef.nativeView.borderColor = '#ff1f00';
                    }
                } 
                if (args.oldValue === '') {
                    if (args.value != '') {
                        this.$refs.nameErrorFieldRef.nativeView.opacity = 0;
                        this.$refs.nameFieldRef.nativeView.borderColor = '#dbdbdb';
                    }
                } 
            },
            checkIDError(args) {
                if (args.value) {
                    const new_input = args.value.replace(/\D/g, '');
                    this.u_id = new_input.substring(0, Math.min(6, new_input.length));
                    this.$refs.idFieldRef.nativeView.text = this.u_id;

                    if (this.u_id.length != 6) {
                        this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                        this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                    } else {
                        this.$refs.idErrorFieldRef.nativeView.opacity = 0;
                        this.$refs.idFieldRef.nativeView.borderColor = '#dbdbdb';
                    } 
                }
            },
            onSaveTap(args) {
                if (this.u_name === '') {
                    this.$refs.nameErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.nameFieldRef.nativeView.borderColor = '#ff1f00';
                }
                if (this.u_id.length != 6 || this.u_id == '000000') {
                    this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                }
                if (! this.end_time_changed) {
                    this.$refs.timeErrorFieldRef.nativeView.opacity = 1;
                }
                if (this.u_name === '' || this.u_id.length != 6 || !this.end_time_changed) return;

                let s_minute = '' + this.$refs.sTimeFieldRef.nativeView.minute;
                let e_minute = '' + this.$refs.eTimeFieldRef.nativeView.minute;
                if (s_minute.length === 1) s_minute = '0' + s_minute;
                if (e_minute.length === 1) e_minute = '0' + e_minute;
                const call_item = {
                    id: this.log_id,
                    nurse_id: this.u_id,
                    nurse_name: formatUsernameForDisplay(this.u_name),
                    nurse_fullname: this.u_name.trim(),
                    call_start: this.$refs.sTimeFieldRef.nativeView.hour + ":" + s_minute,
                    call_end: this.$refs.eTimeFieldRef.nativeView.hour + ":" + e_minute,
                }
               
                this.saveCallInfo(call_item);

                if (this.users.find(elem => elem.id === this.u_id) === undefined) {
                    let color_idx = userColors.findIndex(elem => elem === this.users[this.users.length - 1].color);
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
                this.$modal.close();
            },
            onCloseTap() {
                this.$modal.close();
            },
            onTimeChange() {
                if (! this.end_time_changed) {
                    this.end_time_changed = true;
                    this.$refs.timeErrorFieldRef.nativeView.opacity = 0;
                }
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                layoutView.getViewById("call-a1").dismissSoftInput();
                layoutView.getViewById("call-a2").dismissSoftInput();
            },
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