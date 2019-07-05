<template>
    <ActionItem @tap="onNewTap" text="+ New Log" ios.position="left"></ActionItem>
</template>

<script lang="ts">
    import Dashboard from '../../home/Dashboard.vue';
    import NewPatient from '../../triage/NewPatient.vue';
    import { confirm }  from "tns-core-modules/ui/dialogs";

    export default {
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
                    },
                });
            },
        }
    }
</script>



