<template>
<Frame id="protoFrame">
    <Page class="page catalogue-page">
        <GridLayout class="choose-ctnr" 
                    rows="auto, *, auto" 
                    columns="*" ref="catalogueGridRef" 
                    @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>

            <StackLayout class="choose-main-ctnr" row="1" col="0" :rowSpan="chooseSetting.rowSpan" colSpan="3">
                <StackLayout class="choose-title-ctnr">
                    <Label class="choose-title" text="Select Protocol"></Label>
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
        </GridLayout>
    </Page>
</Frame>
</template>

<script>
    /**
     *  =============================================================
     * 
     *  Modal to display all available protocols and their completion status as a navigatable menu
     *  [Description] - used in ClientBlock, in every client document related pages.
     *  [Related] - styles in clientBlock.scss
     *  @param {Boolean} show_next - 
     *  @param {String} unclicked_color - constant, color for unclicked button
     *  @param {String} clicked_color - constant, color for clicked button
     *  @param {String} white_color - constant, color white
     *  @param {String} black_color - constant, color black
     *  @param {Number} protocol_id - if of protocol selected
     *  @param {Object} chooseSetting - variable to store child level GridLayout setting
     *  @param {Object} gridSetting - variable to store parent level GridLayout setting
     *  @prop {String} log_id - id the current client document
     * 
     *  =============================================================
     * **/

    import { mapActions, mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        name: 'Catalogue',
        data() {
            return {
                show_next: false,
                unclicked_color: '#f5f5f5',
                clicked_color: '#acd6b5',
                saved_color: '#a1ccaa',
                white_color: '#ffffff',
                black_color: '#000000',
                protocol_id: null,

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
        },
        props: {
            log_id: {
                type: String,
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
            /**
             *  Function to check whether a protocol has any response saved
             *  @param {Number} p_id - the protocol id to check
             * **/
            checkSavedProtocols(p_id) {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_items = log.items_answers.find(elem => { return elem.id === p_id; });
                const p_others = log.others_answers.find(elem => { return elem.id === p_id; });
                return p_items != undefined || p_others != undefined;
            },
            /**
             *  Function to change button style based on user interaction
             *  @param {object} args - event object
             *  @param {Object} proto - the protocol object selected
             *  @param {Number} index - index of the button being clicked
             * **/
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
                this.goToProtocol();
            },
            /**
             *  Function to close current modal
             * **/
            onCloseTap() {
                this.$modal.close(-1);
            },
            /**
             *  Function to log progress of the new protocol to go to
             * **/
            goToProtocol() {
                if (this.protocol_id != null) {
                    const progress = {
                        log_id: this.log_id,
                        p_id: this.protocol_id,
                    }
                    this.saveProtoProgress(progress);
                    this.$modal.close(this.protocol_id);
                } else {
                    console.log("OH NO!!!!!");
                }
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.catalogueGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 1000) {
                    this.gridSetting = {
                        rows: "*, *, *, *, *",
                        columns: "*, *, *",
                        denominator: 3
                    };
                    this.chooseSetting = {
                        rowSpan: '1',
                    };
                } else {
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