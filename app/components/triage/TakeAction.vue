<template>
    <Page class="page action-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
        </ActionBar>
        <GridLayout class="action-ctnr" rows="auto, auto, *" columns="*" ref="actionGridRef" @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" :log_id="log_id"/>
            <Timer row="1" col="0"
                   class="timer-wrapper timer-wrapper-action-page"
                   :log_id=log_id
                   :segment_id=3 
                   :event_bus=event_bus />
            <StackLayout class="action-body-ctnr" row="2" col="0">
                <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="space-between">
                    <Button class="action-back-btn" text="Back" @tap="onBackward" ></Button>
                    <StackLayout class="action-title-ctnr">
                        <Label class="action-main-title" text="Log" />
                        <Label class="action-main-title" text="In Progress" />
                    </StackLayout>
                </FlexboxLayout>
                <Label class="action-msg" :text="outcomeMsg"/>
                <Label class="action-msg" :text="actionMsg"/>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import UserBlock from './parts/UserBlock.vue';
    import Timer from './parts/Timer.vue';
    import QuestionPhase3 from './QuestionPhase3.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import Vue from 'nativescript-vue';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                outcomeMsg: 'Placeholder for outcome',
                actionMsg: 'Placeholder for action',

                event_bus: new Vue(),
            }
        },
        mounted() {
            this.prepareAction();
        },
        components: {
            CloseButton,
            UserBlock,
            Timer,
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
            preparePrevQuestion() {
                this.stopTimer();
                this.$navigateTo(QuestionPhase3, {
                    animated: false,
                    clearHistory: true,
                    props: {
                        log_id: this.log_id,
                    }
                });
            },
            stopTimer() {
                this.event_bus.$emit('clear_timer', this.log_id);
            },
            onForward(ans) {
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

                // this.changeLogStatus(this.log_id);
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