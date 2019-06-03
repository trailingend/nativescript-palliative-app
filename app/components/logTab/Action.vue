<template>
    <Page class="page action-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackward" ios.systemIcon="21" ios.position="left" ></ActionItem>
        </ActionBar>
        <StackLayout class="action-ctnr" rows="*" columns="*" ref="actionGridRef" @layoutChanged="onLayoutUpdate">
            <Label class="action-msg" :text="outcomeMsg"/>
            <Label class="action-msg" :text="actionMsg"/>
            <Button class="action-btn" text="Back to Dashboard" @tap="onBackHome"/>
        </StackLayout>
    </Page>
</template>

<script>
    import Placeholder from './Placeholder.vue';
    import QuestionPhase3 from './QuestionPhase3.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                outcomeMsg: 'Placeholder for outcome',
                actionMsg: 'Placeholder for action',
            }
        },
        mounted() {
            this.prepareAction();
        },
        components: {
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
                'intro_outcomes',
			])
		},
        methods: {
            ...mapActions([
                'changeLogStatus',
                'revertIntroProgress'
            ]),
            prepareAction() {
                const log_idx = this.logs.findIndex(elem => { return elem.id === this.log_id; });
                const out_id = this.logs[log_idx].intro_outcome;
                const outcome = this.intro_outcomes.find(elem => { return elem.id === out_id});
                if (outcome.text) {
                    this.outcomeMsg = outcome.text;
                }
            },
            onForward(ans) {
            },
            onBackward(args) {
                // const log_idx = this.logs.findIndex(elem => { return elem.id === this.log_id; });
                // this.revertIntroProgress(this.log_id);
                // const log_progress = this.logs[log_idx].intro_progress;
                
                // const last_progress = log_progress[log_progress.length - 1];
                // if (last_progress === undefined) {
                //     console.log("=== NOT suppose to happen ===");
                // } else {
                //     this.$navigateTo(QuestionPhase3, {
                //         frame: "logFrame",
                //         animated: false,
                //         clearHistory: true,
                //         props: {
                //             log_id: this.log_id,
                //             initial_question_id: last_progress[0]
                //         }
                //     });
                //     this.revertIntroProgress(this.log_id);
                //     this.changeLogStatus(this.log_id);
                // }
            },
            onBackHome(args) {
                console.log("=== Back to Dashboard ===");
                const tabView = args.object.page.frame.parent.parent;
                tabView.selectedIndex = 0;

                this.$navigateTo(Placeholder, {
                    frame: "logFrame",
                    animated: false,
                    clearHistory: true
                });
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.actionGridRef.nativeView.getMeasuredWidth() 
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