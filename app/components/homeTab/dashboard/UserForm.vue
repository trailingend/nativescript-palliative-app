<template>
     <Page class="page edit-page">
        <GridLayout rows="*" columns="*, auto" class="edit-ctnr" 
                    ref="userEditGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <StackLayout row="0" col="0" :class="formSetting.class">
                <Image class="edit-head" src="~/assets/images/head2.png" stretch="aspectFit" ></Image>                    
                <GridLayout rows="auto, auto, auto, auto" columns="auto, *">
                    <Label row="0" col="0" class="edit-q1 edit-q" text="Name:" textWrap="true"/>
                    <TextField row="0" col="1" 
                               id="user-edit-a1"
                               class="edit-a1 edit-a" 
                               v-model="user.name"
                               hint="Firstname Lastname"/>
                    <Label row="1" col="0" class="edit-q2 edit-q" text="ID #:" textWrap="true"/>
                    <TextField row="1" col="1" 
                               id="user-edit-a2"
                               class="edit-a2 edit-a" 
                               v-model="user.id" 
                               hint="Enter your id..."
                               @blur="onIDUpdate" />
                    <Label row="2" col="0" class="edit-q3 edit-q" text="Shift Ends:" textWrap="true"/>
                    <ListPicker row="3" col="0" colSpan="2" :items="shifts" v-model="user.shift" />

                </GridLayout>
                <Button class="edit-btn" text="Save" @tap="onSaveTap" />
            </StackLayout>
            <StackLayout row="0" col="1" class="edit-title-ctnr">
                <Image width=40 class="edit-close" src="~/assets/images/close.png" stretch="aspectFit" @tap="onClose"></Image>
                <Label class="log-title" text="User" />
                <Label class="log-title" text="Infomation" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                user: {
                    id: '',
                    name: '',
                    shift: '5:30PM'
                },
                formSetting: {
                    class: "edit-form-ctnr",
                },
                shifts: ["9:00PM", "7:00AM", "5:30PM"]
            }
        },
        mounted() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'currUserIdx',
                'users'
			]),
		},
        methods: {
            ...mapActions([
                'saveUserInfo'
            ]),
            onIDUpdate(args) {
                this.user.id = this.user.id.replace(/\D/g, '');
            },
            onSaveTap(args) {
                this.saveUserInfo(this.user);
                this.$modal.close();
                console.log("=== User Info Edited ===");
            },
            onClose() {
                this.$modal.close();
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                layoutView.getViewById("user-edit-a1").dismissSoftInput();
                layoutView.getViewById("user-edit-a2").dismissSoftInput();
            },
            onLayoutUpdate() {
                if (this.$refs.editGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.userEditGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.formSetting.class = "edit-form-ctnr tablet-landscape";
                    } else {
                        this.formSetting.class = "edit-form-ctnr";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>