<template>
    <StackLayout class="items-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="items-q"/>
        <SelectType v-if="unit.question_type.type === 'single_select' || unit.question_type.type === 'multiple_select'"
                    :answers="unit.answers" />
        <BooleanType v-else-if="unit.question_type.type === 'boolean'" />
        <TextView v-model="free_text" 
                  :id="`items-free-${unit.id}`"
                  class="items-free"
                  hint="Take notes here..."
                  @textChange="onTextEntered"
                  editable="true" />
    </StackLayout>
</template>

<script lang="ts">
    import SelectType from './SelectType.vue';
    import BooleanType from './BooleanType.vue';
    
    export default {
        data() {
            return {
                free_text: '',
            }
        },
        mounted() {
        },
        components: {
            SelectType,
            BooleanType
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
            onTextEntered(args) {
            },
        }
    }
</script>