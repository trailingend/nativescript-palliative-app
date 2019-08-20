<template>
<Frame id="resourcesFrame">
     <Page class="page resources-page" @navigatedTo="onNavigatedTo">
         <GridLayout :class="ctnrSetting"
                     rows="auto, auto, *" columns="*"
                     ref="resourcesGridRef" 
                     @layoutChanged="onLayoutUpdate">
            

            <StackLayout row="0" col="0" class="resources-title-ctnr">
                <Label class="resources-title" :text="protocol_name" />
                <Label class="resources-subtitle" text="Recommend" />
            </StackLayout>
                
            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>

            <FlexboxLayout row="1" col="0" flexDirect="row" alignItems="center" justifyContent="space-around" class="resources-tab-ctnr">
                <Button v-for="(info, index) in button_list" 
                        :key="index"
                        :text="info.title"
                        class="resources-tab"
                        textWrap="true" 
                        @tap="(args) => { onTabTap(args, info.id); }" />
            </FlexboxLayout>

            <ScrollView row="2" col="0" id="resources-main-ctnr" class="resources-main-ctnr">
                <StackLayout >
                    <StackLayout id="resources-item-ctnr-res" class="resources-item-ctnr resources-resc-ctnr">
                        <FlexboxLayout flexDirection="row" justifyContent="flex-start" alignItems="center">
                            <StackLayout class="divider"/>
                            <Label class="resources-text resources-sec-title" text="resources" />
                        </FlexboxLayout>
                        <StackLayout v-for="resource in resources_list" 
                                    :key="resource.id" 
                                    class="resources-item resources-res-item" > 
                            <Label class="resources-text resources-url" 
                                    :textDecoration="(resource.url != '' && resource.url != 'null' && resource.url !=null) ? 'underline' : 'none'" 
                                    :text="resource.title" 
                                    @tap="onLinkTap(resource.url)" />
                        </StackLayout>
                    </StackLayout>
                    <StackLayout id="resources-item-ctnr-pro" class="resources-item-ctnr resources-resc-ctnr">
                        <FlexboxLayout flexDirection="row" justifyContent="flex-start" alignItems="center">
                            <StackLayout class="divider"/>
                            <Label class="resources-text resources-sec-title" text="Related Protocols"></Label>
                        </FlexboxLayout>
                        <StackLayout v-for="related in related_list" 
                                    :key="related.id" 
                                    class="resources-item resources-rela-item" > 
                            <Label class="resources-text" :text="related.name"></Label>
                        </StackLayout>
                    </StackLayout>
                    <StackLayout class="resources-item-ctnr resources-reco-ctnr">
                        <StackLayout v-for="recommendation in recommendations_list" 
                                    :key="recommendation.id" 
                                    :id="`resources-item-ctnr-${recommendation.id}`"
                                    class="resources-reco-item" > 
                            <FlexboxLayout flexDirection="row" justifyContent="flex-start" alignItems="center">
                                <StackLayout class="divider"/>
                                <Label class="resources-text resources-sec-title" :text="recommendation.title" />
                            </FlexboxLayout>
                            <StackLayout class="resources-item">
                                <HtmlView class="resources-html" backgroundColor="transparent" :html="style_string + recommendation.content" />
                            </StackLayout>
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
                style_string: "<style type='text/css'>h1, h2, h3, h4, h5, h6, ul, li, div, p, span{background: transparent; font-family: 'Nunito', 'proxima-nova', sans-serif;}ul, li, p, span{font-size: 16px;}</style>",
                
                protocol_name: '',
                resources_list: [],
                recommendations_list: [],
                related_list: [],
                button_list: [],
                res_anchors: [],

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

                this.button_list.push({id: "res", title: "resources"});
                this.button_list.push({id: "pro", title: "related protocols"});
                this.recommendations_list.forEach(elem=> { this.button_list.push({id: elem.id, title: elem.title}); });

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
            setupAnchors(args) {
                const page = args.object.page;
                const scrollView = args.object.page.getViewById("resources-main-ctnr");
                this.button_list.forEach(elem => {
                    const view = page.getViewById(`resources-item-ctnr-${elem.id}`);
                    this.res_anchors.push({
                        id: elem.id,
                        y: view.getLocationRelativeTo(scrollView).y
                    });
                });
            },
            onLinkTap(url) {
                if (url === null || url === '' || url === 'null') {
                    console.log("=== Resources === navigating to " + url);
                    utils.openUrl(url);
                }
            },
            onTabTap(args, curr_id) {
                const scrollView = args.object.page.getViewById("resources-main-ctnr");
                const y = this.res_anchors.find(elem => { return elem.id === curr_id; }).y;
                scrollView.scrollToVerticalOffset(y, true);
            },
            onCloseTap() {
                this.$modal.close();
            },
            onNavigatedTo(args) {
                this.setupAnchors(args);
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