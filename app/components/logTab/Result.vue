<template>
    <Page class="page result-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackward" ios.systemIcon="21" ios.position="left" ></ActionItem>
        </ActionBar>
        <StackLayout class="result-ctnr" rows="*" columns="*" ref="resultGridRef" @layoutChanged="onLayoutUpdate">
            <Label class="result-msg" :text="resultMsg"/>
            <Button class="result-btn" text="Back to Dashboard" @tap="onBackHome"/>
        </StackLayout>
    </Page>
</template>

<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                resultMsg: 'Placeholder for result',
            }
        },
        mounted() {
            this.prepareResult();
        },
        components: {
        },
        props: {
            intro_outcome: {
                type: Object,
                required: false,
            },
        },
        computed: {
            ...mapGetters([
			])
		},
        methods: {
            ...mapActions([
            ]),
            prepareResult() {
                if (this.intro_outcome.text) {
                    this.resultMsg = this.intro_outcome.text;
                }
            },
            onForward(ans) {
            },
            onBackward(args) {
                this.$navigateBack();
            },
            onBackHome(args) {
                console.log("=== Back to Dashboard ===");
                const tabView = args.object.page.frame.parent.parent;
                tabView.selectedIndex = 0;
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.resultGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {

                } else {
                 
                }
            },
        }
        
    };
</script>

<style>
</style>