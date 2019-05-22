<template>
    <Page class="page q-page">
        <ActionBar title="Patient Log">
            <NavigationButton text="Back" ios.systemIcon="9" ios.position="left" tap="onBackward"/>
        </ActionBar>
        <StackLayout class="q-ctnr">
            <FlexboxLayout alignItems="stretch" class="q-patient-ctnr">
                <Image width="50" class="user-head" src="~/assets/images/head2.png" stretch="aspectFit"></Image>
                <StackLayout flexGrow="2">
                    <Label :text="logs[currLogIndex].client" class="patient-name patient-top patient-text"/>
                    <Label :text="logs[currLogIndex].phone" class="patient-phone patient-text"/>
                    <Label :text="logs[currLogIndex].patient" class="patient-name patient-text"/>
                    <Label :text="logs[currLogIndex].createdTime" class="patient-time patient-text" />
                </StackLayout>
                <Image class="edit-icon" alignSelf="flex-end" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </FlexboxLayout>
            <StackLayout class="q-main-ctnr">
                <Label class="q-main-title" text="Log" />
                <Label class="q-main-title" text="In Progress" />
                <FlexboxLayout alignItems="stretch" class="q-question-ctnr">
                    <Image width="50" class="user-head" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
                    <Label :text="question_body" class="q-question-q"/>
                </FlexboxLayout>
                <Label v-for="answer in answers_list" v-bind:key="answer.id" :text="answer.text" /> 
            </StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                question_body: '?',
                answers_list: []
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
            prepareInitialQuestion() {
                const q = this.questions.find((question) => { return question.id == this.intro_question_id});
                this.question_body = q.text;
                this.answers_list = this.answers.filter(ans => ans.question_id == q.id);
            },
            onForward(args) {
                console.log("=== Forward ===");
            },
            onBackward(args) {
                console.log("=== Backward ===");
            },
        }
        
    };
</script>

<style>
</style>