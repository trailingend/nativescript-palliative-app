<template>
    <Page class="recommendations recommendations-page">
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, auto, auto, *, auto, auto" 
                    columns="auto, *, auto" ref="recommendationsGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewLog" />

            <ClientBlock row="1" col="0" colSpan="3" :log_id="log_id" :has_proto="true" @goToProtocol="(data) => goToNextProtocol(data)"/>

            <StackLayout row="2" col="0" colSpan="3" class="recommendations-title-ctnr" >
                <Label class="recommendations-title" text="Recommendations"></Label> 
                <!-- <StackLayout class="divider-ctnr"></StackLayout> -->
            </StackLayout>

            <ScrollView row="3" col="0" rowSpan="3" colSpan="3" class="recommendations-main-ctnr">
                <StackLayout class="recommendations-q-a-ctnr" >
                    <StackLayout class="spacer-ctnr"></StackLayout>
                    <StackLayout class="recommendations-free-ctnr">
                        <TextView v-model="free_text" 
                                id="recommendations-free"
                                hint="Take notes here..."
                                @textChange="onTextEntered"
                                editable="true" />
                    </StackLayout>
                </StackLayout>
            </ScrollView>

            <RecommendButton row="4" col="2" rowSpan="1" colSpan="1" 
                             v-show="protocol_id != null && protocol_id != undefined && protocol_id != -1"
                             :log_id="log_id" :protocol_id="protocol_id" />

            <Button row="5" col="0" v-if="!from_summary" class="back-btn" text="Back" @tap="onBackTap" ></Button>
                
            <Button row="5" col="2" v-if="!from_summary" class="next-btn" text="Next" @tap="onNextTap" ></Button>

            <Button row="5" col="2" v-if="from_summary" class="save-btn" text="save" @tap="onSummaryTap" ></Button>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Page to ask user to provide a recommendation
     *  [Description] - can be opened from AssessOthers/ Plans page
     *  [Related] - styles in recommendations.scss
     *  @param {String} free_text - textfield to record user's free response
     *  @param {Object} ctnrSetting - variable to store screen-size sensitive classnames
     *  @prop {String} log_id - the id of the current document
     *  @prop {Number} protocol_id - the id of the current protocol
     *  @prop {String} from_summary - variable to check whether the page is navigated from Summary page
     * 
     *  =============================================================
     * **/

    import NavBar from '../general/parts/NavBar.vue';
    import NewClient from '../intro/NewClient.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
    import RecommendButton from './parts/RecommendButton.vue';
    import ChooseProtocol from './ChooseProtocol.vue';
    import AssessOthers from './AssessOthers.vue';
    import AssessItems from './AssessItems.vue';
    import Summary from '../summary/Summary.vue';
    import Plans from '../protocols/Plans.vue';

    import { mapActions, mapGetters } from 'vuex';
    import Vue from 'nativescript-vue';

    import { confirm }  from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                free_text: '',

                ctnrSetting: {
                    class: "recommendations-ctnr"
                }
            }
        },
        created() {
            this.prepareRecommendations();
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                // type: any,
                required: false,
            },
            from_summary: {
                type: Boolean,
                required: true,
            }
        },
        components: {
            NavBar,
            ClientBlock,
            RecommendButton,
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols'
			]),
        },
        methods: {
            ...mapActions([
                'saveRecommendationsUpdate',
                'saveRecommendationsProgress',
                'saveProtoProgress',
                'savePlansProgress'
            ]),
            /**
             *  Function to retrieved previously saved recommendations from data storage
             * **/
            retrieveSavedRecommendations() {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                this.free_text = log.recommendations;
            },
            /**
             *  Function to retrieve saved data and setup status sub-field on the page
             * **/
            prepareRecommendations() {
                this.retrieveSavedRecommendations();
            },
            /**
             *  Function to go back to AssessOthers page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            preparePrevStage() {
                let q_ids = [];
                const others_questions = this.protocols.find(elem => { return elem.id === this.protocol_id; }).additional_questions;
                others_questions.forEach(elem => { q_ids.push(elem.id); });
                this.$navigateTo(AssessOthers, {
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
                        question_ids: q_ids,
                        question_idx: q_ids.length - 1,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to go next to Plans page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            prepareNextStage() {
                this.$navigateTo(Plans, {
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
             *  Function to jump to ChooseProtocol page if no protocol selected in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            prepareChooseProto() {
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
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const freeTextfield = layoutView.getViewById("recommendations-free");
                freeTextfield.dismissSoftInput();
            },
            /**
             *  Function to save recommendations to data storage
             * **/
            recordResponse() {
                const update = {
                    log_id: this.log_id,
                    content: this.free_text,
                };
                this.saveRecommendationsUpdate(update);
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
            onForward() {                
                const progress = {
                    log_id: this.log_id,
                    in_plans: 1,
                }
                this.savePlansProgress(progress);
                this.prepareNextStage();
            },
            /**
             *  Function to save current progress in linear documenting mode moving backwards
             * **/
            onBackward() {
                if (this.protocol_id != null && this.protocol_id != undefined && this.protocol_id != -1) {
                    const progress = {
                        log_id: this.log_id,
                        in_recommendations: 0,
                    }
                    this.saveRecommendationsProgress(progress);
                    this.preparePrevStage();
                } else {
                    const progress = {
                        log_id: this.log_id,
                        p_id: -1,
                    }
                    this.saveProtoProgress(progress);
                    this.prepareChooseProto();
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
             *  Function to call when free textfield is changed
             * **/
            onTextEntered() {
                this.recordResponse();
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.recommendationsGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.ctnrSetting = {
                        class: "recommendations-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "recommendations-ctnr"
                    };
                }
            },
            /**
             *  Function to create a new client 
             * **/
            onNewTap() {
                confirm({
                    title: "Create New Client",
                    message: "Your current progress will be saved in your Client History.",
                    okButtonText: "Create New Client",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result || result === undefined) {
                        this.addNewLog();
                    } 
                });
            },
        }
    };
</script>

