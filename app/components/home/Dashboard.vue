<template>
    <Page :class="pageSetting.class">
        <!-- <ActionBar title="Dashboard"></ActionBar> -->
        <GridLayout class="home-ctnr" :rows="gridSetting.rows" 
                                      :columns="gridSetting.columns" 
                                      ref="homeGridRef" 
                                      @layoutChanged="onLayoutUpdate">
            <StackLayout :row="gridSetting.children.logoSec.row" 
                         :col="gridSetting.children.logoSec.col" 
                         :rowSpan="gridSetting.children.logoSec.rowSpan" 
                         class="home-logo-ctnr">
                <Image class="home-logo" src="~/assets/images/logo.png" stretch="aspectFill" ></Image>
            </StackLayout>
            <StackLayout :row="gridSetting.children.userSec.row" 
                         :col="gridSetting.children.userSec.col" 
                         :rowSpan="gridSetting.children.userSec.rowSpan" 
                         :class="userSetting">
                <UserBlock @userChange="checkUserStatus" />
            </StackLayout>
            <StackLayout :row="gridSetting.children.titleSec.row" 
                           :col="gridSetting.children.titleSec.col" 
                           :colSpan="gridSetting.children.titleSec.colSpan" 
                           class="log-title-ctnr">
                <Label class="log-title" text="charts" />
            </StackLayout>
            <Logs :row="gridSetting.children.logSec.row" 
                  :col="gridSetting.children.logSec.col" 
                  :rowSpan="gridSetting.children.logSec.rowSpan" 
                  :colSpan="gridSetting.children.logSec.colSpan" 
                  class="home-log-ctnr" />
            <StackLayout :row="gridSetting.children.btnSec.row" 
                         :col="gridSetting.children.btnSec.col"
                         :colSpan="gridSetting.children.btnSec.colSpan" 
                         class="home-btn-ctnr" >
                <Button class="home-add" text="NEW CLIENT" @tap="onNewTap"></Button>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import UserBlock from './parts/UserBlock.vue';
    import Logs from './parts/Logs.vue';
    import NewClient from '../general/NewClient.vue';
    
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from 'tns-core-modules/utils/utils';
    import { homeGridChildLandscape, homeGridChildPortrait } from '../../scripts/common';

    export default {
        data() {
            return {
                pageSetting: {
                    class: "page home-page"
                },
                gridSetting: {
                    rows: "auto, auto, *, 250",
                    columns: "*, auto",
                    children: homeGridChildPortrait,
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
        components: {
            Logs,
            UserBlock,
        },
        computed: {
            ...mapGetters([
                'curr_user_idx',
			])
		},
        methods: {
            ...mapActions([
                'loadLocalData',
                'loadOnlineData',
                'deleteActiveLog'
            ]),
            loadLocalJsonFile() {
                const localJsonData = require('@/assets/data/data.json');
                if (localJsonData) {
                    this.loadLocalData(localJsonData);
                }
            },
            checkUserStatus() {
                this.userSetting = (this.curr_user_idx == -1) ? "home-user-ctnr home-user-begin-ctnr" : "home-user-ctnr"
            },
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
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.homeGridRef.nativeView.getMeasuredWidth() );
                const half_width = width / 2;
                const quater_width = width / 4;
                if (width > 1000) {
                    this.pageSetting = {
                        class: "page home-page tablet-landscape"
                    },
                    // this.gridSetting = {
                    //     rows: "80, auto, *",
                    //     columns: `${quater_width}, ${quater_width}, ${half_width}`,
                    //     children: homeGridChildLandscape
                    // };
                    //  this.pageSetting = {
                    //     class: "page home-page"
                    // },
                    this.gridSetting = {
                        rows: "auto, auto, *, 250",
                        columns: "*, *",
                        children: homeGridChildPortrait
                    }
                } else {
                    this.pageSetting = {
                        class: "page home-page"
                    },
                    this.gridSetting = {
                        rows: "auto, auto, *, 250",
                        columns: "*, *",
                        children: homeGridChildPortrait
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>