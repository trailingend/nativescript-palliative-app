<template>
    <StackLayout class="intro-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="intro-q"/>
        <MultiSelect v-if="unit.question_type.type === 'multiple_select'"
                    :question_id="unit.id"
                    :answers="unit.answers"
                    :responses="retrieveSavedResponses(unit)"
                    @answerChange="onAnswerChange" />
        <SingleSelect v-else-if="unit.question_type.type === 'single_select'" 
                      :question_id="unit.id"
                      :answers="unit.answers"
                      :responses="retrieveSavedResponses(unit)"
                      @answerChange="onAnswerChange" />
        <BooleanSelect v-else-if="unit.question_type.type === 'boolean'"
                       :question_id="unit.id"
                       :responses="retrieveSavedResponses(unit)"
                       @answerChange="onAnswerChange" />
        <ScaleSelect v-else-if="unit.question_type.type === 'scale'"
                       :question_id="unit.id"
                       :responses="retrieveSavedResponses(unit)"
                       @answerChange="onAnswerChange" />
        <FreeText v-else
                  :question_id="unit.id"
                  :responses="retrieveSavedResponses(unit)"
                  @answerChange="onAnswerChange" />
    </StackLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to determine which question-answer type to display
     *  [Description] - called in Introduction page
     *  [Related] - styles in introduction.scss
     *  @prop {String} log_id - the id of the current document
     *  @prop {Object} unit - question object
     * 
     *  =============================================================
     * **/

    import SingleSelect from '../../answers/SingleSelect.vue';
    import MultiSelect from '../../answers/MultiSelect.vue';
    import BooleanSelect from '../../answers/BooleanSelect.vue';
    import ScaleSelect from '../../answers/ScaleSelect.vue';
    import FreeText from '../../answers/FreeText.vue';

    import { mapGetters } from 'vuex';
    
    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        components: {
            SingleSelect,
            MultiSelect,
            BooleanSelect,
            ScaleSelect,
            FreeText
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            unit: {
                type: Object,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
            ]), 
        },
        methods: {
            /**
             *  Function to retrieved previously saved responses to current question from data storage
             *  @param {Object} unit - question object
             *  @return {Array} saved_responses
             * **/
            retrieveSavedResponses(unit) {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const q_obj = log.intro_answers.find(elem => { return elem.q_id === unit.id; });
                if (q_obj) {
                    const saved_answers = q_obj.a;
                    let test_empty_response = saved_answers.join();
                    if (test_empty_response.trim() != "") {
                        this.$emit("foundResponse");
                    }    
                    return saved_answers;
                }
                return [];
            },
            /**
             *  Function to call when any response change, always save the recent update to data storage
             *  @event answerChange - let parent component to know that there is a response change
             * **/
            onAnswerChange(data) {
                this.$emit("answerChange", data);
            },
        }
    }
</script>