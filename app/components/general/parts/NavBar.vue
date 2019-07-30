<template>
    <FlexboxLayout alignItems="flex-end" class="navigation-ctnr" >
        <StackLayout class="nav-btn-ctnr">
            <Button class="navigation-close" text="Close" @tap="onCloseTap"></Button>
        </StackLayout>
        <StackLayout flexGrow="2" class="client-text-ctnr">
            <Label class="navigation-title" text="chart" />
        </StackLayout>
        <StackLayout class="nav-btn-ctnr">
            <Button class="navigation-btn" text="New Client" @tap="onNewTap"></Button>
        </StackLayout>
    </FlexboxLayout>
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
            onNewTap() {
                confirm({
                    title: "Create New Chart",
                    message: "Your current progress will be saved in your Chart History.",
                    okButtonText: "Create New Chart",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result || result === undefined) {
                        this.$emit('newClient');
                    } 
                });
            },
            onBackToHome(args) {
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