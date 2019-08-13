<template>
    <StackLayout class="sum-sec-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-end" justifyContent="space-between" class="sec-title-ctnr">
            <Label text="Client Information" class="sum-sec-title"/>
            <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onEditTap"></Image>
        </FlexboxLayout>
        <GridLayout rows="auto, auto, auto, auto, auto, auto, auto, auto" columns="*, *" class="sec-content-ctnr">
            <Label row="0" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Intake Nurse: " />
                    <span :text="nurse_name" />
                </FormattedString>
            </Label>
            <Label row="1" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Intake Date: " />
                    <span :text="client.createdTime.split(' | ')[1].split(' / ').join(' ')" />
                </FormattedString>
            </Label>
            <Label row="2" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Intake Start Time: " />
                    <span :text="client.createdTime.split(' | ')[0]" />
                </FormattedString>
            </Label>
            <Label row="3" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Intake End Time: " />
                    <span text="- -" />
                </FormattedString>
            </Label>
            
            <Label row="0" col="1" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Client's Name: " />
                    <span :text="client.client" />
                </FormattedString>
            </Label>
            <Label row="1" col="1" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Caller's Name: " />
                    <span :text="client.caller" />
                </FormattedString>
            </Label>
            <Label row="2" col="1" text="Call-back Number: " textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Call-back Number: " />
                    <span :text="`${formatted_phone}`" />
                </FormattedString>
            </Label>
            <Label row="3" col="1"  textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Caller's relationship to client: " />
                    <span :text="client.relation" />
                </FormattedString>
            </Label>
            
            <Label row="4" col="0" colSpan="2" textWrap="true" class="sum-text sum-separate">
                <FormattedString>
                    <span class="sum-bold" text="Consent to care given and to speak on behalf of client: " />
                    <span text="Yes" />
                </FormattedString>
            </Label>
            <Label row="5" col="0" colSpan="2" textWrap="true" class="sum-text sum-separate">
                <FormattedString>
                    <span class="sum-bold" text="General Client Info: " />
                    <span :text="client.info === '' ? 'N/A' : client.info.trim()" />
                </FormattedString>
            </Label>
            
        </GridLayout>
    </StackLayout>
</template>

<script lang="ts">
    import EditClient from '../../general/EditClient.vue';

    import { mapGetters } from 'vuex';
    import { formatPhoneForDisplay } from '../../../scripts/common';

    export default {
        data() {
            return {
                client: {},
                nurse_name: 'Unknown',
                formatted_phone: ''
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
                    this.nurse_name = (curr_user) ? curr_user.name : 'Unknown';
                }
            },
            onEditTap() {
                this.$showModal(EditClient, { 
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
                        if (curr_log.nurse === '') {
                            this.nurse_name = 'Unknown';
                        } else {
                            this.nurse_name = (curr_user) ? curr_user.name : curr_log.nurse;
                        }
                    }
                });
            },
        },
        
    };
</script>