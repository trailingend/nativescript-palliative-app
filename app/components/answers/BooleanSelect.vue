<template>
    <StackLayout>
        <GridLayout rows="auto"
                    columns="*, *"
                    class="answers-a-wrapper">
            <StackLayout v-for="(answer, index) in answers_list" 
                         v-bind:key="answer.id" 
                         row="0" :col="index % 2" 
                         class="answers-a-select-ctnr">
                <GridLayout class="answers-a-ctnr" rows="auto" columns="auto, *, auto" 
                            :backgroundColor="answer.status ? color_checked : color_unchecked"  
                            @tap="(args) => onAnswerTap(answer, args)">
                    <Image row="0" col="0" width="30" 
                           class="ans-status-icon" 
                           :opacity="answer.status ? 1 : 0" 
                           src="~/assets/images/checked.png" 
                           stretch="aspectFit"></Image>
                    <Label row="0" col="1" class="answers-a" textWrap="true" :text="answer.answer" />
                    <StackLayout row="0" col="2" width="30" ></StackLayout>
                </GridLayout>
            </StackLayout>
        </GridLayout>
        <StackLayout class="answers-free-ctnr">
            <TextView v-model="free_text" 
                    :id="`answers-free-${question_id}`"
                    class="answers-free"
                    hint="Additional notes here"
                    @textChange="onTextEntered"
                    editable="true" />
        </StackLayout>
    </StackLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to display boolean-type answers
     *  [Description] - used in every question-answers page
     *  [Related] - styles in answers.scss
     *  @param {String} free_text - textfield to record user's free response
     *  @param {Array} selected_answers - list of all responses
     *  @param {String} color_checked - constant, color indicate the plan has been selected
     *  @param {String} color_unchecked - constant, color indicate the plan has not been selected
     *  @param {Array} answers_list - list of answer choices 
     *  @prop {Number} question_id - the id of the current question
     *  @prop {String} responses - saved responses to this question
     * 
     *  =============================================================
     * **/

    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                free_text: '',
                selected_answers: [],

                color_checked: '#acd6b5',
                color_unchecked: '#e3e3e3',

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
            this.prepareChoices();
        },
        components: {
        },
        props: {
            question_id: {
                type: Number,
                required: true,
            },
            responses: {
                type: Array,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'logs',
            ]),
        },
        methods: {
            /**
             *  Function to prepare answers and retrieve saved responses
             * **/
            prepareChoices() {
                this.retrieveSavedAnswers();
            },
            /**
             *  Function to prepare saving response
             *  @return {Array} data_to_send
             * **/
            prepareResponseToSend() {
                let data_to_send = [];
                this.selected_answers.forEach((elem) => {data_to_send.push(elem)});
                data_to_send.push(this.free_text);
                return data_to_send;
            },
            /**
             *  Function to retieve saved responses
             * **/
            retrieveSavedAnswers() {
                this.free_text = this.responses.length > 0 ? this.responses[this.responses.length - 1] : "";
                this.answers_list.forEach(ans => {
                    const search_in_saved = this.responses.find(res => { return res == ans.answer; });
                    if (search_in_saved) {
                        ans.status = true;
                        ans.id = ans.id + Math.random() * 0.01;
                        this.selected_answers.push(ans.answer);
                    }
                });
            },
            /**
             *  Function to style answer being interacted
             *  @param {Object} ans - the answer object changed
             *  @event answerChange - let the question component know that a response has been made
             * **/
            onAnswerTap(ans, args) {
                const prev_status = ans.status; 
                this.answers_list.forEach((elem, elem_idx) => { 
                    elem.status = false;
                });
                this.selected_answers = prev_status ? [] : [ans.answer];  
                ans.status = ! prev_status;
                ans.id = ans.id + Math.random() * 0.01;
                
                this.$emit('answerChange', this.prepareResponseToSend(), args);
            },
            /**
             *  Function to let parent know free textfield being interacted
             *  @event answerChange - let the question component know that a response has been made
             * **/
            onTextEntered(args) {
                this.$emit("answerChange", this.prepareResponseToSend(), args);
            },
        }
    }
</script>