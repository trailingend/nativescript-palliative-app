<template>
    <StackLayout class="sum-sec-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-end" justifyContent="space-between" class="sec-title-ctnr" >
            <Label text="Call Information" class="sum-sec-title"/>
            <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onEditTap"></Image>
        </FlexboxLayout>
        <GridLayout rows="auto, auto, auto, auto, auto, auto" columns="*, *" class="sec-content-ctnr" @tap="onEditTap">
            <Label row="0" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <Span class="sum-bold" text="Call Start Time: " />
                    <Span :text="client.startTime" />
                </FormattedString>
            </Label>
            <StackLayout row="1" col="0" class="sum-e-ctnr" opacity="0"></StackLayout>
            <Label row="2" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <Span class="sum-bold" text="Call End Time: " />
                    <Span :text="end_time" />
                </FormattedString>
            </Label>
            <StackLayout row="3" col="0" class="sum-e-ctnr" :opacity="(can_check && end_time === '') ? 1 : 0" />
            <Label row="2" col="0" class="sum-e" text="Please enter time" :opacity="(can_check && end_time === '') ? 1 : 0" />
                        
            <Label row="0" col="1" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Date: " />
                    <span :text="client.date" />
                </FormattedString>
            </Label>
            <StackLayout row="1" col="1" class="sum-e-ctnr" opacity="0"></StackLayout>
            <Label row="2" col="1" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Intake Nurse ID: " />
                    <span :text="nurse_id" />
                </FormattedString>
            </Label>
            <StackLayout row="3" col="1" class="sum-e-ctnr" :opacity="(can_check && nurse_id === '') ? 1 : 0"></StackLayout>
            <Label row="2" col="1" class="sum-e" text="Please enter ID" :opacity="(can_check && nurse_id === '') ? 1 : 0" />
            
            <Label row="4" col="1" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Intake Nurse Name: " />
                    <span :text="nurse_name" />
                </FormattedString>
            </Label>
            <StackLayout row="5" col="1" class="sum-e-ctnr" :opacity="(can_check && nurse_id === '') ? 1 : 0"></StackLayout>
            <Label row="4" col="1" class="sum-e" text="Please enter Name" :opacity="(can_check && nurse_name === '') ? 1 : 0" />
        </GridLayout>
    </StackLayout>
</template>

<script lang="ts">
    import EditCallInfo from '../EditCallInfo.vue';

    import { mapGetters } from 'vuex';
    import { formatPhoneForDisplay } from '../../../scripts/common';

    export default {
        data() {
            return {
                client: {},
                end_time: '',
                nurse_id: '',
                nurse_name: '',
                formatted_phone: '',
            }
        },
        created() {
            this.prepareClientInfo();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            can_check: {
                type: Boolean,
                required:true
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'users'
			]),
		},
        methods: {
            prepareClientInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.client = curr_log;
                    this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                    const curr_user = this.users.find((elem) => { return elem.id === curr_log.nurse; });
                    this.end_time = curr_log.endTime;
                    this.nurse_id = curr_log.nurseID;
                    this.nurse_name = curr_log.nurseFullname;
                }
            },
            onEditTap() {
                this.$showModal(EditCallInfo, { 
                    fullscreen: true,
                    props: {
                        log_id: this.log_id,
                    }
                }).then(() => {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    const curr_user = this.users.find((elem) => { return elem.id === curr_log.nurse; });
                    if (curr_log) {
                        this.client = curr_log;
                        this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                        this.end_time = curr_log.endTime;
                        this.nurse_id = curr_log.nurseID;
                        this.nurse_name = curr_log.nurseFullname;
                        this.$emit("canSwitch");
                    }
                });
            },
        },
        
    };
</script>