<template>
    <StackLayout class="items-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="items-q"/>
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
                       @answerChange="(data, args) => onAnswerChange(data, args)" />
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
    import SingleSelect from '../../answers/SingleSelect.vue';
    import MultiSelect from '../../answers/MultiSelect.vue';
    import BooleanSelect from '../../answers/BooleanSelect.vue';
    import ScaleSelect from '../../answers/ScaleSelect.vue';
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
            ...mapActions([
                'saveItemsUpdate',
            ]),
            retrieveSavedResponses(unit) {
                const p_id = unit.protocol.id;
                const q_id = unit.id;
                const q_type = unit.question_type.type;

                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_obj = log.items_answers.find(elem => { return elem.id === p_id; });
                if (p_obj) {                    
                    const q_objs = p_obj.a.find(elem => { return elem.q_id === q_id; });
                    if (q_objs && q_objs.a.length > 0) {
                        let test_empty_response = q_objs.a.join();

                        if (test_empty_response.trim() != '') {
                            this.$emit("foundResponse", q_objs.l_id);
                            return q_objs.a;
                        }
                    }
                }
                return [];
            },
            checkEmptyResponsesForLetter(l_id) {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_obj = log.items_answers.find(elem => { return elem.id === this.unit.protocol.id; });
                if (p_obj) {
                    const q_objs = p_obj.a.filter(elem => { return elem.l_id === l_id; });
                    if (q_objs && q_objs.length > 0) {
                        let test_empty_response = '';
                        q_objs.forEach(r => { test_empty_response = test_empty_response + r.a.join(); });
                        return (q_objs.length > 0 && test_empty_response.trim() != '');
                    } else {    
                        return false;
                    }
                }
            },
            onAnswerChange(data, args) {
                
                const update = {
                    log_id: this.log_id,
                    p_id: this.unit.protocol.id,
                    q_id: this.unit.id, 
                    q_type: this.unit.question_type.type,
                    l_id: this.unit.assessment_letter.id,
                    a: data
                };
                
                this.saveItemsUpdate(update);
                const checkNotEmpty = this.checkEmptyResponsesForLetter(this.unit.assessment_letter.id);
                this.$emit("answerChange", this.unit.assessment_letter.id, args, checkNotEmpty);
            },
        }
    }
</script>