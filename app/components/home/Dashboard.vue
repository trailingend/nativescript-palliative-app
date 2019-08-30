<template>
    <Page :class="pageSetting.class">
        <GridLayout class="home-ctnr" rows="auto, auto, *, auto, auto" 
                                      columns="*, auto" 
                                      ref="homeGridRef" 
                                      @layoutChanged="onLayoutUpdate">
            <StackLayout row="0" col="0" class="home-logo-ctnr">
                <Image class="home-logo" src="~/assets/images/logo.png" stretch="aspectFill" ></Image>
            </StackLayout>

            <StackLayout row="0" col="1" :class="(curr_user_id == -1) ? 'home-user-ctnr home-user-begin-ctnr' : 'home-user-ctnr'" orientation="horizontal">
                <Image class="home-setting" width="35" height="35" src="~/assets/images/union.png" stretch="aspectFill" @tap="onOptionsTap"></Image>
                <UserBlock @userChange="checkUserStatus" />
            </StackLayout>

            <StackLayout row="1" col="0" colSpan="3" class="log-title-ctnr">
                <Label class="log-title" text="client history" />
            </StackLayout>

            <Logs row="2" col="0" rowSpan="2" colSpan="3" class="home-log-ctnr" />

            <Image row="3" col="0" colSpan="3" v-show="is_vertical" src="~/assets/images/mask-p.png" stretch="aspectFill"></Image>
            <Image row="4" col="0" colSpan="3" v-show="is_vertical" src="~/assets/images/pad-p-shorter.png" stretch="aspectFill"></Image>

            <Image row="3" col="0" colSpan="3" v-show="!is_vertical" src="~/assets/images/mask-l.png" stretch="aspectFill"></Image>
            <Image row="4" col="0" colSpan="3" v-show="!is_vertical" src="~/assets/images/pad-l.png" stretch="aspectFill"></Image>

            <StackLayout row="3" col="0" rowSpan="2" colSpan="3" class="home-btn-ctnr" >
                <Button class="home-add" text="NEW CLIENT" @tap="onNewTap"></Button>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Page that displays the Dashboard of the app. This is the default page when the app is freshly loadded
     *  [Description] - called from the main App frame as a default, can be accessed from every other screen
     *  [Related] - styles in dashboard.scss
     *  @param {Boolean} is_vertical - variable indicating whether the user has been created
     *  @param {Object} pageSetting - variable to store GridLayout settings
     *  @param {Object} userSetting - variable to store screen-size sensitive GridLayout information 
     * 
     *  =============================================================
     * **/
    
    import UserBlock from './parts/UserBlock.vue';
    import Logs from './parts/Logs.vue';
    import NewClient from '../intro/NewClient.vue';
    import Notes from '../intro/Notes.vue';
    import Options from './Options.vue';
    
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { setInterval, clearInterval } from "tns-core-modules/timer";
    import * as utils from 'tns-core-modules/utils/utils';

    export default {
        data() {
            return {
                is_vertical: true,

                pageSetting: {
                    class: "page home-page"
                },
                userSetting: "home-user-ctnr home-user-begin-ctnr"
            }
        },
        created() {
            this.loadLocalJsonFile();
        },
        mounted() {
            this.checkUserStatus();
            this.loadOnlineData();
        },
        updated() {
            this.checkUserStatus();
        },
        components: {
            Logs,
            UserBlock,
        },
        computed: {
            ...mapGetters([
                'curr_user_id',
                'data_version'
			])
		},
        methods: {
            ...mapActions([
                'loadLocalData',
                'loadOnlineData',
                'deleteActiveLog'
            ]),
            /**
             *  Function to load local JSON data into the app and saved to data storage
             * **/
            loadLocalJsonFile() {
                const localJsonData = require('@/assets/data/data.json');
                if (localJsonData) {
                    console.log(`=== check if load from local json === ${localJsonData.info.version > this.data_version} (${localJsonData.info.version}, ${this.data_version})`);
                    if (localJsonData.info.version > this.data_version) {
                        this.loadLocalData(localJsonData);
                    } 
                }
            },
            /**
             *  Function to set classnames based on whether there is an user logged in
             * **/
            checkUserStatus() {
                this.userSetting = (this.curr_user_id == -1) ? "home-user-ctnr home-user-begin-ctnr" : "home-user-ctnr";
            },
            /**
             *  Function to create a new client 
             * **/
            onNewTap(args) {
                console.log("=== Creating new Patient ===");
                this.deleteActiveLog();
                this.$navigateTo(NewClient, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slideTop',
                        curve: 'easeIn',
                        duration: 300
                    },
                });
            },
            /**
             *  Function to open options page
             * **/
            onOptionsTap() {
                this.$showModal(Options, { 
                    fullscreen: true,
                }).then(() => {
                    this.checkUserStatus();
                });
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.homeGridRef.nativeView.getMeasuredWidth() );
                const half_width = width / 2;
                const quater_width = width / 4;
                if (width > 1000) {
                    this.is_vertical = false;
                    this.pageSetting = {
                        class: "page home-page tablet-landscape"
                    }
                } else {
                    this.is_vertical = true;
                    this.pageSetting = {
                        class: "page home-page"
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>