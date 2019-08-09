<template>
     <Page class="page add-user-page">
        <GridLayout rows="auto, *" columns="*" 
                    ref="addUserGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <StackLayout row="0" col="0" rowSpan="2" :class="formSetting.class">
                <Label class="add-user-title" text="user information" ></Label>    
                <!-- <PreviousNextView> -->
                <GridLayout rows="auto, auto, auto, auto, auto, auto, auto, auto, auto, auto" columns="*">
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
                    <Label row="3" col="0" class="add-q2 add-q" text="Employee ID #:" textWrap="true"/>
                    <MaskedTextField row="4" col="0"
                                    id="user-add-a2"
                                    class="add-a2 add-a" 
                                    v-model="u_id"
                                    ref="idFieldRef"
                                    mask="000000"
                                    hint="######"
                                    @textChange="checkIDError"
                                    keyboardType="phone" />
                    <Label row="5" col="0" class="add-e add-e2" 
                           text="Please enter a valid employee ID" 
                           opacity="0" 
                           ref="idErrorFieldRef"/>
                    <Label row="6" col="0" class="add-q3 add-q" text="Shift Starts:" textWrap="true"/>
                    <TimePicker row="7" col="0" class="add-picker" v-model="u_shift_start" />
                    <Label row="8" col="0" class="add-q4 add-q" text="Shift Ends:" textWrap="true"/>
                    <TimePicker row="9" col="0" class="add-picker" v-model="u_shift_end" />
                </GridLayout>
                <!-- </PreviousNextView> -->
                <Button class="form-btn add-user-btn" text="Save" @tap="onSaveTap" />
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
                u_shift_start: 'Sun Dec 31 1899 03:01:00 GMT-0800 (PST)',
                u_shift_end: 'Sun Dec 31 1899 03:01:00 GMT-0800 (PST)',

                formSetting: {
                    class: "add-user-ctnr",
                },
            }
        },
        mounted() {
        },
        components: {
        },
        props: ['parent_modal', 'color_idx'],
        computed: {
            ...mapGetters([
			]),
		},
        methods: {
            ...mapActions([
                'saveUserInfo'
            ]),
            prepareTutorial() {
                console.log("go to tutorial")
                this.$showModal(Tutorial, { 
                    fullscreen: true,
                    props: {
                        is_first_time: true,
                        parent_modal: this.parent_modal,
                    }
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
            onSaveTap(args) {
                if (this.u_name === '') {
                    this.$refs.nameErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.nameFieldRef.nativeView.borderColor = '#ff1f00';
                }
                const id_to_check = this.parseIDInput();
                if (id_to_check.length != 6 || id_to_check == '000000') {
                    this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                }
                if (this.u_name === '' || id_to_check.length != 6) return;
                const user_name = (this.u_name != '') ? this.u_name : 'Unknown';
                const item = {
                    id: this.parseIDInput(),
                    name: formatUsernameForDisplay(user_name),
                    shift_start: formatShiftTime(this.u_shift_start),
                    shift_end: formatShiftTime(this.u_shift_end),
                    color: userColors[this.color_idx],
                }
                this.saveUserInfo(item);

                this.prepareTutorial();
            },
            onCloseTap() {
                this.onBackHome();
            },
            onBackHome() {
                this.parent_modal.close();
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                layoutView.getViewById("user-add-a1").dismissSoftInput();
                layoutView.getViewById("user-add-a2").dismissSoftInput();
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