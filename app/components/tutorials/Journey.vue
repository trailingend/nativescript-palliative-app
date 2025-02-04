<template>
     <Page class="page tutorial-page">
        <GridLayout rows="auto, *, auto" columns="auto, *, auto" 
                    ref="firstTimeRef" 
                    :class="ctnrSetting"
                    @layoutChanged="onLayoutUpdate">
            <Label row="0" col="0" colSpan="3" class="tutorial-title" text="tutorial" ></Label> 

            <Image row="0" col="2" colSpan="1" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>

            <GridLayout row="1" col="0" colSpan="3" :rows="mainSetting.rows" :columns="mainSetting.columns" class="first-time-main-ctnr">
                <StackLayout :row="mainSetting.video.row" :col="mainSetting.video.col" class="video-ctnr">
                    <VideoPlayer ref="journeyPlayerRef" 
                                 :src="`~/assets/videos/${tutorials[$props.item_idx].video}.mp4`" 
                                 autoplay="true" 
                                 controls="false"
                                 muted="true"
                                 loop="true"
                                 :width="widthSetting"
                                 height="490"
                                 class="video-player"
                                 :opacity="isReady? 1 : 0"
                                 @playbackReady="() => {isReady = true; }" />
                </StackLayout>
                <StackLayout :row="mainSetting.desc.row" :col="mainSetting.desc.col" class="desc-ctnr">
                    <Label class="tutorial-subtitle" :text="tutorials[$props.item_idx].title" ></Label>   
                    <StackLayout class="tutorial-text-ctnr">
                            <Label class="tutorial-text" textWrap="true" :text="tutorials[$props.item_idx].desc" ></Label>
                    </StackLayout>   
                </StackLayout>
            </GridLayout>

            <Button row="2" col="0" colSpan="1" class="back-btn" text="Back" @tap="onBackTap" :opacity="(!is_first_time && item_idx === 0) ? 0 : 1"></Button>
            <StackLayout row="2" col="1" colSpan="1" class="tutorial-progress-ctnr">
                <Label class="tutorial-progress" :text="`${$props.item_idx + 1} / ${total_pages}`"></Label>
            </StackLayout>
            <Button row="2" col="2"  colSpan="1" v-if="$props.item_idx < tutorials.length - 1" class="next-btn" text="Next" @tap="onNextTap" ></Button>
            <Button row="2" col="2"  colSpan="1" v-else class="next-btn" text="Next" opacity="0" ></Button>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Modal sub-page to display tutorial storyline
     *  [Description] - called in Tutorials page, note that this page cannot solely exists without a pop-up frame
     *  [Related] - styles in tutorial.scss
     *  @param {Boolean} isReady - variable indicating whether the video object on th epage is ready to be displayed
     *  @param {Number} total_pages - total number of storyline pages
     *  @param {String} widthSetting - default width value for video obejcts
     *  @param {Object} mainSetting - variable to store screen-size sensitive GridLayout information 
     *  @prop {Number} item_idx - the index of the current tutorial page
     *  @prop {Boolean} is_first_time - variable indicating whether current user is a first-time user
     *  @prop {Object} parent_modal - Object of the parent modal
     * 
     *  =============================================================
     * **/

    import FirstTime from './FirstTime.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                isReady: false,
                total_pages: 7,
                
                ctnrSetting: "first-time-ctnr",
                widthSetting: '367.5',
                mainSetting: {
                    rows: "auto, *",
                    columns: "*",
                    video: {
                        row: "0",
                        col: "0",
                    },
                    desc: {
                        row: "1",
                        col: "0",
                    }
                }
            }
        },
        beforeCreate() {
            this.$options.components.Journey = require('./Journey.vue').default;
        },
        beforeDestroy() {
            this.$refs.journeyPlayerRef.nativeView.destroy();
        },
        mounted() {
        },
        components: {
        },
        props: {
            item_idx: {
                type: Number,
                required: true,
            },
            is_first_time: {
                type: Boolean,
                required: true,
            },
            parent_modal: {
                type: Object,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'tutorials'
			]),
        },
        methods: {
            ...mapActions([
            ]),
            /**
             *  Function to close current modal and navigate back to Dashboard
             * **/
            onCloseTap() {
                this.onBackHome();
            },
            /**
             *  Function to close current modal
             * **/
            onBackHome() {
                this.$refs.journeyPlayerRef.nativeView.pause();
                this.parent_modal.close();
            },
            /**
             *  Function to call when next button tapped and navigate to the next tutorial story
             *  [Description] - if it reached the first of tutorial storyline, then depending on whether the user being a first-time user, hide back button or navigate to first-time screen
             * **/
            onBackTap() {
                if (this.is_first_time && this.item_idx === 0) {
                    this.$navigateTo(FirstTime, {
                        frame: 'tutorialFrame',
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'fade',
                            curve: 'easeIn',
                            duration: 300
                        },
                        props: {
                            parent_modal: this.parent_modal,
                        }
                    });
                } else {
                    const prev_item_idx = this.item_idx - 1;
                    this.$navigateTo(this.$options.components.Journey, {
                        frame: 'tutorialFrame',
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'fade',
                            curve: 'easeIn',
                            duration: 300
                        },
                        props: {
                            item_idx: prev_item_idx,
                            parent_modal: this.parent_modal,
                            is_first_time: this.is_first_time,
                        }
                    });
                }
                
            },
            /**
             *  Function to call when next button tapped and navigate to the next tutorial story
             * **/
            onNextTap() {
                const next_item_idx = this.item_idx + 1;
                if (next_item_idx < this.tutorials.length) {
                    this.$navigateTo(this.$options.components.Journey, {
                        frame: 'tutorialFrame',
                        animated: true,
                        clearHistory: true,
                        transition: {
                            name: 'fade',
                            curve: 'easeIn',
                            duration: 300
                        },
                        props: {
                            item_idx: next_item_idx,
                            parent_modal: this.parent_modal,
                        }
                    });
                } else {

                }
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                if (this.$refs.firstTimeRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.firstTimeRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.ctnrSetting = "first-time-ctnr tablet-landscape";
                        this.widthSetting = '351.5';
                        this.mainSetting = {
                            rows: "*",
                            columns: "*, *",
                            video: {
                                row: "0",
                                col: "0",
                            },
                            desc: {
                                row: "0",
                                col: "1",
                            }
                        };
                    } else {
                        this.ctnrSetting = "first-time-ctnr";
                        this.widthSetting = '367.5';
                        this.mainSetting = {
                            rows: "auto, *",
                            columns: "*",
                            video: {
                                row: "0",
                                col: "0",
                            },
                            desc: {
                                row: "1",
                                col: "0",
                            }
                        };
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>