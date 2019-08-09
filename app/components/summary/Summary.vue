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
                    <InfoSummary :log_id="log_id" />
                    <IntroSummary :log_id="log_id" />
                    <StackLayout class="sum-sec-ctnr">
                        <StackLayout class="sec-title-ctnr">
                            <Label text="Protocols" class="sum-sec-title"/>
                        </StackLayout>
                        <StackLayout class="sec-content-ctnr">
                            <ProtocolSummary v-for="p_id in protocol_ids"
                                             :key="p_id"
                                             :log_id="log_id" 
                                             :protocol_id="p_id" />
                        </StackLayout>
                    </StackLayout>
                    <PlanSummary :log_id="log_id" /> 
                    <NoteSummary :log_id="log_id" />
                    <FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center">
                        <Button class="form-btn sum-btn" text="New Protocol" @tap="onNewTap" ></Button>
                        <SubmitButton :log_id="log_id" />
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

    export default {
        data() {
            return {
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
            prepareSummary() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    let p_id_set = new Set();
                    curr_log.items_answers.forEach(elem => { p_id_set.add(elem.id) });
                    curr_log.others_answers.forEach(elem => { p_id_set.add(elem.id) });
                    this.protocol_ids = Array.from(p_id_set);
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
            prepareNextStage() {

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
            onSubmitTap() {
                this.prepareNextStage();
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