<template>
<Frame id="settingFrame">
     <Page class="page settings-page">
         <GridLayout rows="auto, auto, *, auto, auto" columns="*"
                     :class="ctnrSetting"
                     ref="settingsGridRef" 
                     @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <Label row="1" col="0" class="settings-title" text="settings" ></Label>   
            <ScrollView row="2" col="0">
                <StackLayout class="settings-items-ctnr">
                    <FlexboxLayout class="settings-item" flexDirection="row" justifyContent="space-between" alignItems="center" @tap="onTutorialTap">
                        <Label class="settings-text" text="Tutorial" />
                        <Image class="settings-arrow" width="20" src="~/assets/images/goto.png" stretch="aspectFit" @tap="onCloseTap"></Image>
                    </FlexboxLayout>
                </StackLayout>
            </ScrollView>
            <Image row="3" col="0" width="300" class="settings-logo" src="~/assets/images/vch-logo.png" stretch="aspectFit"></Image>
            <Label row="4" col="0" class="settings-logout" text="Logout" v-show="curr_user_id != -1" @tap="onLogoutTap"></Label>   
        </GridLayout>
    </Page>
</Frame>
</template>

<script lang="ts">
    import Tutorial from '../tutorials/Tutorial.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { confirm }  from "tns-core-modules/ui/dialogs";
    

    export default {
        data() {
            return {
                ctnrSetting: "settings-ctnr"
            }
        },
        mounted() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'users',
                'curr_user_id'
			]),
		},
        methods: {
            ...mapActions([
                'deactivateUser',
            ]),
            prepareTutorial() {
                console.log("go to tutorial")
                this.$showModal(Tutorial, { 
                    fullscreen: true,
                    props: {
                        is_first_time: false,
                    }
                }).then(() => {
                    this.$modal.close();
                });
            },
            onCloseTap() {
                this.$modal.close();
            },
            onTutorialTap() {
                this.prepareTutorial();
            },
            onLogoutTap() {
                const user = this.users.find(elem => elem.id === this.curr_user_id);
                if (user) {
                    confirm({
                        message: `You are logging out for ${user.name}.`,
                        okButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                    }).then((result) => {
                        if (result) {
                            this.deactivateUser();
                            this.$modal.close();
                        } 
                    });
                } else {
                    console.log("=== no curr user to logout ===")
                }
            },
            onLayoutUpdate() {
                if (this.$refs.settingsGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.settingsGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        
                        this.ctnrSetting = "settings-ctnr tablet-landscape";
                        this.widthSetting = "auto";
                    } else {
                        this.ctnrSetting = "settings-ctnr";
                        this.widthSetting = "20%";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>