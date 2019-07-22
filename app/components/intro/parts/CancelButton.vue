<template>
    <ActionItem @tap="onCloseTap" ios.systemIcon="1" ios.position="left"></ActionItem>
</template>

<script lang="ts">
    import Dashboard from '../../home/Dashboard.vue';
    import { confirm }  from "tns-core-modules/ui/dialogs";

    export default {
        methods: {
            onCloseTap() {
                confirm({
                    title: "Closing Chart",
                    message: "Do you want to exit without saving?",
                    okButtonText: "Exit without Saving",
                    cancelButtonText: "Stay on Current",
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



