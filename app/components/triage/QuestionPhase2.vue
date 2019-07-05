<template>
    <Page class="page q-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackToHome" ios.systemIcon="0" ios.position="left"></ActionItem>
        </ActionBar>
        <GridLayout class="q-ctnr" rows="auto, auto, *" columns="*" ref="qGridRef" @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" :log_id="log_id"/>
            <Timer row="1" col="0"
                   class="timer-wrapper timer-wrapper-q-page"
                   :log_id=log_id
                   :segment_id=1 
                   :event_bus=event_bus
                   v-if="true" />
            <StackLayout row="2" col="0" :class="mainSetting.class">
                <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="space-between">
                    <Button class="q-back-btn" text="Back" @tap="onBackward" ></Button>
                    <StackLayout class="q-title-ctnr">
                        <Label class="q-main-title" text="Log" />
                        <Label class="q-main-title" text="In Progress" />
                    </StackLayout>
                </FlexboxLayout>
                <StackLayout class="q-question-ctnr" >
                    <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="center">
                        <Image width="100" class="q-icon" src="~/assets/images/q-icon.png" stretch="aspectFit"></Image>
                        <Label :text="question_body" class="q-question-body"/>
                    </FlexboxLayout>
                    <Button v-for="answer in answers_list" v-bind:key="answer.id" :text="answer.text" class="q-question-ans" @tap="onForward(answer)" /> 
                </StackLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import UserBlock from './parts/UserBlock.vue';
    import Timer from './parts/Timer.vue';
    import QuestionPhase3 from './QuestionPhase3.vue';
    import NewPatient from './NewPatient.vue';
    import Dashboard from '../home/Dashboard.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import Vue from 'nativescript-vue';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                patient: {},
                question_id: '',
                question_body: '?',
                answers_list: [],

                event_bus: new Vue(),

                mainSetting: {
                    class: "q-main-ctnr"
                }
            }
        },
        mounted() {
            
            this.prepareInitialQuestion();
        },
        components: {
            UserBlock,
            Timer
        },
        props: {
            initial_question_id: {
                type: Number,
                required: true,
            },
            log_id: {
                type: String,
                required: true,
            },
            timer_status: {
                type: Boolean,
                required: false,
            },
        },
        computed: {
            ...mapGetters([
                'logs',
                'questions',
                'answers',
                'branches',
                'intro_outcomes',
			])
		},
        methods: {
            ...mapActions([
                'saveIntroProgress',
                'saveIntroOutcome',
                'revertIntroProgress',
                'changeLogStatus',
                'updateTimer'
            ]),
            retrieveQuestion(target_q_id) {
                const q = this.questions.find(question => { return question.id === target_q_id});
                this.question_id = q.id;
                this.question_body = q.text;
                this.answers_list = this.answers.filter(ans => ans.question_id === q.id);
            },
            prepareInitialQuestion() {
                this.retrieveQuestion(this.initial_question_id);
            },
            prepareNextQuestion(next_id) {
                this.retrieveQuestion(next_id);
            },
            preparePrevQuestion(prev_id) {
                this.retrieveQuestion(prev_id);
            },
            prepareNextStage() {
                this.stopTimer();
                this.$navigateTo(QuestionPhase3, {
                    animated: false,
                    clearHistory: true,
                    props: {
                        log_id: this.log_id
                    }
                });
            },
            stopTimer() {
                // if (this.timer_status) {
                    this.event_bus.$emit('clear_timer', this.log_id);
                // }
            },
            onForward(ans) {
                console.log("=== Forward === ");
                const progress = {
                    log_id: this.log_id,
                    q_id: this.question_id, 
                    a_id: ans.id
                };
                this.saveIntroProgress(progress);
                
                const outcome = this.intro_outcomes.find(out => { return out.answer_id === ans.id});
                if (outcome === undefined) {
                    const branch = this.branches.find(brc => { return brc.answer_id === ans.id});
                    if (branch === undefined) {
                        console.log("=== Trouble in backend ===");
                    } else {
                        const new_q_id = branch.question_id;
                        this.prepareNextQuestion(new_q_id);
                    }
                } else {
                    console.log("=== Heading to phase 3 now ===");
                    this.prepareNextStage();
                    this.saveIntroOutcome({
                        log_id: this.log_id,
                        id: outcome.id 
                    });
                }
            },
            onBackward(args) {
                console.log("=== Backward ===");
                const log_id_for_nav = this.log_id;
                const log = this.logs.find((elem) => { return elem.id === this.log_id; });
                const last_progress = log.intro_progress[log.intro_progress.length - 1];
                if (last_progress === undefined) {
                  
                } else {
                    this.preparePrevQuestion(last_progress[0]);
                    this.revertIntroProgress(this.log_id);
                }
            },
            onBackToHome(args) {
                console.log("=== Back To Home ===");
                this.$navigateTo(Dashboard, {
                    animated: false,
                    clearHistory: true,
                });
            },
            onRecordTime(value) {
                
            },
            onNavigatingFrom() {
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.qGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.mainSetting = {
                        class: "q-main-ctnr tablet-landscape"
                    };
                } else {
                    this.mainSetting = {
                        class: "q-main-ctnr"
                    };
                }
            }
        }
        
    };
</script>

<style>
</style>