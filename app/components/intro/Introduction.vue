<template>
    <Page class="page intro-page">
        <GridLayout :class="formatSetting" 
                    rows="auto, auto, *, auto" 
                    columns="auto, *, auto" ref="introGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewLog" />

            <ClientBlock row="1" col="0" colSpan="3" :log_id="log_id" :has_proto="false" />

            <ScrollView row="2" col="0" rowSpan="2" colSpan="3" class="intro-main-ctnr">
                <StackLayout>
                    <StackLayout class="intro-title-ctnr">
                        <Label class="intro-title" text="Introduction"></Label>
                    </StackLayout>
                    <StackLayout>
                        <StackLayout v-for="question in questions" :key="question.id">
                            <StepQuestion :unit="question" :log_id="log_id" 
                                          @answerChange="(data) => { recordResponse(question, data); }"
                                          @foundResponse="onResponseChange(true)" /> 
                        </StackLayout>
                    </StackLayout>
                </StackLayout>
            </ScrollView>

            <Button row="3" col="0" v-if="step_idx != 0 && !from_summary" class="back-btn" text="Back" @tap="onBackTap" ></Button>

            <Button row="3" col="2" v-if="!from_summary" class="next-btn" :text="next_text" @tap="onNextTap" ></Button>

            <Button row="3" col="2" v-if="from_summary" class="save-btn" text="save" @tap="onSummaryTap" ></Button>
        </GridLayout>
        </Page>
</template>

