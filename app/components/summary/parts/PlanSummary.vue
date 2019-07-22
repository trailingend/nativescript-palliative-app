<template>
    <StackLayout class="sum-unit-ctnr">
        <Label :text="response" textWrap="true" class="sum-text"/>
    </StackLayout>
</template>

<script lang="ts">    
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
            protocol_id: {
                type: Number,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
			]),
		},
        methods: {
            prepareSummary() {
                const curr_log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_obj = curr_log.plans_answers.find(elem => { return elem.id === this.protocol_id; });
                this.response = (p_obj) ? p_obj.a.join('\n') : 'N/A';
                if (this.response === "") this.response = 'N/A';
            },
        },
        
    };
</script>