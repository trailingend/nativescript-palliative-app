<template>
    <Page class="page q-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackward" ios.systemIcon="21" ios.position="left"></ActionItem>
        </ActionBar>
        <GridLayout class="q-ctnr" rows="auto, *" columns="*" ref="qGridRef" @layoutChanged="onLayoutUpdate">
            <FlexboxLayout row="0" col="0" alignItems="stretch" class="q-patient-ctnr">
                <Image width="50" class="user-head" src="~/assets/images/head2.png" stretch="aspectFit"></Image>
                <StackLayout flexGrow="2">
                    <Label :text="patient.client" class="patient-name patient-top patient-text"/>
                    <Label :text="patient.phone" class="patient-phone patient-text"/>
                    <Label :text="patient.patient" class="patient-name patient-text"/>
                    <Label :text="patient.createdTime" class="patient-time patient-text" />
                </StackLayout>
                <Image class="edit-icon" alignSelf="flex-end" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </FlexboxLayout>
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
    </Page>
</template>

<script>
    import Result from './Result.vue';
    import NewPatient from './NewPatient.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                patient: {},
                question_id: '',
                question_body: '?',
                answers_list: [],

                mainSetting: {
                    class: "q-main-ctnr"
                }
            }
        },
        mounted() {
            this.prepareInitialQuestion();
            this.preparePatientInfo();
        },
        components: {
        },
        props: {
            intro_question_id: {
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
                'revertIntroProgress',
            ]),
            retrieveQuestion(target_q_id) {
                const q = this.questions.find(question => { return question.id === target_q_id});
                this.question_id = q.id;
                this.question_body = q.text;
                this.answers_list = this.answers.filter(ans => ans.question_id === q.id);
            },
            prepareInitialQuestion() {
                this.retrieveQuestion(this.intro_question_id);
            },
            prepareNextQuestion(next_id) {
                this.retrieveQuestion(next_id);
            },
            preparePrevQuestion(prev_id) {
                this.retrieveQuestion(prev_id);
            },
            preparePatientInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.patient = curr_log;
                }
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
                    this.$navigateTo(Result, {
                        frame: "logFrame",
                        animated: false,
                        props: {
                            intro_outcome: outcome,
                            log_id: this.log_id
                        }
                    });
                    console.log("=== Heading to result now ===");
                }
            },
            onBackward(args) {
                console.log("=== Backward ===");
                const log_id_for_nav = this.log_id;
                const log = this.logs.find((elem) => { return elem.id === this.log_id; });
                const last_progress = log.progress[log.progress.length - 1];
                if (last_progress === undefined) {
                    // this.$navigateTo(NewPatient, {
                    //     frame: "logFrame",
                    //     animated: false,
                    //     props: {
                    //         log_id: log_id_for_nav,
                    //     }
                    // });
                    // the info page need to check if it is a new entry
                } else {
                    this.preparePrevQuestion(last_progress[0]);
                    this.revertIntroProgress(this.log_id);
                }
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