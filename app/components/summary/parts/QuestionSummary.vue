<template>
    <StackLayout class="sum-unit-ctnr">
        <Label :text="unit.question" textWrap="true" class="sum-text sum-bold sum-q"/>
        <Label :text="response" textWrap="true" class="sum-text"/>
    </StackLayout>
</template>

<script lang="ts"> 
    /**
     *  =============================================================
     * 
     *  Component to display a question and responses associated with it in Summary
     *  [Description] - used in Summary page
     *  @param {String} responses - all responses from user will be combined into a line of text
     *  @prop {String} log_id - the id of the current dociment
     *  @prop {Number} protocol_id - the id of the current protocol
     *  @prop {Object} unit - the content of the question being asked
     *  @prop {String} section - enum states between 'intro', 'items' or 'others
     * 
     *  =============================================================
     * **/
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
            /**
             *  Function to determine how to prepare this question based on section enum
             * **/
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
            /**
             *  Function to prepare responses for question in intro section
             *  [Description] - if no response, display N/A
             * **/
            prepareIntroResponses(curr_log) {
                const q_objs = curr_log.intro_answers;
                if (q_objs) {
                    const q_obj = q_objs.find(elem => { return elem.q_id === this.unit.id; });
                    this.response = (q_obj) ? q_obj.a.filter(elem => elem != "").join('\n') : 'N/A';
                } else {
                    this.response = 'N/A';
                }
                if (this.response === "") this.response = 'N/A';
            },
            /**
             *  Function to prepare responses for question in protocol-assess-items section
             *  [Description] - if no response, display N/A
             * **/
            prepareItemsResponses(curr_log) {
                const p_obj = curr_log.items_answers.find(elem => { return elem.id === this.protocol_id; });
                if (p_obj) {
                    const q_obj = p_obj.a.find(elem => { return elem.q_id === this.unit.id; });
                    this.response = (q_obj) ? q_obj.a.filter(elem => elem != "").join('\n') : 'N/A';
                } else {
                    this.response = 'N/A';
                }
                if (this.response === "") this.response = 'N/A';
            },
            /**
             *  Function to prepare responses for question in protocol-assess-others section
             *  [Description] - if no response, display N/A
             * **/
            prepareOthersResponses(curr_log) {
                const p_obj = curr_log.others_answers.find(elem => { return elem.id === this.protocol_id; });
                if (p_obj) {
                    const q_obj = p_obj.a.find(elem => { return elem.q_id === this.unit.id; });
                    this.response = (q_obj) ? q_obj.a.filter(elem => elem != "").join('\n') : 'N/A';
                } else {
                    this.response = 'N/A';
                }
                if (this.response === "") this.response = 'N/A';
            }
        },
        
    };
</script>