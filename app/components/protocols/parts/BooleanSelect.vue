<template>
    <GridLayout rows="auto"
                columns="*, *"
                class="items-a-wrapper">
        <StackLayout v-for="(answer, index) in answers_list" 
                    v-bind:key="answer.id" 
                    row="0" :col="index % 2" 
                    class="items-a-select-ctnr">
            <GridLayout class="items-a-ctnr" rows="auto" columns="auto, *" @tap="onAnswerTap(answer)">
                <Image row="0" col="0" width="30" class="ans-status-icon " v-show="!answer.status" src="~/assets/images/unchecked.png" stretch="aspectFit"></Image>
                <Image row="0" col="0" width="30" class="ans-status-icon" v-show="answer.status" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                <Label row="0" col="1" class="items-a" textWrap="true" :text="answer.answer" />
            </GridLayout>
        </StackLayout>
    </GridLayout>
</template>

<script lang="ts">

    export default {
        data() {
            return {
                selected_answers: [],

                answers_list: [{
                    "id": 1,
                    "answer": "Yes",
                    "status": false,
                }, {
                    "id": 2,
                    "answer": "No",
                    "status": false,
                }],
            }
        },
        mounted() {
            this.retrieveSavedAnswers();
        },
        components: {
        },
        props: {
        },
        computed: {
        },
        methods: {
            retrieveSavedAnswers() {
                console.log("TODO retrieved saved answers");
            },
            onAnswerTap(ans) {
                const prev_status = ans.status; 
                this.answers_list.forEach((elem, elem_idx) => { 
                    elem.status = false;
                });
                this.selected_answers = prev_status ? [] : [ans.answer];   
                ans.status = ! prev_status;
                ans.id = ans.id + Math.random() * 0.01;
                
                this.$emit('selectionChange', this.selected_answers);
            },
        }
    }
</script>