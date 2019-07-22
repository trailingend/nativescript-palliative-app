<template>
    <StackLayout>
        <TextView v-model="free_text" 
                  :id="`answers-free-${question_id}`"
                  class="answers-free"
                  hint="Additional notes here"
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
                required: false,
            },
            responses: {
                type: Array,
                required: false,
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
                data_to_send.push(this.free_text);
                return data_to_send;
            },
            retrieveSavedAnswers() {
                this.free_text = this.responses.length > 0 ? this.responses[this.responses.length - 1] : "";
            },
            onTextEntered(args) {
                this.$emit("answerChange", this.prepareResponseToSend());
            },
        }
    }
</script>