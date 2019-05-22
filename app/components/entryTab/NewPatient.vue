<template>
    <Page class="page new-page">
        <ScrollView>
            <StackLayout class="new-ctnr">
                <Label class="new-q1 new-q" text="Callback number:" textWrap="true"/>
                <TextField class="new-a1 new-a" v-model="c_phone" hint="Enter text..." />
                <Label class="new-q2 new-q" text="Patient name:" textWrap="true"/>
                <TextField class="new-a2 new-a" v-model="c_patient" hint="Enter text..." />
                <Label class="new-q2 new-q" text="Client name:" textWrap="true"/>
                <TextField class="new-a2 new-a" v-model="c_client" hint="Enter text..." />
                <Label class="new-q3 new-q" text="Relation to client:" textWrap="true"/>
                <TextField class="new-a3 new-a" v-model="c_relation" hint="Enter text..." />

                <Button class="" text="Next" @tap="onNavigateForward" />
            </StackLayout>
        </ScrollView>
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
            }
        },
        mounted() {
        },
        components: {
            Question,
        },
        methods: {
            ...mapActions([
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                const dateTime = date + ' ' + time;
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

                this.$navigateTo(Questions, {
                    frame: "frame1",
                });
            },
        }
        
    };
</script>

<style>
</style>