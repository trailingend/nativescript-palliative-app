<template>
    <Page class="page choose-page">
        <ActionBar title="Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout class="choose-ctnr" 
                    rows="auto, *, auto" 
                    columns="*" ref="chooseGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" :log_id="log_id"/>
            <StackLayout class="choose-main-ctnr" row="1" col="0">
                <StackLayout class="choose-title-ctnr">
                    <Label class="choose-title" text="What is the caller's biggest concern?"></Label>
                    <StackLayout class="divider-ctnr"></StackLayout>
                </StackLayout>
                <Label :text="warning_text" class="choose-warning" textWrap="true"/>
                <GridLayout class="choose-btn-ctnr" :rows="gridSetting.rows" :columns="gridSetting.columns" >
                    <Button v-for="(protocol, index) in protocols" 
                            v-bind:key="protocol.id" 
                            :row="Math.floor(index / gridSetting.denominator)"
                            :col="index % gridSetting.denominator"
                            :text="protocol.name" 
                            :background="unclicked_color"
                            :id="`choose-btn-${index}`"
                            :class="choose-btn" 
                            @tap="(args) => onBtnTap(args, protocol, index)" />
                </GridLayout>
            </StackLayout>
            <FlexboxLayout row="2" col="0" orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" :text="next_text" @tap="onNextTap" ></Button>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import UserBlock from '../general/parts/UserBlock.vue';
    import Diagnose from '../general/Diagnose.vue';
    import AssessItems from './AssessItems.vue';

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
            prepareProtocols() {
                const log_idx = this.logs.findIndex(elem => { return elem.id === this.log_id; });
            },
            preparePrevQuestion() {
                this.$navigateTo(Diagnose, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        question_id: 3
                    },
                });
            },
            prepareNextProtocol() {
                this.$navigateTo(AssessItems, {
                    animated: true,
                    clearHistory: false,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        protocol_id: this.protocol_id
                    }
                });
            },
            onBtnTap(args, proto, index) {
                const layoutView = args.object;
                const clicked_btn = layoutView.getViewById(`choose-btn-${index}`);
                this.protocol_id = (this.protocol_id === proto.id) ? null : proto.id;
                this.next_text = (this.protocol_id === null) ? "Skip" : "Next";

                for (let i = 0; i < this.protocols.length; i++) {
                    layoutView.getViewById(`choose-btn-${i}`).background = this.unclicked_color;
                }
                clicked_btn.background = (this.protocol_id === null) ? this.unclicked_color : this.clicked_color;
            },
            onForward(args) {
                if (this.protocol_id != null) {
                    this.prepareNextProtocol();
                } else {
                    console.log("=== TODO navigate to summary and submit ===");
                }
            },
            onBackward(args) {
                this.preparePrevQuestion();
            },
            onBackTap() {
                this.onBackward();
            },
            onNextTap() {
                this.onForward();
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.chooseGridRef.nativeView.getMeasuredWidth() 
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