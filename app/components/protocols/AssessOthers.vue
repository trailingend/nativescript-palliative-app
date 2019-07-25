<template>
    <Page class="page others-page">
        <ActionBar title="Chart">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <!-- <NewButton /> -->
            <ActionItem @tap="onNewTap" text="+ New Client" ios.position="right"></ActionItem>
        </ActionBar>
        <GridLayout :class="ctnrSetting.class" 
                    rows="auto, *, auto, auto" columns="auto, *, auto" 
                    ref="othersGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <ClientBlock row="0" col="0" colSpan="3" :log_id="log_id"/>

            <ScrollView row="1" col="0" rowSpan="3" colSpan="3" class="others-main-ctnr">
                <StackLayout>
                    <StackLayout class="others-title-ctnr">
                        <Label class="others-title" :text="p_title"></Label>                        
                    </StackLayout>
                    <StackLayout class="others-subtitle-ctnr">
                        <Label class="others-subtitle" text="Others"></Label>
                    </StackLayout>
                    <StackLayout v-for="question in others_questions"
                                :key="question.id">
                        <OthersQuestion :unit="question" :log_id="log_id" 
                                        @foundResponse="changeNextText('Next')"
                                        @answerChange="onResponseEntered" /> 
                    </StackLayout>
                </StackLayout>
            </ScrollView>

            <ResourcesButton row="2" col="2" rowSpan="1" 
                             :log_id="log_id" :protocol_id="protocol_id" />

            <Button row="3" col="0" colSpan="1" class="back-btn" text="Back" @tap="onBackTap" ></Button>

            <Button row="3" col="2" class="next-btn" :text="next_text" @tap="onNextTap" ></Button>
        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import OthersQuestion from './parts/OthersQuestion.vue';
    import NewClient from '../intro/NewClient.vue';
    import ClientBlock from '../intro/parts/ClientBlock.vue';
    import ResourcesButton from './parts/ResourcesButton.vue';
    import AssessItems from './AssessItems.vue';
    import Plans from './Plans.vue';

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

                responses: [],
                textview_ids: new Set(),

                color_checked: '#acd6b5',
                color_unchecked: '#f5f5f5',

                ctnrSetting: {
                    class: "others-ctnr"
                }
            }
        },
        created() {
            this.prepareQuestions();
        },
        components: {
            CloseButton,
            OthersQuestion,
            ClientBlock,
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
            prepareQuestions() {
                this.p_title = this.protocols.find(elem => { return elem.id === this.protocol_id; }).name;
                this.others_questions.forEach(elem => { this.textview_ids.add(`answers-free-${elem.id}`); });
            },
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
                        protocol_id: this.protocol_id
                    }
                });
            },
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
                        protocol_id: this.protocol_id
                    }
                });
            },
            changeNextText(new_text) {
                this.next_text = new_text;
            },
            onResponseEntered() {
                this.changeNextText("Next");
            },
            onForward() {
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
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                this.textview_ids.forEach(elem => {
                    const freeTextfield = layoutView.getViewById(elem);
                    if (freeTextfield) freeTextfield.dismissSoftInput();
                });
            },
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
    }
</script>