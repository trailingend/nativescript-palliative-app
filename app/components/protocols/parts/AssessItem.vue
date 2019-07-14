<template>
    <StackLayout class="items-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="items-q"/>
        <MultiSelect v-if="unit.question_type.type === 'multiple_select'"
                    :answers="unit.answers"
                    @selectionChange="onSelectionChange" />
        <SingleSelect v-else-if="unit.question_type.type === 'single_select'" 
                      :answers="unit.answers"
                      @selectionChange="onSelectionChange" />
        <BooleanSelect v-else-if="unit.question_type.type === 'boolean'"
                       @selectionChange="onSelectionChange" />
        <TextView v-model="free_text" 
                  :id="`items-free-${unit.id}`"
                  class="items-free"
                  hint="Take notes here..."
                  @textChange="onTextEntered"
                  editable="true" />
    </StackLayout>
</template>

<script lang="ts">
    import SingleSelect from './SingleSelect.vue';
    import MultiSelect from './MultiSelect.vue';
    import BooleanSelect from './BooleanSelect.vue';
    
    export default {
        data() {
            return {
                free_text: '',
                selected_answers: [],
            }
        },
        mounted() {
        },
        components: {
            SingleSelect,
            MultiSelect,
            BooleanSelect
        },
        props: {
            unit: {
                type: Object,
                required: true,
            }
        },
        computed: {
        },
        methods: {
            onSelectionChange(data) {
                this.selected_answers = data;

                let data_to_send = [];
                data.forEach((elem) => {data_to_send.push(elem)});
                data_to_send.push(this.free_text);
                this.$emit("answerChange", data_to_send);
            },
            onTextEntered(args) {
                let data_to_send = [];
                this.selected_answers.forEach((elem) => {data_to_send.push(elem)});
                data_to_send.push(this.free_text);
                this.$emit("answerChange", data_to_send);
            },
        }
    }
</script>