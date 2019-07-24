<template>
    <!-- <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="flex-end"> -->
        <Button class="resource-btn" text="recommend" @tap="onBtnTap" ></Button>
    <!-- </FlexboxLayout> -->
</template>

<script lang="ts">
    import Resources from '../Resources.vue';

    export default {
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                type: Number,
                required: true,
            },
        },
        methods: {
            onBtnTap() {
                this.$showModal(Resources, { 
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



