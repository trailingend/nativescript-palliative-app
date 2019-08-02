<template>
    <StackLayout class="sum-sec-ctnr">
        <Label text="Introduction" class="sum-sec-title"/>
        
        <StackLayout>
            <StackLayout v-for="(item, index) in intro" 
                         :key="item.id" 
                         class="sum-item-ctnr">  
                <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between">
                    <Label class="sum-item-title" :text="`Step ${index + 1}`" />
                    <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit" @tap="onEditTap(index)" ></Image>
                </FlexboxLayout>                    
                <StackLayout v-for="question in item.questions" :key="question.id">
                    <QuestionSummary :log_id="log_id" :protocol_id="-1" :unit="question" section="intro" /> 
                </StackLayout>
            </StackLayout>   
        </StackLayout>  
    </StackLayout>
</template>

<script lang="ts">
    import QuestionSummary from './QuestionSummary.vue';
    import Introduction from '../../intro/Introduction.vue';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
            
            }
        },
        components: {
            QuestionSummary
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'intro'
			]),
        },
        methods: {
            onEditTap(curr_idx) {
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
                        step_idx: curr_idx,
                        from_summary: true
                    }
                });
            }
        }
    };
</script>