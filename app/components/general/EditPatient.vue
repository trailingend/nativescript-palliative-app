<template>
    <Page class="page edit-patient-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar>
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem ios.systemIcon="0" ios.position="right" @tap="onCloseTap"></ActionItem>
        </ActionBar>
        <StackLayout :class="ctnrSetting.class" 
                     ref="editPatientGridRef" 
                     @tap="clearTextfieldFocus"
                     @layoutChanged="onLayoutUpdate">
            <Label class="patient-title" text="Patient log" ></Label>                    
            <GridLayout :rows="gridSetting.rows" :columns="gridSetting.columns">
                <Label :row="gridSetting.children.q1.row" 
                       :col="gridSetting.children.q1.col"
                       class="patient-q patient-q1" 
                       text="Callback #:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a1.row" 
                           :col="gridSetting.children.a1.col"
                           id="patient-a1"
                           class="patient-a patient-a1" 
                           v-model="input_phone" 
                           keyboardType="phone"
                           @blur="onPhoneEntered"
                           editable="true" />
                <Label :row="gridSetting.children.q2.row" 
                       :col="gridSetting.children.q2.col"
                       class="patient-q patient-q2" 
                       text="Caller name:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a2.row" 
                           :col="gridSetting.children.a2.col"
                           id="patient-a2"
                           class="patient-a patient-a2" 
                           v-model="c_client" 
                           editable="true" />
                <Label :row="gridSetting.children.q3.row" 
                       :col="gridSetting.children.q3.col"
                       class="patient-q patient-q3" 
                       text="Patient name:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a3.row" 
                           :col="gridSetting.children.a3.col"
                           id="patient-a3"
                           class="patient-a patient-a3" 
                           v-model="c_patient" 
                           editable="true" />
                <Label :row="gridSetting.children.q4.row" 
                       :col="gridSetting.children.q4.col"
                       class="patient-q patient-q4" 
                       text="Relation to Patient:" 
                       textWrap="true"/>
                <TextField :row="gridSetting.children.a4.row" 
                           :col="gridSetting.children.a4.col"
                           id="patient-a4"
                           class="patient-a patient-a4" 
                           v-model="c_relation" 
                           editable="true" />
            </GridLayout>
            <Button class="patient-btn" text="Save" @tap="onSaveTap" />
        </StackLayout>
    </Page>
</template>

<script>    
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { logMonths, formatPhoneNum } from '../../scripts/common';
        
    export default {
        data() {
            return {
                c_phone: '',
                c_patient: '',
                c_client: '',
                c_relation: '',
                created_time: '',

                ctnrSetting: {
                    class: "patient-ctnr",
                },
                gridSetting: {
                    rows: "auto, auto, auto, auto, auto, auto, auto, auto,",
                    columns: "*",
                    children: newGridChildPortrait,
                }
            }
        },
        mounted() {
            this.loadExistingInfo();
        },
        props: {
            log_id: {
                type: String,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'logs'
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
            loadExistingInfo() {
                if (this.log_id) {
                    console.log("===edit info===" + this.c_patient);
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    this.c_phone = curr_log.phone;
                    this.input_phone = formatPhoneNum(this.c_phone);
                    this.c_patient = curr_log.patient;
                    this.c_client = curr_log.client;
                    this.c_relation = curr_log.relation;
                }
            },
            onSaveTap(args) {
                const entry = {
                    id: this.log_id,
                    phone: this.c_phone,
                    client: this.c_client,
                    patient: this.c_patient,
                    relation: this.c_relation,
                };
                this.changeClientInfo(entry);
                this.$modal.close();

                console.log("=== Patient Info Edited ===");
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const a1Textfield = layoutView.getViewById("patient-a1");
                const a2Textfield = layoutView.getViewById("patient-a2");
                const a3Textfield = layoutView.getViewById("patient-a3");
                const a4Textfield = layoutView.getViewById("patient-a4");
                a1Textfield.dismissSoftInput();
                a2Textfield.dismissSoftInput();
                a3Textfield.dismissSoftInput();
                a4Textfield.dismissSoftInput();
            },
            onPhoneEntered() {
                this.input_phone = formatPhoneNum(this.c_phone);
            },
            onLayoutUpdate() {
                if (this.$refs.editPatientGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.editPatientGridRef.nativeView.getMeasuredWidth() );
                    if (width > 800) {
                        this.ctnrSetting.class = "patient-ctnr tablet-landscape";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto",
                            columns: "auto, *",
                            children: newGridChildLandscape,
                        }
                    } else {
                        this.ctnrSetting.class = "patient-ctnr";
                        this.gridSetting = {
                            rows: "auto, auto, auto, auto, auto, auto, auto, auto,",
                            columns: "*",
                            children: newGridChildPortrait,
                        }
                    }
                }
            },
            onCloseTap() {
                this.$modal.close();
            }
        }
        
    };
</script>

<style>
</style>