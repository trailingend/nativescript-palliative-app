<template>
    <StackLayout class="items-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="items-q"/>
        <GridLayout :rows="answers_rows"
                    columns="*, *"
                    class="items-a-wrapper">
                <StackLayout v-for="(answer, index) in unit.answers" 
                             v-bind:key="answer.id" 
                             :row="Math.floor(index / 2)"
                             :col="index % 2" 
                             class="items-a-inner">
                    <GridLayout class="items-a-ctnr" rows="auto" columns="auto, *">
                        <Image row="0" col="0" width="30" class="ans-status-icon " v-show="!answer.status" src="~/assets/images/unchecked.png" stretch="aspectFit"></Image>
                        <Image row="0" col="0" width="30" class="ans-status-icon" v-show="answer.status" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                        <Label row="0" col="1" class="items-a" textWrap="true" :text="answer.answer" />
                    </GridLayout>
                </StackLayout>
        </GridLayout>
        <TextView v-model="free_text" 
                  :id="`items-free-${unit.id}`"
                  class="items-free"
                  hint="Take notes here..."
                  @textChange="onTextEntered"
                  editable="true" />
    </StackLayout>
</template>

<script lang="ts">

    export default {
        data() {
            return {
                answers_count: 0, 
                free_text: ''
            }
        },
        mounted() {
            // this.check();
        },
        components: {
        },
        props: {
            unit: {
                type: Object,
                required: true,
            }
        },
        computed: {
            answers_rows: function() {
                let temp_rows = [];
                for (let i = 0; i < this.unit.answers.length / 2; i++) {
                    temp_rows.push("auto");
                }
                return temp_rows.join(",");
            }
        },
        methods: {
            check() {
            },
            onAnswerTap() {
            },
            onTextEntered(args) {
            },
        }
    }
</script>