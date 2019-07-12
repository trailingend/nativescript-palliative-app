<template>
    <Page class="page items-page">
        <ActionBar title="Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout class="items-ctnr" 
                    rows="auto, auto, *, auto" 
                    columns="*, auto" ref="itemsGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" colSpan="2" :log_id="log_id"/>
            
            <ScrollView row="2" col="0" rowSpan="2" colSpan="2" class="items-main-ctnr" >
                <StackLayout class="items-item-ctnr">
                    <StackLayout v-for="letter in assessment_letters" :key="letter.id">  
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

            <StackLayout row="3" col="0" colSpan="2">
                <FlexboxLayout  orientation="horizontal" alignItems="center" justifyContent="space-between">
                    <Label />
                    <Button class="add-btn" text="references" @tap="onNextTap" ></Button>
                </FlexboxLayout>
                <FlexboxLayout row="3" col="0" colSpan="2" orientation="horizontal" alignItems="center" justifyContent="space-between">
                    <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                    <Button class="next-btn" :text="next_text" @tap="onNextTap" ></Button>
                </FlexboxLayout>
            </StackLayout>

            <StackLayout row="1" col="1" rowSpan="2" colSpan="1" class="items-tab-ctnr">
                <Label class="items-tab" 
                       v-for="letter in assessment_letters"
                       :key="letter.id"
                       :text="letter.letter"></Label>
            </StackLayout>
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
                next_text: 'Skip',
                is_text_setup: false,
                textview_ids: new Set(),

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
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                this.textview_ids.forEach(elem => {
                    const freeTextfield = layoutView.getViewById(elem);
                    if (freeTextfield) freeTextfield.dismissSoftInput();
                });
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