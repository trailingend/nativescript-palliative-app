<template>
    <Page class="page pre-proto-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackToHome" ios.systemIcon="0" ios.position="left"></ActionItem>
        </ActionBar>
        <GridLayout class="pre-proto-ctnr" rows="auto, *" columns="*" ref="preProtoGridRef" @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" :log_id="log_id"/>
            <StackLayout class="pre-proto-choice-ctnr" row="1" col="0">
                <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="space-between">
                    <Button class="pre-proto-back-btn" text="Back" @tap="onBackward" ></Button>
                    <StackLayout class="pre-proto-title-ctnr">
                        <Label class="pre-proto-main-title" text="Log" />
                        <Label class="pre-proto-main-title" text="In Progress" />
                    </StackLayout>
                </FlexboxLayout>
                <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="center">
                    <Label :text="pre_protocol_question" class="pre-proto-body"/>
                </FlexboxLayout>
                <GridLayout class="pre-proto-btn-ctnr" :rows="gridSetting.rows" :columns="gridSetting.columns" >
                    <Button v-for="(protocol, index) in protocols" 
                            v-bind:key="protocol.id" 
                            :row="Math.floor(index / gridSetting.denominator)"
                            :col="index % gridSetting.denominator"
                            :text="protocol.name" 
                            :class="`pre-proto-btn pre-proto-btn${index}`" 
                            @tap="onForward(protocol)" />
                </GridLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import UserBlock from '../triage/parts/UserBlock.vue';
    import QuestionPhase3 from '../triage/QuestionPhase3.vue';
    import Dashboard from '../home/Dashboard.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                gridSetting: {
                    rows: "*, *, *, *, *, *, *",
                    columns: "*, *",
                    denominator: 2
                }
            }
        },
        mounted() {
            // this.prepareProtocols();
        },
        components: {
            UserBlock
        },
        props: {
            log_id: {
                type: String,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols',
                'pre_protocol_question'
			])
		},
        methods: {
            ...mapActions([
                'changeLogStatus',
                'revertIntroProgress'
            ]),
            prepareProtocols() {
                const log_idx = this.logs.findIndex(elem => { return elem.id === this.log_id; });
            },
            preparePrevQuestion() {
                this.$navigateTo(QuestionPhase3, {
                    animated: false,
                    clearHistory: true,
                    props: {
                        log_id: this.log_id,
                    }
                });
            },
            onForward(proto) {
                console.log("=== Heading to protocol === for patient " + this.log_id + " with " + proto.id);
            },
            onBackward(args) {
                console.log("=== Backward ===");
                const log = this.logs.find((elem) => { return elem.id === this.log_id; });
                const last_progress = log.intro_progress[log.intro_progress.length - 1];
                if (last_progress === undefined) {
                    console.log("=== Not suppose to happen!!! ===");
                } else {
                    this.preparePrevQuestion();
                    this.revertIntroProgress(this.log_id);
                }
            },
            onBackToHome(args) {
                console.log("=== Back to Dashboard ===");
                this.$navigateTo(Dashboard, {
                    animated: false,
                    clearHistory: true
                });
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.preProtoGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 1000) {
                    this.gridSetting = {
                        rows: "*, *, *, *, *",
                        columns: "*, *, *",
                        denominator: 3
                    };
                } else {
                    this.gridSetting = {
                        rows: "*, *, *, *, *, *, *",
                        columns: "*, *",
                        denominator: 2
                    };
                }
            },
        }
        
    };
</script>

<style>
</style>