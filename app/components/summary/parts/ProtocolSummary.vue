<template>
    <StackLayout class="sum-proto-ctnr">
        <Label :text="protocol_title" class="sum-proto-title"/>
        
        <GridLayout rows="*" columns="auto, *">
            <Label row="0" col="0" class="sum-step-title" text=" "/>
            <StackLayout row="0" col="1">
                <StackLayout v-for="(letter, index) in valid_assessment_letters()" 
                             :key="letter.id" 
                             class="sum-item-ctnr">  
                    <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between">
                        <Label class="sum-item-title" :text="letter.title" />
                        <Image class="edit-icon" v-show="index === 0" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onItemsEditTap(letter.id)"></Image>
                    </FlexboxLayout> 
                    <StackLayout class="sum-inner-ctnr">
                        <QuestionSummary v-for="question in filteredAssessments(letter)" :key="question.id" 
                                         :log_id="log_id" :protocol_id="protocol_id" :unit="question" section="items" /> 
                    </StackLayout>
                </StackLayout>   
            </StackLayout>   
        </GridLayout>  

        <GridLayout rows="*" columns="auto, *">
            <Label row="0" col="0" class="sum-step-title" text=" "/>
            <StackLayout row="0" col="1" class="sum-pseudo-item-ctnr">
                <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between">
                    <Label class="sum-item-title" text="Other" />
                    <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onOthersEditTap()"></Image>
                </FlexboxLayout>                    
                <StackLayout class="sum-inner-ctnr">
                    <QuestionSummary v-for="question in others_questions" :key="question.id"
                                     :log_id="log_id" :protocol_id="protocol_id" :unit="question" section="others" /> 
                </StackLayout>
            </StackLayout> 
        </GridLayout>   

    </StackLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to display protocol questions and responses in Summary
     *  [Description] - used in Summary page
     *  @param {String} protocol_title - name of current protocol
     *  @param {Array} items_questions - local cache of the items questions
     *  @param {Array} others_questions - local cache of the others questions
     *  @prop {String} log_id - the id of the current document
     *  @prop {Number} protocol_id - the id of the current protocol
     * 
     *  =============================================================
     * **/

    import QuestionSummary from './QuestionSummary.vue';
    import AssessItems from '../../protocols/AssessItems.vue';
    import AssessOthers from '../../protocols/AssessOthers.vue';
    
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                protocol_title:'',
                items_questions: [],
                others_questions: [],
            }
        },
        created() {
            this.prepareSummary();
        },
        components: {
            QuestionSummary,
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
                'protocols',
                'assessment_letters'
			]),
		},
        methods: {
            /**
             *  Function to get array of assessment lettters with questions
             *  [Description] - assessment letters with no question will be excluded
             *  @return {Array} valid_letters
             * **/
            valid_assessment_letters() {
                let valid_letters = new Set();
                this.assessment_letters.forEach(letter_obj => {
                    const items_check = this.items_questions.find(q => q.assessment_letter.id === letter_obj.id);
                    if (items_check != undefined) valid_letters.add(letter_obj);
                })
                return Array.from(valid_letters);
            },
            /**
             *  Function to get questions related with a given letter in current protocol
             *  @param {Object} letter - the current letter object
             *  @return {Array} filted_assessments - array of questions related with current letter
             * **/
            filteredAssessments(letter) {
                const filted_assessments = this.items_questions.filter(elem => elem.assessment_letter.id == letter.id);
                return filted_assessments;
            },
            /**
             *  Function to prepare local cache of questions of current protocol
             * **/
            prepareSummary() {
                const protocol = this.protocols.find(elem => { return elem.id === this.protocol_id; });
                this.protocol_title = protocol.name;
                this.items_questions = this.protocols.find(elem => { return elem.id === this.protocol_id; }).assessment_questions;
                this.others_questions = this.protocols.find(elem => { return elem.id === this.protocol_id; }).additional_questions;
            },
            /**
             *  Function to go and edit Assessment Items page of current protocol
             *  [Description] - from_summary flag on for Items oage
             *  @param {Number} letter_id - the current letter id to be edited
             * **/
            onItemsEditTap(letter_id) {
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
                        protocol_id: this.protocol_id,
                        // preset_letter_id: letter_id,
                        from_summary: true,
                    }
                });
            },
            /**
             *  Function to go and edit Assessment Others page of current protocol
             *  [Description] - from_summary flag on for Others oage
             * **/
            onOthersEditTap() {
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
                        from_summary: true,
                    }
                });
            },
            
        },
        
    };
</script>