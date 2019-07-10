<template>
    <FlexboxLayout alignItems="center" class="patient-info-ctnr" @tap="onEditTap">
        <Image width="50" class="user-head" src="~/assets/images/head2.png" stretch="aspectFit"></Image>
        <StackLayout flexGrow="2">
            <Label :text="patient.patient" class="patient-text patient-bold"/>
            <Label :text="`${formatted_phone} | Caller: ${patient.caller}`" class="patient-text"/>                            
            <Label :text="patient.createdTime" class="patient-text patient-light" />
        </StackLayout>
        <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
        <StackLayout class="bar-ctnr"></StackLayout>
        <StackLayout class="facetime-ctnr" @tap="onCallTap(patient.id)">
            <Image class="facetime-icon" width="30" src="~/assets/images/facetime.png" stretch="aspectFit"></Image>
        </StackLayout>
    </FlexboxLayout>
</template>

<script lang="ts">
    import EditPatient from '../EditPatient.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { openUrl } from 'tns-core-modules/utils/utils';
    import { formatPhoneForDisplay } from '../../../scripts/common';

    export default {
        data() {
            return {
                patient: {},
                formatted_phone: ''
            }
        },
        mounted() {
            this.preparePatientInfo();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
			]),
		},
        methods: {
            ...mapActions([
            ]),
            preparePatientInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.patient = curr_log;
                    this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                }
            },
            onCallTap(id) {
                const log = this.logs.find(elem => { return elem.id === id; });
                const phone_num = log.phone.replace(/-/g, "");
                console.log("=== facetime === " + log.phone);
                openUrl('facetime:' + phone_num);
            },
            onEditTap() {
                console.log("=== TODO to open edit ===");
                this.$showModal(EditPatient, { 
                    fullscreen: true,
                    props: {
                        log_id: this.log_id
                    }
                });
            }
        },
        
    };
</script>

<style>
</style>