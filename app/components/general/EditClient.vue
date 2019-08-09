<template>
    <Page class="page edit-client-page" @navigatingFrom="onNavigatingFrom">
        <GridLayout rows="auto, *" columns="*" 
                    :class="ctnrSetting.class" 
                    ref="editClientGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <ScrollView>
                <StackLayout row="1" col="0" class="client-main-ctnr">
                    <Label class="client-title" text="client Informtaion" ></Label>   
                        
                    <!-- <PreviousNextView>              -->
                        <GridLayout :rows="gridSetting.rows" :columns="gridSetting.columns">
                            <Label :row="gridSetting.children.q1.row" 
                                    :col="gridSetting.children.q1.col"
                                    class="client-q client-q1" 
                                    text="Callback #:" 
                                    textWrap="true"/>
                            <TextField :row="gridSetting.children.a1.row" 
                                        :col="gridSetting.children.a1.col"
                                        id="client-a1"
                                        class="client-a client-a1" 
                                        ref="phoneFieldRef"
                                        hint="(888) 888-8888"
                                        keyboardType="phone"
                                        @textChange="onPhoneChange"
                                        @blur="onPhoneEnterred"
                                        editable="true" />
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
                                    text="client name:" 
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
                                    text="Caller name:" 
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
                                    text="Relation to client:" 
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
                            <Label :row="gridSetting.children.q5.row" 
                                    :col="gridSetting.children.q5.col"
                                    class="client-q client-q5" 
                                    text="Intake nurse ID:" 
                                    textWrap="true"/>
                            <TextField :row="gridSetting.children.a5.row" 
                                        :col="gridSetting.children.a5.col"
                                        id="client-a5"
                                        class="client-a client-a5" 
                                        hint="i.e. 888888"
                                        ref="idFieldRef"
                                        @textChange="onIdChange"
                                        editable="true" />
                            <Label :row="gridSetting.children.e5.row" 
                                    :col="gridSetting.children.e5.col"
                                    :colSpan="gridSetting.children.e5.colSpan"
                                    class="client-e client-e5" 
                                    text="Please enter your work ID" 
                                    ref="idErrorFieldRef"
                                    opacity="0" />
                        </GridLayout>
                    <!-- </PreviousNextView> -->

                    <StackLayout>
                        <Label class="client-t client-t-info" text="General Client Information" textWrap="true"/>
                        <Label class="client-d" text="Ex. age, diagnosis, history, medical profile, care plan, GOC." textWrap="true"/>
                        <StackLayout class="client-free-ctnr">
                            <TextView v-model="c_info" 
                                    id="client-free"
                                    class="client-free"
                                    hint="Ex. age, diagnosis, history, medical profile, care plan, GOC."
                                    @textChange="resetTextviewModel"
                                    ref="editClientRef"
                                    editable="true" />
                        </StackLayout>
                    </StackLayout>
                    <Button class="form-btn client-btn" text="save" @tap="onSaveTap" />
                </StackLayout>
            </ScrollView>

            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
        </GridLayout>
    </Page>
</template>

