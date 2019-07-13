<template>
    <GridLayout :rows="answers_rows"
                columns="*, *"
                class="items-a-wrapper">
        <StackLayout v-for="(answer, index) in answers" 
                    v-bind:key="answer.id" 
                    :row="Math.floor(index / 2)"
                    :col="index % 2" 
                    class="items-a-select-ctnr">
            <GridLayout class="items-a-ctnr" rows="auto" columns="auto, *">
                <Image row="0" col="0" width="30" class="ans-status-icon " v-show="!answer.status" src="~/assets/images/unchecked.png" stretch="aspectFit"></Image>
                <Image row="0" col="0" width="30" class="ans-status-icon" v-show="answer.status" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                <Label row="0" col="1" class="items-a" textWrap="true" :text="answer.answer" />
            </GridLayout>
        </StackLayout>
    </GridLayout>
</template>

<script lang="ts">

    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        components: {
        },
        props: {
            answers: {
                type: Array,
                required: true,
            }
        },
        computed: {
            answers_rows: function() {
                let temp_rows = [];
                for (let i = 0; i < this.answers.length / 2; i++) {
                    temp_rows.push("auto");
                }
                return temp_rows.join(",");
            }
        },
    }
</script>