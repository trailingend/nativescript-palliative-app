<template>
    <Page class="page reason-page" @navigatingFrom="onNavigatingFrom">
        <GridLayout rows="auto, *, auto" columns="*" 
                    :class="ctnrSetting.class" 
                    ref="reasonGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">

            <Label row="0" col="0" class="reason-title" :text="is_user_editing ? 'Edit User' : 'Reason for edits'" ></Label> 

            <ScrollView row="1" col="0">
                <StackLayout  class="reason-main-ctnr">
                    <stackLayout v-if="is_user_editing" >
                        <Label class="reason-q1 reason-u-q" text="Intake Nurse Name:" textWrap="true"/>
                        <TextField id="reason-a1"
                                   class="reason-a1 reason-a" 
                                   ref="nameReasonRef"
                                   v-model="u_name"
                                   @textChange="checkNameError"
                                   hint="Enter your first and last name"/>
                        <Label row="2" col="0" class="reason-e reason-e1" 
                               text="Please enter first and last name" 
                               opacity="0" 
                               ref="nameEReasonRef" />
                        <Label row="3" col="0" class="reason-q2 reason-u-q" text="Intake Nurse ID #:" textWrap="true"/>
                        <TextField row="4" col="0"
                                    id="reason-a2"
                                    class="reason-a reason-a2" 
                                    hint="Enter your six digit ID number"
                                    v-model="u_id"
                                    ref="idReasonRef"
                                    @textChange="checkIDError"
                                    keyboardType="phone"
                                    editable="true" />
                        <Label row="5" col="0" class="reason-e reason-e2" 
                               text="Please enter a valid employee ID" 
                               opacity="0" 
                               ref="idEReasonRef"/>
                    </stackLayout>
                    <StackLayout v-else class="reason-unit-ctnr">
                        <Label text="Explain your edits and where they were made" textWrap="true" class="reason-q"/>
                        <SingleSelect :question_id="c_q_id"
                                      :answers="preset_reasons"
                                      :responses="retrieveSavedResponses()"
                                      @answerChange="onAnswerChange" />
                        <FlexboxLayout alignItems="center" justifyContent="space-between" class="reason-user-ctnr">
                            <Label class="reason-u-text" text="Edited by" />
                            <StackLayout class="reason-head" v-show="this.u_id != ''" :background="user_head_color"></StackLayout>
                            <Label class="reason-u-text reason-u-text-bold" flexGrow="2" :text="user_name" :color="user_text_color" :opacity="is_user_editing ? 0 : 1" />
                            <Label class="reason-u-text" :text="this.u_id != '' ? 'Change User' : 'Add User'" @tap="onChangeUser" />
                        </FlexboxLayout>
                    </StackLayout>
                </StackLayout>
            </ScrollView>

            <Button row="2" col="0" class="form-btn reason-btn" :text="is_user_editing? 'Save User' : 'submit'" @tap="onSubmitTap" />

            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
        </GridLayout>
    </Page>
</template>

