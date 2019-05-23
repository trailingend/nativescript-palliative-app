<template>
        <ScrollView class="patient-list">
            <ListView for="patient in logs" @itemTap="onItemTap">
                <v-template>
                    <FlexboxLayout alignItems="stretch" class="patient-item">
                        <Image width="50" class="user-head" src="~/assets/images/loading.png" stretch="aspectFit"></Image>
                        <StackLayout flexGrow="2">
                            <Label :text="patient.client" class="patient-name patient-top patient-text"/>
                            <Label :text="patient.phone" class="patient-phone patient-text"/>
                            <Label :text="patient.patient" class="patient-name patient-text"/>
                            <Label :text="patient.createdTime" class="patient-time patient-text" />
                        </StackLayout>
                        <Image class="edit-icon" alignSelf="flex-end" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                        <Button class="patient-btn" text="DELETE" @tap="onDeleteTap"></Button>
                    </FlexboxLayout>
                </v-template>
            </ListView>
        </ScrollView>
    
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
            }
        },
        created() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
				'logs',
			])
		},
        methods: {
            ...mapActions([
                'changePatient'
            ]),
            onItemTap(args) {
				const log_idx = args.index;
				this.changePatient(log_idx);

				const patient_loc = this.logs[log_idx].progressLoc;
				const patient_progress = patient_loc == -1 ? [-1, -1] : this.logs[log_idx].progress[patient_loc];
				const q_id = patient_progress[0];
				const a_id = patient_progress[1];
                console.dir("=== Edit patient === " + patient_progress);

				// TODO: proper ways to search for obj
				// var values = Object.keys(json_file).filter(function(x) {
				// 				return json_file[x].id.indexOf(q_id) > -1;
				// 			}).map(function(x) {
				// 				return json_file[x].state;
				// 			});
			},
            onDeleteTap(args) {
                confirm({
                    title: "Attention",
                    message: "Confirm you want to delete this patient log?",
                    okButtonText: "YES",
                    cancelButtonText: "Cancel"
                }).then(isConfirmed => {
                    if (isConfirmed) {
                        console.dir("=== Delete patient === " + args.object.bindingContext.id);
                    }
                });
            }
        },
        
    };
</script>

<style>
</style>