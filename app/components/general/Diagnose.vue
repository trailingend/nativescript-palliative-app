<template>
    <Page class="page diagnose-page" @navigatingFrom="onNavigatingFrom">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <CloseButton />
        </ActionBar>
        <GridLayout :class="ctnrSetting.class" rows="auto, *, auto" columns="*" ref="diagnoseGridRef" @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" :log_id="log_id"/>
            <StackLayout row="1" col="0" class="diagnose-main-ctnr">
                <StackLayout class="diagnose-q-ctnr" >
                    <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="center">
                        <Image width="100" class="q-icon" src="~/assets/images/q-icon.png" stretch="aspectFit"></Image>
                        <Label :text="question" class="diagnose-q"/>
                    </FlexboxLayout>
                    <Button v-for="answer in answers_list" v-bind:key="answer.id" :text="answer.text" class="diagnose-a" @tap="onForward(answer)" /> 
                </StackLayout>
            </StackLayout>
            <FlexboxLayout row="2" col="0" orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Button class="back-btn" text="Back" @tap="onBackTap" ></Button>
                <Button class="next-btn" :text="next_text" @tap="onNextTap" ></Button>
            </FlexboxLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import UserBlock from './parts/UserBlock.vue';
    import CloseButton from './parts/CloseButton.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                question_id: -1,
                question: '?',
                answers_list: [],
                next_text: 'Skip',

                ctnrSetting: {
                    class: "diagnose-ctnr"
                }
            }
        },
        mounted() {
            this.prepareInitialQuestion();
        },
        components: {
            UserBlock,
            CloseButton
        },
        props: {
            initial_question_id: {
                type: Number,
                required: true,
            },
            log_id: {
                type: String,
                required: true,
            },
        },
        computed: {
            ...mapGetters([
                'logs',
                'intro_questions'
			])
		},
        methods: {
            ...mapActions([
                'saveIntroProgress',
                'revertIntroProgress',
                'changeLogStatus',
            ]),
            retrieveQuestion(target_q_id) {
                const question_obj = this.intro_questions.filter(elem => { return elem.id == target_q_id; });
            },
            prepareInitialQuestion() {
                this.retrieveQuestion(this.initial_question_id);
            },
            prepareNextQuestion(next_id) {
                this.retrieveQuestion(next_id);
            },
            preparePrevQuestion(prev_id) {
                this.retrieveQuestion(prev_id);
            },
            prepareNextStage() {
                // TODO
            },
            onForward(ans) {
                console.log("=== Forward === ");
                const progress = {
                    log_id: this.log_id,
                    q_id: this.question_id, 
                    a_id: ans.id
                };
                // TODO: this.saveIntroProgress(progress);
                
                const next_question_id = this.question_id + 1;
                if (next_question_id < this.intro_questions.length) {
                    this.prepareNextQuestion(next_question_id);
                } else {
                    this.prepareNextStage();
                }
            },
            onBackward(args) {
                // console.log("=== Backward ===");
                // const log_id_for_nav = this.log_id;
                // const log = this.logs.find((elem) => { return elem.id === this.log_id; });
                // const last_progress = log.intro_progress[log.intro_progress.length - 1];
                // if (last_progress === undefined) {
                  
                // } else {
                //     this.preparePrevQuestion(last_progress[0]);
                //     this.revertIntroProgress(this.log_id);
                // }
            },
            onBackTap() {

            },
            onNextTap() {

            },
            onNavigatingFrom() {
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.diagnoseGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.ctnrSetting = {
                        class: "diagnose-ctnr tablet-landscape"
                    };
                } else {
                    this.ctnrSetting = {
                        class: "diagnose-ctnr"
                    };
                }
            }
        }
        
    };
</script>

<style>
</style>