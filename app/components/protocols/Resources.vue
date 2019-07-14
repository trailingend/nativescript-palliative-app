<template>
<Frame id="resourcesFrame">
     <Page class="page resources-page">
         <GridLayout :class="ctnrSetting"
                     rows="auto, auto, *" columns="*"
                     ref="resourcesGridRef" 
                     @layoutChanged="onLayoutUpdate">
            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
            <FlexboxLayout row="1" col="0" flexDirect="row">
                <Button text="resources"/>
                <Button v-for="recommendation in recommendations_list" 
                        :key="recommendation.id"
                        :text="recommendation.title"/>
                <Button text="related protocols"/>
            </FlexboxLayout>
            <StackLayout row="2" col="0" class="resources-main-ctnr">
                <StackLayout class="resources-title-ctnr">
                    <Label class="resources-title" text="Resources" />
                    <Label class="resources-subtitle" :text="protocol_name" />
                    <StackLayout class="divider-ctnr"></StackLayout>
                </StackLayout>
                <StackLayout class="resources-resc-ctnr">
                    <StackLayout v-for="resource in resources_list" 
                                :key="resource.id" 
                                class="resources-reco-item" > 
                        <Label class="select-text select-name" :text="resource.title" />
                        <Label class="select-text select-url" :html="resource.url" />
                    </StackLayout>
                </StackLayout>
                <StackLayout class="resources-reco-ctnr">
                    <StackLayout v-for="recommendation in recommendations_list" 
                                :key="recommendation.id" 
                                class="resources-reco-item" > 
                        <Label class="select-text select-name" :text="recommendation.title" />
                        <HtmlView class="select-text select-html" :html="recommendation.content" />
                    </StackLayout>
                </StackLayout>
                <StackLayout class="resources-resc-ctnr">
                    <StackLayout v-for="related in related_list" 
                                :key="related.related_to" 
                                class="resources-rela-item" > 
                        <Label class="select-text select-name" :text="related.related_to"></Label>
                    </StackLayout>
                </StackLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</Frame>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                ctnrSetting: "resources-ctnr",
                protocol_name: '',
                resources_list: [],
                recommendations_list: [],
                related_list: []
            }
        },
        created() {
            this.prepareResources();
        },
        props: {
            log_id: {
                type: String,
                required: true,
            },
            protocol_id: {
                type: Number,
                required: true,
            },
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'logs',
                'protocols'
			]),
		},
        methods: {
            ...mapActions([
            ]),
            prepareResources() {
                const protocol_obj = this.protocols.find(elem => { return elem.id == this.protocol_id; });
                this.protocol_name = protocol_obj.name;
                console.dir(protocol_obj);
                this.resources_list = protocol_obj.resources;
                this.recommendations_list = protocol_obj.recommendations;
                this.related_list = protocol_obj.related_protocols;
            },
            onCloseTap() {
                this.$modal.close();
            },
            onLayoutUpdate() {
                if (this.$refs.editGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.resourcesGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        ctnrSetting: "resources-ctnr tablet-landscape"
                    } else {
                        ctnrSetting: "resources-ctnr"
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>