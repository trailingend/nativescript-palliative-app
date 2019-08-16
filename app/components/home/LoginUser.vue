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
                <Label row="1" col="0" class="login-q3 login-q" text="Shift Starts:" textWrap="true"/>
                <Label row="1" col="0" class="login-e login-e3" text="Please select start time" opacity="0" ref="sErrorFieldRef" />
                <TimePicker row="2" col="0" 
                            class="login-picker" 
                            ref="sTimeFieldRef"
                            @timeChange="onStartTimeChange" />
                <Label row="3" col="0" class="login-q4 login-q" text="Shift Ends:" textWrap="true" />
                <Label row="3" col="0" class="login-e login-e4" text="Please select end time" opacity="0" ref="eErrorFieldRef" />
                <TimePicker row="4" col="0" 
                            class="login-picker" 
                            ref="eTimeFieldRef"
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
    import { alert }  from "tns-core-modules/ui/dialogs";
    import { formatShiftTime, formatUsernameForDisplay, userColors } from '../../scripts/common';

    export default {
        data() {
            return {
                u_id: '',
                u_name: '',
                u_fullname: '',

                is_passed: false,
                start_time_changed: false,
                end_time_changed: false,

                formSetting: {
                    class: "login-user-ctnr",
                },
            }
        },
        mounted() {
        },
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
                'activateUser'
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
                    this.$refs.sErrorFieldRef.nativeView.opacity = 0;
                }
            },
            onEndTimeChange() {
                if (! this.end_time_changed) {
                    this.end_time_changed = true;
                    this.$refs.eErrorFieldRef.nativeView.opacity = 0;
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
                        this.$refs.sErrorFieldRef.nativeView.opacity = 1;
                    }
                    if (! this.end_time_changed) {
                        this.$refs.eErrorFieldRef.nativeView.opacity = 1;
                    }
                    if (! this.start_time_changed || ! this.end_time_changed) return;

                    let s_minute = '' + this.$refs.sTimeFieldRef.nativeView.minute;
                    let e_minute = '' + this.$refs.eTimeFieldRef.nativeView.minute;
                    if (s_minute.length === 1) s_minute = '0' + s_minute;
                    if (e_minute.length === 1) e_minute = '0' + e_minute;
                    const item = {
                        id: this.u_id,
                        shift_start: this.$refs.sTimeFieldRef.nativeView.hour + ":" + s_minute,
                        shift_end: this.$refs.eTimeFieldRef.nativeView.hour + ":" + e_minute,
                    }
                    this.activateUser(item);
                    this.parent_modal.close();
                }
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