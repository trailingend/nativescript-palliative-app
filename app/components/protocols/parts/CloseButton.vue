<template>
    <ActionItem @tap="onCloseTap" text="Close" ios.position="left"></ActionItem>
</template>

<script lang="ts">
    import Dashboard from '../../home/Dashboard.vue';
    import { confirm }  from "tns-core-modules/ui/dialogs";

    export default {
        methods: {
            onCloseTap() {
                confirm({
                    title: "Close Chart",
                    message: "Your current progress will be saved in your Chart History.",
                    okButtonText: "Save and Close",
                    neutralButtonText: "Close without Saving",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result || result === undefined) {
                        this.onBackToHome();
                    } 
                });
            },
            onBackToHome(args) {
                console.log("=== Navigate Back To Home ===");
                this.$navigateTo(Dashboard, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slideBottom',
                        curve: 'easeIn',
                        duration: 300
                    }
                });
            },
        }
    }
</script>



