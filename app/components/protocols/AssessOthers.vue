<template>
    <Page class="page others-page">
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, auto, auto, *, auto, auto" columns="auto, *, auto" 
                    ref="othersGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewLog" />

            <ClientBlock row="1" col="0" colSpan="3" :log_id="log_id" :has_proto="true" @goToProtocol="(data) => goToNextProtocol(data)"/>

            <StackLayout row="2" col="0" colSpan="3" class="others-title-ctnr">
                <Label class="others-title" :text="p_title"></Label> 
                <Label class="others-subtitle" text="Other"></Label>
                <StackLayout class="divider-ctnr"></StackLayout>
            </StackLayout>

            <ScrollView row="3" col="0" rowSpan="3" colSpan="3" class="others-main-ctnr">
                <StackLayout>
                    <StackLayout class="spacer-ctnr"></StackLayout>
                    <StackLayout v-for="question in others_questions"
                                :key="question.id">
                        <OthersQuestion :unit="question" :log_id="log_id" 
                                        @foundResponse="changeNextText('Next')"
                                        @answerChange="changeNextText('Next')" /> 
                    </StackLayout>
                </StackLayout>
            </ScrollView>

            <RecommendButton row="4" col="2"
                             :log_id="log_id" :protocol_id="protocol_id" />

            <Button row="5" col="0" colSpan="1" class="back-btn" v-if="!from_summary" text="Back" @tap="onBackTap" ></Button>

            <Button row="5" col="2" class="next-btn" v-if="!from_summary" :text="next_text" @tap="onNextTap" ></Button>

            <Button row="5" col="2" colSpan="1" v-if="from_summary" class="save-btn" text="save" @tap="onSummaryTap" ></Button>
        </GridLayout>
    </Page>
</template>

<script>
    /**
     *  =============================================================
     * 
     *  Page to ask assessment-other questions
     *  [Description] - can be opened from AssessItems/ Plans/ Summary page
     *  [Related] - styles in assessOthers.scss
     *  @param {String} p_title - name of current protocol
     *  @param {String} next_text - text displayed on next button, either 'Next' pr 'Skip'
     *  @param {Set} textview_ids - set of unique ids of every textfield on the page
     *  @param {Object} ctnrSetting - variable to store screen-size sensitive classnames
     *  @prop {String} log_id - the id of the current document
     *  @prop {Number} protocol_id - the id of the current protocol
     *  @prop {String} from_summary - variable to check whether the page is navigated from Summary page
     * 
     *  =============================================================
     * **/
    
    import NavBar from '../general/parts/NavBar.vue';
    import OthersQuestion from './parts/OthersQuestion.vue';
    import NewClient from '../intro/NewClient.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
    import RecommendButton from './parts/RecommendButton.vue';
    import AssessItems from './AssessItems.vue';
    import Recommendations from './Recommendations.vue';
    import Summary from '../summary/Summary.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { confirm }  from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        name: 'AssessOthers',
        data() {
            return {
                p_title: 'Protocol',
                next_text: 'Skip',
                textview_ids: new Set(),

                ctnrSetting: {
                    class: "others-ctnr"
                }
            }
        },
        created() {
            this.prepareQuestions();
        },
        components: {
            NavBar,
            OthersQuestion,
            ClientBlock,
            RecommendButton
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
            from_summary: {
                type: Boolean,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols',
            ]),
            others_questions: function() {
                return this.protocols.find(elem => { return elem.id === this.protocol_id; }).additional_questions;
            }
        },
        methods: {
            ...mapActions([
                'saveOthersProgress',
                'saveRecommendationsProgress',
            ]),
            /**
             *  Function to retrieve id of textfields on the page
             * **/
            prepareQuestions() {
                this.p_title = this.protocols.find(elem => { return elem.id === this.protocol_id; }).name;
                this.others_questions.forEach(elem => { this.textview_ids.add(`answers-free-${elem.id}`); });
            },
            /**
             *  Function to go back to AssessItems page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            preparePrevStage() {
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
                        protocol_id: this.protocol_id,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to go next to Plans page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            prepareNextStage() {
                this.$navigateTo(Recommendations, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        protocol_id: this.protocol_id,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to jump to another protocol's Itenms page
             *  [Description] - always clear navigation history
             * **/
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
             * **/
            changeNextText(new_text) {
                this.next_text = new_text;
            },
<<<<<<< HEAD
            /**
             *  Function to abort the current document and start a new doucment
             *  [Description] - always clear navigation history
             * **/
            addNewChart() {
=======
            addNewLog() {
>>>>>>> josh
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
            onForward() {
                const progress = {
                    log_id: this.log_id,
                    in_recommendations: 1,
                }
                this.saveRecommendationsProgress(progress);
                this.prepareNextStage();
            },
            /**
             *  Function to save current progress in linear documenting mode moving backwards
             * **/
            onBackward() {
                const progress = {
                    log_id: this.log_id,
                    in_others: 0,
                }
                this.saveOthersProgress(progress);
                this.preparePrevStage();
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
             *  Function to call when save button tapped in summary editing mode
             * **/
            onSummaryTap() {
                this.goToSummary();
            },
            /**
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                this.textview_ids.forEach(elem => {
                    const freeTextfield = layoutView.getViewById(elem);
                    if (freeTextfield) freeTextfield.dismissSoftInput();
                });
            },
            /**
             *  Function to swap class-level classnames on media query changes
             *  [Description] - all add extra padding to the laste letter section
             * **/
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.othersGridRef.nativeView.getMeasuredWidth() );

                if (width > 800) {
                    this.ctnrSetting = {
                        class: "others-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "others-ctnr"
                    };
                }
            },
        }
    }
</script>