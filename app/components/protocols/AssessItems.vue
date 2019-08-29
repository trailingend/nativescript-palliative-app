<template>
    <Page class="page items-page" @navigatedTo="onNavigatedTo">
        <GridLayout :class="formatSetting" 
                    rows="auto, auto, auto, *, auto, auto" 
                    columns="auto, auto, *, auto" ref="itemsGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="4" :is_close="true" @newClient="addNewLog" ref="navRef" />

            <ClientBlock row="1" col="0" colSpan="4" :log_id="log_id" :has_proto="true" @goToProtocol="(data) => goToNextProtocol(data)" ref="clientBlockRef"/>

            <StackLayout row="2" col="0" rowSpan="1" colSpan="4" class="items-title-ctnr" ref="titleRef">
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
                        <Label v-show="letter.letter === 'V'" text="Review Goals of Care" class="items-d" textWrap="true"/>
                        <StackLayout v-for="question in filteredAssessments(letter)"
                                    :key="question.id">
                                <AssessItem :unit="question" :log_id="log_id" 
                                            @foundResponse="(l_id) => { onResponseFound(l_id); }"
                                            @answerChange="(l_id, args, checkNotEmpty) => { onResponseEntered(l_id, args, checkNotEmpty); }" /> 
                        </StackLayout>
                        <StackLayout v-if="index === filtered_letters.length - 1" :height="end_spacer_height" class="items-spacer"></StackLayout>
                    </StackLayout>                            
                </StackLayout>
            </ScrollView>

            <ResourcesButton row="4" col="3" rowSpan="1" colSpan="1" 
                             :log_id="log_id" :protocol_id="protocol_id" />

            <Button row="5" col="0" colSpan="2" v-if="!from_summary" class="back-btn" text="Intro" @tap="onBackTap" ></Button>
            
            <Button row="5" col="3" colSpan="1" v-if="!from_summary" class="next-btn" :text="next_text" @tap="onNextTap" ></Button>

            <Button row="5" col="0" colSpan="2" v-if="from_summary" class="back-btn" text="Back" opacity="0" ></Button>

            <Button row="5" col="3" colSpan="1" v-if="from_summary" class="save-btn" text="save" @tap="onSummaryTap" ></Button>

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
    /**
     *  =============================================================
     * 
     *  Modal to allow user to enter or to modify call infomation
     *  [Description] - called from Summary page
     *  @param {String} p_title - name of current protocol
     *  @param {String} l_title - name of current assessment letter section that reached the top of the page
     *  @param {String} next_text - text displayed on next button, either 'Next' pr 'Skip'
     *  @param {String} color_uncomplete - constant, color indicate the letter section has not been reached
     *  @param {String} color_complete - constant, color indicate the letter section has been reached
     *  @param {String} color_white - constant, color white
     *  @param {String} color_black - const, color black
     *  @param {Set} textview_ids - set of unique ids of every textfield on the page
     *  @param {Array} item_anchors - list of objects records the y position of each element
     *      - id - the id of the element
     *      - y - the y position of the element on the page
     *  @param {Number} curr_letter_id - id of the current letter appearing on the top of the viewport
     *  @param {Number} end_spacer_height - if the height of the last letter section has a height smaller than a viepage height, 
     *                                      Add extra padding to the section. This variable is the height of the padding.
     *  @param {Number} thingsHeight - if the height of the last letter section has a height smaller than a viepage height, 
     *                                 Add extra padding to the section. This variable is the height of any other element on the page if padding is needed.
     *  @param {Array} letters / filtered_letters - list of assessment letters that actually have content
     *  @param {Array} assessments - list of assessment items questions
     *  @param {Set} existing_letters - set of unique letter objects
     *  @param {Set} complete_letter_ids - set of letter ids who at least has one response to any of questions
     *  @param {Object} gridSetting - variable to store screen-size sensitive GridLayout settings
     *  @param {Object} formatSetting - variable to store screen-size sensitive classnames
     *  @prop {String} log_id - the id of the current dociment
     *  @prop {Number} protocol_id - the id of the current protocol
     *  @prop {String} preset_letter_id - the id of the pre-set letter to scroll to when page loads 
     *  @prop {String} from_summary - variable to check whether the page is navigated from Summary page
     * 
     *  =============================================================
     * **/

    import NavBar from '../general/parts/NavBar.vue';
    import NewClient from '../intro/NewClient.vue';
    import AssessItem from './parts/AssessItem.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
    import ResourcesButton from './parts/ResourcesButton.vue';
    import Introduction from '../intro/Introduction.vue';
    import AssessOthers from './AssessOthers.vue';
    import Summary from '../summary/Summary.vue';

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
                textview_ids: new Set(),
                item_anchors: [],
                curr_letter_id: 1,
                end_spacer_height: 0,
                thingsHeight: 0,
                
                letters: [],
                assessments: [],
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
            },
            preset_letter_id: {
                type: Number,
                required: false,
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
                'protocols',
                'assessment_letters'
            ]), 
            filtered_letters: function() {
                return this.assessment_letters.filter(elem => { return this.existing_letters.has(elem.id); });
            }
		},
        methods: {
            ...mapActions([
                'saveProtoProgress',
                'saveItemsProgress',
                'saveOthersProgress'
            ]),
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
                let steps_ids = [];
                this.intro.forEach(elem => { steps_ids.push(elem.id); });
                this.$navigateTo(Introduction, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        step_ids: steps_ids,
                        step_idx: steps_ids.length - 1,
                        from_summary: false
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
                        from_summary: false,
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
            goToTab(page, letter) {
                if (page) {
                    const dividerOffset = 72;
                    const scrollView = page.getViewById("items-main-ctnr");
                    const y = this.item_anchors.find(elem => { return elem.id === letter.id; }).y;
                    if (letter.letter != 'O') {
                        scrollView.scrollToVerticalOffset(y + dividerOffset, true);
                    } else {
                        scrollView.scrollToVerticalOffset(y, true);
                    }
                }
            },
            changeNextText(new_text) {
                this.next_text = new_text;
            },
            markAsComplete(l_id) {
                this.complete_letter_ids.add(l_id);
            },
            markAsIncomplete(l_id) {
                const success = this.complete_letter_ids.delete(l_id);
            },
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
            
            onResponseEntered(l_id, args, checkNotEmpty) {
                if (args.object.page) {
                    const letter_view = args.object.page.getViewById(`items-tab-${l_id}`);
                    const mark_view = args.object.page.getViewById(`items-icon-${l_id}`);
                    if (checkNotEmpty) {
                        this.markAsComplete(l_id);
                        mark_view.opacity = 1;
                        if (this.curr_letter_id != l_id) {
                            letter_view.color = this.color_complete;
                            letter_view.background = this.color_white;
                            letter_view.borderColor = this.color_complete;
                        }
                    } else {
                        this.markAsIncomplete(l_id);
                        mark_view.opacity = 0;
                        if (this.curr_letter_id != l_id) {
                            letter_view.color = this.color_black;
                            letter_view.background = this.color_white;
                            letter_view.borderColor = this.color_uncomplete;
                        }
                    }
                }
            },
            onResponseFound(l_id, checkNotEmpty) {
                this.changeNextText("Next");
                this.markAsComplete(l_id);
            },
            onForward(args) {
                const progress = {
                    log_id: this.log_id,
                    in_others: 1,
                }
                this.saveOthersProgress(progress);
                this.prepareNextPage();
            },
            onBackward(args) {
                const progress = {
                    log_id: this.log_id,
                    p_id: -2,
                }
                this.saveProtoProgress(progress);
                this.preparePrevPage();
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
            onTabTap(args, letter) {
                this.goToTab(args.object.page, letter)
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
                if (this.preset_letter_id === undefined) {
                    this.setTabText(1, args.object.page, true);
                } else {
                    const preset_letter = this.letters.find(elem => elem.id === this.preset_letter_id);
                    this.goToTab(args.object.page, preset_letter);
                }
            },
            onLayoutUpdate(args) {
                let extra_for_landscape = 0;

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
                    extra_for_landscape = 25;
                } else {
                    this.formatSetting = "items-ctnr";
                    this.gridSetting = {
                        rows: "*, *, *, *, *, *, *",
                        columns: "*, *",
                        denominator: 2
                    };
                    extra_for_landscape = 0;
                }
                
                if (this.filtered_letters[this.filtered_letters.length - 1]) {
                     const last_letter_id = this.filtered_letters[this.filtered_letters.length - 1].id;
                    const pageHeight = utils.layout.toDeviceIndependentPixels( 
                        this.$refs.itemsGridRef.nativeView.getMeasuredHeight() 
                    );
                    if (this.thingsHeight) {
                        this.end_spacer_height = pageHeight > this.thingsHeight ? (pageHeight - this.thingsHeight) + 5 + extra_for_landscape : 0;
                    } else {
                        this.thingsHeight = utils.layout.toDeviceIndependentPixels( 
                            this.$refs.navRef.nativeView.getMeasuredHeight() 
                            + this.$refs.clientBlockRef.nativeView.getMeasuredHeight() 
                            + this.$refs.titleRef.nativeView.getMeasuredHeight() 
                            + args.object.page.getViewById(`items-item-ctnr-${last_letter_id}`).getMeasuredHeight() 
                        );
                        this.end_spacer_height = pageHeight > this.thingsHeight ? (pageHeight - this.thingsHeight) + 5 + extra_for_landscape : 0;
                    }
                }
            },
        }
        
    };
</script>

<style>
</style>