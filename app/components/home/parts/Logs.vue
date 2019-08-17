<template>
    <StackLayout>
        <ScrollView class="client-list" v-if="logs.length > 0">
            <RadListView for="client in full_logs" 
                         ref="logListView"
                         swipeActions="true"
                         @itemTap="onEditTap"
                         @itemSwipeProgressStarted="onSwipeStarted" >
                <v-template>
                    <FlexboxLayout alignItems="center" class="client-item">
                        <Image width="50" class="user-head " v-show="!client.status" src="~/assets/images/progress.png" stretch="aspectFit"></Image>
                        <Image width="50" class="user-head" v-show="client.status" src="~/assets/images/confirmed.png" stretch="aspectFit"></Image>
                        <StackLayout flexGrow="2">
                            <Label :text="client.client" class="client-text client-bold"/>
                            <Label :text="`${formatPhoneNum(client.phone)} | Caller: ${client.caller}`" class="client-text"/>                            
                            <Label :text="`${client.startTime} | ${client.date} | ${getNurseName(client.nurse)}`" class="client-text client-light" />
                        </StackLayout>
                        <StackLayout alignSelf="flex-start" class="client-tip-ctnr">
                            <Label :text="`deletes in ${client.countdown}`" class="client-text client-light" :color="`${client.color}`" />
                        </StackLayout>
                        <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                        <!-- <StackLayout class="bar-ctnr"></StackLayout>
                        <StackLayout class="facetime-ctnr" @tap="onCallTap(client.id)">
                            <Image class="facetime-icon" width="35" src="~/assets/images/facetime.png" stretch="aspectFit"></Image>
                        </StackLayout> -->
                    </FlexboxLayout>
                </v-template>

                <v-template name="itemswipe">
                    <GridLayout class="swipe-ctnr" columns="*, auto">
                        <Button col="1" id="delete-view" class="delete-btn" text="DELETE" @tap="onDeleteTap"></Button>
                    </GridLayout>
                </v-template>

            </RadListView>
        </ScrollView>
        <Label v-else text="no current chart records" class="home-log-null"/>
    </StackLayout>
</template>

