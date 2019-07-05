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
    import { mapGetters } from 'vuex';

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
        created() {
        },
        mounted() {
            this.initTimer();
            this.tick();
            if (this.event_bus) {
                this.event_bus.$on('clear_timer', () => {
                    console.log("=== Timer: in clear time === ");
                    this.stopTimer();
                });
            }
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: false,
            },
            segment_id: {
                type: Number,
                required: true
            },
            event_bus: {
                type: Object,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'timer_value',
                'timer_status',
			])
		},
        methods: {
            ...mapActions([
                'updateTimerValue',
                'turnOffTimer'
            ]),
            initTimer() {
                console.log("status " + this.timer_status);
                if (this.timer_status) {
                    this.curr_time = 0 + this.timer_value;
                } else {
                    console.log("here")
                    this.curr_time = 61;
                }
                
                this.updateColor();
                this.updateBarValue();
            },
            tick() {
                this.timer = setInterval(() => {
                    if (this.curr_time <= 60) this.curr_time++;
                    this.updateColor();
                    this.updateBarValue();
                    console.log("=== in timer ===" + this.curr_time);
                    
                    if (this.curr_time > this.checkpoints[2]) {
                        this.updateTimerStatus();
                    } 
                }, 1000);
            },
            stopTimer() { // Public-facing
                clearInterval(this.timer);
                this.updateTimerValue(this.curr_time);
            },
            updateTimerStatus() {
                clearInterval(this.timer);
                this.turnOffTimer();
            },
            updateBarValue() {
                if (this.curr_time <= this.checkpoints[0]) {
                    let fraction = this.curr_time / this.checkpoints[0] * 100;
                    if (fraction > 100) fraction = 100;
                    this.timer_value_1 = fraction + '%';
                    this.timer_value_2 = '0%';
                    this.timer_value_3 = '0%';
                } else if (this.curr_time > this.checkpoints[0] && this.curr_time <= this.checkpoints[1]) {
                    let fraction = (this.curr_time - this.checkpoints[0]) / (this.checkpoints[1] - this.checkpoints[0]) * 100;
                    if (fraction > 100) fraction = 100;
                    this.timer_value_1 = '100%';
                    this.timer_value_2 = fraction + '%';
                    this.timer_value_3 = '0%';
                }
                else if (this.curr_time > this.checkpoints[1] && this.curr_time <= this.checkpoints[2]) {
                    let fraction = (this.curr_time - this.checkpoints[1]) / (this.checkpoints[2] - this.checkpoints[1]) * 100;
                    if (fraction > 100) fraction = 100;
                    this.timer_value_1 = '100%';
                    this.timer_value_2 = '100%';
                    this.timer_value_3 = fraction + '%'; 
                } else {
                    this.timer_value_1 = '100%';
                    this.timer_value_2 = '100%';
                    this.timer_value_3 = '100%'; 
                }
            },
            updateColor() {
                let checkpoint = (this.segment_id >= 0 && this.segment_id <= 2) ? 
                                  this.checkpoints[this.segment_id] : this.checkpoints[2];
                this.color = (this.curr_time > checkpoint || this.curr_time > this.checkpoints[2]) ? this.warning_color : this.normal_color;
            }
        },
        
    };
</script>

<style>
</style>