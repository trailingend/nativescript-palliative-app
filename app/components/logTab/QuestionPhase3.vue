<template>
    <Page class="page q-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackward" ios.systemIcon="21" ios.position="left"></ActionItem>
        </ActionBar>
        <GridLayout class="q-ctnr" rows="auto, *" columns="*" ref="qPh3GridRef" @layoutChanged="onLayoutUpdate">
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
    </Page>
</template>

<script>
    import UserBlock from './parts/UserBlock.vue';
    import QuestionPhase2 from './QuestionPhase2.vue';
    import Action from './Action.vue';
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
            this.prepareQuestion();
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
                'questions',
                'answers',
                'phase_3_question_id',
                'pre_protocol_answer',
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
            prepareQuestion() {
                this.retrieveQuestion(this.phase_3_question_id);
            },
            onForward(ans) {
                console.log("=== Forward === ");
                const progress = {
                    log_id: this.log_id,
                    q_id: this.question_id, 
                    a_id: ans.id
                };
                this.saveIntroProgress(progress);
                
                if (ans.id === pre_protocol_answer) {
                    this.$navigateTo(Action, {
                        frame: "logFrame",
                        animated: false,
                        props: {
                            log_id: this.log_id
                        }
                    });
                    console.log("=== Heading to actions now ===");
                } else {
                    // this.$navigateTo(Protocol, {
                    //     frame: "logFrame",
                    //     animated: false,
                    //     // props: {
                    //     //     intro_outcome: outcome,
                    //     //     log_id: this.log_id
                    //     // }
                    // });
                    console.log("=== Heading to protocols now ===");
                }
            },
            onBackward(args) {
                // console.log("=== Backward ===");
                // const log_id_for_nav = this.log_id;
                // const log = this.logs.find((elem) => { return elem.id === this.log_id; });
                // const last_progress = log.intro_progress[log.intro_progress.length - 1];
                // if (last_progress === undefined) {
                  
                // } else {
                //     this.preparePrevQuestion(last_progress[0]);
                //     this.revertIntroProgress(this.log_id);
                // }
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.qPh3GridRef.nativeView.getMeasuredWidth() );

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