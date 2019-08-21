<template>
     <Page class="page tutorial-page">
        <GridLayout rows="auto, *" columns="*" 
                    ref="firstTimeRef" 
                    :class="ctnrSetting"
                    @layoutChanged="onLayoutUpdate">
            <Label row="0" col="0" class="tutorial-title" text="tutorial" ></Label> 
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <GridLayout row="1" col="0" :rows="mainSetting.rows" :columns="mainSetting.columns" class="first-time-main-ctnr">
                <StackLayout :row="mainSetting.video.row" :col="mainSetting.video.col" class="video-ctnr">
                    <VideoPlayer ref="firstTimePlayerRef" 
                                 src="~/assets/videos/first_time.mp4" 
                                 autoplay="true" 
                                 controls="false"
                                 muted="true"
                                 loop="true"
                                 width="367.5"
                                 height="490"
                                 class="video-player"
                                 :opacity="isReady? 1 : 0"
                                 @playbackReady="() => {isReady = true; }" />
                </StackLayout>
                <StackLayout :row="mainSetting.desc.row" :col="mainSetting.desc.col" class="desc-ctnr">
                    <Label class="tutorial-subtitle" text="First Time Using this Tool?" ></Label>   
                    <StackLayout class="tutorial-text-ctnr">
                            <Label class="tutorial-text" text="We can show you how to use this tool." ></Label>
                            <Label class="tutorial-text" text="Revisit this Tutorial anytime in Settings."></Label>
                    </StackLayout>   
                    <Button class="form-btn first-time-save-btn" text="Start" @tap="onStartTap" />
                    <Button class="first-time-skip-btn" text="Skip" @tap="onSkipTap" />
                </StackLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import Journey from './Journey.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                isReady: false,

                ctnrSetting: "first-time-ctnr",
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
        beforeDestroy() {
            this.$refs.firstTimePlayerRef.nativeView.destroy();
        },
        components: {
        },
        props: {
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
            
            onStartTap(args) {
                this.$navigateTo(Journey, {
                    frame: 'tutorialFrame',
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        item_idx: 0,
                        parent_modal: this.parent_modal,
                    }
                });
            },
            onSkipTap() {
                this.onBackHome();
            },
            onCloseTap() {
                this.onBackHome();
            },
            onBackHome() {
                this.$refs.firstTimePlayerRef.nativeView.pause();
                this.parent_modal.close();
            },
            onLayoutUpdate() {
                if (this.$refs.firstTimeRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.firstTimeRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.ctnrSetting = "first-time-ctnr tablet-landscape";
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