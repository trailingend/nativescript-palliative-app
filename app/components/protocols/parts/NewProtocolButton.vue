<template>
    <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="flex-end">
        <Button class="new-proto-btn" text="New Protocol" @tap="onNewTap" ></Button>
    </FlexboxLayout>
</template>

<script lang="ts">
    import ChooseProtocol from '../ChooseProtocol.vue';

    export default {
        methods: {
            onNewTap() {
                this.$navigateTo(ChooseProtocol, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slide',
                        curve: 'easeIn',
                        duration: 300
                    },
                });
            },
        }
    }
</script>



