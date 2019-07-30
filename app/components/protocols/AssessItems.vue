<template>
    <Page class="page items-page" @navigatedTo="onNavigatedTo">
        <GridLayout :class="formatSetting" 
                    rows="auto, auto, auto, *, auto, auto" 
                    columns="auto, auto, *, auto" ref="itemsGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="4" @newClient="addNewChart" />

            <ClientBlock row="1" col="0" colSpan="4" :log_id="log_id" @goToProtocol="(data) => goToNextProtocol(data)"/>

            <StackLayout row="2" col="0" rowSpan="1" colSpan="4" class="items-title-ctnr">
                <Label class="items-title" :text="p_title"></Label>
                <Label class="items-subtitle" :text="l_title" ref="subtitleRef"></Label>
                <StackLayout class="divider-ctnr"></StackLayout>
            </StackLayout>

            <ScrollView row="3" col="0" rowSpan="3" colSpan="4" 
                        id="items-main-ctnr"
                        class="items-main-ctnr"
                        @scroll="onScroll" >
                <StackLayout>
                    <StackLayout v-for="(letter, index) in filtered_letters" 
                                 :key="letter.id" 
                                 :id="`items-item-ctnr-${letter.id}`"
                                 class="items-item-ctnr">  
                        <StackLayout v-if="index != 0" class="items-subtitle-ctnr">
                            <Label class="items-subtitle" :text="letter.title"></Label>
                            <StackLayout class="divider-ctnr"></StackLayout>
                        </StackLayout>
                        <StackLayout class="spacer-ctnr"></StackLayout>
                        <Label v-show="letter.letter === 'V'" text="Review Goals of care" class="items-d" textWrap="true"/>
                        <StackLayout v-for="question in filteredAssessments(letter)"
                                    :key="question.id">
                                <AssessItem :unit="question" :log_id="log_id" 
                                            @foundResponse="(l_id) => { onResponseFound(l_id); }"
                                            @answerChange="(l_id, args) => { onResponseEntered(l_id, args); }" /> 
                                <StackLayout v-if="question.assessment_letter.id === 8" class="items-spacer"></StackLayout>
                        </StackLayout>
                    </StackLayout>                            
                </StackLayout>
            </ScrollView>

            <ResourcesButton row="4" col="3" rowSpan="1" colSpan="1" 
                             :log_id="log_id" :protocol_id="protocol_id" />

            <Button row="5" col="0" colSpan="2" class="back-btn" text="Back" @tap="onBackTap" ></Button>
            
            <Button row="5" col="3" colSpan="1" class="next-btn" :text="next_text" @tap="onNextTap" ></Button>

            <StackLayout row="2" col="0" rowSpan="3" colSpan="1" class="items-tab-ctnr">
                <Label class="items-tab" 
                        rows="auto" columns="*"
                        textWrap="true"
                        v-for="letter in letters"
                        v-bind:key="letter.unique"
                        :id="`items-tab-${letter.id}`"
                        @tap="(args) => { onTabTap(args, letter); }" 
                        :text="letter.letter"></Label>
            </StackLayout>
            <StackLayout row="2" col="0" rowSpan="3" colSpan="1" class="items-tab-ctnr">
                <StackLayout class="items-icon" 
                        rows="auto" columns="*"
                        textWrap="true"
                        v-for="letter in letters"
                        v-bind:key="letter.unique" 
                        @tap="(args) => { onTabTap(args, letter); }" >
                    <Image width="15" height="15" opacity="0" 
                            :id="`items-icon-${letter.id}`" 
                            src="~/assets/images/complete.png" stretch="aspectFill"/>
                </StackLayout>
            </StackLayout>

        </GridLayout>
    </Page>
</template>

