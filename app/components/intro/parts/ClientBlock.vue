<template>
    <FlexboxLayout alignItems="center" class="client-info-ctnr" >
        <StackLayout class="facetime-ctnr" @tap="onCallTap(client.id)">
            <Image class="facetime-icon" width="30" src="~/assets/images/darkfacetime.png" stretch="aspectFit"></Image>
        </StackLayout>
        <!-- <StackLayout class="bar-ctnr"></StackLayout> -->
        <StackLayout flexGrow="2" class="client-text-ctnr" @tap="onEditTap">
            <Label :text="client.client" class="client-text client-bold"/>
            <Label :text="`${formatted_phone} | ${client.caller}`" class="client-text"/>                            
            <Label :text="`${client.createdTime} | ${nurse_name}`" class="client-text client-light" />
        </StackLayout>
        <Image class="edit-icon" src="~/assets/images/darkpen.png" stretch="aspectFit" @tap="onEditTap"></Image>
        <StackLayout class="bar-ctnr"></StackLayout>
        <StackLayout class="notes-ctnr" @tap="onNotesTap">
            <Image class="notes-icon" width="30" src="~/assets/images/notes.png" stretch="aspectFit"></Image>
        </StackLayout>
    </FlexboxLayout>
</template>

<script lang="ts">
    import EditClient from '../EditClient.vue';
    import Notes from '../Notes.vue';

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
            onNotesTap(id) {
                let ShowModalOptions = {
                    context: "context",
                    closeCallback: () => console.log("home page modal page closed"),
                    fullscreen: false,
                    ios: {
                        presentationStyle: UIModalPresentationStyle.Popover
                    },
                    props: {
                        log_id: this.log_id,
                    }
                };
                this.$showModal(Notes, ShowModalOptions);
            },
        },
        
    };
</script>

<style>
</style>