<script lang="ts">
    import Introduction from '../../intro/Introduction.vue';
    import ChooseProtocol from '../../protocols/ChooseProtocol.vue';
    import AssessItems from '../../protocols/AssessItems.vue';
    import AssessOthers from '../../protocols/AssessOthers.vue';
    import Plans from '../../protocols/Plans.vue';
    import Summary from '../../summary/Summary.vue';

    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    import { openUrl } from 'tns-core-modules/utils/utils';
    import { confirm }  from "tns-core-modules/ui/dialogs";
    import { formatPhoneForDisplay, convertMonthToNum, numDaysInMon } from '../../../scripts/common';


    export default {
        data() {
            return {
                full_logs: [],
                isSwiping: false,
            }
        },
        mounted() {
            this.prepareLogs();
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'logs',
                'users',
                'intro'
			])
		},
        methods: {
            ...mapActions([
                'deleteChart',
                'saveActiveChart'
            ]),
            prepareLogs() {
                this.full_logs = this.logs;
                this.full_logs.forEach(log => {
                    log.countdown = this.formatCountdown(log.date);
                    if (log.countdown === 0) {
                        console.log("delete this one " + log.id);
                        this.deleteChart(log.id);
                    }

                    log.color = (log.countdown <= 2) ? "#ff1f00" : "#4b4b4b";
                });
            },
            formatPhoneNum(num) {
                return formatPhoneForDisplay(num);
            },
            formatCountdown(date) {
                const month_title = date.split(" ")[1];
                
                const today = new Date();
                
                let month_diff = today.getMonth() - convertMonthToNum(month_title);
                if (month_diff < 0) month_diff = today.getMonth() + (12 - convertMonthToNum(month_title));
                const date_diff = today.getDate() - parseInt(date.split(" ")[0]);

                let countdown = 0;
                if (month_diff == 0) {
                    countdown = date_diff;
                } else if (month_diff == 1 || month_diff < 0 ) {
                    const old_month_full = numDaysInMon(today.getFullYear())[convertMonthToNum(month_title)]; 
                    const residule = old_month_full - parseInt(date.split(" ")[0]);
                    countdown = residule + today.getDate();
                } else {
                    const old_month_full = numDaysInMon(today.getFullYear())[convertMonthToNum(month_title)];
                    const residule = old_month_full - parseInt(date.split(" ")[0]);
                    countdown = old_month_full * (month_diff - 2) + residule + today.getDate();
                }

                countdown = (countdown > 7) ? 0 : 7 - countdown; 
                return (countdown > 1) ? `${countdown} DAYS` : `TOMORROW`;
            },
            getNurseName(nurse_id) {
                const curr_user = this.users.find((elem) => { return elem.id === nurse_id; });
                return (curr_user) ? curr_user.name : 'Unknown';
            },
            onEditTap(args) {
                this.triage(args.index);
            },
            onTouch(args) {
                console.log("=== Log touched === " + args.action);
            },
            // onCallTap(id) {
            //     const log = this.logs.find(elem => { return elem.id === id; });
            //     const phone_num = log.phone.replace(/-/g, "");
            //     console.log("=== facetime === " + log.phone);
            //     openUrl('facetime:' + phone_num);
            // },
            onDeleteTap(args) {
                const id = args.object.bindingContext.id;
                confirm({
                    title: "Delete Chart",
                    message: "This chart and its contents will be removed from the app. This action is not reversible.",
                    okButtonText: "Delete",
                    cancelButtonText: "Cancel"
                }).then(isConfirmed => {
                    if (isConfirmed) {
                        console.log("=== Delete client === " + id);
                        this.deleteChart(id);
                    } else {
                        console.log("=== no delete ===");
                    }
                });
            },

            onSwipeStarted ({ data, object }) {
                // this.$refs.logListView.notifySwipeToExecuteFinished();
                if (! this.isSwiping) {
                    console.log(`Swipe started`);
                    this.isSwiping = true;
                    const swipeLimits = data.swipeLimits;
                    const swipeView = object;
                    const rightItem = swipeView.getViewById('delete-view');
                    swipeLimits.left = 0;
                    swipeLimits.right = rightItem.getMeasuredWidth();
                    swipeLimits.top = 0;
                    swipeLimits.bottom = 0;
                    swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
                    setTimeout(() => {
                        this.isSwiping = false;
                    }, 500);
                } else {
                    console.log("still swiping");
                }
                
            },
            triage(log_idx) {
                const log = this.logs[log_idx];
                const status = log.status;
                const progress = log.progress;
                if (status) {
                    this.prepareSummary(log.id);
                } else {
                    if (progress[4] === 1) { // if plans filled
                        this.prepareSummary(log.id);
                    } else {
                        if (progress[1] != -1) { // if protocol selected
                            if (progress[3] === 1) { // if others filled, go to plans
                                this.preparePlans(log.id);
                            } else if (progress[3] === 0) { // if items filled, go to others
                                this.prepareOthers(log.id, progress[1]);
                            } else if (progress[2] != -1) { // if items in progress, go to items
                                this.prepareItems(log.id, progress[1]);
                            } else { // if protocol choosed, go to items
                                this.prepareItems(log.id, progress[1]);
                            }
                        } else {
                            let steps_ids = [];
                            this.intro.forEach(elem => { steps_ids.push(elem.id); });
                            if (progress[0] != -1) {
                                const curr_idx = steps_ids.findIndex(elem => elem === progress[0]);
                                if (curr_idx + 1 < steps_ids.length) {
                                    this.prepareIntro(log.id, steps_ids, curr_idx + 1);
                                } else { // if intro filled, go to choose protocol
                                    this.prepareChoose(log.id);
                                }
                            } else {
                                const curr_idx = 0;
                                this.prepareIntro(log.id, steps_ids, curr_idx);
                            }
                        }
                        
                    }
                }
            },
            prepareIntro(log_id, steps_ids, curr_idx) {
                this.$navigateTo(Introduction, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: log_id,
                        step_ids: steps_ids,
                        step_idx: curr_idx,
                        from_summary: false,
                    }
                });
            },
            prepareChoose(log_id) {
                this.$navigateTo(ChooseProtocol, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: log_id,
                        from_summary: false,
                    }
                });
            },
            prepareItems(log_id, protocol_id, letter_id) {
                this.$navigateTo(AssessItems, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: log_id,
                        protocol_id: protocol_id,
                        preset_letter_id: letter_id,
                        from_summary: false,
                    }
                });
            },
            prepareOthers(log_id, protocol_id) {
                this.$navigateTo(AssessOthers, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: log_id,
                        protocol_id: protocol_id,
                        from_summary: false,
                    }
                });
            },
            preparePlans(log_id) {
                this.$navigateTo(Plans, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'fade',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: log_id,
                        from_summary: false,
                    }
                });
            },
            prepareSummary(log_id) {
                this.$navigateTo(Summary, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: 'slideTop',
                        curve: 'easeIn',
                        duration: 300
                    },
                    props: {
                        log_id: log_id,
                        has_prev: false
                    }
                });
            },
        },
        
    };
</script>

<style>
</style>