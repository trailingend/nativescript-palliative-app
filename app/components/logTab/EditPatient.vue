<template>
    <Page class="page edit-page">
        <GridLayout rows="*" columns="*, auto" class="edit-ctnr" 
                    ref="editGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <StackLayout row="0" col="0" :class="formSetting.class">
                <Image class="edit-head" src="~/assets/images/head2.png" stretch="aspectFit" ></Image>                    
                <GridLayout rows="auto, auto, auto, auto" columns="auto, *">
                    <Label row="0" col="0" class="edit-q1 edit-q" text="Callback #:" textWrap="true"/>
                    <TextField row="0" col="1" 
                               id="edit-a1"
                               class="edit-a edit-a1" 
                               v-model="input_phone" 
                               keyboardType="phone"
                               @blur="onPhoneEntered"
                               editable="true" />
                    <Label row="1" col="0" class="edit-q2 edit-q" text="Client name:" textWrap="true"/>
                    <TextField row="1" col="1" 
                               id="edit-a2"
                               class="edit-a edit-a2" 
                               v-model="c_client"
                               editable="true" />
                    <Label row="2" col="0" class="edit-q2 edit-q" text="Patient name:" textWrap="true"/>
                    <TextField row="2" col="1" 
                               id="edit-a3"
                               class="edit-a edit-a3" 
                               v-model="c_patient"
                               editable="true" />
                    <Label row="3" col="0" class="edit-q3 edit-q" text="Relation to client:" textWrap="true"/>
                    <TextField row="3" col="1"
                               id="edit-a4"
                               class="edit-a edit-a4"
                               v-model="c_relation"
                               editable="true" />
                </GridLayout>
                <Button class="edit-btn" text="Save" @tap="onSaveTap" />
            </StackLayout>
            <StackLayout row="0" col="1" class="edit-title-ctnr">
                <Image width=40 class="edit-close" src="~/assets/images/close.png" stretch="aspectFit" @tap="onClose"></Image>
                <Label class="log-title" text="Log in" />
                <Label class="log-title" text="Progress" />
            </StackLayout>
        </GridLayout>
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

                formSetting: {
                    class: "edit-form-ctnr",
                },
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
                    this.c_phone = new_input.replace(/\D/g, '').substring(0, Math.min(9, new_input.length));
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
                    phone: client_phone,
                    client: client_name,
                    patient: patient_name,
                    relation: this.c_relation,
                };
                this.changeClientInfo(entry);

                console.log("=== Patient Info Edited ===");
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const a1Textfield = layoutView.getViewById("edit-a1");
                const a2Textfield = layoutView.getViewById("edit-a2");
                const a3Textfield = layoutView.getViewById("edit-a3");
                const a4Textfield = layoutView.getViewById("edit-a4");
                a1Textfield.dismissSoftInput();
                a2Textfield.dismissSoftInput();
                a3Textfield.dismissSoftInput();
                a4Textfield.dismissSoftInput();
            },
            onPhoneEntered() {
                this.input_phone = formatPhoneNum(this.c_phone);
            },
            onLayoutUpdate() {
                if (this.$refs.editGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.editGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.formSetting.class = "edit-form-ctnr tablet-landscape";
                    } else {
                        this.formSetting.class = "edit-form-ctnr";
                    }
                }
            },
            onClose() {
                this.$modal.close();
            }
        }
        
    };
</script>

<style>
</style>