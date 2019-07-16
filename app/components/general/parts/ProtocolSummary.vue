<template>
    <StackLayout class="sum-sec-ctnr">
        <Label :text="protocol_title" class="sum-sec-title"/>
        
        <StackLayout>
            <StackLayout v-for="letter in assessment_letters" 
                         :key="letter.id" 
                         class="sum-item-ctnr">  
                <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between">
                    <Label class="sum-item-title" :text="letter.title" />
                    <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                </FlexboxLayout>                    
                <StackLayout v-for="question in filteredAssessments(letter)" :key="question.id">
                    <QuestionSummary :log_id="log_id" :protocol_id="protocol_id" :unit="question" section="items" /> 
                </StackLayout>
            </StackLayout>   
        </StackLayout>  

        <StackLayout class="sum-pseudo-item-ctnr">
            <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between">
                <Label class="sum-item-title" text="Others" />
                <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </FlexboxLayout>                    
            <StackLayout v-for="question in others_questions" :key="question.id">
                <QuestionSummary :log_id="log_id" :protocol_id="protocol_id" :unit="question" section="others" /> 
            </StackLayout>
        </StackLayout>  

        <StackLayout class="sum-pseudo-item-ctnr">
            <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between">
                <Label class="sum-item-title" text="Plans" />
                <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </FlexboxLayout>                    
            <StackLayout>
                <PlanSummary :log_id="log_id" :protocol_id="protocol_id" /> 
            </StackLayout>
        </StackLayout>

    </StackLayout>
</template>

<script lang="ts">
    import QuestionSummary from './QuestionSummary.vue';
    import PlanSummary from './PlanSummary.vue';
    
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
            PlanSummary
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
            filteredAssessments(letter) {
                const filted_assessments = this.items_questions.filter(elem => elem.assessment_letter.id == letter.id);
                return filted_assessments;
            },
            prepareSummary() {
                const protocol = this.protocols.find(elem => { return elem.id === this.protocol_id; });
                this.protocol_title = protocol.name;
                this.items_questions = this.protocols.find(elem => { return elem.id === this.protocol_id; }).assessment_questions;
                this.others_questions = this.protocols.find(elem => { return elem.id === this.protocol_id; }).additional_questions;
            },
        },
        
    };
</script>