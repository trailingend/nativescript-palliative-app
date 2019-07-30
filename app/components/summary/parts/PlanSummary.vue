<template>
    <StackLayout class="sum-pseudo-item-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between">
            <Label class="sum-item-title" text="Plans" />
            <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit" @tap="onPlansEditTap"></Image>
        </FlexboxLayout>                    
        <StackLayout class="sum-unit-ctnr">
            <Label :text="response" textWrap="true" class="sum-text"/>
        </StackLayout>
    </StackLayout>
</template>

<script lang="ts">    
    import Plans from '../../protocols/Plans.vue';
    
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                response: '',
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
            prepareSummary() {
                const plans_answers = this.logs.find(elem => { return elem.id === this.log_id; }).plans_answers;
                this.response = (plans_answers != []) ? plans_answers.join('\n') : 'N/A';
                if (this.response === "") this.response = 'N/A';
            },
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
                    }
                });
            },
        },
        
    };
</script>