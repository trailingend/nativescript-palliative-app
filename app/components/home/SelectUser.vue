<template>
<Frame id="userFrame">
     <Page class="page select-user-page">
         <GridLayout :class="ctnrSetting"
                     rows="auto, *" columns="*"
                     ref="userSelectGridRef" 
                     @tap="clearTextfieldFocus"
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
                                    @tap="onUserTap(user)" > 
                                    <StackLayout class="select-head"></StackLayout>
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

    export default {
        data() {
            return {
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
                'logs'
			]),
		},
        methods: {
            ...mapActions([
                'activateUser'
            ]),
            onUserTap(user) {
                dialogs.prompt({
                    title: "Verification",
                    message: "Enter your ID:",
                    okButtonText: "confirm",
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
                        parent_modal: this.$modal
                    }
                });
            },
            onCloseTap() {
                this.$modal.close();
            },
            onLayoutUpdate() {
                if (this.$refs.editGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.userSelectGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        ctnrSetting: "select-user-ctnr tablet-landscape"
                    } else {
                        ctnrSetting: "select-user-ctnr"
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>