<template>
    <Page class="page others-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
        </ActionBar>
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, auto, *, auto" columns="*" 
                    ref="othersGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" :log_id="log_id"/>

            <StackLayout row="1" col="0" rowSpan="3" class="others-main-ctnr">
                <StackLayout class="others-q-a-ctnr" >
                    <StackLayout class="others-title-ctnr">
                        <Label class="others-title" text="Assess"></Label>
                        <Label class="others-subtitle" text="Others"></Label>
                        <StackLayout class="divider-ctnr"></StackLayout>
                    </StackLayout>
                    <FlexboxLayout orientation="horizontal" alignItems="align" justifyContent="flex-start" class="others-q-ctnr">
                        <Image width="50" class="q-icon" src="~/assets/images/q-icon.png" stretch="aspectFit"></Image>
                        <Label :text="question_text" class="others-q"/>
                    </FlexboxLayout>
                    <GridLayout v-for="answer in answers_list" 
                                   :key="answer.id" 
                                   class="others-a-ctnr" 
                                   rows="auto" columns="auto, *"
                                   @tap="onAnswerTap(answer)" > 
                        <Image row="0" col="0" width="30" class="ans-status-icon " v-show="!answer.status" src="~/assets/images/unchecked.png" stretch="aspectFit"></Image>
                        <Image row="0" col="0" width="30" class="ans-status-icon" v-show="answer.status" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                        <Label row="0" col="1" class="others-a" :text="answer.answer" />
                    </GridLayout>
                    <TextView v-model="free_text" 
                               id="others-free"
                               class="others-free"
                               hint="Take notes here..."
                               @textChange="onTextEntered"
                               editable="true" />
                </StackLayout>
            </StackLayout>

            <ResourcesButton row="1" col="0" rowSpan="1" colSpan="2" 
                             :log_id="log_id" :protocol_id="protocol_id" />

            <FlexboxLayout row="3" col="0" orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" :text="next_text" @tap="onNextTap" ></Button>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import UserBlock from '../general/parts/UserBlock.vue';
    import ResourcesButton from './parts/ResourcesButton.vue';
    import AssessItems from './AssessItems.vue';
    import Plans from './Plans.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
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
                    class: "others-ctnr"
                }
            }
        },
        beforeCreate: function () {
            this.$options.components.AssessOthers = require('./AssessOthers.vue').default
        },
        created() {
            this.prepareCurrentQuestion();
        },
        components: {
            CloseButton,
            NewButton,
            UserBlock,
            ResourcesButton
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
                'protocols',
            ]),
        },
        methods: {
            ...mapActions([
            ]),
            retrieveQuestion(target_q_id) {
                const p_idx = this.protocols.findIndex(elem => { return elem.id === this.protocol_id; });
                const q_obj = this.protocols[p_idx].additional_questions.find(elem => { return elem.id == target_q_id; });
                if (q_obj) {
                    this.question_text = q_obj.question;
                    this.question_type = q_obj.question_type.type;
                    if ( this.question_type === 'boolean') {
                        this.answers_list = this.boolean_answers;
                    } else if (this.question_type === 'free_form') {
                        this.answers_list = [];
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
            },
            prepareCurrentQuestion() {
                this.question_id = this.question_ids[this.question_idx];
                this.retrieveQuestion(this.question_id);
            },
            prepareAnotherQuestion(q_idx) {
                this.$navigateTo(this.$options.components.AssessOthers, {
                    animated: true,
                    clearHistory: false,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        protocol_id: this.protocol_id,
                        question_ids: this.question_ids,
                        question_idx: q_idx
                    }
                });
            },
            preparePrevStage() {
                this.$navigateTo(AssessItems, {
                    animated: true,
                    clearHistory: false,
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
                this.$navigateTo(Plans, {
                    animated: true,
                    clearHistory: false,
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
                const freeTextfield = layoutView.getViewById("others-free");
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
                console.log("=== TODO log progress === ");
                
                const p_idx = this.protocols.findIndex(elem => { return elem.id === this.protocol_id; });
                const next_question_idx = this.question_idx + 1;
                if (next_question_idx < this.protocols[p_idx].additional_questions.length) {
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
                    this.preparePrevStage();
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
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.othersGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.ctnrSetting = {
                        class: "others-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "others-ctnr"
                    };
                }
            }
        }
    }
</script>