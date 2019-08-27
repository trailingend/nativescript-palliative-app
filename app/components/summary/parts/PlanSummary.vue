<template>
    <StackLayout class="sum-pseudo-item-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between" class="sec-title-ctnr">
            <Label class="sum-sec-title" text="Plans" />
            <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onPlansEditTap"></Image>
        </FlexboxLayout>                 
        <StackLayout class="sec-content-ctnr sum-unit-ctnr">
            <Label v-if="plans_answers.join('') === ''" text="N/A" class="sum-text"/>
            <GridLayout rows="auto" columns="auto, *" 
                        class="sum-plan-unit"
                        v-else v-for="(plan, index) in plans_answers.filter(elem => elem != '')" :key="index">
                <Image row="0" col="0" class="sum-pointy" src="~/assets/images/pointy.png" stretch="aspectFit" ></Image>
                <Label row="0" col="1" :text="plan" textWrap="true" class="sum-text"/>
            </GridLayout>
        </StackLayout>
    </StackLayout>
</template>

<script lang="ts">    
    /**
     *  =============================================================
     * 
     *  Component to display plans selected in Summary
     *  [Description] - used in Summary page
     *  @param {Array} plan_answers - list of plans selected
     *  @prop {String} log_id - the id of the current dociment
     * 
     *  =============================================================
     * **/

    import Plans from '../../protocols/Plans.vue';
    
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                plans_answers: [],
            }
        },
        created() {
            this.prepareSummary();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
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
             *  Function to get saved plans for current client
             * **/
            prepareSummary() {
                this.plans_answers = this.logs.find(elem => { return elem.id === this.log_id; }).plans_answers;
            },
            /**
             *  Function to go and edit Plans page of current client
             *  [Description] - from_summary flag on for Plans oage
             * **/
            onPlansEditTap() {
                this.$navigateTo(Plans, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        from_summary: true,
                    }
                });
            },
        },
        
    };
</script>