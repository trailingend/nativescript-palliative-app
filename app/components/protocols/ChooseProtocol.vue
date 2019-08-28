<template>
    <Page class="page choose-page">
        <GridLayout :class="ctnrSetting" 
                    rows="auto, auto, *, auto" 
                    columns="auto, *, auto" ref="chooseGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <NavBar row="0" col="0" colSpan="3" :is_close="true" @newClient="addNewChart" />

            <ClientBlock row="1" col="0" colSpan="3" :log_id="log_id" :has_proto="true" @goToProtocol="(data) => goToNextProtocol(data)"/>

            <StackLayout class="choose-main-ctnr" row="2" col="0" :rowSpan="chooseSetting.rowSpan" colSpan="3">
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
            <!-- <FlexboxLayout row="2" col="0" orientation="horizontal" alignItems="center" justifyContent="space-between"> -->
            <Button row="3" col="0" class="back-btn" text="Back" @tap="onBackTap" ></Button>
            
            <Button row="3" col="2" v-if="show_next" class="next-btn" text="Next"></Button>
            <!-- </FlexboxLayout> -->
        </GridLayout>
    </Page>
</template>

<script>
    /**
     *  =============================================================
     * 
     *  Page to ask user to select a protocol to continue
     *  [Description] - can be opened from Introduction/ AssessItems/ Plans/ Summary page
     *  [Related] - styles in plans.scss
     *  @param {Boolean} show_next - textfield to record user's free response
     *  @param {String} unclicked_color - constant, color indicate the protocol has not been selected
     *  @param {String} clicked_color - constant, color indicate the protocol has been selected
     *  @param {String} saved_color - constant, color indicate the protocol has not been selected
     *  @param {String} white_color - constant, color white
     *  @param {String} black_color - constant, color black
     *  @param {Number} protocol_id - id of selected protocol
     *  @param {Object} chooseSetting - variable to store rowSpan of the GridLayout
     *  @param {Object} gridSetting - variable to store parent settings of the GridLayout
     *  @param {Object} ctnrSetting - variable to store screen-size sensitive classnames
     *  @prop {String} log_id - the id of the current document
     *  @prop {String} from_summary - variable to check whether the page is navigated from Summary page
     * 
     *  =============================================================
     * **/

    import NavBar from '../general/parts/NavBar.vue';
    import ClientBlock from '../general/parts/ClientBlock.vue';
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

                ctnrSetting: 'choose-ctnr',
                chooseSetting: {
                    rowSpan: '1',
                },
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
            NavBar,
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
            /**
             *  Function to go back to Introduction page if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
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
                            step_idx: step_ids.length - 1,
                            from_summary: false
                        }
                    });
                }
            },
            /**
             *  Function to go next to AssessItems page of selected protocol if in linearly documenting mode
             *  [Description] - always clear navigation history
             * **/
            prepareNextProtocol() {
                this.$navigateTo(AssessItems, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        protocol_id: this.protocol_id,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to go next to AssessItems page of selected protocol if in linearly documenting mode
             *  [Description] - always clear navigation history
             *  @param {Number} p_id - protocol id to go tp
             * **/
            goToNextProtocol(p_id) {
                this.$navigateTo(AssessItems, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: this.log_id,
                        protocol_id: p_id,
                        from_summary: false,
                    }
                });
            },
            /**
             *  Function to to check whether the protocol is attempted
             *  @param {Number} p_id - protocol id
             * **/
            checkSavedProtocols(p_id) {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_items = log.items_answers.find(elem => { return elem.id === p_id; });
                const p_others = log.others_answers.find(elem => { return elem.id === p_id; });
                return p_items != undefined || p_others != undefined;
            },
            /**
             *  Function to abort the current document and start a new doucment
             *  [Description] - always clear navigation history
             * **/
            addNewChart() {
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
            /**
             *  Function to change style of selected button, and then navigate to the protocol
             *  @param {Object} args - event object
             *  @param {Object} proto - protocol object
             *  @param {Number} index - index of the button tapped
             * **/
            onBtnTap(args, proto, index) {
                const page = args.object.page;
                const clicked_btn = page.getViewById(`choose-btn-${index}`);
                this.protocol_id = (this.protocol_id === proto.id) ? null : proto.id;

                for (let i = 0; i < this.protocols.length; i++) {
                    const p_id_to_check = this.protocols[i].id;
                    if (this.checkSavedProtocols(p_id_to_check)) { // if the current protocol has been attempted 
                        if (i === index) {
                            if (this.protocol_id != null) {
                                clicked_btn.color = this.black_color;
                                clicked_btn.background = this.clicked_color;
                            } else {
                                clicked_btn.color = this.saved_color;
                                clicked_btn.background = this.white_color;
                            }
                        } else {
                            page.getViewById(`choose-btn-${i}`).color = this.saved_color;
                            page.getViewById(`choose-btn-${i}`).background = this.white_color;
                        }
                    } else { // if the current protocol has not been attempted 
                        if (i === index) {
                            if (this.protocol_id != null && proto.assessment_questions.length > 0) { 
                                // CONDITIONING - Style before go to protocol
                                console.log("index of yes proto " + i)
                                clicked_btn.background = this.clicked_color;
                                clicked_btn.borderColor = this.clicked_color;
                            } else { 
                                // CONDITIONING - No content in such protocol
                                clicked_btn.background = this.unclicked_color;
                                clicked_btn.borderColor = this.unclicked_color;
                                return;
                            }
                        } else {
                            page.getViewById(`choose-btn-${i}`).background = this.unclicked_color;
                            page.getViewById(`choose-btn-${i}`).borderColor = this.unclicked_color;
                        }
                    }
                }

                this.onForward();
            },
            /**
             *  Function to save current progress in linear documenting mode moving forwards
             * **/
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
            /**
             *  Function to save current progress in linear documenting mode moving backwards
             * **/
            onBackward(args) {
                const progress = {
                    log_id: this.log_id,
                    p_id: -2,
                }
                this.saveProtoProgress(progress);
                this.preparePrevQuestion();
            },
            /**
             *  Function to call when back button tapped
             * **/
            onBackTap() {
                this.onBackward();
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.chooseGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 800) {
                    this.ctnrSetting = 'choose-ctnr tablet-landscape';
                    this.gridSetting = {
                        rows: "*, *, *, *, *",
                        columns: "*, *, *",
                        denominator: 3
                    };
                    this.chooseSetting = {
                        rowSpan: '2',
                    };
                } else {
                    this.ctnrSetting = 'choose-ctnr';
                    this.gridSetting = {
                        rows: "*, *, *, *, *, *, *",
                        columns: "*, *",
                        denominator: 2
                    };
                    this.chooseSetting = {
                        rowSpan: '1',
                    };
                }
            },
            
        }
        
    };
</script>

<style>
</style>