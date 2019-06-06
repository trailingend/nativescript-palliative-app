<template>
    <Page class="page q-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackward" ios.systemIcon="21" ios.position="left"></ActionItem>
        </ActionBar>
        <StackLayout>
            <Progress v-show="timer_status" class="time-progress"                     
                      :value="curr_time"
                      :minValue="min_time"
                      :maxValue="max_time"
                      :color="color"
                      @loaded="onProgressLoaded" />
            <GridLayout class="q-ctnr" rows="auto, *" columns="*" ref="qGridRef" @layoutChanged="onLayoutUpdate">
                <UserBlock row="0" col="0" :log_id="log_id"/>
                <StackLayout row="1" col="0" :class="mainSetting.class">
                    <StackLayout class="q-title-ctnr">
                        <Label class="q-main-title" text="Log" />
                        <Label class="q-main-title" text="In Progress" />
                    </StackLayout>
                    <StackLayout class="q-question-ctnr" >
                        <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="center">
                            <Image width="100" class="q-icon" src="~/assets/images/q-icon.png" stretch="aspectFit"></Image>
                            <Label :text="question_body" class="q-question-body"/>
                        </FlexboxLayout>
                        <Button v-for="answer in answers_list" v-bind:key="answer.id" :text="answer.text" class="q-question-ans" @tap="onForward(answer)" /> 
                    </StackLayout>
                </StackLayout>
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import UserBlock from './parts/UserBlock.vue';
    import QuestionPhase3 from './QuestionPhase3.vue';
    import NewPatient from './NewPatient.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { Progress } from 'tns-core-modules/ui/progress';
    import { isIOS } from "platform";

    export default {
        data() {
            return {
                patient: {},
                question_id: '',
                question_body: '?',
                answers_list: [],

                curr_time: "0",
                min_time: "0", 
                max_time: "10", 
                color: "#adebad",
                timer: null,
                time_status: true,

                mainSetting: {
                    class: "q-main-ctnr"
                }
            }
        },
        mounted() {
            this.prepareInitialQuestion();
            this.tick();
        },
        components: {
            UserBlock
        },
        props: {
            initial_question_id: {
                type: Number,
                required: true,
            },
            log_id: {
                type: String,
                required: true,
            }
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
                'changeLogStatus'
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
                this.$navigateTo(QuestionPhase3, {
                    frame: "logFrame",
                    animated: false,
                    props: {
                        log_id: this.log_id
                    }
                });
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
            onProgressLoaded(args) {
                let progress = args.object;
                if (isIOS) {
                    let transform = CGAffineTransformMakeScale(1.0, 5.0);  
                    progress.ios.transform = transform; // progress.ios === UIProgressView
                }

            },
            tick() {
                this.timer = setInterval(() => {
                    const max_time_val = parseInt(this.max_time);
                    let curr_time_val = parseInt(this.curr_time);
                    curr_time_val++;
                    this.curr_time = '' + curr_time_val;
                    console.log("=== in timer ===" + this.curr_time)
                    if (curr_time_val >= max_time_val) {
                        this.color = '#ffcccc';
                        clearInterval(this.timer);
                    } else if (curr_time_val >= max_time_val / 2) {
                        this.color = '#ffdd99';
                    }
                }, 1000);
            },
            onNavigatingFrom() {
                 clearInterval(this.timer);
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