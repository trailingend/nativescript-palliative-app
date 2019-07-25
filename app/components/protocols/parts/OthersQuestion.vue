<template>
    <StackLayout class="others-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="others-q"/>
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
        <FreeText v-else
                  :question_id="unit.id"
                  :responses="retrieveSavedResponses(unit)"
                  @answerChange="onAnswerChange" />
    </StackLayout>
</template>

<script lang="ts">
    import SingleSelect from '../../answers/SingleSelect.vue';
    import MultiSelect from '../../answers/MultiSelect.vue';
    import BooleanSelect from '../../answers/BooleanSelect.vue';
    import FreeText from '../../answers/FreeText.vue';

    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    
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
            ...mapActions([
                'saveOthersUpdate',
                'saveOthersProgress',
            ]),
            retrieveSavedResponses(unit) {
                const p_id = unit.protocol.id;
                const q_id = unit.id;
                const q_type = unit.question_type.type;

                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_obj = log.others_answers.find(elem => { return elem.id === p_id; });
                if (p_obj) {
                    const q_objs = p_obj.a.find(elem => { return elem.q_id === q_id; });
                    if (q_objs) {
                        const saved_answers = q_objs.a;
                        this.$emit("foundResponse");
                        return saved_answers;
                    }
                }
                return [];
            },
            onAnswerChange(data) {
                this.$emit("answerChange", data);
                const update = {
                    log_id: this.log_id,
                    p_id: this.unit.protocol.id,
                    q_id: this.unit.id, 
                    q_type: this.unit.question_type.type,
                    a: data
                };
                const progress = {
                    log_id: this.log_id,
                    q_id: this.unit.id, 
                }
                this.saveOthersUpdate(update);
                this.saveOthersProgress(progress);
            },
        }
    }
</script>