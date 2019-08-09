<template>
    <StackLayout class="sum-sec-ctnr">
        <StackLayout class="sec-title-ctnr">
            <Label text="Introduction" class="sum-sec-title"/>
        </StackLayout>
        
        <StackLayout class="sec-content-ctnr">
            <StackLayout v-for="(item, index) in intro" 
                         :key="item.id" 
                         class="sum-item-ctnr">  
                <GridLayout rows="*" columns="auto, *, auto">
                    <Label row="0" col="0" class="sum-step-title" :text="`${index + 1}`"/>
                    <StackLayout row="0" col="1" class="sum-inner-ctnr">
                        <QuestionSummary v-for="question in item.questions" :key="question.id" :log_id="log_id" :protocol_id="-1" :unit="question" section="intro" /> 
                    </StackLayout>
                    <Image row="0" col="2" class="edit-icon sum-item-edit" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onEditTap(index)" ></Image>
                </GridLayout>            
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