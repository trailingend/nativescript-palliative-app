<template>
    <StackLayout class="sum-sec-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="space-between">
            <Label text="Client Information" class="sum-sec-title"/>
            <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit" @tap="onEditTap"></Image>
        </FlexboxLayout>
        <GridLayout rows="auto, auto, auto, auto, auto, auto, auto" columns="*, *">
            <Label row="0" col="0" text="Client's Name: " class="sum-text sum-bold"/>
            <Label row="1" col="0" text="Call-back Number: " class="sum-text sum-bold"/>
            <Label row="2" col="0" text="Caller's Name: " class="sum-text sum-bold"/>
            <Label row="3" col="0" text="Relationship to client: " class="sum-text sum-bold"/>
            <Label row="4" col="0" text="Consent to recorded: " class="sum-text sum-bold"/>
            <Label row="5" col="0" text="Intake Nurse " class="sum-text sum-bold"/>
            <Label row="6" col="0" text="Intake Date: " class="sum-text sum-bold"/>
            

            <Label row="0" col="1" :text="client.client" class="sum-text"/>
            <Label row="1" col="1" :text="`${formatted_phone}`" class="sum-text" />
            <Label row="2" col="1" :text="client.caller" class="sum-text"/>  
            <Label row="3" col="1" :text="client.relation" class="sum-text"/> 
            <Label row="4" col="1" text="Yes" class="sum-text" />                       
            <Label row="5" col="1" :text="nurse_name" class="sum-text" />
            <Label row="6" col="1" :text="client.createdTime" class="sum-text" />
            
        </GridLayout>
    </StackLayout>
</template>

<script lang="ts">
    import EditClient from '../../intro/EditClient.vue';

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