<script>
    import SingleSelect from '../answers/SingleSelect.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { alert }  from "tns-core-modules/ui/dialogs";
    import { formatUsernameForDisplay, userColors, logMonths } from '../../scripts/common';
    
    export default {
        data() {
            return {
                c_id: '',
                c_q_id: 0,
                c_reason: '',
                user_text_color: '#000000',
                user_head_color: '#a57ed7',
                user_name: '',
                responses: [],

                u_name: '',
                u_id: '',
                preset_reasons: [
                    {
                        "id": 0,
                        "answer": "Correcting errors",
                        "question": 0
                    },
                    {
                        "id": 1,
                        "answer": "Generic edits (no errors)",
                        "question": 0
                    }
                ],

                is_user_editing: false,

                ctnrSetting: {
                    class: "reason-ctnr",
                },
            }
        },
        created() {
        },
        mounted() {
            this.loadExistingInfo();
        },
        components: {
            SingleSelect
        },
        props: {
            log_id: {
                type: String,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'users',
                'curr_user_id'
            ]),
		},
        methods: {
            ...mapActions([
                'changeClientHistory',
                'saveUserInfo'
            ]),
            loadExistingInfo() {
                if (this.log_id) {
                    if (this.curr_user_id != -1) {
                        const user_idx = this.users.findIndex(elem => elem.id === this.curr_user_id);
                        if (user_idx > 0) {
                            this.user_name = this.users[user_idx].name;
                            this.user_head_color = this.users[user_idx].color;
                            this.user_text_color = '#000000';
                            this.u_name = this.users[user_idx].fullname;
                            this.u_id = this.curr_user_id;
                        }
                    } else {
                        this.user_name = 'Unknown User';
                        this.user_text_color = '#ff1f00';
                    }
                }
            },
            retrieveSavedResponses() {
                return [];
            },
            onAnswerChange(data) {
                this.responses = data;
            },
            saveReason(args) {
                const entry = {
                    log_id: this.log_id,
                    content: args.value
                };
                this.changeClientReason(entry);
            },
            checkNameError(args) {
                if (args.oldValue.trim() != '') {
                    if (args.value.trim() === '') {
                        this.$refs.nameEReasonRef.nativeView.opacity = 1;
                        this.$refs.nameReasonRef.nativeView.borderColor = '#ff1f00';
                    }
                } 
                if (args.oldValue.trim() === '') {
                    if (args.value.trim() != '') {
                        this.$refs.nameEReasonRef.nativeView.opacity = 0;
                        this.$refs.nameReasonRef.nativeView.borderColor = '#dbdbdb';
                    }
                } 
            },
            checkIDError(args) {
                if (args.value) {
                    const new_input = args.value.replace(/\D/g, '');
                    this.u_id = new_input.substring(0, Math.min(6, new_input.length));
                    this.$refs.idReasonRef.nativeView.text = this.u_id;

                    if (this.u_id.length != 6) {
                        this.$refs.idEReasonRef.nativeView.opacity = 1;
                        this.$refs.idReasonRef.nativeView.borderColor = '#ff1f00';
                    } else {
                        this.$refs.idEReasonRef.nativeView.opacity = 0;
                        this.$refs.idReasonRef.nativeView.borderColor = '#dbdbdb';
                    } 
                }
            },
            recordTime() {
                const today = new Date();
                const date = today.getDate() + ' ' + logMonths(today.getMonth()) + ' ' + today.getFullYear();
                const minute = (today.getMinutes() < 10) ? `0${today.getMinutes()}` : `${today.getMinutes()}`;
                const time = today.getHours() + ':' + minute;
                const dateTime = time + ' | ' + date;
                return dateTime;
            },
            onUserSaveTap(args) {
                if (this.u_name.trim() === '') {
                    this.$refs.nameEReasonRef.nativeView.opacity = 1;
                    this.$refs.nameReasonRef.nativeView.borderColor = '#ff1f00';
                }
                if (this.u_id.length != 6 || this.u_id == '000000') {
                    this.$refs.idEReasonRef.nativeView.opacity = 1;
                    this.$refs.idReasonRef.nativeView.borderColor = '#ff1f00';
                }
                if (this.u_name.trim() === '' || this.u_id.length != 6) return;

                const saved_user = this.users.find(elem => elem.id === this.u_id);
                if (saved_user === undefined) {
                    let color_idx;
                    if (this.users.length === 0) color_idx = 0;
                    else color_idx = userColors.findIndex(elem => elem === this.users[this.users.length - 1].color);
                    color_idx = (color_idx === userColors.length - 1) ? 0 : color_idx + 1;
                    const user_item = {
                        id: this.u_id,
                        name: formatUsernameForDisplay(this.u_name.trim()),
                        fullname: this.u_name.trim(),
                        shift_start: '',
                        shift_end: '',
                        color: userColors[color_idx],
                    }
                    this.saveUserInfo(user_item);

                    this.user_head_color = userColors[color_idx];
                } else {
                    this.user_head_color = saved_user.color;
                }

                this.user_name = formatUsernameForDisplay(this.u_name);
                this.user_text_color = '#000000';
                this.is_user_editing = false;
            },
            onSubmit() {
                if (this.u_id === '') {
                    alert({
                        title: "Missing User Information",
                        message: "Please complete before continuing.",
                        okButtonText: "OK"
                    });
                } else {
                    const hist_item = {
                        log_id: this.log_id,
                        content: {
                            nurse: this.u_id,
                            recordTime: this.recordTime(),
                            reason: this.responses
                        }
                    }
                    this.changeClientHistory(hist_item);
                    this.$modal.close(true);
                }
            },
            onChangeUser() {
                // this.$refs.idReasonRef.nativeView.text = this.curr_user_id;
                this.is_user_editing = true;
            },
            onSubmitTap(args) {
                if (this.is_user_editing) {
                    this.onUserSaveTap(args);
                } else {
                    this.onSubmit();
                }
            },
            onCloseTap() {
                this.$modal.close(false);
            },
            clearTextfieldFocus(args) {
                if (this.is_user_editing) {
                    const a1Textfield = args.object.getViewById(`reason-a1`);
                    const a2Textfield = args.object.getViewById(`reason-a1`);
                    a1Textfield.dismissSoftInput();
                    a2Textfield.dismissSoftInput();
                } else {
                    const aTextfield = args.object.getViewById(`answers-free-${this.c_q_id}`);
                    aTextfield.dismissSoftInput();
                }
            },
            onNavigatingFrom() {
                
            },
            onLayoutUpdate() {
                if (this.$refs.reasonGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.reasonGridRef.nativeView.getMeasuredWidth() );
                    if (width > 800) {
                        this.ctnrSetting.class = "reason-ctnr tablet-landscape";
                    } else {
                        this.ctnrSetting.class = "reason-ctnr";
                    }
                }
            },
            
        }
        
    };
</script>