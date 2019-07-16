<template>
    <Page class="page preview-page">
        <ActionBar title="Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout :class="ctnrSetting.class" 
                    rows="*, auto, auto" 
                    columns="*" ref="previewGridRef" 
                    @layoutChanged="onLayoutUpdate">

            <ScrollView row="0" col="0" rowSpan="3">
                <StackLayout class="preview-main-ctnr">
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
                </StackLayout>
            </ScrollView>

            <NewProtocolButton row="1" col="0" />

            <FlexboxLayout row="2" col="0" orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" text="Finish" @tap="onNextTap" ></Button>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import NewProtocolButton from './parts/NewProtocolButton.vue';
    import InfoSummary from '../general/parts/InfoSummary.vue';
    import IntroSummary from '../general/parts/IntroSummary.vue';
    import ProtocolSummary from '../general/parts/ProtocolSummary.vue';
    import Plans from './Plans.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                protocol_ids: [],

                ctnrSetting: {
                    class: "preview-ctnr",
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
                required: true,
            },
        },
        components: {
            NewButton,
            CloseButton,
            NewProtocolButton,
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
                // this.$navigateTo(Summary, {
                //     animated: true,
                //     clearHistory: true,
                //     transition: {
                //         name: 'fade',
                //         curve: 'easeIn',
                //         duration: 300
                //     },
                //     props: {
                //         log_id: this.log_id,
                //         protocol_id: this.protocol_id
                //     }
                // });
            },
            onForward() {
                console.log("=== Forward === ");
                this.prepareNextStage();
            },
            onBackward() {
                this.preparePrevStage();
            },
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.previewGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.ctnrSetting = {
                        class: "preview-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "preview-ctnr"
                    };
                }
            }
        },
        
    };
</script>

<style>
</style>