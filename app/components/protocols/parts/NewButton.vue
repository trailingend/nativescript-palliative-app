<template>
    <ActionItem @tap="onNewTap" text="+ New Log" ios.position="right"></ActionItem>
</template>

<script>
    import NewPatient from '../../general/NewPatient.vue';
    import { confirm }  from "tns-core-modules/ui/dialogs";

    export default {
        name: 'NewButton',
        methods: {
            onNewTap() {
                confirm({
                    message: "You are currently in the middle of a log. Are you sure to create a new log?",
                    okButtonText: "Yes",
                    cancelButtonText: "No",
                    // neutralButtonText: "Exit"
                }).then((result) => {
                    if (result || result === undefined) {
                        this.addNewLog();
                    } 
                });
            },
            addNewLog(args) {
                this.$navigateTo(NewPatient, {
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



