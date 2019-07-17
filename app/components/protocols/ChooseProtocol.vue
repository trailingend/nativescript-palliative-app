<template>
    <Page class="page choose-page">
        <ActionBar title="Chart">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <NewButton />
        </ActionBar>
        <GridLayout class="choose-ctnr" 
                    rows="auto, *, auto" 
                    columns="*" ref="chooseGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <ClientBlock row="0" col="0" :log_id="log_id"/>
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
                            class="choose-btn" 
                            @tap="(args) => onBtnTap(args, protocol, index)" />
                </GridLayout>
            </StackLayout>
            <FlexboxLayout row="2" col="0" orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button v-if="show_next" class="next-btn" text="Next" @tap="onNextTap" ></Button>
                <Label v-else />
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import CloseButton from './parts/CloseButton.vue';
    import NewButton from './parts/NewButton.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
    import Diagnose from '../general/Diagnose.vue';
    import AssessItems from './AssessItems.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        name: 'ChooseProtocol',
        data() {
            return {
                warning_text: 'If the situation appears to be urgent and life-threatening then a possible transfer to the hospital might be warranted',
                show_next: false,
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
        },
        components: {
            NewButton,
            CloseButton,
            ClientBlock
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
                'intro_questions',
                'protocols',
			])
		},
        methods: {
            ...mapActions([
            ]),
            prepareProtocols() {
                const log_idx = this.logs.findIndex(elem => { return elem.id === this.log_id; });
            },
            preparePrevQuestion() {
                let q_ids = [];
                this.intro_questions.forEach(elem => { q_ids.push(elem.id); });
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
                        question_ids: q_ids,
                        question_idx: q_ids.length - 1
                    }
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
                const page = args.object.page;
                const clicked_btn = page.getViewById(`choose-btn-${index}`);
                this.protocol_id = (this.protocol_id === proto.id) ? null : proto.id;
                this.show_next = (this.protocol_id != null);

                for (let i = 0; i < this.protocols.length; i++) {
                    page.getViewById(`choose-btn-${i}`).background = this.unclicked_color;
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