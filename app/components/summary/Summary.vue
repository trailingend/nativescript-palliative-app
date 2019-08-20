<template>
    <Page class="page sum-page summary-page">
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, *, auto" 
                    columns="auto, *" ref="summaryGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewChart" />

            <ScrollView row="1" col="0" rowSpan="2" colSpan="2">
                <StackLayout class="summary-main-ctnr">
                    <StackLayout class="sum-title-ctnr">
                        <Label class="sum-title" text="Summary"></Label>
                    </StackLayout>
                    <CallSummary :log_id="log_id" :can_check="can_check_call_info" @canSwitch="onSwitchCanEnable"/>
                    <InfoSummary :log_id="log_id" />
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

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
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
            ]),
            /**
             *  Function to prepare data to display on load
             *  - also check whether the switch can be enabled based on content of nurse info of the log
             * **/
            prepareSummary() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    let p_id_set = new Set();
                    curr_log.items_answers.forEach(elem => { p_id_set.add(elem.id) });
                    curr_log.others_answers.forEach(elem => { p_id_set.add(elem.id) });
                    this.protocol_ids = Array.from(p_id_set);

                    if (curr_log.nurse === "" || curr_log.endTime === "") {
                        this.is_switch_enabled = false;
                    } else {
                        this.is_switch_enabled = true;
                    }
                }
            },
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
            onSwitchTap(args) {
                if (! this.is_switch_enabled) {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    if (curr_log.nurse === "" || curr_log.endTime === "") {
                        this.is_reviewed = false;
                        alert({
                            title: "Missing Call Information",
                            message: "Please complete before continuing.",
                            okButtonText: "OK"
                        }).then((result) => {
                            this.can_check_call_info = true;
                        });
                    }
                }           
            },
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
            checkConditions() {
                if (! this.is_reviewed) {
                    this.$refs.consentErrorRef.nativeView.opacity = 1;
                }
            },
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
            onBackward() {
                this.preparePrevStage();
            },
            onBackTap() {
                this.onBackward();
            },
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
            onSwitchCanEnable() {
                console.log("can enable");
                this.is_switch_enabled = true;
            },
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