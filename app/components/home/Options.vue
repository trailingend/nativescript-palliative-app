<template>
<Frame id="settingFrame">
     <Page class="page options-page">
         <GridLayout rows="auto, auto, *, auto, auto" columns="*"
                     :class="ctnrSetting"
                     ref="optionsGridRef" 
                     @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <Label row="1" col="0" class="options-title" text="Options" ></Label>   
            <ScrollView row="2" col="0">
                <StackLayout class="options-items-ctnr">
                    <FlexboxLayout class="options-item" flexDirection="row" justifyContent="space-between" alignItems="center" @tap="onTutorialTap">
                        <Label class="options-text" text="View Tutorial" />
                        <Image class="options-arrow" width="20" src="~/assets/images/goto.png" stretch="aspectFit" @tap="onCloseTap"></Image>
                    </FlexboxLayout>
                </StackLayout>
            </ScrollView>
            <Button row="3" col="0" class="form-btn options-logout-btn" text="Logout" v-show="curr_user_id != -1" @tap="onLogoutTap"></Button>  
            <StackLayout row="4" col="0" > 
                <Image width="150" class="options-logo" src="~/assets/images/vch-logo.png" stretch="aspectFit"></Image>
                <Label class="options-credits" text="© 2019 VCH | Powered by Learning Technologies, Clinical Education" />
            </StackLayout>
        </GridLayout>
    </Page>
</Frame>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Modal that displays the options of the app
     *  [Description] - called from Dashboard page
     *  [Related] - styles in options.scss
     *  @param {Object} ctnrSetting - variable to store screen-size sensitive GridLayout information 
     * 
     *  =============================================================
     * **/

    import Tutorial from '../tutorials/Tutorial.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { confirm }  from "tns-core-modules/ui/dialogs";
    

    export default {
        data() {
            return {
                ctnrSetting: "options-ctnr"
            }
        },
        mounted() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'users',
                'curr_user_id',
                'timer',
			]),
		},
        methods: {
            ...mapActions([
                'deactivateUser',
            ]),
            /**
             *  Function to open Tutorial pages
             * **/
            prepareTutorial() {
                this.$showModal(Tutorial, { 
                    fullscreen: true,
                    props: {
                        is_first_time: false,
                    }
                }).then(() => {
                    // // uncomment this line when you want to close Options automatically after closing Tutorials
                    // this.$modal.close();
                });
            },
            /**
             *  Function to terminate any timer that is running
             * **/
            endTimerForUser() {
                console.log("=== Setting === timer stopped");
                clearInterval(this.timer);
            },
            /**
             *  Function to close current modal
             * **/
            onCloseTap() {
                this.$modal.close();
            },
            /**
             *  Function to open tutorial storylines
             * **/
            onTutorialTap() {
                this.prepareTutorial();
            },
            /**
             *  Function to make current user logout
             * **/
            onLogoutTap() {
                const user = this.users.find(elem => elem.id === this.curr_user_id);
                if (user) {
                    confirm({
                        message: `You are logging out for ${user.name}.`,
                        okButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                    }).then((result) => {
                        if (result) {
                            this.endTimerForUser();
                            this.deactivateUser();
                            this.$modal.close();
                        } 
                    });
                } else {
                    console.log("=== no curr user to logout ===")
                }
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                if (this.$refs.optionsGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.optionsGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        
                        this.ctnrSetting = "options-ctnr tablet-landscape";
                        this.widthSetting = "auto";
                    } else {
                        this.ctnrSetting = "options-ctnr";
                        this.widthSetting = "20%";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>