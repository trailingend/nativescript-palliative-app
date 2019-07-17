<template>
    <Page class="page sum-page summary-page">
        <ActionBar title="Chart">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout :class="ctnrSetting.class" 
                    rows="*, auto" 
                    columns="*" ref="summaryGridRef" 
                    @layoutChanged="onLayoutUpdate">

            <ScrollView row="0" col="0" rowSpan="2">
                <StackLayout class="summary-main-ctnr">
                    <StackLayout class="sum-title-ctnr">
                        <Label class="sum-title" text="Client Summary"></Label>
                        <StackLayout class="divider-ctnr"></StackLayout>
                    </StackLayout>
                    <InfoSummary :log_id="log_id" />
                    <IntroSummary :log_id="log_id" />
                    <ProtocolSummary v-for="p_id in protocol_ids"
                                     :key="p_id"
                                     :log_id="log_id" 
                                     :protocol_id="p_id" />
                    <FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center">
                        <Button class="form-btn sum-btn" text="New Protocol" @tap="onNewTap" ></Button>
                        <SubmitButton />
                    </FlexboxLayout>
                </StackLayout>
            </ScrollView>

            <FlexboxLayout row="1" col="0" orientation="horizontal" alignItems="center" justifyContent="flex-start">
                <Button v-show="has_prev" class="back-btn" text="Back" @tap="onBackTap" ></Button>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import CloseButton from '../protocols/parts/CloseButton.vue';
    import NewButton from '../protocols/parts/NewButton.vue';
    import SubmitButton from './parts/SubmitButton.vue';
    import InfoSummary from './parts/InfoSummary.vue';
    import IntroSummary from './parts/IntroSummary.vue';
    import ProtocolSummary from './parts/ProtocolSummary.vue';
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
            NewButton,
            SubmitButton,
            CloseButton,
            InfoSummary,
            IntroSummary,
            ProtocolSummary
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
                    curr_log.items_answers.forEach(elem => { this.protocol_ids.push(elem.id) });
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
                        protocol_id: this.protocol_id
                    }
                });
            },
            prepareNextStage() {

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