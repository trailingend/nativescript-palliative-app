<template>
    <StackLayout>
        <GridLayout :rows="answers_rows"
                    columns="*, *"
                    class="answers-a-wrapper">
            <StackLayout v-for="(answer, index) in answers_list" 
                        v-bind:key="answer.id" 
                        :row="Math.floor(index / 2)"
                        :col="index % 2" 
                        class="answers-a-select-ctnr">
                <GridLayout class="answers-a-ctnr" rows="auto" columns="auto, *, auto" 
                            :backgroundColor="answer.status ? color_checked : color_unchecked"  
                            @tap="(args) => { onAnswerTap(answer, args); }">
                    <Image row="0" col="0" width="30" 
                           class="ans-status-icon" 
                           :opacity="answer.status ? 1 : 0" 
                           src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                    <Label row="0" col="1" class="answers-a" textWrap="true" :text="answer.answer" />
                    <StackLayout row="0" col="2" width="30" ></StackLayout>
                </GridLayout>
            </StackLayout>
        </GridLayout>
        <StackLayout class="answers-free-ctnr">
            <TextView v-model="free_text" 
                    :id="`answers-free-${question_id}`"
                    class="answers-free"
                    hint="Additioanl notes here"
                    @textChange="onTextEntered"
                    editable="true" />
        </StackLayout>
    </StackLayout>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                free_text: '',
                answers_list: [],
                selected_answers: [],

                color_checked: '#acd6b5',
                color_unchecked: '#e3e3e3',
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
            answers: {
                type: Array,
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
            prepareResponseToSend() {
                let data_to_send = [];
                this.selected_answers.forEach((elem) => {data_to_send.push(elem)});
                data_to_send.push(this.free_text);
                return data_to_send;
            },
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
            toggleMultiAnswerSelection(ans_text) {
                const ans_idx = this.selected_answers.findIndex( selected => { return selected === ans_text; });
                if (ans_idx === -1) {
                    this.selected_answers.push(ans_text);
                } else {
                    this.selected_answers.splice(ans_idx, 1);
                }
            },
            onAnswerTap(ans, args) {
                const ans_idx = this.answers_list.findIndex( elem => { return elem.id === ans.id; });
                this.toggleMultiAnswerSelection(ans.answer);
                ans.status = ! ans.status;
                ans.id = ans.id + Math.random() * 0.01;
                
                this.$emit('answerChange', this.prepareResponseToSend(), args);
            },
            onTextEntered(args) {
                this.$emit("answerChange", this.prepareResponseToSend(), args);
            },
        }
    }
</script>