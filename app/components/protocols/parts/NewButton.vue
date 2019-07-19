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
                    message: "You are currently in the middle of a chart. Are you sure to create a new chart?",
                    okButtonText: "Create New",
                    cancelButtonText: "Stay on Current",
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



