<template>
    <StackLayout class="sum-pseudo-item-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between" class="sec-title-ctnr">
            <Label class="sum-sec-title" text="Recommendations" />
            <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onRecommendationsEditTap"></Image>
        </FlexboxLayout>                 
        <StackLayout class="sec-content-ctnr sum-unit-ctnr">
            <Label :text="recommendations === '' ? 'N/A' : recommendations" class="sum-text"/>
        </StackLayout>
    </StackLayout>
</template>

<script lang="ts">    
    /**
     *  =============================================================
     * 
     *  Component to display Recommendation given in Summary
     *  [Description] - used in Summary page
     *  @param {Array} recommendations - recommendation text saved
     *  @prop {String} log_id - the id of the current dociment
     * 
     *  =============================================================
     * **/

    import Recommendations from '../../protocols/Recommendations.vue';
    
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                recommendations: '',
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
             *  Function to get saved recommendations for current client
             * **/
            prepareSummary() {
                this.recommendations = this.logs.find(elem => { return elem.id === this.log_id; }).recommendations;
            },
            /**
             *  Function to go and edit Recomendations page of current client
             *  [Description] - from_summary flag on for Recomendations oage
             * **/
            onRecommendationsEditTap() {
                this.$navigateTo(Recommendations, {
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