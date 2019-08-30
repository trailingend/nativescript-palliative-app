<template>
<Frame id="userFrame">
     <Page class="page select-user-page">
         <GridLayout rows="auto, auto, *, auto" columns="*"
                     ref="userSelectGridRef" 
                     :class="ctnrSetting"
                     @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width="30" class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>

            <Label row="1" col="0" class="select-title" text="user information" ></Label>   

            <StackLayout row="2" col="0" rowSpan="1" class="select-content-ctnr">
                <StackLayout v-if="users.length > 0" >
                    <GridLayout rows="auto" columns="*, auto" class="select-text-ctnr">
                        <Label row="0" col="0" colSpan="2" class="select-text" text="select from saved users" ></Label> 
                        <Image row="0" col="1" colSpan="1" class="select-edit-icon" v-if="! canDelete" src="~/assets/images/pen-user.png" stretch="aspectFit" @tap="onEditUserTap"></Image>
                        <Image row="0" col="1" colSpan="1" class="select-edit-icon" v-else src="~/assets/images/done-user.png" stretch="aspectFit" @tap="onEditUserTap"></Image>
                    </GridLayout>
                    
                    <ScrollView class="select-scroll">
                        <StackLayout>
                            <FlexboxLayout flexWrap="wrap" justifyContent="center" alignItems="flex-start" class="select-ppl-ctnr">
                                <StackLayout v-for="user in users" 
                                            :key="user.id" 
                                            class="select-ppl" 
                                            :width="widthSetting" > 
                                            <GridLayout rows="*" columns="*" class="select-head-ctnr">
                                                <StackLayout row="0" column="0" class="select-head" :background="user.color" @tap="onUserTap(user)" ></StackLayout>
                                                <Image row="0" col="0" 
                                                       v-show="canDelete" @tap="onDeleteTap(user)" 
                                                       class="select-head-x" src="~/assets/images/head-x.png" stretch="aspectFit"></Image>
                                            </GridLayout>
                                            <Label class="select-text select-name" :text="user.name" textWrap="true"></Label>
                                </StackLayout>
                            </FlexboxLayout>
                        </StackLayout>
                    </ScrollView>
                </StackLayout>

                <Label v-else class="user-null" text="No Currently saved user"  />
            </StackLayout>

            <StackLayout row="3" col="0" >
                <Label class="select-text select-or" text="or" ></Label> 
                <Button class="form-btn select-add-btn" text="Add new user" @tap="onAddTap" />
            </StackLayout>
        </GridLayout>
    </Page>
</Frame>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Modal to select from an existing users. Also has options to delete user and to add a new user
     *  [Description] - called from Dashboard
     *  [Related] - styles in user.scss
     *  @param {Boolean} canDelete - variable to indicate delete mode/ normal mode
     *  @param {Number} next_color_idx - user avatar's color index in color array
     *  @param {String} widthSetting - width of an user item
     *  @param {Object} ctnrSetting - variable to store screen-size sensitive classnames information 
     * 
     *  =============================================================
     * **/

    import AddUser from './AddUser.vue';
    import LoginUser from './LoginUser.vue';

    import { mapActions, mapGetters } from 'vuex';
    import * as dialogs from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                canDelete: false,
                next_color_idx: 0,
                widthSetting: "20%",
                ctnrSetting: "select-user-ctnr"
            }
        },
        mounted() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'users',
                'logs',
                'curr_user_id'
			]),
		},
        methods: {
            ...mapActions([
                'activateUser',
                'deleteUser'
            ]),
            /**
             *  Function to log in to a user, promping LoginUser page in the same modal frame
             * **/
            onUserTap(user) {
                if (! this.canDelete) {
                    this.$navigateTo(LoginUser, {
                    frame: 'userFrame',
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        parent_modal: this.$modal,
                        selected_user: user
                    }
                });
                }
            },
            /**
             *  Function to open AddUser page in the same modal frame
             * **/
            onAddTap(args) {
                // const page = args.object.page;
                this.$navigateTo(AddUser, {
                    frame: 'userFrame',
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        parent_modal: this.$modal,
                    }
                });
            },
            /**
             *  Function to toggle between deleting mode and normal mode
             * **/
            onEditUserTap() {
                this.canDelete = !this.canDelete;
            },
            /**
             *  Function to delete a user from data storage. Note that current loggedin user cannot be deleted
             * **/
            onDeleteTap(user) {
                if (this.curr_user_id === user.id) {
                    dialogs.alert('This is the current user. Cannot delete. Please log out first.').then(() => {
                        console.log("=== in Select User - cannot delete user ===");
                    });
                } else {
                    dialogs.confirm({
                        title: "About to Delete",
                        message: "Are you sure you want to delete the user?",
                        okButtonText: "Delete",
                        cancelButtonText: "Cancel"
                    }).then(isConfirmed => {
                        if (isConfirmed) {
                            console.log("=== in Select User - delete user === " + user.id);
                            this.deleteUser(user.id);
                        }
                    });
                }
                
            },
            /**
             *  Function to close current modal
             * **/
            onCloseTap() {
                this.$modal.close();
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                if (this.$refs.userSelectGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.userSelectGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        
                        this.ctnrSetting = "select-user-ctnr tablet-landscape";
                        this.widthSetting = "auto";
                    } else {
                        this.ctnrSetting = "select-user-ctnr";
                        this.widthSetting = "20%";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>