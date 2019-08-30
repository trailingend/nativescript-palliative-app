<template>
    <StackLayout>
        <StackLayout class="answers-a-wrapper">
            <Slider minValue="0" maxValue="10" v-model="scale" 
                    class="answers-scale"
                    @valueChange="(args) => onValueChanged(args)" />
            <Label class="answers-scale-text">
                <FormattedString>
                    <Span text="Selected scale: "/>
                    <Span class="answers-scale-bold-text" :text="scale_int" />
                </FormattedString>
            </Label>
        </StackLayout>
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
     *  Component to display scale-type answers
     *  [Description] - used in every question-answers page
     *  [Related] - styles in answers.scss
     *  @param {String} free_text - textfield to record user's free response
     *  @param {Number} scale - scale value related with scale object
     *  @param {Number} scale_int - scale value parsed into int
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
                scale: 0,
                scale_int: 0,
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
                data_to_send.push(this.scale_int);
                data_to_send.push(this.free_text);
                return data_to_send;
            },
            /**
             *  Function to retieve saved responses
             * **/
            retrieveSavedAnswers() {
                this.free_text = this.responses.length > 0 ? this.responses[this.responses.length - 1] : "";
                this.scale = this.responses.length > 1 ? parseInt(this.responses[0]) : 0;
                this.scale_int = this.responses.length > 1 ? parseInt(this.responses[0]) : 0;
            },
            /**
             *  Function to let parent know scale being interacted
             *  @event answerChange - let the question component know that a response has been made
             * **/
            onValueChanged(args) {
                this.scale_int = Math.round(this.scale);
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