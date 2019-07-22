<template>
<Frame id="userFrame">
     <Page class="page select-user-page">
         <GridLayout :class="ctnrSetting"
                     rows="auto, *" columns="*"
                     ref="userSelectGridRef" 
                     @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <StackLayout row="0" col="0" rowSpan="2" class="select-content-ctnr">
                <Label class="select-title" text="user infomation" ></Label>   
                <StackLayout v-if="users.length > 0">
                    <Label class="select-text" text="select from saved users" ></Label>   
                    <FlexboxLayout flexWrap="wrap" justifyContent="center" alignItems="flex-start" class="select-ppl-ctnr">
                        <StackLayout v-for="user in users" 
                                    :key="user.id" 
                                    class="select-ppl" 
                                    :width="widthSetting"
                                    @tap="onUserTap(user)"
                                    @longPress="onUserLongPress(user)" > 
                                    <StackLayout class="select-head" :background="user.color"></StackLayout>
                                    <Label class="select-text select-name" :text="user.name"></Label>
                        </StackLayout>
                    </FlexboxLayout>
                    <Label class="select-text" text="or" ></Label> 
                </StackLayout>
                <Label v-else text="No Currently saved user" class="user-null" />
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
                'curr_user_idx'
			]),
		},
        methods: {
            ...mapActions([
                'activateUser',
                'deleteUser'
            ]),
            onUserTap(user) {
                dialogs.prompt({
                    title: "Verification",
                    message: "Enter your ID:",
                    okButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    inputType: dialogs.inputType.number
                }).then(result => {
                    if (result.text == user.id) {
                        this.activateUser(user);
                        this.$modal.close();
                        console.log("=== User Selected ===");
                    } else {
                        console.log("=== User Not found ===");
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
                if (this.curr_user_idx === this.users.findIndex(elem => { return elem.id === user.id })) {
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