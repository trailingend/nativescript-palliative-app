<template>
     <Page class="page add-user-page">
        <GridLayout rows="auto, *" columns="*" 
                    ref="addUserGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <StackLayout row="0" col="0" rowSpan="2" :class="formSetting.class">
                <Label class="add-user-title" text="Shift information" ></Label>    
                <PreviousNextView>
                <GridLayout rows="auto, auto, auto, auto, auto, auto, auto, auto" columns="*">
                    <Label row="0" col="0" class="add-q1 add-q" text="Full name:" textWrap="true"/>
                    <TextField row="1" col="0" 
                               id="user-add-a1"
                               class="add-a1 add-a" 
                               v-model="u_name"
                               hint="Firstname Lastname"/>
                    <Label row="2" col="0" class="add-q2 add-q" text="Employee ID #:" textWrap="true"/>
                    <TextField row="3" col="0" 
                               id="user-add-a2"
                               class="add-a2 add-a" 
                               v-model="u_id" 
                               hint="Enter your id..."
                               @blur="onIDUpdate" />
                    <Label row="4" col="0" class="add-q3 add-q" text="Shift Ends:" textWrap="true"/>
                    <TimePicker row="5" col="0" class="add-picker" v-model="u_shift_start" />
                    <Label row="6" col="0" class="add-q4 add-q" text="Shift Ends:" textWrap="true"/>
                    <TimePicker row="7" col="0" class="add-picker" v-model="u_shift_end" />
                </GridLayout>
                </PreviousNextView>
                <Button class="form-btn add-user-btn" text="Save" @tap="onSaveTap" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    import { formatShiftTime, userColors } from '../../scripts/common';

    export default {
        data() {
            return {
                u_id: '',
                u_name: '',
                u_shift_start: 'Sun Dec 31 1899 03:01:00 GMT-0800 (PST)',
                u_shift_end: 'Sun Dec 31 1899 03:01:00 GMT-0800 (PST)',

                formSetting: {
                    class: "add-user-ctnr",
                },
            }
        },
        mounted() {
        },
        components: {
        },
        props: ['parent_modal', 'color_idx'],
        computed: {
            ...mapGetters([
			]),
		},
        methods: {
            ...mapActions([
                'saveUserInfo'
            ]),
            onIDUpdate(args) {
                this.u_id = this.u_id.replace(/\D/g, '');
            },
            onSaveTap(args) {
                const item = {
                    id: this.u_id,
                    name: this.u_name,
                    shift_start: formatShiftTime(this.u_shift_start),
                    shift_end: formatShiftTime(this.u_shift_end),
                    color: userColors[this.color_idx],
                }
                this.saveUserInfo(item);
                this.onBackHome();
            },
            onCloseTap() {
                this.onBackHome();
            },
            onBackHome() {
                this.parent_modal.close();
            },
            clearTextfieldFocus(args) {
                const layoutView = args.object;
                layoutView.getViewById("user-add-a1").dismissSoftInput();
                layoutView.getViewById("user-add-a2").dismissSoftInput();
            },
            onLayoutUpdate() {
                if (this.$refs.addUserGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.addUserGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        this.formSetting.class = "add-user-ctnr tablet-landscape";
                    } else {
                        this.formSetting.class = "add-user-ctnr";
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>