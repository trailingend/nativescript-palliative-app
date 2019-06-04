<template>
    <FlexboxLayout alignItems="stretch" class="q-patient-ctnr" @tap="onEditTap">
        <Image width="50" class="user-head" src="~/assets/images/head2.png" stretch="aspectFit"></Image>
        <StackLayout flexGrow="2">
            <Label :text="patient.client" class="patient-name patient-top patient-text"/>
            <Label :text="formatted_phone" class="patient-phone patient-text"/>
            <Label :text="patient.patient" class="patient-name patient-text"/>
            <Label :text="patient.createdTime" class="patient-time patient-text" />
        </StackLayout>
        <Image class="edit-icon" alignSelf="flex-end" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
    </FlexboxLayout>
</template>

<script lang="ts">
    import EditPatient from '../EditPatient.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
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
            onEditTap() {
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