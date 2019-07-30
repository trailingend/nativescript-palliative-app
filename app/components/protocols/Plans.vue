<template>
    <Page class="page plans-page">
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, auto, auto, *, auto, auto" 
                    columns="auto, *, auto" ref="plansGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" @newClient="addNewChart" />

            <ClientBlock row="1" col="0" colSpan="3" :log_id="log_id" @goToProtocol="(data) => goToNextProtocol(data)"/>

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
                    <TextView v-model="free_text" 
                              id="plans-free"
                              class="plans-free"
                              hint="Take notes here..."
                              @textChange="onTextEntered"
                              editable="true" />
                </StackLayout>
            </ScrollView>

            <ResourcesButton row="4" col="2" rowSpan="1" colSpan="1" 
                             v-show="protocol_id != null && protocol_id != undefined && protocol_id != -1"
                             :log_id="log_id" :protocol_id="protocol_id" />

            <Button row="5" col="0" class="back-btn" text="Back" @tap="onBackTap" ></Button>
                
            <Button row="5" col="2" class="next-btn" text="Next" @tap="onNextTap" ></Button>

        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import NavBar from '../general/parts/NavBar.vue';
    import NewClient from '../intro/NewClient.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
    import ResourcesButton from './parts/ResourcesButton.vue';
    import ChooseProtocol from './ChooseProtocol.vue';
    import AssessOthers from './AssessOthers.vue';
    import AssessItems from './AssessItems.vue';
    import Summary from '../summary/Summary.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import Vue from 'nativescript-vue';

    import { confirm }  from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                plans_list: [],
                status_list: [],

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
        },
        components: {
            NavBar,
            ClientBlock,
            ResourcesButton,
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
                'savePlansProgress'
            ]),
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
            preparePlans() {
                this.plans_list = [... this.plans];
                this.preparePlansStatus();
                this.retrieveSavedPlans();
            },
            preparePlansStatus() {
                this.plans_list.forEach(elem => { 
                    elem.status = false; 
                    this.$set(elem, 'unique', elem.id)
                });
            },
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
                    }
                });
            },
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
                        protocol_id: p_id
                    }
                });
            },
            toggleMultiPlanSelection(plan_text) {
                const plan_idx = this.selected_plans.findIndex( selected => { return selected === plan_text; });
                if (plan_idx === -1) {
                    this.selected_plans.push(plan_text);
                } else {
                    this.selected_plans.splice(plan_idx, 1);
                }
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                const freeTextfield = layoutView.getViewById("plans-free");
                freeTextfield.dismissSoftInput();
            },
            recordResponse() {
                const update = {
                    log_id: this.log_id,
                    content: [...this.selected_plans, this.free_text],
                };
                this.savePlansUpdate(update);
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
            onForward() {
                console.log("=== Forward === ");
                
                const progress = {
                    log_id: this.log_id,
                    has_plan: 1,
                }
                this.savePlansProgress(progress);

                this.prepareNextStage();
            },
            onBackward() {
                if (this.protocol_id != null && this.protocol_id != undefined && this.protocol_id != -1) {
                    this.preparePrevStage();
                } else {
                    this.prepareChooseProto();
                }
            },
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onAnswerTap(plan) {
                const plan_idx = this.plans_list.findIndex( elem => { return elem.id === plan.id; });
                this.toggleMultiPlanSelection(plan.plan);
                plan.status = ! plan.status;
                this.$set(plan, 'unique', plan.unique + 0.01);
                this.recordResponse();
            },
            onTextEntered() {
                this.recordResponse();
            },
            onNavigatingFrom() {
            },
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

            onNewTap() {
                confirm({
                    title: "Create New Chart",
                    message: "Your current progress will be saved in your Chart History.",
                    okButtonText: "Create New Chart",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result || result === undefined) {
                        this.addNewLog();
                    } 
                });
            },
            addNewLog(args) {
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
        }
    };
</script>

