<template>
    <Page class="page home-page">
        <ActionBar title="Dashboard"></ActionBar>

        <GridLayout class="home-ctnr" :rows="gridSetting.rows" 
                                      :columns="gridSetting.columns" 
                                      ref="homeGridRef" 
                                      @layoutChanged="onLayoutUpdate">
            <StackLayout :row="gridSetting.logoSec.row" 
                         :col="gridSetting.logoSec.col" 
                         :rowSpan="gridSetting.logoSec.rowSpan" 
                         class="home-logo-ctnr">
                <Image class="home-logo" src="~/assets/images/logo.png" stretch="aspectFill" ></Image>
            </StackLayout>
            <StackLayout :row="gridSetting.userSec.row" 
                         :col="gridSetting.userSec.col" 
                         :rowSpan="gridSetting.userSec.rowSpan" 
                         class="home-user-ctnr">
                <UserForm />
            </StackLayout>
            <FlexboxLayout :row="gridSetting.titleSec.row" 
                           :col="gridSetting.titleSec.col" 
                           :colSpan="gridSetting.titleSec.colSpan" 
                           flexDirection="column" 
                           class="log-title-ctnr">
                <Label class="log-title" text="Log" />
                <Label class="log-title" text="Progress" />
            </FlexboxLayout>
            <Logs :row="gridSetting.logSec.row" 
                  :col="gridSetting.logSec.col" 
                  :rowSpan="gridSetting.logSec.rowSpan" 
                  :colSpan="gridSetting.logSec.colSpan" 
                  class="home-log-ctnr" />
            <StackLayout :row="gridSetting.btnSec.row" 
                         :col="gridSetting.btnSec.col"
                         :colSpan="gridSetting.btnSec.colSpan" 
                         :class="btnSetting.class" 
                         @tap="onNewTap">
                <Image class="home-add" src="~/assets/images/plus.png" stretch="aspectFit"></Image>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import Logs from './dashboard/Logs.vue';
    import UserForm from './dashboard/UserForm.vue';

    import { mapActions } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                btnSetting: {
                    class: "home-btn-ctnr"
                },
                gridSetting: {
                    rows: "auto, auto, *, 250",
                    columns: "*, *",
                    logoSec: {
                        row: "0",
                        col: "0",
                        rowSpan: "1"
                    },
                    userSec: {
                        row: "0",
                        col: "1",
                        rowSpan: "1"
                    },
                    titleSec: {
                        row: "1",
                        col: "0",
                        colSpan: "2"
                    },
                    logSec: {
                        row: "2",
                        col: "0",
                        rowSpan: "1",
                        colSpan: "2"
                    },
                    btnSec: {
                        row: "3",
                        col: "0",
                        colSpan: "2"
                    }
                }
            }
        },
        mounted() {
            this.loadData();
        },
        components: {
            Logs,
            UserForm,
        },
        computed: {
           
		},
        methods: {
            ...mapActions([
                'loadData'
            ]),
            onNewTap(args) {
                console.log("=== Creating new Patient ===");
                const tabView = args.object.page.frame.parent.parent;
                tabView.selectedIndex = 1;
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.homeGridRef.nativeView.getMeasuredWidth() );
                const half_width = width / 2;
                const quater_width = width / 4;
                if (width > 1000) {
                    this.btnSetting = {
                        class: "home-btn-ctnr tablet-landscape"
                    };
                    this.gridSetting = {
                        rows: "80, auto, *",
                        columns: `${quater_width}, ${quater_width}, ${half_width}`,
                        logoSec: {
                            row: "0",
                            col: "0",
                            rowSpan: "2"
                        },
                        userSec: {
                            row: "0",
                            col: "1",
                            rowSpan: "2"
                        },
                        titleSec: {
                            row: "0",
                            col: "2",
                            colSpan: "1"
                        },
                        logSec: {
                            row: "1",
                            col: "2",
                            rowSpan: "2",
                            colSpan: "1"
                        },
                        btnSec: {
                            row: "3",
                            col: "0",
                            colSpan: "2"
                        }
                    }
                } else {
                    this.btnSetting = {
                        class: "home-btn-ctnr"
                    };
                    this.gridSetting = {
                        rows: "auto, auto, *, 250",
                        columns: "*, *",
                        logoSec: {
                            row: "0",
                            col: "0",
                            rowSpan: "1"
                        },
                        userSec: {
                            row: "0",
                            col: "1",
                            rowSpan: "1"
                        },
                        titleSec: {
                            row: "1",
                            col: "0",
                            colSpan: "2"
                        },
                        logSec: {
                            row: "2",
                            col: "0",
                            rowSpan: "1",
                            colSpan: "2"
                        },
                        btnSec: {
                            row: "3",
                            col: "0",
                            colSpan: "2"
                        }
                    }
                }
            }
        },
        
    };
</script>

<style>
</style>