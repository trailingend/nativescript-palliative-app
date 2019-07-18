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
                        
                    <PreviousNextView>             
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
                                        v-model="input_phone" 
                                        hint="(888) 888-8888"
                                        keyboardType="phone"
                                        @blur="onPhoneEntered"
                                        editable="true" />
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
                            <Label :row="gridSetting.children.q5.row" 
                                    :col="gridSetting.children.q5.col"
                                    class="client-q client-q5" 
                                    text="Intake nurse ID:" 
                                    textWrap="true"/>
                            <TextField :row="gridSetting.children.a5.row" 
                                        :col="gridSetting.children.a5.col"
                                        id="client-a5"
                                        class="client-a client-a5" 
                                        v-model="c_nurse" 
                                        hint="i.e. 888888"
                                        editable="true" />
                        </GridLayout>
                    </PreviousNextView>

                    <StackLayout>
                        <Label class="client-t client-t-info" text="General Client Information" textWrap="true"/>
                        <Label class="client-d" text="Ex. age, diagnosis, history, medical profile, care plan, GOC." textWrap="true"/>
                        <TextView v-model="c_info" 
                                  id="client-free"
                                  class="client-free"
                                  hint="Ex. age, diagnosis, history, medical profile, care plan, GOC."
                                  @textChange="resetTextviewModel"
                                  ref="editClientRef"
                                  editable="true" />
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
    import { confirm }  from "tns-core-modules/ui/dialogs";
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
                    rows: "auto, auto, auto, auto, auto, auto, auto, auto, auto, auto,",
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
                'intro_questions'
            ]),
            input_phone: {
                get: function() {                    
                    return formatPhoneNum(this.c_phone);
                },
                set: function (new_input) {
                    this.c_phone = new_input.replace(/\D/g, '').substring(0, Math.min(10, new_input.length));
                    console.log("in setter " + this.c_phone);
                }
            }
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
                    this.c_nurse = curr_log.nurse;
                    this.c_info = curr_log.info;
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
                const entry = {
                    id: this.log_id,
                    phone: client_phone,
                    caller: caller_name,
                    client: client_name,
                    relation: this.c_relation,
                    nurse: this.c_nurse,
                    info: this.c_info,
                };
                console.log("TODO save edited")
                this.changeClientInfo(entry);

                this.$modal.close();
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
            onPhoneEntered() {
                this.input_phone = formatPhoneNum(this.c_phone.replace(/\D/g, ''));
            },
            onNavigatingFrom() {
                
            },
            onLayoutUpdate() {
                if (this.$refs.editClientGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.editClientGridRef.nativeView.getMeasuredWidth() );
                    if (width > 800) {
                        this.ctnrSetting.class = "client-ctnr tablet-landscape";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto, auto",
                            columns: "auto, *",
                            children: editGridChildLandscape,
                        }
                    } else {
                        this.ctnrSetting.class = "client-ctnr";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto, auto, auto, auto, auto, auto, auto,",
                            columns: "*",
                            children: editGridChildPortrait,
                        }
                    }
                }
            },
            
        }
        
    };
</script>