<template>
    <Page class="page diagnose-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar title="Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
        </ActionBar>
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, *, auto" columns="*" 
                    ref="diagnoseGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <PatientBlock row="0" col="0" :log_id="log_id"/>
            <StackLayout row="1" col="0" class="diagnose-main-ctnr">
                <StackLayout class="diagnose-q-a-ctnr" >
                    <StackLayout class="diagnose-title-ctnr">
                        <Label class="diagnose-title" text="General"></Label>
                        <StackLayout class="divider-ctnr"></StackLayout>
                    </StackLayout>
                    <FlexboxLayout orientation="horizontal" alignItems="align" justifyContent="flex-start" class="diagnose-q-ctnr">
                        <Image width="50" class="q-icon" src="~/assets/images/q-icon.png" stretch="aspectFit"></Image>
                        <Label :text="question_text" class="diagnose-q"/>
                    </FlexboxLayout>
                    <GridLayout v-for="answer in answers_list" 
                                   :key="answer.id" 
                                   class="diagnose-a-ctnr" 
                                   rows="auto" columns="auto, *"
                                   @tap="onAnswerTap(answer)" > 
                        <Image row="0" col="0" width="30" class="ans-status-icon " v-show="!answer.status" src="~/assets/images/unchecked.png" stretch="aspectFit"></Image>
                        <Image row="0" col="0" width="30" class="ans-status-icon" v-show="answer.status" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                        <Label row="0" col="1" class="diagnose-a" :text="answer.answer" />
                    </GridLayout>
                    <TextView v-model="free_text" 
                               id="diagnose-free"
                               class="diagnose-free"
                               hint="Take notes here..."
                               @textChange="onTextEntered"
                               editable="true" />
                </StackLayout>
            </StackLayout>
            <FlexboxLayout row="2" col="0" orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button v-if="question_idx != 0" class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Label v-else />
                <Button class="next-btn" :text="next_text" @tap="onNextTap" ></Button>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import PatientBlock from './parts/PatientBlock.vue';
    import CloseButton from './parts/CloseButton.vue';
    import ChooseProtocol from '../protocols/ChooseProtocol.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import Vue from 'nativescript-vue';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                question_type: 'free_form',
                question_id: 0,
                question_text: '?',
                answers_list: [],
                next_text: 'Skip',

                selected_answers: [],
                free_text: '',

                boolean_answers: [{
                    "id": 1,
                    "answer": "Yes"
                }, {
                    "id": 2,
                    "answer": "No"
                }],
                ctnrSetting: {
                    class: "diagnose-ctnr"
                }
            }
        },
        beforeCreate: function () {
            this.$options.components.Diagnose = require('./Diagnose.vue').default
        },
        created() {
            this.prepareCurrentQuestion();
        },
        components: {
            PatientBlock,
            CloseButton
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            question_ids: {
                type: Array,
                required: true,
            },
            question_idx: {
                type: Number,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'logs',
                'intro_questions'
			])
		},
        methods: {
            ...mapActions([
                'saveIntroProgress',
            ]),
            retrieveQuestion(target_q_id) {
                const q_obj = this.intro_questions.find(elem => { return elem.id == target_q_id; });
                if (q_obj) {
                    this.question_text = q_obj.question;
                    this.question_type = q_obj.question_type.type;
                    if ( this.question_type === 'boolean') {
                        this.answers_list = this.boolean_answers;
                    } else {
                        this.answers_list = q_obj.answers;
                    } 
                } else {
                    console.log("=== Retriving question === no such question");
                }
                this.prepareAnswersStatus();
                this.retrieveSavedAnswers();
            },
            retrieveSavedAnswers() {
                console.log("=== retrieve saved answers related with this question ===");
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const log_answers = log.intro_answers;
                const saved_answers_objs = log_answers.find(elem => { return elem.id === this.question_id; });
                
                if (saved_answers_objs) {
                    const saved_answers = saved_answers_objs.a;
                    console.dir(saved_answers);
                    this.free_text = saved_answers.length > 0 ? saved_answers[saved_answers.length - 1] : [];
                    this.answers_list.forEach(ans => {
                        const search_in_saved = saved_answers.find(elem => { return elem == ans.answer; });
                        if (search_in_saved) {
                            ans.status = true;
                            ans.id = ans.id + Math.random() * 0.01;
                            this.selected_answers.push(ans.answer);
                        }
                    });
                }
            },
            prepareCurrentQuestion() {
                this.question_id = this.question_ids[this.question_idx];
                this.retrieveQuestion(this.question_id);
            },
            prepareAnotherQuestion(q_idx) {
                this.$navigateTo(this.$options.components.Diagnose, {
                    animated: true,
                    clearHistory: false,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        question_ids: this.question_ids,
                        question_idx: q_idx
                    }
                });
            },
            prepareNextStage() {
                console.log("=== TODO Finished General ===");
                this.$navigateTo(ChooseProtocol, {
                    animated: true,
                    clearHistory: false,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                    }
                });
            },
            prepareAnswersStatus() {
                this.answers_list.forEach(elem => { elem.status = false; });
            },
            toggleMultiAnswerSelection(ans_text) {
                const ans_idx = this.selected_answers.findIndex( selected => { return selected === ans_text; });
                if (ans_idx === -1) {
                    this.selected_answers.push(ans_text);
                } else {
                    this.selected_answers.splice(ans_idx, 1);
                }
                console.dir(this.selected_answers)
            },
            changeNextText(new_text) {
                this.next_text = new_text;
            },
            checkNextButtonStatus() {
                const whetherSelected = this.selected_answers.length > 0;
                const whetherEnterred = this.free_text.trim() != "";
                if (! whetherSelected && ! whetherEnterred) this.changeNextText("Skip");
                else this.changeNextText("Next");
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const freeTextfield = layoutView.getViewById("diagnose-free");
                freeTextfield.dismissSoftInput();
            },
            onForward() {
                console.log("=== Forward === ");
                this.selected_answers.push(this.free_text);
                const progress = {
                    log_id: this.log_id,
                    q_id: this.question_id, 
                    a: this.selected_answers
                };
                this.saveIntroProgress(progress);
                
                const next_question_idx = this.question_idx + 1;
                if (next_question_idx < this.intro_questions.length) {
                    this.prepareAnotherQuestion(next_question_idx);
                } else {
                    this.prepareNextStage();
                }
            },
            onBackward() {
                console.log("=== Backward ===");
                const prev_question_idx = this.question_idx - 1;
                if (prev_question_idx >= 0) {
                    this.prepareAnotherQuestion(prev_question_idx);
                } else {
                    console.log("=== No prev question to go to ===")
                }
            },
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onAnswerTap(ans) {
                const ans_idx = this.answers_list.findIndex( elem => { return elem.id === ans.id; });
                
                if (this.question_type == 'single_select' || this.question_type == 'boolean') {
                    const prev_status = ans.status; 
                    this.answers_list.forEach((elem, elem_idx) => { 
                        elem.status = false;
                    });
                    this.selected_answers = prev_status ? [] : [ans.answer];   
                    ans.status = ! prev_status;
                    ans.id = ans.id + Math.random() * 0.01;
                } else if (this.question_type == 'multiple_select') {
                    this.toggleMultiAnswerSelection(ans.answer);
                    ans.status = ! ans.status;
                    ans.id = ans.id + Math.random() * 0.01;
                } else {
                    console.log("=== on answer tap === q type is scale or free form");
                }

                this.checkNextButtonStatus();
                console.log("=== Answer tapped === " + this.selected_answers);
            },
            onTextEntered() {
                this.checkNextButtonStatus();
                console.log("=== Answer enterred === " + this.free_text);
            },
            onNavigatingFrom() {
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.diagnoseGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.ctnrSetting = {
                        class: "diagnose-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "diagnose-ctnr"
                    };
                }
            }
        }
        
    };
</script>

<style>
</style>