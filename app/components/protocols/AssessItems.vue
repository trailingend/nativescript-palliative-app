<template>
    <Page class="page items-page" @navigatedTo="onNavigatedTo">
        <ActionBar title="Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout class="items-ctnr" 
                    rows="auto, auto, *, auto" 
                    columns="auto, *" ref="itemsGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <PatientBlock row="0" col="0" colSpan="2" :log_id="log_id"/>

            <ScrollView row="1" col="0" rowSpan="3" colSpan="2" 
                        id="items-main-ctnr"
                        class="items-main-ctnr"
                        @scroll="onScroll" >
                <StackLayout>
                    <StackLayout v-for="letter in assessment_letters" 
                                 :key="letter.id" 
                                 :id="`items-item-ctnr-${letter.id}`"
                                 class="items-item-ctnr">  
                        <StackLayout class="items-title-ctnr">
                            <Label class="items-title" text="Assess"></Label>
                            <Label class="items-subtitle" :text="letter.title"></Label>
                            <StackLayout class="divider-ctnr"></StackLayout>
                            <Label text="Describe what is currently happening?" class="items-d" textWrap="true"/>
                        </StackLayout>                       
                        <StackLayout v-for="question in filteredAssessments(letter)"
                                    :key="question.id">
                                <AssessItem :unit="question" @answerChange="(data) => { recordResponse(question, data); }" /> 
                        </StackLayout>
                    </StackLayout>                            
                </StackLayout>
            </ScrollView>

            <ResourcesButton row="1" col="0" rowSpan="1" colSpan="2" 
                             :log_id="log_id" :protocol_id="protocol_id" />

            <FlexboxLayout row="3" col="0" rowSpan="1" colSpan="2"
                           orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" text="Next" @tap="onNextTap" ></Button>
            </FlexboxLayout>

            <StackLayout row="1" col="0" rowSpan="3" colSpan="1" class="items-tab-ctnr">
                <Label class="items-tab" 
                        textWrap="true"
                        v-for="letter in letters"
                        v-bind:key="letter.unique"
                        :id="`items-tab-${letter.id}`"
                        :text="letter.letter"
                        @tap="(args) => { onTabTap(args, letter); }" />
            </StackLayout>

        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import AssessItem from './parts/AssessItem.vue';
    import PatientBlock from '../general/parts/PatientBlock.vue';
    import ResourcesButton from './parts/ResourcesButton.vue';
    import ChooseProtocol from './ChooseProtocol.vue';
    import AssessOthers from './AssessOthers.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                is_text_setup: false,
                textview_ids: new Set(),
                item_anchors: [],
                curr_letter_id: 1,
                
                letters: [],
                assessments: [],
                responses:[],

                gridSetting: {
                    rows: "*, *, *, *, *, *, *",
                    columns: "*, *",
                    denominator: 2
                },

            }
        },
        created() {
            this.prepareProtocol();
        },
        mounted() {
        },
        components: {
            CloseButton,
            NewButton,
            PatientBlock,
            AssessItem,
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
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols',
                'assessment_letters'
            ]), 
		},
        methods: {
            ...mapActions([
                'saveItemsProgress',
            ]),
            filteredAssessments(letter) {
                const filted_assessments = this.assessments.filter(elem => elem.assessment_letter.id == letter.id);
                filted_assessments.forEach(elem => { this.textview_ids.add(`items-free-${elem.id}`); });
                return filted_assessments;
            },
            prepareProtocol() {
                this.assessments = this.protocols.find(elem => { return elem.id === this.protocol_id; }).assessment_questions;
                this.letters = this.assessment_letters;
                this.letters.forEach(elem => { elem.willExpand = false; elem.unique = 0 + elem.id; });
            },
            preparePrevPage() {
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
            prepareNextPage() {
                let q_ids = [];
                const others_questions = this.protocols.find(elem => { return elem.id === this.protocol_id; }).additional_questions;
                others_questions.forEach(elem => { q_ids.push(elem.id); });
                this.$navigateTo(AssessOthers, {
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
                        question_ids: q_ids,
                        question_idx: 0,
                    }
                });
            },
            setupAnchors(args) {
                const page = args.object.page;
                const scrollView = args.object.page.getViewById("items-main-ctnr");
                this.assessment_letters.forEach(elem => {
                    const view = page.getViewById(`items-item-ctnr-${elem.id}`);
                    this.item_anchors.push({
                        id: elem.id,
                        y: view.getLocationRelativeTo(scrollView).y
                    });
                });
            },
            setTabText(id, page) {
                this.letters.forEach(elem => { 
                    const letter_view = page.getViewById(`items-tab-${elem.id}`);
                    if (elem.id === id) {
                        // letter_view.text = elem.title;
                        letter_view.backgroundColor = "#777777";
                    } else {
                        // letter_view.text = elem.letter;
                        letter_view.backgroundColor = "#cccccc";
                    }
                });
                console.log("change of letter: " + id);
            },
            recordResponse(q, data) {
                const response_item = {
                    log_id: this.log_id,
                    q_id: q.id, 
                    q_type: q.question_type.type,
                    a: data,
                };
                const response_idx = this.responses.findIndex( elem => { return elem.q_id === q.id; });
                if (response_idx === -1) {
                    this.responses.push(response_item);
                } else {
                    this.responses[response_idx].a = data;
                }
                console.dir(this.responses);
            },
            onForward(args) {
                console.log("=== Forward === ");
                const progress = {
                    log_id: this.log_id,
                    p_id: this.protocol_id, 
                    content: this.responses,
                };
                this.saveItemsProgress(progress);
                this.prepareNextPage();
            },
            onBackward(args) {
                console.log("=== Backward === ");
                this.preparePrevPage();
            },
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onTabTap(args, letter) {
                const scrollView = args.object.page.getViewById("items-main-ctnr");
                const y = this.item_anchors.find(elem => { return elem.id === letter.id; }).y;
                scrollView.scrollToVerticalOffset(y, true);
            },
            onScroll(args) {
                let id = 1;
                for (let i = 1; i < this.item_anchors.length; i++) {
                    const prev_y = this.item_anchors[i - 1].y;
                    if (args.scrollY >= prev_y) {
                        id = this.item_anchors[i - 1].id;
                    }
                }
                if (this.curr_letter_id != id) {
                    this.curr_letter_id = id;
                    this.setTabText(id, args.object.page);
                }                
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                this.textview_ids.forEach(elem => {
                    const freeTextfield = layoutView.getViewById(elem);
                    if (freeTextfield) freeTextfield.dismissSoftInput();
                });
            },
            onNavigatedTo(args) {
                this.setupAnchors(args);
                this.setTabText(1, args.object.page);
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.itemsGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 1000) {
                    this.gridSetting = {
                        rows: "*, *, *, *, *",
                        columns: "*, *, *",
                        denominator: 3
                    };
                } else {
                    this.gridSetting = {
                        rows: "*, *, *, *, *, *, *",
                        columns: "*, *",
                        denominator: 2
                    };
                }
            },
        }
        
    };
</script>

<style>
</style>