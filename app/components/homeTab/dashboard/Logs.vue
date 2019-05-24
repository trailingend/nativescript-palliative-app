<template>
        <ScrollView class="patient-list">
            <ListView for="patient in logs" @itemTap="onEditTap">
                <v-template>
                    <FlexboxLayout alignItems="stretch" class="patient-item">
                        <Image width="50" class="user-head" v-show="!patient.status" src="~/assets/images/progress.png" stretch="aspectFit"></Image>
                        <Image width="50" class="user-head" v-show="patient.status" src="~/assets/images/confirmed.png" stretch="aspectFit"></Image>
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
    import { dialogLogDelete } from '../../../scripts/common';

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
            ]),
            onEditTap(args) {
                const log_idx = args.index;
                const log_progress = this.logs[log_idx].progress;
                const log_last = log_progress[log_progress.length - 1];
				const q_id = log_last[0];
				const a_id = log_last[1];
                console.dir("=== Edit patient === " + log_last);

				// TODO: proper ways to search for obj
				// var values = Object.keys(json_file).filter(function(x) {
				// 				return json_file[x].id.indexOf(q_id) > -1;
				// 			}).map(function(x) {
				// 				return json_file[x].state;
				// 			});
			},
            onDeleteTap(args) {
                dialogLogDelete(args.object.bindingContext.id);
            }
        },
        
    };
</script>

<style>
</style>