<script>
    /**
     *  =============================================================
     * 
     *  Page to ask introduction questions
     *  [Description] - can be opened from NewClient/ ChooseProtocols/ AssessItems/ Summary page
     *  [Related] - styles in introduction.scss
     *  @param {Number} step_id - the id number of current step in introduction
     *  @param {Array} questions - list of introduction questions in current step
     *  @param {Array} responses - list of responses
     *  @param {String} next_text - text of the next button
     *  @param {String} textview_ids list of objects records the y position of each element
     *      - id - the id of the element
     *      - y - the y position of the element on the page
     *  @param {Object} formatSetting - variable to store screen-size sensitive classnames
     *  @prop {Number} log_id - the id of the current document
     *  @prop {Array} step_ids - list of available step ids
     *  @prop {Number} step_idx - the index of current step
     *  @prop {Boolean} from_summary - - variable to check whether the page is navigated from Summary page
     * 
     *  =============================================================
     * **/

    import NavBar from '../general/parts/NavBar.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
    import ChooseProtocol from '../protocols/ChooseProtocol.vue';
    import StepQuestion from './parts/StepQuestion.vue';
    import AssessItems from '../protocols/AssessItems.vue';
    import Summary from '../summary/Summary.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        name: 'introduction',
        data() {
            return {
                step_id: 1,
                questions: [],
                responses: [],
                next_text: 'Skip',
                textview_ids: new Set(),

                formatSetting: "intro-ctnr"
            }
        },
        beforeCreate: function () {
            // Enable this component to call itself
            this.$options.components.Introduction = require('./Introduction.vue').default;
        },
        created() {
            
        },
        mounted() {
            this.prepareIntro();
        },
        components: {
            NavBar,
            ClientBlock,
            StepQuestion,
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            step_ids: {
                type: Array,
                required: true,
            },
            step_idx: {
                type: Number,
                required: true,
            },
            from_summary: {
                type: Boolean,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'intro',
                'assessment_letters'
            ]), 
		},
        methods: {
            ...mapActions([
                'saveIntroUpdate',
                'saveIntroProgress',
                'saveProtoProgress'
            ]),
            /**
             *  Function to retrieve all question objects related with current step
             * **/
            prepareIntro() {
                this.step_id = this.step_ids[this.step_idx];
                const step_obj = this.intro.find(elem => { return elem.id == this.step_id; });
                if (step_obj) {
                    this.questions = step_obj.questions;
                    this.questions.forEach(elem => { this.textview_ids.add(`answers-free-${elem.id}`); });
                }
            },
            /**
             *  Function to navigate to another introduction step page
             *  @param {Number} step_idx - the index of step
             * **/
            prepareAnotherQuestion(step_idx) {
                this.$navigateTo(this.$options.components.Introduction, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        step_ids: this.step_ids,
                        step_idx: step_idx,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to save any response changes to data storage
             *  @param {Object} q - the question object
             *  @param {data} data - the response object
             * **/
            recordResponse(q, data) {
                const response_item = {
                    q_id: q.id, 
                    a: data,
                };
                const response_idx = this.responses.findIndex( elem => { return elem.q_id === q.id; });
                if (response_idx === -1) {
                    this.responses.push(response_item);
                } else {
                    this.responses[response_idx].a = data;
                }

                const update = {
                    log_id: this.log_id,
                    content: this.responses,
                };
                this.saveIntroUpdate(update);
                
                this.onResponseChange(false);
            },
            /**
             *  Function to go next to ChooseProtocol page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            prepareNextStage() {
                this.$navigateTo(ChooseProtocol, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to jump back to Summary page if in summary edit mode
             *  [Description] - always clear navigation history
             * **/
            goToSummary() {
                this.$navigateTo(Summary, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'slide',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        has_prev: false
                    }
                });
            },
            /**
             *  Function to change next button text
             *  @param {new_next}
             * **/
            changeNextText(new_text) {
                this.next_text = new_text;
            },
            /**
             *  Function to abort the current document and start a new doucment
             *  [Description] - always clear navigation history
             * **/
            addNewLog() {
                this.$navigateTo(NewClient, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slide',
                        curve: 'easeIn',
                        duration: 300
                    },
                });
            },
            /**
             *  Function to save current progress in linear documenting mode moving forwards
             * **/
            onForward(args) {
                const next_step_idx = this.step_idx + 1;
                if (next_step_idx < this.intro.length) {
                    const progress = {
                        log_id: this.log_id,
                        s_id: this.step_ids[next_step_idx],
                    }
                    this.saveIntroProgress(progress);
                    this.prepareAnotherQuestion(next_step_idx);
                } else {
                    const progress = {
                        log_id: this.log_id,
                        p_id: -1,
                    }
                    this.saveProtoProgress(progress);
                    this.prepareNextStage();
                }
            },
            /**
             *  Function to save current progress in linear documenting mode moving backwards
             * **/
            onBackward(args) {
                const prev_step_idx = this.step_idx - 1;
                if (prev_step_idx >= 0) {
                    const progress = {
                        log_id: this.log_id,
                        s_id: this.step_ids[prev_step_idx],
                    }
                    this.saveIntroProgress(progress);
                    this.prepareAnotherQuestion(prev_step_idx);
                } else {
                    console.log("=== No prev step to go to ===")
                }
            },
            /**
             *  Function to call when back button tapped
             * **/
            onBackTap() {
                this.onBackward();
            },
            /**
             *  Function to call when next button tapped
             * **/
            onNextTap() {
                this.onForward();
            },
            /**
             *  Function to call when save button tapped
             * **/
            onSummaryTap() {
                this.goToSummary();
            },
            /**
             *  Function to call when any response has changed, set button text accordingly
             *  @param {Boolean} from_saved - whether the response change is happenning because of user interaction or from saved data storage
             * **/
            onResponseChange(from_saved=false) {
                let test_empty_response = '';
                this.responses.forEach(r => { test_empty_response = test_empty_response + r.a.join(); });

                if (from_saved || (this.responses.length > 0 && test_empty_response.trim() != '') ) {
                    this.changeNextText('Next');
                } else {
                    this.changeNextText('Skip');
                }
            },
            /**
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                const page = args.object.page;
                this.textview_ids.forEach(elem => {
                    const freeTextfield = page.getViewById(elem);
                    if (freeTextfield) freeTextfield.dismissSoftInput();   
                });
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.introGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 800) {
                    this.formatSetting = "intro-ctnr tablet-landscape";
                } else {
                    this.formatSetting = "intro-ctnr";
                }
            },
        }
        
    };
</script>