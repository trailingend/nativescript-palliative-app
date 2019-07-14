<template>
    <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="flex-end">
        <Button class="resource-btn" text="references" @tap="onBtnTap" ></Button>
    </FlexboxLayout>
</template>

<script lang="ts">
    import Resources from '../Resources.vue';

    export default {
        methods: {
            onBtnTap() {
                this.$showModal(Resources, { 
                    fullscreen: true,
                });
            }
        }
    }
</script>



