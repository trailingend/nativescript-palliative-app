<template>
    <Page class="page pre-proto-page">
        <ActionBar title="Patient Log">
            <NavigationButton visibility="hidden" ></NavigationButton>
            <ActionItem @tap="onBackward" ios.systemIcon="21" ios.position="left" ></ActionItem>
        </ActionBar>
        <GridLayout class="pre-proto-ctnr" rows="auto, *" columns="*" ref="preProtoGridRef" @layoutChanged="onLayoutUpdate">
            <UserBlock row="0" col="0" :log_id="log_id"/>
            <StackLayout class="pre-proto-choice-ctnr" row="1" col="0">
                <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="center">
                    <Label :text="pre_protocol_question" class="pre-proto-body"/>
                </FlexboxLayout>
                <GridLayout class="pre-proto-btn-ctnr" rows="*, *, *, *, *, *" columns="*, *" >
                    <Button v-for="(protocol, index) in protocols" 
                            v-bind:key="protocol.id" 
                            :row="Math.floor(index / 2)"
                            :col="index % 2"
                            :text="protocol.name" 
                            :class="`pre-proto-btn pre-proto-btn${index}`" 
                            @tap="onForward(protocol)" />
                </GridLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import UserBlock from './parts/UserBlock.vue';
    import Placeholder from './Placeholder.vue';
    import QuestionPhase3 from './QuestionPhase3.vue';

    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
            }
        },
        mounted() {
            // this.prepareProtocols();
        },
        components: {
            UserBlock
        },
        props: {
            log_id: {
                type: String,
                required: true,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols',
                'pre_protocol_question'
			])
		},
        methods: {
            ...mapActions([
                'changeLogStatus',
                'revertIntroProgress'
            ]),
            prepareProtocols() {
                const log_idx = this.logs.findIndex(elem => { return elem.id === this.log_id; });
            },
            preparePrevQuestion() {
                this.$navigateTo(QuestionPhase3, {
                    frame: "logFrame",
                    animated: false,
                    props: {
                        log_id: this.log_id,
                    }
                });
            },
            onForward(proto) {
                console.log("=== Heading to protocol === for patient " + this.log_id + " with " + proto.id);
            },
            onBackward(args) {
                console.log("=== Backward ===");
                const log = this.logs.find((elem) => { return elem.id === this.log_id; });
                const last_progress = log.intro_progress[log.intro_progress.length - 1];
                if (last_progress === undefined) {
                    console.log("=== Not suppose to happen!!! ===");
                } else {
                    this.preparePrevQuestion();
                    this.revertIntroProgress(this.log_id);
                }
            },
            onBackHome(args) {
                console.log("=== Back to Dashboard ===");
                const tabView = args.object.page.frame.parent.parent;
                tabView.selectedIndex = 0;

                this.$navigateTo(Placeholder, {
                    frame: "logFrame",
                    animated: false,
                    clearHistory: true
                });
            },
            onLayoutUpdate() {
                const width = utils.layout.toDeviceIndependentPixels( 
                    this.$refs.preProtoGridRef.nativeView.getMeasuredWidth() 
                );

                if (width > 1000) {

                } else {
                 
                }
            },
        }
        
    };
</script>

<style>
</style>