<template>
    <GridLayout rows="auto" columns="*, auto, auto" class="timer-ctnr">
        <GridLayout col="0" columns="auto, *" class="timer-bar-ctnr timer-bar-ctnr-1">
            <StackLayout :width="timer_value_1" :background="color" col="0" class="timer-value"></StackLayout>
        </GridLayout>
        <GridLayout col="1" columns="auto, *" class="timer-bar-ctnr timer-bar-ctnr-2">
            <StackLayout :width="timer_value_2" :background="color" col="0" class="timer-value"></StackLayout>
        </GridLayout>
        <GridLayout col="2" columns="auto, *" class="timer-bar-ctnr timer-bar-ctnr-3">
            <StackLayout :width="timer_value_3" :background="color" col="0" class="timer-value"></StackLayout>
        </GridLayout>
    </GridLayout>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                curr_time: 0,
                max_time: 60, 
                checkpoints: [10, 30, 60], 
                color: "#bbbbbb",
                normal_color: "#bbbbbb",
                warning_color: "#777777",
                timer: null,
                timer_value_1: '0%',
                timer_value_2: '0%',
                timer_value_3: '0%',
            }
        },
        mounted() {
            this.curr_time = this.init_val;
            this.tick();
            if (this.event_bus) {
                this.event_bus.$on('clear_timer', (log_id) => {
                    this.stopTimer(log_id);
                });
            }
        },
        components: {
        },
        props: {
            segment_id: {
                type: Number,
                required: true
            },
            init_val: {
                type: Number,
                required: true,
            },
            event_bus: {
                type: Object,
                required: false,
            }
        },
        computed: {
		},
        methods: {
            ...mapActions([
                'updateTimer'
            ]),
            tick() {
                this.timer = setInterval(() => {
                    let checkpoint = (this.segment_id >= 0 && this.segment_id <= 2) ? 
                                     this.checkpoints[this.segment_id] : this.checkpoints[2];
                    this.curr_time++;
                    this.color = (this.curr_time >= checkpoint) ? this.warning_color : this.normal_color;
                    console.log("=== in timer ===" + this.curr_time)

                    if (this.curr_time <= this.checkpoints[0]) {
                        const fraction = this.curr_time / this.checkpoints[0] * 100;
                        this.timer_value_1 = fraction + '%';
                        this.timer_value_2 = '0%';
                        this.timer_value_3 = '0%';
                    } else if (this.curr_time > this.checkpoints[0] && this.curr_time <= this.checkpoints[1]) {
                        const fraction = (this.curr_time - this.checkpoints[0]) / (this.checkpoints[1] - this.checkpoints[0]) * 100;
                        this.timer_value_1 = '100%';
                        this.timer_value_2 = fraction + '%';
                        this.timer_value_3 = '0%';
                    }
                    else if (this.curr_time > this.checkpoints[1] && this.curr_time <= this.checkpoints[2]) {
                        const fraction = (this.curr_time - this.checkpoints[1]) / (this.checkpoints[2] - this.checkpoints[1]) * 100;
                        this.timer_value_1 = '100%';
                        this.timer_value_2 = '100%';
                        this.timer_value_3 = fraction + '%'; 
                    }

                    if (this.curr_time >= this.checkpoints[2]) {
                        this.color = this.warning_color;
                        this.stopTimer();
                    } 
                }, 1000);
            },
            stopTimer(log_id) {
                clearInterval(this.timer);
                if (log_id) {
                    console.log("=== Timer: in stop timer === " + log_id + " " + this.curr_time)
                    this.updateTimer({
                        log_id: log_id,
                        curr_time: this.curr_time
                    });
                }
            },
            
        },
        
    };
</script>

<style>
</style>