<script>
    import NavBar from '../general/parts/NavBar.vue';
    import NewClient from '../intro/NewClient.vue';
    import AssessItem from './parts/AssessItem.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
    import ResourcesButton from './parts/ResourcesButton.vue';
    import ChooseProtocol from './ChooseProtocol.vue';
    import AssessOthers from './AssessOthers.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { confirm }  from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";
    import { animateSubTitle } from '../../scripts/common';

    export default {
        data() {
            return {
                p_title: "Protocol",
                l_title: "Onset",
                next_text: 'Skip',
                color_uncomplete: '#e3e3e3',
                color_complete: '#acd6b5',
                color_white: '#ffffff',
                color_black: '#000000',
                is_text_setup: false,
                textview_ids: new Set(),
                item_anchors: [],
                curr_letter_id: 1,
                
                letters: [],
                assessments: [],
                responses:[],
                existing_letters: new Set(),
                complete_letter_ids: new Set(),

                gridSetting: {
                    rows: "*, *, *, *, *, *, *",
                    columns: "*, *",
                    denominator: 2
                },
                formatSetting: "items-ctnr"

            }
        },
        beforeCreate: function () {
            this.$options.components.AssessItems = require('./AssessItems.vue').default;
        },
        created() {
            this.prepareProtocol();
        },
        mounted() {
        },
        components: {
            NavBar,
            ClientBlock,
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
            filtered_letters: function() {
                return this.assessment_letters.filter(elem => { return this.existing_letters.has(elem.id); });
            }
		},
        methods: {
            filteredAssessments(letter) {
                const filted_assessments = this.assessments.filter(elem => elem.assessment_letter.id == letter.id);
                filted_assessments.forEach(elem => { this.textview_ids.add(`answers-free-${elem.id}`); });
                return filted_assessments;
            },
            prepareProtocol() {
                this.p_title = this.protocols.find(elem => { return elem.id === this.protocol_id; }).name;
                this.assessments = this.protocols.find(elem => { return elem.id === this.protocol_id; }).assessment_questions;
                this.assessments.forEach(elem => this.existing_letters.add(elem.assessment_letter.id));
                this.letters = this.filtered_letters;
                this.letters.forEach(elem => { elem.willExpand = false; elem.unique = 0 + elem.id; });
            },
            preparePrevPage() {
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
            prepareNextPage() {
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
                        question_idx: 0,
                    }
                });
            },
            goToNextProtocol(p_id) {
                this.$navigateTo(this.$options.components.AssessItems, {
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
            setupAnchors(args) {
                if (args.object.page) {
                    const page = args.object.page;
                    const scrollView = args.object.page.getViewById("items-main-ctnr");
                    this.filtered_letters.forEach(elem => {
                        const view = page.getViewById(`items-item-ctnr-${elem.id}`);
                        this.item_anchors.push({
                            id: elem.id,
                            y: view.getLocationRelativeTo(scrollView).y
                        });
                    });
                }
            },
            setTabText(id, page, init=false) {
                if (page) {
                    this.letters.forEach(elem => { 
                        const letter_view = page.getViewById(`items-tab-${elem.id}`);
                        const mark_view = page.getViewById(`items-icon-${elem.id}`);
                        if (elem.id === id) {
                            if (!init) {
                                const subtitle = this.$refs.subtitleRef.nativeView;
                                animateSubTitle(subtitle, elem.title);
                            }
                            mark_view.opacity = (this.complete_letter_ids.has(elem.id)) ? 1 : 0;
                            letter_view.color = this.color_black;
                            letter_view.backgroundColor = this.color_complete;
                            letter_view.borderColor = this.color_complete;
                        } else {
                            if (this.complete_letter_ids.has(elem.id)) {
                                mark_view.opacity = 1;
                                letter_view.color = this.color_complete;
                                letter_view.background = this.color_white;
                                letter_view.borderColor = this.color_complete;
                            } else {
                                mark_view.opacity = 0;
                                letter_view.color = this.color_black;
                                letter_view.backgroundColor = this.color_white;
                                letter_view.borderColor = this.color_uncomplete;
                            }
                            
                        }
                    });
                }
                // console.log("change of letter: " + id);
            },
            setTabMarks(page) {
                this.letters.forEach(elem => { 
                    const letter_view = page.getViewById(`items-tab-${elem.id}`);
                    const mark_view = page.getViewById(`items-icon-${elem.id}`);
                    if (this.complete_letter_ids.has(elem.id)) {
                        mark_view.opacity = 1;
                        letter_view.color = this.color_complete;
                        letter_view.background = this.color_white;
                        letter_view.borderColor = this.color_complete;
                    } else {
                        mark_view.opacity = 0;
                        letter_view.color = this.color_black;
                        letter_view.background = this.color_white;
                        letter_view.borderColor = this.color_uncomplete;
                    }
                });
            },
            changeNextText(new_text) {
                this.next_text = new_text;
            },
            markAsComplete(l_id) {
                this.complete_letter_ids.add(l_id);
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
            onResponseEntered(l_id, args) {
                this.changeNextText("Next");
                this.markAsComplete(l_id);
                if (args.object.page) {
                    const letter_view = args.object.page.getViewById(`items-tab-${l_id}`);
                    const mark_view = args.object.page.getViewById(`items-icon-${l_id}`);
                    mark_view.opacity = 1;
                    if (this.curr_letter_id != l_id) {
                        letter_view.color = this.color_complete;
                        letter_view.background = this.color_white;
                        letter_view.borderColor = this.color_complete;
                    }
                }
            },
            onResponseFound(l_id) {
                this.changeNextText("Next");
                this.markAsComplete(l_id);
            },
            onForward(args) {
                console.log("=== Forward === ");
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
                if (args.object.page) {
                    const dividerOffset = 48;
                    const scrollView = args.object.page.getViewById("items-main-ctnr");
                    const y = this.item_anchors.find(elem => { return elem.id === letter.id; }).y;
                    if (letter.letter != 'O') {
                        scrollView.scrollToVerticalOffset(y + dividerOffset, true);
                    } else {
                        scrollView.scrollToVerticalOffset(y, true);
                    }
                }
            },
            onScroll(args) {
                let id = 1;
                for (let i = 0; i < this.item_anchors.length; i++) {
                    const prev_y = this.item_anchors[i].y;
                    if (args.scrollY >= prev_y) {
                        id = this.item_anchors[i].id;
                    }
                }
                if (this.curr_letter_id != id) {
                    this.curr_letter_id = id;
                    const anchor_y = this.item_anchors.find(elem=>elem.id==id).y
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
                this.setTabMarks(args.object.page);
                this.setTabText(1, args.object.page, true);
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.itemsGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 800) {
                    this.formatSetting = "items-ctnr tablet-landscape";
                    this.gridSetting = {
                        rows: "*, *, *, *, *",
                        columns: "*, *, *",
                        denominator: 3
                    };
                } else {
                    this.formatSetting = "items-ctnr";
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