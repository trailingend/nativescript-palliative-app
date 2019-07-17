<template>
<Frame id="resourcesFrame">
     <Page class="page resources-page">
         <GridLayout :class="ctnrSetting"
                     rows="auto, auto, auto, *" columns="*"
                     ref="resourcesGridRef" 
                     @layoutChanged="onLayoutUpdate">

            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>

            <StackLayout row="1" col="0" class="resources-title-ctnr">
                <Label class="resources-title" text="Resources" />
                <Label class="resources-subtitle" :text="protocol_name" />
                <StackLayout class="divider-ctnr"></StackLayout>
            </StackLayout>

            <FlexboxLayout row="2" col="0" flexDirect="row" alignItems="center" justifyContent="space-around" class="resources-tab-ctnr">
                <Button class="resources-tab" text="resources" textWrap="true" />
                <Button v-for="recommendation in recommendations_list" 
                        :key="recommendation.id"
                        :text="recommendation.title"
                        class="resources-tab"
                        textWrap="true" />
                <Button text="related protocols" class="resources-tab" textWrap="true"/>
            </FlexboxLayout>

            <ScrollView row="3" col="0" class="resources-main-ctnr">
                <StackLayout>
                    <StackLayout class="resources-item-ctnr resources-resc-ctnr">
                        <Label class="resources-text resources-sec-title" text="resources" />
                        <StackLayout v-for="resource in resources_list" 
                                    :key="resource.id" 
                                    class="resources-item resources-reco-item" > 
                            <Label class="resources-text resources-url" :text="resource.title" @tap="onLinkTap(resource.url)" />
                        </StackLayout>
                    </StackLayout>
                    <StackLayout class="resources-item-ctnr resources-reco-ctnr">
                        <StackLayout v-for="recommendation in recommendations_list" 
                                    :key="recommendation.id" 
                                    class="resources-item resources-reco-item" > 
                            <Label class="resources-text resources-sec-title" :text="recommendation.title" />
                            <HtmlView class="resources-text resources-html" backgroundColor="transparent" :html="style_string + recommendation.content" />
                        </StackLayout>
                    </StackLayout>
                    <StackLayout class="resources-item-ctnr resources-resc-ctnr">
                        <Label class="resources-text resources-sec-title" text="Related Protocols"></Label>
                        <StackLayout v-for="related in related_list" 
                                    :key="related.id" 
                                    class="resources-item resources-rela-item" > 
                            <Label class="resources-text" :text="related.name"></Label>
                        </StackLayout>
                    </StackLayout>
                </StackLayout>
            </ScrollView>

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
                style_string: "<style type='text/css'>h1, h2, h3, h4, h5, h6, ul, li, div, p, span{background: red; font-family: 'Nunito', 'proxima-nova', sans-serif;}ul, li, p, span{font-size: 16px;}</style>",
                
                protocol_name: '',
                resources_list: [],
                recommendations_list: [],
                related_list: [],

                ctnrSetting: "resources-ctnr",
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
                this.resources_list = protocol_obj.resources;
                this.recommendations_list = protocol_obj.recommendations;
                protocol_obj.related_protocols.forEach(elem => { 
                    const related_p_obj = this.protocols.find(p => { return p.id == elem.related_to; });
                    if (related_p_obj != undefined) {
                        this.related_list.push({
                            id: related_p_obj.id,
                            name: related_p_obj.name
                        }); 
                    }
                });
            },
            onLinkTap(url) {
                utils.openUrl(url);
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