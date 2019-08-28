<template>
    <Page class="page sum-page summary-page">
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, *, auto" 
                    columns="auto, *" ref="summaryGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewChart" />

            <ScrollView row="1" col="0" rowSpan="2" colSpan="2" id="sum-scroll">
                <StackLayout class="summary-main-ctnr">
                    <StackLayout class="sum-title-ctnr">
                        <Label class="sum-title" text="Summary"></Label>
                    </StackLayout>
                    <CallSummary :log_id="log_id" :can_check="can_check_call_info" @checkSwitch="checkSwitch"/>
                    <InfoSummary :log_id="log_id" :can_check="can_check_call_info" @checkSwitch="checkSwitch"/>
                    <IntroSummary :log_id="log_id" />
                    <StackLayout class="sum-sec-ctnr">
                        <StackLayout class="sec-title-ctnr">
                            <Label text="Protocols" class="sum-sec-title"/>
                        </StackLayout>
                        <StackLayout class="sec-content-ctnr">
                            <Label v-if="protocol_ids.length === 0" class="sum-text" text="N/A" />
                            <ProtocolSummary v-else v-for="p_id in protocol_ids"
                                             :key="p_id"
                                             :log_id="log_id" 
                                             :protocol_id="p_id" />
                        </StackLayout>
                    </StackLayout>
                    <PlanSummary :log_id="log_id" /> 
                    <NoteSummary :log_id="log_id" />

                    <FlexboxLayout class="sum-switch-ctnr" flexDirection="row" alignItems="center" justifyContent="space-between" @tap="onSwitchTap">
                        <Label class="sum-bold" text="Documentation reviewed and finalized." />
                        <Switch class="sum-switch" :isEnabled="is_switch_enabled" ref="switchRef" @checkedChange="onSwitchSwap" offBackgroundColor="#e5e5e5"/>
                    </FlexboxLayout>
                    <StackLayout class="sum-e-ctnr sum-switch-e-ctnr" opacity="0" ref="consentErrorRef">
                        <Label class="sum-e sum-e5" text="Please confirm review" />
                    </StackLayout>

                    <FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center">
                        <Button class="form-btn sum-btn" text="New Protocol" @tap="onNewTap" ></Button>
                        <SubmitButton :log_id="log_id" :is_reviewed="is_reviewed" @onClick="checkConditions" />
                    </FlexboxLayout>
                </StackLayout>
            </ScrollView>

            <Button row="2" col="0" v-show="has_prev" class="back-btn" text="Back" @tap="onBackTap" ></Button>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Page to display summary of current client
     *  [Related] - styles in summary.scss
     *  @param {Boolean} is_reviewed - the variable controls whether can submit
     *  @param {Boolean} can_check_call_info - the variable controls whether to check call info 
     *  @param {Boolean} is_switch_enabled - the variable controls whether to enable switch
     *  @param {Array} protocol_ids - the list of ids of selected protocols 
     *  @prop {String} log_id - the id of the current document
     *  @prop {Number} protocol_id - the id of the current protocol
     *  @prop {Boolean} has_prev - the variable records whether Summary page is in linearly documenting mode or opened directly from Dashboard
     * 
     *  =============================================================
     * **/

    import NavBar from '../general/parts/NavBar.vue';
    import NewClient from '../intro/NewClient.vue';
    import SubmitButton from './parts/SubmitButton.vue';
    import CallSummary from './parts/CallSummary.vue';
    import InfoSummary from './parts/InfoSummary.vue';
    import IntroSummary from './parts/IntroSummary.vue';
    import ProtocolSummary from './parts/ProtocolSummary.vue';
    import PlanSummary from './parts/PlanSummary.vue';
    import NoteSummary from './parts/NoteSummary.vue';
    import ChooseProtocol from '../protocols/ChooseProtocol.vue';
    import Plans from '../protocols/Plans.vue';

    import { mapActions, mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { alert }  from "tns-core-modules/ui/dialogs";

    export default {
        data() {
            return {
                is_reviewed: false,
                can_check_call_info: false,
                is_switch_enabled: false,
                protocol_ids: [],

                ctnrSetting: {
                    class: "summary-ctnr",
                }
            }
        },
        created() {
            this.prepareSummary();
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                type: Number,
                required: false,
            },
            has_prev: {
                type: Boolean,
                required: true,
            }
        },
        components: {
            NavBar,
            SubmitButton,
            CallSummary,
            InfoSummary,
            IntroSummary,
            ProtocolSummary,
            PlanSummary,
            NoteSummary
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols',
                'assessment_letters'
			]),
		},
        methods: {
            ...mapActions([
                'saveSummaryProgress'
            ]),
            /**
             *  Function to prepare data for the page
             *  [Description] - also check whether the switch can be enabled based on content of nurse info of the log
             * **/
            prepareSummary() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    let p_id_set = new Set();
                    curr_log.items_answers.forEach(elem => { p_id_set.add(elem.id) });
                    curr_log.others_answers.forEach(elem => { p_id_set.add(elem.id) });
                    this.protocol_ids = Array.from(p_id_set);

                    this.checkSwitch();
                }
            },
            /**
             *  Function to go back to Plans page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            preparePrevStage() {
                this.$navigateTo(Plans, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        protocol_id: this.protocol_id,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to enable call info and client info check when switch is tapped
             * **/
            onSwitchTap(args) {
                if (! this.is_switch_enabled) {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    if (curr_log.nurseID === "" || curr_log.endTime === "" || curr_log.client === "") {
                        this.is_reviewed = false;
                        alert({
                            title: "Missing Call Information",
                            message: "Please complete before continuing.",
                            okButtonText: "OK"
                        }).then((result) => {
                            this.can_check_call_info = true;
                            if (args.object.page) {
                                const page = args.object.page;
                                const scrollView = args.object.page.getViewById("sum-scroll");
                                scrollView.scrollToVerticalOffset(0, true);
                            }
                        });
                    }
                }           
            },
            /**
             *  Function to toggle values of the review switch
             * **/
            onSwitchSwap(args) {
                this.is_reviewed = ! this.is_reviewed;
                if (args.oldValue) {
                    if (! args.value) {
                        this.$refs.consentErrorRef.nativeView.opacity = 1;
                    }
                } else {
                    if (args.value) {
                        this.$refs.consentErrorRef.nativeView.opacity = 0;
                    }
                } 
            },
            /**
             *  Function to show error message if review switch is not checked 
             * **/
            checkConditions() {
                if (! this.is_reviewed) {
                    this.$refs.consentErrorRef.nativeView.opacity = 1;
                }
            },
            /**
             *  Function to abort the current document and start a new doucment
             *  [Description] - always clear navigation history
             * **/
            addNewChart() {
                this.$navigateTo(NewClient, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slide',
                        curve: 'easeIn',
                        duration: 300
                    },
                });
            },
            /**
             *  Function to go back to previous page in linear mode
             *  [Description] - update progress in this function
             * **/
            onBackward() {
                const progress = {
                    log_id: this.log_id,
                    in_sum: 0,
                }
                this.saveSummaryProgress(progress);
                this.preparePrevStage();
            },
            /**
             *  Function to go back on tap
             * **/
            onBackTap() {
                this.onBackward();
            },
            /**
             *  Function to add another protocol by navigating to ChooseProtocol page
             *  [Description] - from_summary flag set to true; always clear navigation history
             * **/
            onNewTap() {
                this.$navigateTo(ChooseProtocol, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slide',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        from_summary: true,
                    }
                });
            },
            /**
             *  Function to check whether all conditions met to enable switch
             * **/
            checkSwitch() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                this.is_switch_enabled = ! (curr_log.nurseID === "" || curr_log.endTime === "" || curr_log.client === "");
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.summaryGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.ctnrSetting = {
                        class: "summary-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "summary-ctnr"
                    };
                }
            }
        },
        
    };
</script>

<style>
</style>