<template>
    <StackLayout>
        <ScrollView class="client-list" v-if="logs.length > 0">
            <RadListView for="client in logs" 
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
                            <Label :text="`${client.createdTime} | ${getNurseName(client.nurse)}`" class="client-text client-light" />
                        </StackLayout>
                        <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                        <StackLayout class="bar-ctnr"></StackLayout>
                        <StackLayout class="facetime-ctnr" @tap="onCallTap(client.id)">
                            <Image class="facetime-icon" width="30" src="~/assets/images/facetime.png" stretch="aspectFit"></Image>
                        </StackLayout>
                    </FlexboxLayout>
                </v-template>

                <v-template name="itemswipe">
                    <GridLayout class="swipe-ctnr" columns="auto">
                        <Button id="delete-view" class="delete-btn" text="DELETE" @tap="onDeleteTap"></Button>
                    </GridLayout>
                </v-template>

            </RadListView>
        </ScrollView>
        <Label v-else text="no current chart records" class="home-log-null"/>
    </StackLayout>
</template>

<script lang="ts">
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
                'users'
			])
		},
        methods: {
            ...mapActions([
                'deleteChart',
                'saveActiveChart'
            ]),
            formatPhoneNum(num) {
                return formatPhoneForDisplay(num);
            },
            getNurseName(nurse_id) {
                const curr_user = this.users.find((elem) => { return elem.id === nurse_id; });
                return (curr_user) ? curr_user.name : 'Unknown';
            },
            onEditTap(args) {
                if (this.isSwipeMode) {
                    this.isSwipeMode = false;
                } else {
                    const log_idx = args.index;
                    const log = this.logs[log_idx];
                    // this.saveActiveChart(log.id);
                    // this.$navigateTo(Preview, {
                    //     animated: true,
                    //     clearHistory: true,
                    //     transition: {
                    //         name: 'slideTop',
                    //         curve: 'easeIn',
                    //         duration: 300
                    //     },
                    //     props: {
                    //         log_id: log.id,
                    //         has_prev: false
                    //     }
                    // });
                }
            },
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
                    message: "Confirm you want to delete this client log?",
                    okButtonText: "Yes",
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
                console.log(`Swipe started`);
                const swipeLimits = data.swipeLimits;
                const swipeView = object;
                const rightItem = swipeView.getViewById('delete-view');
                swipeLimits.left = rightItem.getMeasuredWidth();
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