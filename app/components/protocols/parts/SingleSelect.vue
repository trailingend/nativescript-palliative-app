<template>
    <GridLayout :rows="answers_rows"
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
                answers_list: [],
                selected_answers: [],
            }
        },
        mounted() {
            this.prepareChoices();
        },
        components: {
        },
        props: {
            answers: {
                type: Array,
                required: true,
            }
        },
        computed: {
            answers_rows: function() {
                let temp_rows = [];
                for (let i = 0; i < this.answers.length / 2; i++) {
                    temp_rows.push("auto");
                }
                return temp_rows.join(",");
            }
        },
        methods: {
            prepareChoices() {
                this.answers_list = this.answers;
                this.prepareAnswersStatus();
                this.retrieveSavedAnswers();
            },
            prepareAnswersStatus() {
                this.answers_list.forEach(elem => { elem.status = false; });
            },
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