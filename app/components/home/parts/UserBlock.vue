<template>
    <StackLayout class="user-ctnr" @tap="onEditTap">
        <FlexboxLayout justifyContent="space-between" alignItems="flex-start" v-if="curr_user_id != -1">
            <StackLayout class="user-head" :background="user.color" @tap="onDotTap"></StackLayout>
            <StackLayout>
                <Label class="user-item user-bold" :text="user.name" />
                <Label class="user-item user-text" :text="`ID #: ${user.id}`" />
                <Label class="user-item user-shift" :text="`Shift: ${user.shift_start} - ${user.shift_end}`" />
            </StackLayout>
            <StackLayout class="edit-ctnr">
                <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </StackLayout>
        </FlexboxLayout>
        <FlexboxLayout justifyContent="center" alignItems="center" v-else>
            <StackLayout >
                <Label class="user-item user-begin-text" text="START" />
                <Label class="user-item user-begin-text" text="MY SHIFT" />
            </StackLayout>   
            <StackLayout>
                <Image class="edit-icon" src="~/assets/images/arrow.png" stretch="aspectFit"></Image>
            </StackLayout>
        </FlexboxLayout>
    </StackLayout>
</template>

<script lang="ts">
    import SelectUser from '../SelectUser.vue';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                user: {
                    id: '888888',
                    name: 'Nomen Nescio',
                    shift_start: '5:30',
                    shift_end: '8:30',
                },

                timer_obj: undefined,
                shift_start_h: 0,
                shift_start_m: 0,
                shift_end_h: 0,
                shift_end_m: 0,
            }
        },
        mounted() {
            this.prepareUser();
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'curr_user_id',
                'users'
			]),
		},
        methods: {
            prepareUser() {
                if (this.curr_user_id != -1) {
                    this.user = this.users.find((user)=> {return user.id === this.curr_user_id; });
                    this.$emit("userChange");

                    if (this.timer_obj === undefined) {
                        this.shift_start_h = parseInt(this.user.shift_start.split(':')[0]);
                        this.shift_start_m = parseInt(this.user.shift_start.split(':')[1]);
                        this.shift_end_h = parseInt(this.user.shift_end.split(':')[0]);
                        this.shift_end_m = parseInt(this.user.shift_end.split(':')[1]);
                        this.startTimerForUser();
                    }
                } 
            },
            startTimerForUser() {
                const today = new Date();
                let tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                this.shift_start_d = today.getDate();
                if (this.shift_end_h >= this.start_h) { // no date change
                    this.shift_end_d = today.getDate();
                } else { // date change
                    this.shift_end_d = tomorrow.getDate();
                }
                
                console.log("=== Timer init === " + this.shift_end_d + ' ' + this.shift_end_h + ' ' + this.shift_end_m);

                this.timer_obj = setInterval(() => {
                    const curr_obj = new Date();
                    const curr_hour = curr_obj.getHours();
                    const curr_minute = curr_obj.getMinutes();
                    
                    console.log("=== Timer running === " + curr_hour + ' ' + curr_minute);
                }, 30000);
            },
            endTimerForUser() {
                clearInterval(this.timer_obj);
            },
            onDotTap() {

            },
            onEditTap() {
                this.$showModal(SelectUser, { 
                    fullscreen: true,
                }).then(data => {
                    this.prepareUser();
                });
            },
        },
       
    };
</script>

<style>
</style>