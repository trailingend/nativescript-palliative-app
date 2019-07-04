<template>
    <Page class="page empty-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
        </ActionBar>
        <StackLayout class="empty-ctnr" rows="*" columns="*" ref="emptyGridRef" @layoutChanged="onLayoutUpdate">
            <Label class="empty-msg" text="Add a new log from Dashboard."/>
            <Label class="empty-msg" text="Or select an existing log."/>
            <Button class="empty-btn" text="Back to Dashboard" @tap="onBackHome"/>
        </StackLayout>
    </Page>
</template>

<script>
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        components: {
        },
        props: {
        },
        computed: {
		},
        methods: {
            onBackHome(args) {
                console.log("=== Back to Dashboard ===");

            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.emptyGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 1000) {

                } else {
                 
                }
            },
        }
        
    };
</script>

<style>
</style>