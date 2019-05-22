<template>
    <Page class="page new-page">
        <ActionBar title="Dashboard"></ActionBar>
        <GridLayout rows="*" columns="*, auto" class="new-ctnr">
            <StackLayout row="0" col="0" class="new-form-ctnr">
                <Image class="new-head" src="~/assets/images/head2.png" stretch="aspectFit" ></Image>                    
                <GridLayout rows="auto, auto, auto, auto" columns="auto, *">
                    <Label row="0" col="0" class="new-q1 new-q" text="Callback #:" textWrap="true"/>
                    <TextField row="0" col="1" class="new-a1 new-a" v-model="c_phone" hint="Enter text..." />
                    <Label row="1" col="0" class="new-q2 new-q" text="Client name:" textWrap="true"/>
                    <TextField row="1" col="1" class="new-a2 new-a" v-model="c_client" hint="Enter text..." />
                    <Label row="2" col="0" class="new-q2 new-q" text="Patient name:" textWrap="true"/>
                    <TextField row="2" col="1" class="new-a2 new-a" v-model="c_patient" hint="Enter text..." />
                    <Label row="3" col="0" class="new-q3 new-q" text="Relation to client:" textWrap="true"/>
                    <TextField row="3" col="1" class="new-a3 new-a" v-model="c_relation" hint="Enter text..." />
                </GridLayout>
                <Label class="new-q new-consent-title" text="consent" textWrap="true"/>
                <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Label class="new-q new-consent-body" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." textWrap="true"/>
                    <Switch v-model="is_consented" />
                </FlexboxLayout>
                <Button class="new-btn" text="Continue" @tap="onNavigateForward" />
            </StackLayout>
            <StackLayout row="0" col="1" class="new-title-ctnr">
                <Label class="log-title" text="Patient" />
                <Label class="log-title" text="Log" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import { mapActions } from 'vuex';

    import Question from './Question.vue';
        
    export default {
        data() {
            return {
                c_phone: '',
                c_patient: '',
                c_client: '',
                created_time: '',
                is_consented: false
            }
        },
        mounted() {
        },
        components: {
            Question,
        },
        methods: {
            ...mapActions([
                'saveClientInfo',
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;
                this.created_time = dateTime;
            },
            onNavigateForward(args) {
                const client_phone = (this.c_phone === '') ? '888-888-8888' : this.c_phone;
                const client_client = (this.c_client === '') ? 'Anonymous' : this.c_client;
                const client_patient = (this.c_patient === '') ? 'John Dow' : this.c_patient;
                const entry = {
                    phone: client_phone,
                    client: client_name,
                    patient: patient_name,
                    createdTime: this.created_time,
                    relation: this.c_relation,
                    progressLoc: -1,
                    progress: []
                };
                this.saveClientInfo(entry);
            },
        }
        
    };
</script>

<style>
</style>