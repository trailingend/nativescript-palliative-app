<template>
    <Page :class="pageSetting.class">
        <GridLayout class="home-ctnr" rows="auto, auto, *, 250" 
                                      columns="*, auto" 
                                      ref="homeGridRef" 
                                      @layoutChanged="onLayoutUpdate">
            <StackLayout row="0" col="0" class="home-logo-ctnr">
                <Image class="home-logo" src="~/assets/images/logo.png" stretch="aspectFill" ></Image>
            </StackLayout>
            <StackLayout row="0" col="1" :class="userSetting" orientation="horizontal">
                <Image class="home-setting" width="35" height="35" src="~/assets/images/union.png" stretch="aspectFill" @tap="onSettingTap"></Image>
                <UserBlock @userChange="checkUserStatus" />
            </StackLayout>
            <StackLayout row="1" col="0" colSpan="3" class="log-title-ctnr">
                <Label class="log-title" text="charts" />
            </StackLayout>
            <Logs row="2" col="0" rowSpan="2" colSpan="3" class="home-log-ctnr" />
            <StackLayout row="3" col="0" colSpan="3" class="home-btn-ctnr" >
                <Button class="home-add" text="NEW CLIENT" @tap="onNewTap"></Button>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import UserBlock from './parts/UserBlock.vue';
    import Logs from './parts/Logs.vue';
    import NewClient from '../intro/NewClient.vue';
    
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from 'tns-core-modules/utils/utils';

    export default {
        data() {
            return {
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
            // this.loadOnlineData();
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
                'deleteActiveChart'
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
                this.deleteActiveChart();
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
            onSettingTap() {

            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.homeGridRef.nativeView.getMeasuredWidth() );
                const half_width = width / 2;
                const quater_width = width / 4;
                if (width > 1000) {
                    this.pageSetting = {
                        class: "page home-page tablet-landscape"
                    }
                } else {
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