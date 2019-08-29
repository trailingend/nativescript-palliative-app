<template>
    <!-- <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="flex-end"> -->
        <Button class="resource-btn" text="recommend" @tap="onBtnTap" ></Button>
    <!-- </FlexboxLayout> -->
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to open Recommand pop-up
     *  [Description] - used in AssessItems/ AssessOthers pages
     *  @prop {String} log_id - the id of the current document
     *  @prop {Object} unit - question object
     * 
     *  =============================================================
     * **/

    import Recommend from '../Recommend.vue';

    export default {
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                // type: Number,
                required: true,
            },
        },
        methods: {
            /**
             *  Function to call when the button is tapped, open Recommend pop-up
             * **/
            onBtnTap() {
                this.$showModal(Recommend, { 
                    fullscreen: true,
                    props: {
                        log_id: this.log_id,
                        protocol_id: this.protocol_id
                    }
                });
            }
        }
    }
</script>



