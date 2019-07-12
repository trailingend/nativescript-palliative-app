<template>
    <Page class="page items-page">
        <ActionBar title="Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout class="items-ctnr" 
                    rows="auto, auto, *, auto" 
                    columns="*, auto" ref="itemsGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" colSpan="2" :log_id="log_id"/>
            <StackLayout row="1" col="0" rowSpan="1" colSpan="2" class="items-title-ctnr">
                <Label class="items-title" text="Assess"></Label>
                <Label class="items-subtitle" text="quality"></Label>
                <StackLayout class="divider-ctnr"></StackLayout>
            </StackLayout>
            <StackLayout row="2" col="0" rowSpan="2" colSpan="2" class="items-main-ctnr">
                <Label text="Describe what is currently happening?" class="items-d" textWrap="true"/>
                <ScrollView class="items-q-list">

                </ScrollView>
            </StackLayout>
            <FlexboxLayout row="3" col="0" colSpan="2" orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" :text="next_text" @tap="onNextTap" ></Button>
            </FlexboxLayout>
            <StackLayout row="1" col="1" rowSpan="2" colSpan="1" class="items-tab-ctnr">
                <Label class="items-tab" text="O"></Label>
                <Label class="items-tab" text="P"></Label>
                <Label class="items-tab" text="Q"></Label>
                <Label class="items-tab" text="R"></Label>
                <Label class="items-tab" text="S"></Label>
                <Label class="items-tab" text="T"></Label>
                <Label class="items-tab" text="U"></Label>
                <Label class="items-tab" text="V"></Label>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import UserBlock from '../general/parts/UserBlock.vue';
    import Diagnose from '../general/Diagnose.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                warning_text: 'If the situation appears to be urgent and life-threatening then a possible transfer to the hospital might be warranted',
                next_text: 'Skip',
                unclicked_color: '#eeeeee',
                clicked_color: '#cccccc',
                protocol_id: null,

                gridSetting: {
                    rows: "*, *, *, *, *, *, *",
                    columns: "*, *",
                    denominator: 2
                },

            }
        },
        mounted() {
            // this.prepareProtocols();
        },
        components: {
            CloseButton,
            NewButton,
            UserBlock
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                type: Number,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols',
			])
		},
        methods: {
            ...mapActions([
                'changeLogStatus',
            ]),
            
            onForward(args) {
                
            },
            onBackward(args) {
            },
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.itemsGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 1000) {
                    this.gridSetting = {
                        rows: "*, *, *, *, *",
                        columns: "*, *, *",
                        denominator: 3
                    };
                } else {
                    this.gridSetting = {
                        rows: "*, *, *, *, *, *, *",
                        columns: "*, *",
                        denominator: 2
                    };
                }
            },
        }
        
    };
</script>

<style>
</style>