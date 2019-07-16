<template>
    <StackLayout>
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
        <TextViewWithHint v-model="free_text" 
                          :id="`items-free-${question_id}`"
                          class="items-free"
                          hint="Take notes here..."
                          @textChange="onTextEntered"
                          editable="true" />
    </StackLayout>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                free_text: '',
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
            prepareChoices() {
                this.retrieveSavedAnswers();
            },
            prepareResponseToSend() {
                let data_to_send = [];
                this.selected_answers.forEach((elem) => {data_to_send.push(elem)});
                data_to_send.push(this.free_text);
                return data_to_send;
            },
            retrieveSavedAnswers() {
                console.log("TODO boolean retrieved saved answers");
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
            onAnswerTap(ans) {
                const prev_status = ans.status; 
                this.answers_list.forEach((elem, elem_idx) => { 
                    elem.status = false;
                });
                this.selected_answers = prev_status ? [] : [ans.answer];  
                ans.status = ! prev_status;
                ans.id = ans.id + Math.random() * 0.01;
                
                this.$emit('answerChange', this.prepareResponseToSend());
            },
            onTextEntered(args) {
                this.$emit("answerChange", this.prepareResponseToSend());
            },
        }
    }
</script>