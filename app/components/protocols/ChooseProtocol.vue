<template>
    <Page class="page choose-page">
        <ActionBar title="Chart">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
            <!-- <NewButton /> -->
            <ActionItem @tap="onNewTap" text="+ New Client" ios.position="right"></ActionItem>
        </ActionBar>
        <GridLayout class="choose-ctnr" 
                    rows="auto, *, auto" 
                    columns="*" ref="chooseGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <ClientBlock row="0" col="0" :log_id="log_id"/>
            <StackLayout class="choose-main-ctnr" row="1" col="0">
                <StackLayout class="choose-title-ctnr">
                    <Label class="choose-title" text="Select Protocol"></Label>
                    <!-- <StackLayout class="divider-ctnr"></StackLayout> -->
                </StackLayout>
                <StackLayout class="choose-warning">
                    <Label text="If the situation appears to be urgent and life-threatening,"  textWrap="false"/>
                    <Label text="then a possible transfer to hospital might be indicated."  textWrap="false"/>
                </StackLayout>
                <StackLayout class="choose-d">
                    <Label text="If client chooses to transfer to hospital, remind them to bring necessary "  textWrap="false"/>
                    <Label text='forms (e.g. "no CPR" form, resentation agreement, advance directives, MOST, etc.).'  textWrap="false"/>
                </StackLayout>
                <GridLayout class="choose-btn-ctnr" :rows="gridSetting.rows" :columns="gridSetting.columns" >
                    <GridLayout v-for="(protocol, index) in protocols" 
                                v-bind:key="protocol.id" 
                                :row="Math.floor(index / gridSetting.denominator)"
                                :col="index % gridSetting.denominator"
                                rows="*" columns="auto, *"
                                :text="protocol.name" 
                                :color="checkSavedProtocols(protocol.id) ? saved_color : black_color"
                                :borderColor="checkSavedProtocols(protocol.id) ? clicked_color : unclicked_color"
                                :background="checkSavedProtocols(protocol.id) ? white_color : unclicked_color"
                                :id="`choose-btn-${index}`"
                                class="choose-btn" 
                                @tap="(args) => onBtnTap(args, protocol, index)">
                        <Image row="0" col="0" width="30" class="choose-status-icon" v-show="checkSavedProtocols(protocol.id)" src="~/assets/images/checked.png" stretch="aspectFit"></Image>
                        <Label row="0" col="1" class="answers-a" textWrap="true" :text="protocol.name" />
                    </GridLayout>
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
    // import NewButton from './parts/NewButton.vue';
    import ClientBlock from '../intro/parts/ClientBlock.vue';
    import Introduction from '../intro/Introduction.vue';
    import NewClient from '../intro/NewClient.vue';
    import AssessItems from './AssessItems.vue';
    import Summary from '../summary/Summary.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    import { confirm }  from "tns-core-modules/ui/dialogs";

    export default {
        name: 'ChooseProtocol',
        data() {
            return {
                show_next: false,
                unclicked_color: '#f5f5f5',
                clicked_color: '#acd6b5',
                saved_color: '#a1ccaa',
                white_color: '#ffffff',
                black_color: '#000000',
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
            // NewButton,
            CloseButton,
            ClientBlock
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            from_summary: {
                type: Boolean,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'logs',
                'intro',
                'protocols',
			])
		},
        methods: {
            ...mapActions([
                'saveProtoProgress'
            ]),
            prepareProtocols() {
            },
            preparePrevQuestion() {
                if (this.from_summary) {
                    this.$navigateTo(Summary, {
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'slideRight',
                            curve: 'easeIn',
                            duration: 300
                        },
                        props: {
                            log_id: this.log_id,
                            has_prev: false
                        }
                    });
                } else {
                    let step_ids = [];
                    this.intro.forEach(elem => { step_ids.push(elem.id); });
                    this.$navigateTo(Introduction, {
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'fade',
                            curve: 'easeIn',
                            duration: 300
                        },
                        props: {
                            log_id: this.log_id,
                            step_ids: step_ids,
                            step_idx: step_ids.length - 1
                        }
                    });
                }
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
            checkSavedProtocols(p_id) {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_items = log.items_answers.find(elem => { return elem.id === p_id; });
                const p_others = log.others_answers.find(elem => { return elem.id === p_id; });
                const p_plans = log.plans_answers.find(elem => { return elem.id === p_id; });
                return p_items != undefined || p_others != undefined || p_plans != undefined;
            },
            onBtnTap(args, proto, index) {
                const page = args.object.page;
                const clicked_btn = page.getViewById(`choose-btn-${index}`);
                this.protocol_id = (this.protocol_id === proto.id) ? null : proto.id;

                for (let i = 0; i < this.protocols.length; i++) {
                    const p_id_to_check = this.protocols[i].id;
                    if (this.checkSavedProtocols(p_id_to_check)) {
                        if (i === index) {
                            if (this.protocol_id != null) {
                                this.show_next = true;
                                clicked_btn.color = this.black_color;
                                clicked_btn.background = this.clicked_color;
                            } else {
                                this.show_next = false;
                                clicked_btn.color = this.saved_color;
                                clicked_btn.background = this.white_color;
                            }
                        } else {
                            page.getViewById(`choose-btn-${i}`).color = this.saved_color;
                            page.getViewById(`choose-btn-${i}`).background = this.white_color;
                        }
                    } else {
                        if (i === index) {
                            if (this.protocol_id != null && proto.assessment_questions.length > 0) {
                                this.show_next = true;
                                clicked_btn.background = this.clicked_color;
                                clicked_btn.borderColor = this.clicked_color;
                            } else {
                                this.show_next = false;
                                clicked_btn.background = this.unclicked_color;
                                clicked_btn.borderColor = this.unclicked_color;
                            }
                        } else {
                            page.getViewById(`choose-btn-${i}`).background = this.unclicked_color;
                            page.getViewById(`choose-btn-${i}`).borderColor = this.unclicked_color;
                        }
                    }
                }
            },
            onForward(args) {
                if (this.protocol_id != null) {
                    const progress = {
                        log_id: this.log_id,
                        p_id: this.protocol_id,
                    }
                    this.saveProtoProgress(progress);
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

            onNewTap() {
                confirm({
                    title: "Create New Chart",
                    message: "Your current progress will be saved in your Chart History.",
                    okButtonText: "Create New Chart",
                    cancelButtonText: "Cancel",
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
        
    };
</script>

<style>
</style>