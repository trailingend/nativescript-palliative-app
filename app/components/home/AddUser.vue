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
                            ref="nameFieldRef"
                            v-model="u_name"
                            @textChange="checkNameError"
                            hint="Firstname Lastname"/>
                <Label row="2" col="0" class="add-e add-e1" 
                        text="Please enter your firstname and lastname" 
                        opacity="0" 
                        ref="nameErrorFieldRef" />
                <Label row="3" col="0" class="add-q add-q2" text="Employee ID #:" textWrap="true"/>
                <MaskedTextField row="4" col="0"
                                id="user-add-a2"
                                class="add-a2 add-a" 
                                ref="idFieldRef"
                                mask="000000"
                                hint="######"
                                @textChange="checkIDError"
                                keyboardType="phone" />
                <Label row="5" col="0" class="add-e add-e2" 
                        text="Please enter a valid employee ID" 
                        opacity="0" 
                        ref="idErrorFieldRef"/>
            </GridLayout>

            <GridLayout v-else
                        row="2" col="0" rowSpan="2" class="add-content-ctnr"
                        rows="auto, auto, auto, auto" columns="*">
                <Label row="0" col="0" class="add-q add-q3" text="Shift Starts:" color="black"/>
                <Label row="0" col="0" class="add-e add-e3" text="Please select start time" opacity="0" ref="sErrorFieldRef" />
                <TimePicker row="1" col="0" 
                            class="add-picker" 
                            ref="sTimeFieldRef"
                            @timeChange="onStartTimeChange" />
                <Label row="2" col="0" class="add-q4 add-q" text="Shift Ends:" textWrap="true" />
                <Label row="2" col="0" class="add-e add-e4" text="Please select end time" opacity="0" ref="eErrorFieldRef" />
                <TimePicker row="3" col="0" 
                            class="add-picker" 
                            ref="eTimeFieldRef"
                            @timeChange="onEndTimeChange"/>
            </GridLayout>

            <Button row="3" col="0" class="form-btn add-user-btn" :text="is_login ? 'Start' : 'Save'" @tap="onSaveTap" />
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

                is_login: false,
                start_time_changed: false,
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
                'activateUser'
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
                if (this.$refs.idFieldRef) {
                    if (this.$refs.idFieldRef.nativeView.text != null 
                        && this.$refs.idFieldRef.nativeView.text != '') {
                        const curr_val = this.$refs.idFieldRef.nativeView.text;
                        user_ID = curr_val.replace(/\D/g, '').substring(0, 6);
                    }
                }
                return user_ID;
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
                if (! this.is_login) { 
                    if (this.u_name === '') {
                        this.$refs.nameErrorFieldRef.nativeView.opacity = 1;
                        this.$refs.nameFieldRef.nativeView.borderColor = '#ff1f00';
                    }
                    this.u_id = this.parseIDInput();
                    if (this.u_id.length != 6 || this.u_id == '000000') {
                        this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                        this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                    }
                    if (this.u_name === '' || this.u_id.length != 6) {
                        return;
                    } else {
                        this.is_login = ! this.is_login;
                    }

                    const user_name = (this.u_name != '') ? this.u_name : 'Unknown';
                    let color_idx = userColors.findIndex(elem => elem === this.users[this.users.length - 1].color);
                    color_idx = (color_idx === userColors.length - 1) ? 0 : color_idx + 1;
                    console.log("in save tap of add user " + color_idx)
                    const item = {
                        id: this.parseIDInput(),
                        name: formatUsernameForDisplay(user_name),
                        fullname: user_name.trim(),
                        shift_start: '',
                        shift_end: '',
                        color: userColors[color_idx],
                    }
                    this.saveUserInfo(item);
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
                    this.prepareTutorial();
                }
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