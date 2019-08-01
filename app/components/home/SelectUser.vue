<template>
<Frame id="userFrame">
     <Page class="page select-user-page">
         <GridLayout rows="auto, auto, *, auto" columns="*"
                     ref="userSelectGridRef" 
                     @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <Label row="1" col="0" class="select-title" text="user information" ></Label>   
            <StackLayout row="2" col="0" rowSpan="1" :class="ctnrSetting">
                <StackLayout v-if="users.length > 0" class="select-content-ctnr">
                    <Label class="select-text" text="select from saved users" ></Label>   
                    <ScrollView class="select-scroll">
                        <StackLayout>
                            <FlexboxLayout flexWrap="wrap" justifyContent="center" alignItems="flex-start" class="select-ppl-ctnr">
                                <StackLayout v-for="user in users" 
                                            :key="user.id" 
                                            class="select-ppl" 
                                            :width="widthSetting"
                                            @tap="onUserTap(user)"
                                            @longPress="onUserLongPress(user)" > 
                                            <StackLayout class="select-head" :background="user.color"></StackLayout>
                                            <Label class="select-text select-name" :text="user.name" textWrap="true"></Label>
                                </StackLayout>
                            </FlexboxLayout>
                        </StackLayout>
                    </ScrollView>
                </StackLayout>

                <StackLayout v-if="users.length <= 0" class="select-content-ctnr">
                    <Label  text="No Currently saved user" class="user-null" />
                </StackLayout>
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
    import AddUser from './AddUser.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as dialogs from "tns-core-modules/ui/dialogs";
    import * as utils from "tns-core-modules/utils/utils";
    import { userColors } from '../../scripts/common';

    export default {
        data() {
            return {
                next_color_idx: 0,
                widthSetting: "20%",
                ctnrSetting: "select-user-ctnr"
            }
        },
        mounted() {
            this.next_color_idx = this.users.length % userColors.length;
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
            onUserTap(user) {
                dialogs.prompt({
                    title: "Enter Employee ID",
                    okButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    inputType: dialogs.inputType.number
                }).then(result => {
                    if (result.result) {
                        if (result.text == user.id) {
                            this.activateUser(user);
                            this.$modal.close();
                        } else {
                            dialogs.confirm({
                                title: "ID not match",
                                message: "The ID you entered does not match our record.",
                                okButtonText: "OK",
                            });
                        }
                    }
                    
                });
            },
            onAddTap() {
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
                        color_idx: this.next_color_idx,
                    }
                });
            },
            onUserLongPress(user) {
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
            onCloseTap() {
                this.$modal.close();
            },
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