<template>
    <Page class="page intro-page" @navigatedTo="onNavigatedTo">
        <GridLayout :class="formatSetting" 
                    rows="auto, auto, *, auto" 
                    columns="auto, *, auto" ref="introGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewChart" />

            <ClientBlock row="1" col="0" colSpan="3" :log_id="log_id" :has_proto="false" @goToProtocol="(data) => goToNextProtocol(data)"/>

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
            prepareIntro() {
                this.step_id = this.step_ids[this.step_idx];
                const step_obj = this.intro.find(elem => { return elem.id == this.step_id; });
                if (step_obj) {
                    this.questions = step_obj.questions;
                    this.questions.forEach(elem => { this.textview_ids.add(`answers-free-${elem.id}`); });
                }
            },
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
            goToNextProtocol(p_id) {
                this.$navigateTo(AssessItems, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        protocol_id: p_id,
                        from_summary: false,
                    }
                });
            },
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
            changeNextText(new_text) {
                this.next_text = new_text;
            },
            addNewChart() {
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
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onSummaryTap() {
                this.goToSummary();
            },
            onResponseChange(from_saved=false) {
                let test_empty_response = '';
                this.responses.forEach(r => { test_empty_response = test_empty_response + r.a.join(); });

                if (from_saved || (this.responses.length > 0 && test_empty_response.trim() != '') ) {
                    this.changeNextText('Next');
                } else {
                    this.changeNextText('Skip');
                }
            },
            clearTextfieldFocus(args) {
                const page = args.object.page;
                this.textview_ids.forEach(elem => {
                    const freeTextfield = page.getViewById(elem);
                    if (freeTextfield) freeTextfield.dismissSoftInput();   
                });
            },
            onNavigatedTo(args) {
            },
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