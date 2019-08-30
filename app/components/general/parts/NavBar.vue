<template>
    <FlexboxLayout alignItems="flex-end" class="navigation-ctnr" >
        <StackLayout class="nav-btn-ctnr">
            <Button class="navigation-close" text="Close" @tap="onCloseTap"></Button>
        </StackLayout>
        <StackLayout flexGrow="2" class="client-text-ctnr">
            <Label class="navigation-title" text="client" />
        </StackLayout>
        <StackLayout class="nav-btn-ctnr">
            <Button class="navigation-btn" text="New Client" @tap="onNewTap"></Button>
        </StackLayout>
    </FlexboxLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component of main navigation on client document related pages
     *  [Description] - used in every client document related pages
     *  [Related] - styles in navigation.scss
     *  @prop {Boolean} is_close - can close current document
     * 
     *  =============================================================
     * **/

    import Dashboard from '../../home/Dashboard.vue';
    import { confirm }  from "tns-core-modules/ui/dialogs";

    export default {
        data() {
            return {
            }
        },
        props: {
            is_close: {
                type: Boolean,
                required: true,
            }
        },
        methods: {
            /**
             *  Function to ask the user to confirm whether to close current client document and go back to Dashboard
             * **/
            onCloseTap() {
                if (this.is_close) {
                    confirm({
                        title: "Close Document",
                        message: "Your current progress will be saved in your Client History.",
                        okButtonText: "Save and Close",
                        cancelButtonText: "Cancel",
                    }).then((result) => {
                        if (result) {
                            this.onBackToHome();
                        } 
                    });
                } else {
                    confirm({
                        title: "Cancel Create Client",
                        message: "This client will not be documented.",
                        okButtonText: "Close without Saving",
                        cancelButtonText: "Cancel",
                    }).then((result) => {
                        if (result || result === undefined) {
                            this.onBackToHome();
                        } 
                    });
                }
            },
            /**
             *  Function to create a new client 
             * **/
            onNewTap() {
                confirm({
                    title: "Create New Client",
                    message: "Your current progress will be saved in your Client History.",
                    okButtonText: "Create New Client",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result || result === undefined) {
                        this.$emit('newClient');
                    } 
                });
            },
            /**
             *  Function to navigate to Dashboard page
             * **/
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