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
    import EditClient from '../EditClient.vue';
    import Catalogue from '../Catalogue.vue';
    import Notes from '../Notes.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
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
            prepareClientInfo() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    this.client = curr_log;
                    this.formatted_phone = formatPhoneForDisplay(curr_log.phone);
                    this.nurse_initials = formatUsernameForDisplay(curr_log.nurseFullname);
                    this.countProtocols();
                }
            },
            getCallerName(client) {
                const caller = client.caller;
                return (caller != '') ? caller : 'Anonymous';
            },
            getClientName(client) {
                const client_name = client.client;
                return (client_name != '') ? client_name : 'John Doe';
            },
            countProtocols() {
                let count_p = 0;
                this.protocols.forEach(elem => {
                    if (this.checkOneProtocol(elem.id)) count_p = count_p + 1;
                });
                this.count_protocols = count_p;
            },
            checkOneProtocol(p_id) {
                const log = this.logs.find(elem => { return elem.id === this.log_id; });
                const p_items = log.items_answers.find(elem => { return elem.id === p_id; });
                const p_others = log.others_answers.find(elem => { return elem.id === p_id; });
                return p_items != undefined || p_others != undefined;
            },
            onCallTap(id) {
                const curr_log = this.logs.find(elem => { return elem.id === this.log_id; });
                const phone_num = curr_log.phone.replace(/-/g, "");
                console.log("=== facetime === " + curr_log.phone);
                openUrl('facetime:' + phone_num);
            },
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
            onProtoTap() {
                this.$showModal(Catalogue, {
                    fullscreen: true,
                    props: {
                        log_id: this.log_id,
                    },
                }).then(data => {
                    this.countProtocols();
                    console.log("from proto sewlection " + data);
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