<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { dialogConsent, 
             logMonths, 
             formatPhoneNum, 
             editGridChildPortrait, 
             editGridChildLandscape } from '../../scripts/common';

    export default {
        data() {
            return {
                c_id: '',
                c_phone: '',
                c_client: '',
                c_caller: '',
                c_relation: '',
                c_info: '',
                c_nurse: '',

                ctnrSetting: {
                    class: "client-ctnr",
                },
                gridSetting: {
                    rows: "auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto,",
                    columns: "*",
                    children: editGridChildPortrait,
                }
            }
        },
        created() {
        },
        mounted() {
            this.loadExistingInfo();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
            ]),
		},
        methods: {
            ...mapActions([
                'changeClientInfo',
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getDate() + ' / ' + logMonths(today.getMonth()) + ' / ' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;

                this.created_time = dateTime;
                this.c_id = '' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes();
            },
            loadExistingInfo() {
                if (this.log_id) {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    this.c_phone = curr_log.phone;
                    this.c_client = curr_log.client;
                    this.c_caller = curr_log.caller;
                    this.c_relation = curr_log.relation;
                    this.c_nurse = curr_log.nurse.replace(/\D/g, '').substring(0, 6);
                    this.c_info = curr_log.info;
                    this.$refs.phoneFieldRef.nativeView.text = formatPhoneNum(this.c_phone);
                    this.$refs.idFieldRef.nativeView.text = formatPhoneNum(this.c_nurse);
                    // this.$refs.editClientRef.nativeView.text = curr_log.info;
                }
            },
            resetTextviewModel(args) {
                this.c_info = args.value;
                // this.$refs.editClientRef.nativeView.text = args.value;
            },
            onSaveTap(args) {
                const client_phone = (this.c_phone === '') ? '8888888888' : this.c_phone;
                const caller_name = (this.c_caller === '') ? 'Anonymous' : this.c_caller;
                const client_name = (this.c_client === '') ? 'John Doe' : this.c_client;
                const client_relation = (this.c_relation === '') ? 'Unknown' : this.c_relation;

                if (client_phone.length != 10) {
                    this.$refs.phoneErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.phoneFieldRef.nativeView.borderColor = '#ff1f00';
                    return;
                }

                if (this.c_nurse.length != 6) {
                    this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                    return;
                }

                const entry = {
                    id: this.log_id,
                    phone: client_phone,
                    caller: caller_name,
                    client: client_name,
                    relation: client_relation,
                    nurse: this.c_nurse,
                    info: this.c_info,
                };
                this.changeClientInfo(entry);

                this.$modal.close();
            },
            onPhoneChange(args) {
                const new_input = args.value.replace(/\D/g, '');
                this.c_phone = new_input.substring(0, Math.min(10, new_input.length));
                this.$refs.phoneFieldRef.nativeView.text = formatPhoneNum(this.c_phone);

                if (this.c_phone.length != 10) {
                    this.$refs.phoneErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.phoneFieldRef.nativeView.borderColor = '#ff1f00';
                } else {
                    this.$refs.phoneErrorFieldRef.nativeView.opacity = 0;
                    this.$refs.phoneFieldRef.nativeView.borderColor = '#dbdbdb';
                }
            },
            onIdChange(args) {
                const new_input = args.value.replace(/\D/g, '');
                this.c_nurse = new_input.substring(0, Math.min(6, new_input.length));
                this.$refs.idFieldRef.nativeView.text = this.c_nurse;

                if (this.c_nurse.length != 6) {
                    this.$refs.idErrorFieldRef.nativeView.opacity = 1;
                    this.$refs.idFieldRef.nativeView.borderColor = '#ff1f00';
                } else {
                    this.$refs.idErrorFieldRef.nativeView.opacity = 0;
                    this.$refs.idFieldRef.nativeView.borderColor = '#dbdbdb';
                }
            },
            onPhoneEnterred() {
                // this.$refs.phoneFieldRef.nativeView.text = formatPhoneNum(this.c_phone);
            },
            onCloseTap() {
                this.$modal.close();
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                for (let i = 1; i <= 5; i++) {
                    const aTextfield = layoutView.getViewById(`client-a${i}`);
                    aTextfield.dismissSoftInput();
                }
            },
            onNavigatingFrom() {
                
            },
            onLayoutUpdate() {
                if (this.$refs.editClientGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.editClientGridRef.nativeView.getMeasuredWidth() );
                    if (width > 800) {
                        this.ctnrSetting.class = "client-ctnr tablet-landscape";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto, auto, auto, auto, auto, auto, auto,",
                            columns: "auto, *",
                            children: editGridChildLandscape,
                        }
                    } else {
                        this.ctnrSetting.class = "client-ctnr";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto,",
                            columns: "*",
                            children: editGridChildPortrait,
                        }
                    }
                }
            },
            
        }
        
    };
</script>