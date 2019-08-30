<template>
    <FlexboxLayout alignItems="stretch" class="client-info-ctnr" >
        <StackLayout class="facetime-ctnr" @tap="onCallTap(client.id)">
            <Image class="facetime-icon" width="35" src="~/assets/images/darkfacetime.png" stretch="aspectFit"></Image>
        </StackLayout>
        <StackLayout class="bar-ctnr"></StackLayout>
        <StackLayout flexGrow="2" class="client-text-ctnr" @tap="onEditTap">
            <Label :text="getClientName(client)" class="client-text client-bold"/>
            <Label :text="`${formatted_phone} | CALLER: ${getCallerName(client)}`" class="client-text"/>                            
            <Label :text="`${client.startTime} | ${client.date} | ${nurse_initials}`" class="client-text client-light" />
        </StackLayout>
        <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onEditTap"></Image>
        <StackLayout v-show="has_proto" class="bar-ctnr"></StackLayout>
        <StackLayout v-show="has_proto" class="op-ctnr proto-ctnr" @tap="onProtoTap">
            <Label class="op-text" text="protocols"></Label>
            <Label class="op-text" :text="`(${count_protocols})`"></Label>
        </StackLayout>
        <StackLayout class="bar-ctnr"></StackLayout>
        <StackLayout class="op-ctnr notes-ctnr" @tap="onNotesTap">
            <Label class="op-text" text="Notes"></Label>
        </StackLayout>
    </FlexboxLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to show basic client information of current document. Thsi component allows facetiming, editing client information, navigating between protocols, adding additioanl notes
     *  [Description] - used in every client document related pages.
     *  [Related] - styles in clientBlock.scss
     *  @param {Object} client - the current client object
     *  @param {String} formatted_phone - the formatted phone number
     *  @param {String} nurse_initials - the first name and initial of last name of client
     *  @param {Number} count_protocols - number of protocols saved
     *  @prop {String} log_id - id the current client document
     *  @prop {Boolean} has_proto - variable check whether to display protocol navigation button
     * 
     *  =============================================================
     * **/

    import EditClient from '../EditClient.vue';
    import Catalogue from '../Catalogue.vue';
    import Notes from '../Notes.vue';

    import { mapActions, mapGetters } from 'vuex';
    import { openUrl } from 'tns-core-modules/utils/utils';
    import { formatPhoneForDisplay, formatUsernameForDisplay } from '../../../scripts/common';

    export default {
        name: 'ClientBlock',
        data() {
            return {
                client: {},
                formatted_phone: '',
                nurse_initials: '',
                count_protocols: 1,
            }
        },
        mounted() {
            this.prepareClientInfo();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            has_proto: {
                type: Boolean,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'users',
                'protocols'
            ]),
		},
        methods: {
            ...mapActions([
            ]),
            /**
             *  Function to retrieve client information from data storage
             * **/
            prepareClientInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.client = curr_log;
                    this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                    this.nurse_initials = formatUsernameForDisplay(curr_log.nurseFullname);
                    this.countProtocols();
                }
            },
            /**
             *  Function to parse caller's name
             *  @param {Object} client - the client information object
             * **/
            getCallerName(client) {
                const caller = client.caller;
                return (caller != '') ? caller : 'Anonymous';
            },
            /**
             *  Function to parse client's name
             *  @param {Object} client - the client information object
             * **/
            getClientName(client) {
                const client_name = client.client;
                return (client_name != '') ? client_name : 'John Doe';
            },
            /**
             *  Function to count number of protocols
             * **/
            countProtocols() {
                let count_p = 0;
                this.protocols.forEach(elem => {
                    if (this.checkOneProtocol(elem.id)) count_p = count_p + 1;
                });
                this.count_protocols = count_p;
            },
            /**
             *  Function to check whether the protocol has any response saved
             *  @param {Number} p_id - the id of protocol to check
             *  @return {Boolean} has_response
             * **/
            checkOneProtocol(p_id) {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_items = log.items_answers.find(elem => { return elem.id === p_id; });
                const p_others = log.others_answers.find(elem => { return elem.id === p_id; });
                return p_items != undefined || p_others != undefined;
            },
            /**
             *  Function to open Facetime
             *  @param {String} id - id of client to call
             * **/
            onCallTap(id) {
                const curr_log = this.logs.find(elem => { return elem.id === this.log_id; });
                const phone_num = curr_log.phone.replace(/-/g, "");
                console.log("=== facetime === " + curr_log.phone);
                openUrl('facetime:' + phone_num);
            },
            /**
             *  Function to open edit client information modal
             * **/
            onEditTap() {
                this.$showModal(EditClient, { 
                    fullscreen: true,
                    props: {
                        log_id: this.log_id,
                    }
                }).then(() => {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    if (curr_log) {
                        this.client = curr_log;
                        this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                    }
                });
            },
            /**
             *  Function to open Note modal
             * **/
            onNotesTap() {
                this.$showModal(Notes, {
                    fullscreen: false,
                    ios: {
                        presentationStyle: UIModalPresentationStyle.Popover
                    },
                    props: {
                        log_id: this.log_id,
                    }
                });
            },
            /**
             *  Function to open protocol menu
             * **/
            onProtoTap() {
                this.$showModal(Catalogue, {
                    fullscreen: true,
                    props: {
                        log_id: this.log_id,
                    },
                }).then(data => {
                    this.countProtocols();
                    if (data != -1) {
                        this.$emit('goToProtocol', data);
                    }
                });;
            }
        },
        
    };
</script>

<style>
</style>