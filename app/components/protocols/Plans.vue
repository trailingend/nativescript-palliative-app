<template>
    <Page class="page plans-page">
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, auto, auto, *, auto, auto" 
                    columns="auto, *, auto" ref="plansGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewChart" />

            <ClientBlock row="1" col="0" colSpan="3" :log_id="log_id" :has_proto="true" @goToProtocol="(data) => goToNextProtocol(data)"/>

            <StackLayout row="2" col="0" colSpan="3" class="plans-title-ctnr" >
                <Label class="plans-title" text="Select plan(s)"></Label> 
                <!-- <Label class="plans-subtitle" text="Plan"></Label> -->
                <!-- <StackLayout class="divider-ctnr"></StackLayout> -->
            </StackLayout>

            <ScrollView row="3" col="0" rowSpan="3" colSpan="3" class="plans-main-ctnr">
                <StackLayout class="plans-q-a-ctnr" >
                    <StackLayout class="spacer-ctnr"></StackLayout>
                    <StackLayout>
                        <GridLayout v-for="plan in plans_list" 
                                    :key="plan.unique" 
                                    class="plans-a-ctnr" 
                                    :backgroundColor="plan.status ? color_checked : color_unchecked"
                                    rows="auto" columns="auto, *"
                                    @tap="onAnswerTap(plan)" > 
                            <Image row="0" col="0" width="30" class="plan-status-icon " v-show="!plan.status" src="~/assets/images/unchecked.png" stretch="aspectFit"></Image>
                            <Image row="0" col="0" width="30" class="plan-status-icon" v-show="plan.status" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                            <StackLayout row="0" col="1" >
                                <Label class="plans-a" :text="plan.plan" textWrap="true"/>
                                <Label class="plans-a" v-show="plan.details != null" :text="`- ${plan.details}`" textWrap="true"/>
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                    <StackLayout class="plans-free-ctnr">
                        <TextView v-model="free_text" 
                                id="plans-free"
                                class="plans-free"
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
     *  Page to ask user to select a plan
     *  [Description] - can be opened from AssessOthers/ Summary page
     *  [Related] - styles in plans.scss
     *  @param {String} free_text - textfield to record user's free response
     *  @param {String} color_checked - constant, color indicate the plan has been selected
     *  @param {String} color_unchecked - constant, color indicate the plan has not been selected
     *  @param {Array} plans_list - list of plan items 
     *  @param {Array} selected_plans - list of all responses
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

    import { mapActions, mapGetters } from 'vuex';
    import Vue from 'nativescript-vue';

    import { confirm }  from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                plans_list: [],
                selected_plans: [],
                free_text: '',

                color_checked: '#acd6b5',
                color_unchecked: '#f5f5f5',

                ctnrSetting: {
                    class: "plans-ctnr"
                }
            }
        },
        created() {
            this.preparePlans();
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                type: Number,
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
                'plans',
                'protocols'
			]),
        },
        methods: {
            ...mapActions([
                'savePlansUpdate',
                'savePlansProgress',
                'saveProtoProgress',
                'saveSummaryProgress'
            ]),
            /**
             *  Function to retrieved previously saved plans from data storage
             * **/
            retrieveSavedPlans() {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const saved_answers = log.plans_answers;
                this.free_text = saved_answers.length > 0 ? saved_answers[saved_answers.length - 1] : "";
                this.plans_list.forEach(plan => {
                    const search_in_saved = saved_answers.find(elem => { return elem == plan.plan; });
                    if (search_in_saved) {
                        plan.status = true;
                        plan.unique = plan.unique + Math.random() * 0.01;
                        this.selected_plans.push(plan.plan);
                    }
                });
            },
            /**
             *  Function to retrieve saved data and setup status sub-field on the page
             * **/
            preparePlans() {
                this.plans_list = [... this.plans];
                this.preparePlansStatus();
                this.retrieveSavedPlans();
            },
            /**
             *  Function to setup each plan status
             * **/
            preparePlansStatus() {
                this.plans_list.forEach(elem => { 
                    elem.status = false; 
                    this.$set(elem, 'unique', elem.id)
                });
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
             *  Function to go next to Summary page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            prepareNextStage() {
                this.$navigateTo(Summary, {
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
                        has_prev: true
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
             *  Function to select or deselect a plan
             *  @param {String} plan_text - the text of plan to check
             * **/
            toggleMultiPlanSelection(plan_text) {
                const plan_idx = this.selected_plans.findIndex( selected => { return selected === plan_text; });
                if (plan_idx === -1) {
                    this.selected_plans.push(plan_text);
                } else {
                    this.selected_plans.splice(plan_idx, 1);
                }
            },
            /**
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const freeTextfield = layoutView.getViewById("plans-free");
                freeTextfield.dismissSoftInput();
            },
            /**
             *  Function to save selected plans to data storage
             * **/
            recordResponse() {
                const update = {
                    log_id: this.log_id,
                    content: [...this.selected_plans, this.free_text],
                };
                this.savePlansUpdate(update);
            },
            /**
             *  Function to abort the current document and start a new doucment
             *  [Description] - always clear navigation history
             * **/
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
            /**
             *  Function to save current progress in linear documenting mode moving forwards
             * **/
            onForward() {
                console.log("=== Forward === ");
                
                const progress = {
                    log_id: this.log_id,
                    in_sum: 1,
                }
                this.saveSummaryProgress(progress);

                this.prepareNextStage();
            },
            /**
             *  Function to save current progress in linear documenting mode moving backwards
             * **/
            onBackward() {
                if (this.protocol_id != null && this.protocol_id != undefined && this.protocol_id != -1) {
                    const progress = {
                        log_id: this.log_id,
                        has_plan: 0,
                    }
                    this.savePlansProgress(progress);
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
             *  Function to call when a plan is tapped
             * **/
            onAnswerTap(plan) {
                const plan_idx = this.plans_list.findIndex( elem => { return elem.id === plan.id; });
                this.toggleMultiPlanSelection(plan.plan);
                plan.status = ! plan.status;
                this.$set(plan, 'unique', plan.unique + 0.01);
                this.recordResponse();
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
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.plansGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.ctnrSetting = {
                        class: "plans-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "plans-ctnr"
                    };
                }
            },
        }
    };
</script>

