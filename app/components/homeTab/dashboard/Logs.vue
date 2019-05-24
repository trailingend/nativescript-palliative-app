<template>
        <ScrollView class="patient-list">
            <RadListView for="patient in logs" 
                         @itemTap="onEditTap"
                         swipeActions="true"
                         @itemSwipeProgressStarted="onSwipeStarted" >
                <v-template>
                    <FlexboxLayout alignItems="stretch" class="patient-item">
                        <Image width="50" class="user-head " v-show="!patient.status" src="~/assets/images/progress.png" stretch="aspectFit"></Image>
                        <Image width="50" class="user-head" v-show="patient.status" src="~/assets/images/confirmed.png" stretch="aspectFit"></Image>
                        <StackLayout flexGrow="2">
                            <Label :text="patient.client" class="patient-name patient-top patient-text"/>
                            <Label :text="patient.phone" class="patient-phone patient-text"/>
                            <Label :text="patient.patient" class="patient-name patient-text"/>
                            <Label :text="patient.createdTime" class="patient-time patient-text" />
                        </StackLayout>
                        <Image class="edit-icon" alignSelf="flex-end" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                        <StackLayout class="facetime-ctnr" @tap="onCallTap(patient.id)">
                            <Image class="facetime-icon" width="30" src="~/assets/images/facetime.png" stretch="aspectFit"></Image>
                        </StackLayout>
                    </FlexboxLayout>
                </v-template>

                <v-template name="itemswipe">
                    <GridLayout class="swipe-ctnr" columns="auto">
                        <Button id="delete-view" class="patient-btn" text="DELETE" @tap="onDeleteTap"></Button>
                    </GridLayout>
                </v-template>

            </RadListView>
        </ScrollView>
    
</template>

<script lang="ts">
    import Question from '../../logTab/Question.vue';
    import Result from '../../logTab/Result.vue';

    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    import { openUrl } from 'tns-core-modules/utils/utils';
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
                'intro_question_id',
                'intro_outcomes'
			])
		},
        methods: {
            ...mapActions([
                'deleteLog'
            ]),
            onEditTap(args) {
                const log_idx = args.index;
                const log_id = this.logs[log_idx].id;
                const log_progress = this.logs[log_idx].progress;
                let q_id = this.intro_question_id;
                if (log_progress.length > 0) {
                    const log_last = log_progress[log_progress.length - 1];
                    q_id = log_last[0];
                    console.log("=== to edit record === " + log_last);
                    if (log_last[1] == -1) {
                        const outcome = this.intro_outcomes.find(out => { return out.id === log_last[0]});
                        this.$navigateTo(Result, {
                            frame: "logFrame",
                            animated: false,
                            props: {
                                intro_outcome: outcome,
                                log_id: log_id
                            }
                        });
                    } else {
                        this.$navigateTo(Question, {
                            frame: "logFrame",
                            animated: false,
                            clearHistory: true,
                            props: {
                                log_id: log_id,
                                intro_question_id: q_id
                            }
                        });
                    }
                } else {
                    this.$navigateTo(Question, {
                        frame: "logFrame",
                        animated: false,
                        clearHistory: true,
                        props: {
                            log_id: log_id,
                            intro_question_id: q_id
                        }
                    });
                }
                
                // navigate to second tabview
                const tabView = args.object.page.frame.parent.parent;
                tabView.selectedIndex = 1;
            },
            onCallTap(id) {
                const log = this.logs.find(elem => { return elem.id === id; });
                const phone_num = log.phone.replace(/-/g, "");
                console.log("=== facetime === " + log.phone);
                openUrl('facetime:' + phone_num);
            },
            onDeleteTap(args) {
                dialogLogDelete(args.object.bindingContext.id);
            },

            onSwipeStarted ({ data, object }) {
                console.log(`Swipe started`);
                const swipeLimits = data.swipeLimits;
                const swipeView = object;
                const rightItem = swipeView.getViewById('delete-view');
                swipeLimits.left = rightItem.getMeasuredWidth() + 10;
                swipeLimits.right = 0;
                swipeLimits.top = 0;
                swipeLimits.bottom = 0;
                swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
            },
        },
        
    };
</script>

<style>
</style>