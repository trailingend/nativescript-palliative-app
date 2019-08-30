<template>
    <StackLayout>
        <ScrollView class="client-list" v-if="logs.length > 0">
            <RadListView for="client in full_logs" 
                         ref="logListView"
                         swipeActions="true"
                         @itemTap="onEditTap"
                         @itemSwipeProgressStarted="onSwipeStarted" >
                <v-template>
                    <GridLayout rows="auto" columns="auto, *, auto, auto" class="client-item">
                        <Image row="0" col="0" width="50" class="user-head " v-show="!client.status" src="~/assets/images/progress.png" stretch="aspectFit"></Image>
                        <Image row="0" col="0" width="50" class="user-head" v-show="client.status" src="~/assets/images/confirmed.png" stretch="aspectFit"></Image>
                        <StackLayout row="0" col="1" verticalAlignment="center">
                            <Label :text="getClientName(client)" class="client-text client-bold"/>
                            <Label :text="`${formatPhoneNum(client.phone)} | Caller: ${getCallerName(client)}`" class="client-text"/>                            
                            <Label :text="`${client.startTime} | ${client.date} | ${getNurseName(client)}`" class="client-text client-light" />
                        </StackLayout>
                        <StackLayout row="0" col="2" class="client-tip-ctnr">
                            <Label :text="`deletes ${client.countdown}`" class="client-text client-light" :color="`${client.color}`" />
                        </StackLayout>
                        <Image row="0" col="3" class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                    </GridLayout>
                </v-template>

                <v-template name="itemswipe">
                    <GridLayout class="swipe-ctnr" columns="*, auto">
                        <Button col="1" id="delete-view" class="delete-btn" text="DELETE" @tap="onDeleteTap"></Button>
                    </GridLayout>
                </v-template>

            </RadListView>
        </ScrollView>
        <Label v-else text="No logs are currently saved on this device" class="home-log-null"/>
    </StackLayout>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Component to display list of client document history
     *  [Description] - used in Dashboard. This list is in newest-to-oldest order. Can View/ Edit/ Delete a client document from this list.
     *  [Related] - styles in dashboard.scss
     *  @param {Array} full_logs - list of logs from data storage
     *  @param {Number} countdown_threshold - the number of days to keep a client document
     *  @param {Boolean} isSwiping - variable to check whether an log is being swiped
     * 
     *  =============================================================
     * **/

    import Introduction from '../../intro/Introduction.vue';
    import ChooseProtocol from '../../protocols/ChooseProtocol.vue';
    import AssessItems from '../../protocols/AssessItems.vue';
    import AssessOthers from '../../protocols/AssessOthers.vue';
    import Plans from '../../protocols/Plans.vue';
    import Recommendations from '../../protocols/Recommendations.vue';
    import Summary from '../../summary/Summary.vue';

    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';
    import { openUrl } from 'tns-core-modules/utils/utils';
    import { confirm }  from "tns-core-modules/ui/dialogs";
    import { formatPhoneForDisplay, monthStringToNumber, numDaysInMon, formatUsernameForDisplay } from '../../../scripts/common';


    export default {
        data() {
            return {
                full_logs: [],
                countdown_threshold: 7, 
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
                'deleteLog',
                'saveActiveLog'
            ]),
            /**
             *  Function to prepare data to display on load
             *  - the delete time countdown will trun red when there are less than two days left
             * **/
            prepareLogs() {
                this.full_logs = this.logs;
                this.full_logs.forEach(log => {
                    log.countdown = this.formatCountdown(log.date);
                    if (log.countdown === 'TODAY') {
                        console.log("=== auto deleting === " + log.id);
                        this.deleteLog(log.id);
                    }

                    log.color = (log.countdown === 'TOMORROW' || log.countdown === 'IN 2 DAYS') ? "#ff1f00" : "#4b4b4b";
                });
            },
            /**
             *  Function to parse phone data for display
             *  [Description] - this function is here to wrap an external function that cannot be accessed via template
             *  @return {String} formatted phone
             * **/
            formatPhoneNum(num) {
                return formatPhoneForDisplay(num);
            },
            /**
             *  Function to parse the count down for display
             *  @param {String} date - in format of DD MMM YYYY 
             *  @return {String} countdown
             * **/
            formatCountdown(date) {
                const month_title = date.split(" ")[1];
                
                const today = new Date();
                
                let month_diff = today.getMonth() - monthStringToNumber(month_title);
                if (month_diff < 0) month_diff = today.getMonth() + (12 - monthStringToNumber(month_title));
                const date_diff = today.getDate() - parseInt(date.split(" ")[0]);

                // calculate how long the document has lived
                let countdown = 0;
                if (month_diff == 0) { // if within the same month
                    countdown = date_diff;
                } else if (month_diff == 1 || month_diff < 0 )  { // if has one month difference, do the math to accumulate days
                    const old_month_full = numDaysInMon(today.getFullYear())[monthStringToNumber(month_title)]; 
                    const residule = old_month_full - parseInt(date.split(" ")[0]);
                    countdown = residule + today.getDate();
                } else { // if the difference is more than one month, normally will not reach here
                    const old_month_full = numDaysInMon(today.getFullYear())[monthStringToNumber(month_title)];
                    const residule = old_month_full - parseInt(date.split(" ")[0]);
                    countdown = old_month_full * (month_diff - 2) + residule + today.getDate();
                }

                // calculate countdown based on how many days the documents can live
                countdown = (countdown > this.countdown_threshold) ? 0 : this.countdown_threshold - countdown; 

                if (countdown === 1) {
                    return 'TOMORROW';
                } else if (countdown === 0) {
                    return 'TODAY';
                } else {
                    return `IN ${countdown} DAYS`;
                }
            },
            /**
             *  Function to parse the caller's name for display
             *  @return {String} caller_name
             * **/
            getCallerName(client) {
                const caller = client.caller;
                return (caller != '') ? caller : 'Anonymous';
            },
            /**
             *  Function to parse the client's name for display
             *  @return {String} client_name
             * **/
            getClientName(client) {
                const client_name = client.client;
                return (client_name != '') ? client_name : 'John Doe';
            },
            /**
             *  Function to parse the user's name for display
             *  @return {String} user_name
             * **/
            getNurseName(client) {
                const nurse_fullname = client.nurseFullname;
                const name_segments = nurse_fullname.trim().split(' ');
                const firstname = name_segments[0];
                if (name_segments.length - 1 === 0) {
                    return (firstname != '') ? firstname : 'Unknown';
                } else {
                    const lastname = name_segments[name_segments.length - 1];
                    return `${firstname} ${lastname.substring(0, 1)}.`
                }
            },
            /**
             *  Function to parse the caller's name for display
             *  @return {String} caller_name
             * **/
            onEditTap(args) {
                this.triage(args.index);
            },
            /**
             *  Function to ask user to confirm deleting the document
             * **/
            onDeleteTap(args) {
                const id = args.object.bindingContext.id;
                confirm({
                    title: "Delete Document",
                    message: "This document and its contents will be removed from the app. This action is not reversible.",
                    okButtonText: "Delete",
                    cancelButtonText: "Cancel"
                }).then(isConfirmed => {
                    if (isConfirmed) {
                        console.log("=== Delete client === " + id);
                        this.deleteLog(id);
                    } else {
                        console.log("=== no delete ===");
                    }
                });
            },
            /**
             *  Function to show delete button on swipe from right to left
             * **/
            onSwipeStarted ({ data, object }) {
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
            /**
             *  Function to open an existing client document
             *  - [Description] - based on the last location the user was on, this function determines which page to open
             *  @param {Number} log_idx - the index of the log being tapped
             * **/
            triage(log_idx) {
                const log = this.logs[log_idx];
                const status = log.status;
                const progress = log.progress;
                
                if (status) { // if the client has exited from linear documenting mode, direct them to Summary page
                    this.prepareSummary(log.id);
                    return;
                } 
                if (progress[6] === 1) { // if last at Summary page
                    this.prepareSummary(log.id);
                    return;
                }
                if (progress[5] === 1) { // if last at Plans page
                    this.preparePlans(log.id);
                    return;
                }
                if (progress[4] === 1) { // if last at Recommendations page
                    this.prepareRecommendations(log.id);
                    return;
                }
                if (progress[1] > -1) { // if any protocol is selected
                    if (progress[3] === 1) { // if last at AssessOthers page
                        this.prepareOthers(log.id, progress[1]);
                        return;
                    }
                    if (progress[2] === 1) { // if last at AssessItems page
                        this.prepareItems(log.id, progress[1]);
                        return;
                    }
                } else if (progress[1] === -1) { // if at ChooseProtocol page
                    this.prepareChoose(log.id);
                } else { // if last in Introduction section
                    let steps_ids = [];
                    this.intro.forEach(elem => { steps_ids.push(elem.id); });
                    if (progress[0] != -1) {
                        const curr_idx = steps_ids.findIndex(elem => elem === progress[0]);
                        if (curr_idx < steps_ids.length) {
                            this.prepareIntro(log.id, steps_ids, curr_idx);
                        } else { // if Introduction section has all been filled, go to ChooseProtocol page
                            console.log("=== OH NO!!! something is not logged right in progress ===")
                        }
                    } else {
                        const curr_idx = 0;
                        this.prepareIntro(log.id, steps_ids, curr_idx);
                    }
                }
            },
            /**
             *  Function to open Introduction page
             *  @param {String} log_id - the id of current client document
             *  @param {Array} steps_ids - list of all possible step ids
             *  @param {Array} curr_idx - the index of current step id
             * **/
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
            /**
             *  Function to open ChooseProtocol page
             *  @param {String} log_id - the id of current client document
             * **/
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
            /**
             *  Function to open AssessItems page
             *  @param {String} log_id - the id of current client document
             *  @param {Number} protocol_id - id of current protocol of current client document
             *  @param {Number} letter_id - id of current letter in current protocol
             * **/
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
            /**
             *  Function to open AssessOthers page
             *  @param {String} log_id - the id of current client document
             *  @param {Number} protocol_id - id of current protocol of current client document
             * **/
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
            /**
             *  Function to open Recomentations page
             *  @param {String} log_id - the id of current client document
             * **/
            prepareRecommendations(log_id) {
                this.$navigateTo(Recommendations, {
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
            /**
             *  Function to open Plans page
             *  @param {String} log_id - the id of current client document
             * **/
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
            /**
             *  Function to open Summary page
             *  @param {String} log_id - the id of current client document
             * **/
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