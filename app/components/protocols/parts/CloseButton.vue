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
                    title: "Closing Log",
                    message: "Do you want to save a draft of your current progress?",
                    okButtonText: "Save and Close",
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



