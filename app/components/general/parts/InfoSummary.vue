<template>
    <StackLayout class="sum-sec-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="space-between">
            <Label text="Client Information" class="sum-sec-title"/>
            <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
        </FlexboxLayout>
        <GridLayout rows="auto, auto, auto, auto" columns="auto, *">
            <Label row="0" col="0" text="Patient: " class="sum-text sum-bold"/>
            <Label row="1" col="0" text="Caller: " class="sum-text sum-bold"/>
            <Label row="2" col="0" text="Phone: " class="sum-text sum-bold"/>
            <Label row="3" col="0" text="Date: " class="sum-text sum-bold"/>
            <Label row="0" col="1" :text="patient.patient" class="sum-text"/>
            <Label row="1" col="1" :text="patient.caller" class="sum-text"/>                            
            <Label row="2" col="1" :text="`${formatted_phone}`" class="sum-text" />
            <Label row="3" col="1" :text="patient.createdTime" class="sum-text" />
        </GridLayout>
    </StackLayout>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { formatPhoneForDisplay } from '../../../scripts/common';

    export default {
        data() {
            return {
                patient: {},
                formatted_phone: ''
            }
        },
        created() {
            this.preparePatientInfo();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'logs',
			]),
		},
        methods: {
            preparePatientInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.patient = curr_log;
                    this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                }
            },
        },
        
    };
</script>