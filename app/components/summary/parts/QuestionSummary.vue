<template>
    <StackLayout class="sum-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="sum-text sum-bold sum-q"/>
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
                const curr_log = this.logs.find(elem => { return elem.id === this.log_id; });
                
                if (this.section === 'intro') {
                    this.prepareIntroResponses(curr_log);
                } else if (this.section === 'items') {
                    this.prepareItemsResponses(curr_log);
                } else if (this.section === 'others') {
                    this.prepareOthersResponses(curr_log);
                } 
            },
            prepareIntroResponses(curr_log) {
                const q_objs = curr_log.intro_answers;
                console.dir(curr_log.intro_answers)
                if (q_objs) {
                    const q_obj = q_objs.find(elem => { return elem.q_id === this.unit.id; });
                    this.response = (q_obj) ? q_obj.a.join('\n') : 'N/A';
                } else {
                    this.response = 'N/A';
                }
                if (this.response === "") this.response = 'N/A';
            },
            prepareItemsResponses(curr_log) {
                const p_obj = curr_log.items_answers.find(elem => { return elem.id === this.protocol_id; });
                if (p_obj) {
                    const q_obj = p_obj.a.find(elem => { return elem.q_id === this.unit.id; });
                    this.response = (q_obj) ? q_obj.a.join('\n') : 'N/A';
                } else {
                    this.response = 'N/A';
                }
            },
            prepareOthersResponses(curr_log) {
                const p_obj = curr_log.others_answers.find(elem => { return elem.id === this.protocol_id; });
                if (p_obj) {
                    const q_obj = p_obj.a.find(elem => { return elem.q_id === this.unit.id; });
                    this.response = (q_obj) ? q_obj.a.join('\n') : 'N/A';
                } else {
                    this.response = 'N/A';
                }
                if (this.response === "") this.response = 'N/A';
            }
        },
        
    };
</script>