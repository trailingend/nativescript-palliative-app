<template>
    <ActionItem @tap="onBackTap" ios.systemIcon="0" ios.position="right"></ActionItem>
</template>

<script lang="ts">
    import Dashboard from '../../home/Dashboard.vue';
    import { confirm }  from "tns-core-modules/ui/dialogs";

    import { mapActions } from 'vuex';

    export default {
        methods: {
            ...mapActions([
                'changeLogStatus',
                'revertIntroProgress',
                'turnOffTimer',
            ]),
            onBackTap() {
                confirm({
                    title: "Closing Log",
                    message: "Do you want to save a draft of your current progress?",
                    okButtonText: "Save and Close",
                    cancelButtonText: "Cancel",
                    // neutralButtonText: "Exit"
                }).then((result) => {
                    if (result || result === undefined) {
                        this.onBackToHome();
                        this.$emit("close");
                    } 
                });
            },
            onBackToHome(args) {
                console.log("=== Navigate Back To Home ===");
                this.turnOffTimer();
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



