<template>
    <GridLayout rows="auto"
                columns="*, *"
                class="items-a-wrapper">
        <StackLayout v-for="(answer, index) in boolean_answers" 
                    v-bind:key="answer.id" 
                    row="0" :col="index % 2" 
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
                 boolean_answers: [{
                    "id": 1,
                    "answer": "Yes"
                }, {
                    "id": 2,
                    "answer": "No"
                }],
            }
        },
        mounted() {
        },
        components: {
        },
        props: {
        },
        computed: {
        },
    }
</script>