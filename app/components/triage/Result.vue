<template>
    <Page class="page result-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackward" ios.systemIcon="21" ios.position="left" ></ActionItem>
        </ActionBar>
        <StackLayout class="result-ctnr" rows="*" columns="*" ref="resultGridRef" @layoutChanged="onLayoutUpdate">
            <Label class="result-msg" :text="resultMsg"/>
            <Button class="result-btn" text="Back to Dashboard" @tap="onBackHome"/>
        </StackLayout>
    </Page>
</template>

<script>
    import Dashboard from '../home/Dashboard.vue';
    import QuestionPhase3 from './QuestionPhase3.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                resultMsg: 'Placeholder for result',
            }
        },
        mounted() {
            this.prepareResult();
        },
        components: {
        },
        props: {
            intro_outcome: {
                type: Object,
                required: false,
            },
            log_id: {
                type: String,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs'
			])
		},
        methods: {
            ...mapActions([
                'changeLogStatus',
                'revertIntroProgress'
            ]),
            prepareResult() {
                if (this.intro_outcome.text) {
                    this.resultMsg = this.intro_outcome.text;
                }
            },
            onForward(ans) {
            },
            onBackward(args) {
                const log_idx = this.logs.findIndex(elem => { return elem.id === this.log_id; });
                this.revertIntroProgress(this.log_id);
                const log_progress = this.logs[log_idx].intro_progress;
                
                const last_progress = log_progress[log_progress.length - 1];
                if (last_progress === undefined) {
                    console.log("=== NOT suppose to happen ===");
                } else {
                    this.$navigateTo(QuestionPhase3, {
                        animated: false,
                        clearHistory: true,
                        props: {
                            log_id: this.log_id,
                            initial_question_id: last_progress[0]
                        }
                    });
                    this.revertIntroProgress(this.log_id);
                    this.changeLogStatus(this.log_id);
                }
            },
            onBackHome(args) {
                console.log("=== Back to Dashboard ===");
                this.$navigateTo(Dashboard, {
                    animated: false,
                    clearHistory: true
                });
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.resultGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 1000) {

                } else {
                 
                }
            },
        }
        
    };
</script>

<style>
</style>