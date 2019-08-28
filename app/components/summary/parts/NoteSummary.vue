<template>
    <StackLayout class="sum-pseudo-item-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-start" justifyContent="space-between" class="sec-title-ctnr">
            <Label class="sum-sec-title" text="Notes" />
            <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onNotesEditTap"></Image>
        </FlexboxLayout>                 
        <StackLayout class="sec-content-ctnr sum-unit-ctnr">
            <Label :text="notes.trim() === '' ? 'N/A' : notes.trim()" textWrap="true" class="sum-text"/>
        </StackLayout>
    </StackLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to display additional notes in Summary
     *  [Description] - used in Summary page
     *  @param {String} notes - notes in one line of text
     *  @prop {String} log_id - the id of the current dociment
     * 
     *  =============================================================
     * **/

    import Notes from '../../general/Notes.vue';
    
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                notes: '',
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
             *  Function to get saved notes for current client
             * **/
            prepareSummary() {
                this.notes = this.logs.find(elem => { return elem.id === this.log_id; }).notes;
            },
            /**
             *  Function to go and edit Notes of current client
             * **/
            onNotesEditTap() {
                this.$showModal(Notes, {
                    fullscreen: false,
                    ios: {
                        presentationStyle: UIModalPresentationStyle.Popover
                    },
                    props: {
                        log_id: this.log_id,
                    }
                }).then(() => {
                    this.prepareSummary();
                });
            },
        },
        
    };
</script>