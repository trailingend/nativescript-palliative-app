<template>
    <StackLayout class="sum-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="sum-text sum-bold sum-q"/>
    </StackLayout>
</template>

<script lang="ts">    
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
            }
        },
        created() {
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                type: Number,
                required: true,
            },
            unit: {
                type: Object,
                required: true,
            },
            section: {
                type: String,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'assessment_letters'
			]),
		},
        methods: {
            prepareSummary() {
                const protocol = this.protocols.find(elem => { return elem.id === this.protocol_id; });
                const curr_log = this.logs.find(elem => { return elem.id === this.log_id; });
                const items_responses = curr_log.items_answers.find(elem => { return elem.id === this.protocol_id; }).a;
                const others_responses = curr_log.others_answers.find(elem => { return elem.id === this.protocol_id; }).a;
                const plans_responses = curr_log.plans_answers.find(elem => { return elem.id === this.protocol_id; }).a;
            }
        },
        
    };
</script>