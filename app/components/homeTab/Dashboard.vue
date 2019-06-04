<template>
    <Page :class="pageSetting.class">
        <ActionBar title="Dashboard"></ActionBar>

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
                         class="home-user-ctnr">
                <UserForm />
            </StackLayout>
            <FlexboxLayout :row="gridSetting.children.titleSec.row" 
                           :col="gridSetting.children.titleSec.col" 
                           :colSpan="gridSetting.children.titleSec.colSpan" 
                           flexDirection="column" 
                           class="log-title-ctnr">
                <Label class="log-title" text="Log" />
                <Label class="log-title" text="Progress" />
            </FlexboxLayout>
            <Logs :row="gridSetting.children.logSec.row" 
                  :col="gridSetting.children.logSec.col" 
                  :rowSpan="gridSetting.children.logSec.rowSpan" 
                  :colSpan="gridSetting.children.logSec.colSpan" 
                  class="home-log-ctnr" />
            <StackLayout :row="gridSetting.children.btnSec.row" 
                         :col="gridSetting.children.btnSec.col"
                         :colSpan="gridSetting.children.btnSec.colSpan" 
                         class="home-btn-ctnr" 
                         @tap="onNewTap">
                <Image class="home-add" src="~/assets/images/plus.png" stretch="aspectFit"></Image>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import Logs from './dashboard/Logs.vue';
    import NewPatient from '../logTab/NewPatient.vue';
    import UserForm from './dashboard/UserForm.vue';

    import { mapActions } from 'vuex';
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
                    columns: "*, *",
                    children: homeGridChildPortrait,
                }
            }
        },
        created() {
            this.loadLocalJsonFile();
        },
        mounted() {
            this.loadOnlineData();
        },
        components: {
            Logs,
            UserForm,
        },
        computed: {

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
            onNewTap(args) {
                console.log("=== Creating new Patient ===");
                this.deleteActiveLog();
                this.$navigateTo(NewPatient, {
                    frame: "logFrame",
                    clearHistory: true
                });
                const tabView = args.object.page.frame.parent.parent;
                tabView.selectedIndex = 1;
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.homeGridRef.nativeView.getMeasuredWidth() );
                const half_width = width / 2;
                const quater_width = width / 4;
                if (width > 1000) {
                    this.pageSetting = {
                        class: "page home-page tablet-landscape"
                    },
                    this.gridSetting = {
                        rows: "80, auto, *",
                        columns: `${quater_width}, ${quater_width}, ${half_width}`,
                        children: homeGridChildLandscape
                    };
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
            }
        },
        
    };
</script>

<style>
</style>