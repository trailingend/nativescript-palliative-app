<template>
    <ActionItem @tap="onNewTap" text="+ New Client" ios.position="right"></ActionItem>
</template>

<script>
    import NewClient from '../../intro/NewClient.vue';
    import { confirm }  from "tns-core-modules/ui/dialogs";

    export default {
        name: 'NewButton',
        methods: {
            onNewTap() {
                confirm({
                    title: "Create New Chart",
                    message: "Your current progress will be saved in your Chart History.",
                    okButtonText: "Create New Chart",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result || result === undefined) {
                        this.addNewLog();
                    } 
                });
            },
            addNewLog(args) {
                this.$navigateTo(NewClient, {
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



