<template>
    <Page class="page plans-page">
        <ActionBar title="Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, *, auto" 
                    columns="*" ref="plansGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <PatientBlock row="0" col="0" colSpan="2" :log_id="log_id"/>

            <StackLayout row="1" col="0" rowSpan="2" class="plans-main-ctnr">
                <StackLayout class="plans-q-a-ctnr" >
                    <StackLayout class="plans-title-ctnr">
                        <Label class="plans-title" text="Select plan"></Label>
                        <StackLayout class="divider-ctnr"></StackLayout>
                    </StackLayout>
                    <!-- <FlexboxLayout orientation="horizontal" alignItems="align" justifyContent="flex-start" class="plans-q-ctnr">
                        <Label text="description placeholder" class="plans-q"/>
                    </FlexboxLayout> -->
                    <StackLayout>
                    <GridLayout v-for="plan in plans_list" 
                                :key="plan.unique" 
                                class="plans-a-ctnr" 
                                rows="auto" columns="auto, *"
                                @tap="onAnswerTap(plan)" > 
                        <Image row="0" col="0" width="30" class="ans-status-icon " v-show="!plan.status" src="~/assets/images/unchecked.png" stretch="aspectFit"></Image>
                        <Image row="0" col="0" width="30" class="ans-status-icon" v-show="plan.status" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                        <Label row="0" col="1" class="plans-a" :text="plan.plan" textWrap="true" />
                    </GridLayout>
                    </StackLayout>
                    <TextView v-model="free_text" 
                              id="plans-free"
                              class="plans-free"
                              hint="Take notes here..."
                              @textChange="onTextEntered"
                              editable="true" />
                </StackLayout>
            </StackLayout>

            <!-- <NewProtocolButton row="1" col="0" /> -->

            <FlexboxLayout row="2" col="0"
                           orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" text="Next" @tap="onNextTap" ></Button>
            </FlexboxLayout>

        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import PatientBlock from '../general/parts/PatientBlock.vue';
    import AssessOthers from './AssessOthers.vue';
    import Preview from './Preview.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import Vue from 'nativescript-vue';

    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                plans_list: [],
                status_list: [],

                selected_plans: [],
                free_text: '',

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
                required: true,
            },
        },
        components: {
            PatientBlock,
            NewButton,
            CloseButton,
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
                'savePlansProgress'
            ]),
            retrieveSavedPlans() {
                
            },
            preparePlans() {
                const plan_id_objs = this.protocols.find(elem => { return elem.id == this.protocol_id; }).plans;
                const plan_ids = this.protocols.find(elem => { return elem.id == this.protocol_id; }).plans.map(plan => plan.plan);
                this.plans_list = this.plans.filter(elem => { return plan_ids.includes(elem.id); });
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
                this.$navigateTo(Preview, {
                    animated: true,
                    clearHistory: true,
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
            onForward() {
                console.log("=== Forward === ");
                this.selected_plans.push(this.free_text);
                const progress = {
                    log_id: this.log_id,
                    p_id: this.protocol_id, 
                    a: this.selected_plans
                };
                console.log("=== TODO log progress === ");
                this.savePlansProgress(progress);
                this.prepareNextStage();
            },
            onBackward() {
                this.preparePrevStage();
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
                console.log("=== Answer tapped === " + this.selected_plans);
            },
            onTextEntered() {
                console.log("=== Answer enterred === " + this.free_text);
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
            }
        }
    };
</script>

