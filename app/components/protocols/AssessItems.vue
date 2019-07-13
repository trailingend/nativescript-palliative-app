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
            <UserBlock row="0" col="0" colSpan="2" :log_id="log_id"/>
            
            

            <ScrollView row="1" col="0" rowSpan="3" colSpan="2" 
                        id="items-main-ctnr"
                        class="items-main-ctnr"
                        @scroll="onScroll" >
                <StackLayout>
                    <StackLayout v-for="letter in assessment_letters" 
                                 :key="letter.id" 
                                 :id="`items-item-ctnr-${letter.id}`"
                                 class="items-item-ctnr">  
                        <StackLayout row="1" col="0" rowSpan="1" colSpan="2" class="items-title-ctnr">
                            <Label class="items-title" text="Assess"></Label>
                            <Label class="items-subtitle" :text="letter.title"></Label>
                            <StackLayout class="divider-ctnr"></StackLayout>
                            <Label text="Describe what is currently happening?" class="items-d" textWrap="true"/>
                        </StackLayout>                       
                        <StackLayout v-for="question in filteredAssessments(letter)"
                                    :key="question.id">
                                <AssessItem :unit="question" /> 
                        </StackLayout>
                    </StackLayout>                            
                </StackLayout>
            </ScrollView>

            
            <StackLayout row="1" col="0" rowSpan="3" colSpan="1" class="items-tab-ctnr">

                    <!-- <FlexboxLayout flexDirection="column" alignItems="flex-start"
                                   v-for="letter in letters"
                                   v-bind:key="letter.unique"> -->
                    <Label class="items-tab" 
                            textWrap="true"
                            v-for="letter in letters"
                            v-bind:key="letter.unique"
                            :id="`items-tab-${letter.id}`"
                            :text="letter.letter"
                            @tap="(args) => { onTabTap(args, letter); }" />
                    <!-- </FlexboxLayout> -->
            </StackLayout>

            <FlexboxLayout row="1" col="0" rowSpan="1" colSpan="2" 
                           orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Label />
                <Button class="resource-btn" text="references" @tap="onResourceTap" ></Button>
            </FlexboxLayout>

            <FlexboxLayout row="3" col="0" rowSpan="1" colSpan="2"
                           orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" text="Next" @tap="onNextTap" ></Button>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import AssessItem from './parts/AssessItem.vue';
    import UserBlock from '../general/parts/UserBlock.vue';
    import Diagnose from '../general/Diagnose.vue';

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
            UserBlock,
            AssessItem
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
                'changeLogStatus',
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
                        letter_view.text = elem.title;
                    } else {
                        letter_view.text = elem.letter;
                    }
                });
                console.log("change of letter: " + id);
            },
            onForward(args) {
                
            },
            onBackward(args) {
            },
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onResourceTap() {

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