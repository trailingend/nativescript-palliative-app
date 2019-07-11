<template>
        <ScrollView class="patient-list">
            <RadListView for="patient in logs" 
                         ref="logListView"
                         swipeActions="true"
                         @itemTap="onEditTap"
                         @itemSwipeProgressStarted="onSwipeStarted" >
                <v-template>
                    <FlexboxLayout alignItems="center" class="patient-item">
                        <Image width="50" class="user-head " v-show="!patient.status" src="~/assets/images/progress.png" stretch="aspectFit"></Image>
                        <Image width="50" class="user-head" v-show="patient.status" src="~/assets/images/confirmed.png" stretch="aspectFit"></Image>
                        <StackLayout flexGrow="2">
                            <Label :text="patient.patient" class="patient-text patient-bold"/>
                            <Label :text="`${formatPhoneNum(patient.phone)} | Caller: ${patient.caller}`" class="patient-text"/>                            
                            <Label :text="patient.createdTime" class="patient-text patient-light" />
                        </StackLayout>
                        <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                        <StackLayout class="bar-ctnr"></StackLayout>
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
    // import QuestionPhase2 from '../../triage/QuestionPhase2.vue';
    // import QuestionPhase3 from '../../triage/QuestionPhase3.vue';
    // import ChooseProtocol from '../../documentation/ChooseProtocol.vue';
    // import Action from '../../triage/TakeAction.vue';
    // import Result from '../../triage/Result.vue';

    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    import { openUrl } from 'tns-core-modules/utils/utils';
    import { confirm }  from "tns-core-modules/ui/dialogs";
    import { formatPhoneForDisplay } from '../../../scripts/common';


    export default {
        data() {
            return {
                isSwipeMode: false,
            }
        },
        mounted() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'logs',
                'currLogId'
			])
		},
        methods: {
            ...mapActions([
                'deleteLog',
                'saveActiveLog'
            ]),
            formatPhoneNum(num) {
                return formatPhoneForDisplay(num);
            },
            // navigateToPhase2Question(log_id, q_id) {
            //     // this.$navigateTo(QuestionPhase2, {
            //     //     animated: true,
            //     //     clearHistory: true,
            //     //     props: {
            //     //         log_id: log_id,
            //     //         initial_question_id: q_id
            //     //     }
            //     // });
            // },
            // navigateToPhase3Page(log_id, elem) { // phase3 question, action and choose protocol
            //     this.$navigateTo(elem, {
            //         animated: true,
            //         clearHistory: true,
            //         props: {
            //             log_id: log_id
            //         }
            //     });
            // },
            // preparePhase2Question(log) {
            //     let init_q_id = this.phase_2_question_id;
            //     let next_q_id = this.phase_2_question_id;
            //     if (log.intro_progress.length > 0) {
            //         const log_last = log.intro_progress[log.intro_progress.length - 1];
            //         const branch = this.branches.find(brc => { return brc.answer_id === log_last[1]});
            //         if (branch === undefined) {
            //             console.log("=== Unsync of outcome and progress navigating to phase 2 ===");
            //         } else {
            //             next_q_id = branch.question_id;
            //             // this.navigateToPhase2Question(log.id, next_q_id);
            //         }
            //     } else { 
            //         // this.navigateToPhase2Question(log.id, init_q_id);
            //     }
            // },
            // preparePhase3Question(log_id) {
            //     // this.navigateToPhase3Page(log_id, QuestionPhase3);
            // },
            // prepareActionPage(log_id) {
            //     // this.navigateToPhase3Page(log_id, Action);
            // },
            // prepareChooseProtoPage(log_id) {
            //     // this.navigateToPhase3Page(log_id, ChooseProtocol);
            // },
            // onEditTap(args) {
            //     if (this.isSwipeMode) {
            //         this.isSwipeMode = false;
            //     } else {
            //         const log_idx = args.index;
            //         const log = this.logs[log_idx];
            //         const action_indicator = log.intro_action;
            //         const protocol_indicator = log.protocol_id;
            //         const outcome_indicator = log.intro_outcome;
                    
            //         this.saveActiveLog(log.id);

            //         if (protocol_indicator != -1) {
            //             // do it after complete protocol section
            //         } else if (action_indicator != -1) {
            //             // go to action result
            //         } else if (outcome_indicator != -1) {
            //             const log_last = log.intro_progress[log.intro_progress.length - 1];
            //             console.log("=== in edit log === " + log_last[1] + " " + this.pre_protocol_answer + " " + (log_last[1] == this.pre_protocol_answer));
            //             if (log_last[0] == this.phase_3_question_id) {
            //                 if (log_last[1] == this.pre_protocol_answer) {
            //                     // this.prepareChooseProtoPage(log.id);
            //                 } else {
            //                     // this.prepareActionPage(log.id);
            //                 }
            //             } else {
            //                 // this.preparePhase3Question(log.id);
            //             }
            //         } else {
            //             // this.preparePhase2Question(log);
            //         }
            //     }
                
            // },
            onTouch(args) {
                console.log("=== Log touched === " + args.action);
            },
            onCallTap(id) {
                const log = this.logs.find(elem => { return elem.id === id; });
                const phone_num = log.phone.replace(/-/g, "");
                console.log("=== facetime === " + log.phone);
                openUrl('facetime:' + phone_num);
            },
            onDeleteTap(args) {
                const id = args.object.bindingContext.id;
                confirm({
                    title: "Attention",
                    message: "Confirm you want to delete this patient log?",
                    okButtonText: "Yes",
                    cancelButtonText: "Cancel"
                }).then(isConfirmed => {
                    if (isConfirmed) {
                        console.dir("=== Delete patient === " + id);
                        this.deleteLog(id);
                    } else {
                        console.log("=== no delete ===");
                    }
                });
            },

            onSwipeStarted ({ data, object }) {
                console.log(`Swipe started`);
                const swipeLimits = data.swipeLimits;
                const swipeView = object;
                const rightItem = swipeView.getViewById('delete-view');
                swipeLimits.left = rightItem.getMeasuredWidth() + 10;
                swipeLimits.right = 0;
                // swipeLimits.left = 0;
                // swipeLimits.right = rightItem.getMeasuredWidth();
                swipeLimits.top = 0;
                swipeLimits.bottom = 0;
                swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
                this.$refs.logListView.notifySwipeToExecuteFinished();
                this.isSwipeMode = true;
            },
        },
        
    };
</script>

<style>
</style>