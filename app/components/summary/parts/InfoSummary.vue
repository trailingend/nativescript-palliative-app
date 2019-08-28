<template>
    <StackLayout class="sum-sec-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-end" justifyContent="space-between" class="sec-title-ctnr">
            <Label text="Client Information" class="sum-sec-title"/>
            <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onEditTap"></Image>
        </FlexboxLayout>
        <GridLayout rows="auto, auto, auto, auto, auto, auto, auto" columns="*" class="sec-content-ctnr">
            <Label row="0" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Client's Name: " />
                    <span :text="client.client" />
                </FormattedString>
            </Label>
            <StackLayout row="1" col="0" class="sum-e-ctnr" :opacity="(can_check && client.client === '') ? 1 : 0"></StackLayout>
            <Label row="0" col="0" class="sum-e" text="Please enter client's first and last name" :opacity="(can_check && client.client === '') ? 1 : 0" />
            <Label row="2" col="0" textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Caller's Name: " />
                    <span :text="getCallerName(client)" />
                </FormattedString>
            </Label>
            <Label row="3" col="0" text="Call-back Number: " textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Call-back Number: " />
                    <span :text="`${formatted_phone}`" />
                </FormattedString>
            </Label>
            <Label row="4" col="0"  textWrap="true" class="sum-text">
                <FormattedString>
                    <span class="sum-bold" text="Caller's relationship to client: " />
                    <span :text="client.relation" />
                </FormattedString>
            </Label>
            <Label row="5" col="0" textWrap="true" class="sum-text sum-separate">
                <FormattedString>
                    <span class="sum-bold" text="Consent to care given and to speak on behalf of client: " />
                    <span text="Yes" />
                </FormattedString>
            </Label>
            <Label row="6" col="0" textWrap="true" class="sum-text sum-separate">
                <FormattedString>
                    <span class="sum-bold" text="General Client Info: " />
                    <span :text="client.info === '' ? 'N/A' : client.info.trim()" />
                </FormattedString>
            </Label>
        </GridLayout>
    </StackLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to display client info section in Summary
     *  [Description] - used in Summary page
     *  @param {client} - local cache of current client document
     *  @param {String} nurse_name - the name of the intake nurse
     *  @param {String} formatted_phone - the formatted call-back number
     *  @prop {String} log_id - the id of the current document
     *  @prop {Boolean} can_check - the variable recprds whether can perform error checking
     * 
     *  =============================================================
     * **/

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
            /**
             *  Function to retrieve client info from data storage
             * **/
            prepareClientInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.client = curr_log;
                    this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                    const curr_user = this.users.find((elem) => { return elem.id === curr_log.nurse; });
                    this.nurse_name = (curr_user) ? curr_user.name : 'Unknown';
                }
            },
            /**
             *  Function to parse caller name
             *  @return {String} caller - name of caller
             * **/
            getCallerName(client) {
                const caller = client.caller;
                return (caller != '') ? caller : 'Anonymous';
            },
            /**
             *  Function to go and edit client info section 
             *  @event checkSwicth - ask parent to re-cehck status of the switch
             * **/
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
                    this.$emit("checkSwitch");
                });
            },
        },
        
    };
</script>