<template>
    <FlexboxLayout alignItems="center" class="client-info-ctnr" @tap="onEditTap">
        <!-- <Image width="50" class="user-head" src="~/assets/images/head2.png" stretch="aspectFit"></Image> -->
        <StackLayout flexGrow="2" class="client-text-ctnr">
            <Label :text="client.client" class="client-text client-bold"/>
            <Label :text="`${formatted_phone} | ${client.caller}`" class="client-text"/>                            
            <Label :text="`${client.createdTime} | ${nurse_name}`" class="client-text client-light" />
        </StackLayout>
        <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
        <StackLayout class="bar-ctnr"></StackLayout>
        <StackLayout class="facetime-ctnr" @tap="onCallTap(client.id)">
            <Image class="facetime-icon" width="30" src="~/assets/images/facetime.png" stretch="aspectFit"></Image>
        </StackLayout>
    </FlexboxLayout>
</template>

<script lang="ts">
    import EditClient from '../EditClient.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import { openUrl } from 'tns-core-modules/utils/utils';
    import { formatPhoneForDisplay } from '../../../scripts/common';

    export default {
        data() {
            return {
                client: {},
                nurse_name: 'Unknown',
                formatted_phone: ''
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
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'users',
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

                    const curr_user = this.users.find((elem) => { return elem.id === this.client.nurse; });
                    this.nurse_name = (curr_user) ? curr_user.name : 'Unknown';
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
                this.$showModal(EditClient, { 
                    fullscreen: true,
                    props: {
                        log_id: this.log_id,
                    }
                });
            }
        },
        
    };
</script>

<style>
</style>