<template>
    <Page class="page q-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem tap="onBackward" ios.systemIcon="21" ios.position="left" ></ActionItem>
        </ActionBar>
        <GridLayout class="q-ctnr" rows="auto, *" columns="*" ref="qGridRef" @layoutChanged="onLayoutUpdate">
            <FlexboxLayout row="0" col="0" alignItems="stretch" class="q-patient-ctnr">
                <Image width="50" class="user-head" src="~/assets/images/head2.png" stretch="aspectFit"></Image>
                <StackLayout flexGrow="2">
                    <Label :text="logs[currLogIndex].client" class="patient-name patient-top patient-text"/>
                    <Label :text="logs[currLogIndex].phone" class="patient-phone patient-text"/>
                    <Label :text="logs[currLogIndex].patient" class="patient-name patient-text"/>
                    <Label :text="logs[currLogIndex].createdTime" class="patient-time patient-text" />
                </StackLayout>
                <Image class="edit-icon" alignSelf="flex-end" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </FlexboxLayout>
            <StackLayout row="1" col="0" :class="mainSetting.class">
                <StackLayout class="q-title-ctnr">
                    <Label class="q-main-title" text="Log" />
                    <Label class="q-main-title" text="In Progress" />
                </StackLayout>
                <StackLayout class="q-question-ctnr" >
                    <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="center">
                        <Image width="100" class="q-icon" src="~/assets/images/q-icon.png" stretch="aspectFit"></Image>
                        <Label :text="question_body" class="q-question-body"/>
                    </FlexboxLayout>
                    <Button v-for="answer in answers_list" v-bind:key="answer.id" :text="answer.text" class="q-question-ans" @tap="onForward(answer)" /> 
                </StackLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                question_body: '?',
                answers_list: [],

                mainSetting: {
                    class: "q-main-ctnr"
                }
            }
        },
        mounted() {
            this.prepareInitialQuestion();
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'logs',
                'questions',
                'answers',
                'branches',
                'intro_outcomes',
                'intro_question_id',
                'currLogIndex'
			])
		},
        methods: {
            ...mapActions([
            ]),
            recordTime() {
                const today = new Date();
                const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                const time = today.getHours() + ':' + today.getMinutes();
                const dateTime = time + ' | ' + date;
                this.created_time = dateTime;
            },
            retrieveQuestion(target_q_id) {
                const q = this.questions.find(question => { return question.id === target_q_id});
                this.question_body = q.text;
                this.answers_list = this.answers.filter(ans => ans.question_id === q.id);
            },
            prepareInitialQuestion() {
                this.retrieveQuestion(this.intro_question_id);
            },
            prepareNextQuestion(next_id) {
                this.retrieveQuestion(next_id);
            },
            onForward(ans) {
                console.log("=== Forward ===");
                const outcome = this.intro_outcomes.find(out => { return out.answer_id === ans.id});
                if (outcome === undefined) {
                    const branch = this.branches.find(brc => { return brc.answer_id === ans.id});
                    if (branch === undefined) {
                        console.log("=== Trouble in backend ===");
                    } else {
                        const new_q_id = branch.question_id;
                        this.prepareNextQuestion(new_q_id);
                    }
                } else {
                    // navigate to result page with outcome id
                    console.log("=== Heading to result now ===");
                }
            },
            onBackward(args) {
                console.log("=== Backward ===");
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( this.$refs.qGridRef.nativeView.getMeasuredWidth() );

                if (width > 1000) {
                    this.mainSetting = {
                        class: "q-main-ctnr tablet-landscape"
                    };
                } else {
                    this.mainSetting = {
                        class: "q-main-ctnr"
                    };
                }
            }
        }
        
    };
</script>

<style>
</style>