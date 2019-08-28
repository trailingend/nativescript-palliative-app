<template>
<Frame id="recommendFrame">
     <Page class="page recommend-page" @navigatedTo="onNavigatedTo">
         <GridLayout :class="ctnrSetting"
                     rows="auto, auto, *" columns="*"
                     ref="recommendGridRef" 
                     @layoutChanged="onLayoutUpdate">

            <StackLayout row="0" col="0" class="recommend-title-ctnr">
                <Label class="recommend-title" :text="protocol_name" />
                <Label class="recommend-subtitle" text="Recommend" />
            </StackLayout>
                
            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>

            <FlexboxLayout row="1" col="0" flexDirect="row" alignItems="center" justifyContent="center" class="recommend-tab-ctnr">
                <Button v-for="(info, index) in button_list" 
                        :key="index"
                        :text="info.title"
                        class="recommend-tab"
                        textWrap="true" 
                        @tap="(args) => { onTabTap(args, info.id); }" />
            </FlexboxLayout>

            <ScrollView row="2" col="0" id="recommend-main-ctnr" class="recommend-main-ctnr">
                <StackLayout >
                    <StackLayout id="recommend-item-ctnr-res" class="recommend-item-ctnr recommend-resc-ctnr">
                        <FlexboxLayout flexDirection="row" justifyContent="flex-start" alignItems="center">
                            <StackLayout class="divider"/>
                            <Label class="recommend-text recommend-sec-title" text="recommend" />
                        </FlexboxLayout>
                        <StackLayout v-for="resource in resources_list" 
                                    :key="resource.id" 
                                    class="recommend-item recommend-res-item" > 
                            <Label class="recommend-text recommend-url" 
                                    :textDecoration="(resource.url != '' && resource.url != 'null' && resource.url !=null) ? 'underline' : 'none'" 
                                    :text="resource.title" 
                                    @tap="onLinkTap(resource.url)" />
                        </StackLayout>
                    </StackLayout>
                    <StackLayout id="recommend-item-ctnr-pro" class="recommend-item-ctnr recommend-resc-ctnr">
                        <FlexboxLayout flexDirection="row" justifyContent="flex-start" alignItems="center">
                            <StackLayout class="divider"/>
                            <Label class="recommend-text recommend-sec-title" text="Related Protocols"></Label>
                        </FlexboxLayout>
                        <StackLayout v-for="related in related_list" 
                                    :key="related.id" 
                                    class="recommend-item recommend-rela-item" > 
                            <Label class="recommend-text" :text="related.name"></Label>
                        </StackLayout>
                    </StackLayout>
                    <StackLayout class="recommend-item-ctnr recommend-reco-ctnr">
                        <StackLayout v-for="recommendation in recommendations_list" 
                                    :key="recommendation.id" 
                                    :id="`recommend-item-ctnr-${recommendation.id}`"
                                    class="recommend-reco-item" > 
                            <FlexboxLayout flexDirection="row" justifyContent="flex-start" alignItems="center">
                                <StackLayout class="divider"/>
                                <Label class="recommend-text recommend-sec-title" :text="recommendation.title" />
                            </FlexboxLayout>
                            <StackLayout class="recommend-item">
                                <HtmlView class="recommend-html" backgroundColor="transparent" :html="style_string + recommendation.content" />
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
    /**
     *  =============================================================
     * 
     *  Modal to show Recommendations for current protocol
     *  [Description] - can be opened from AssessItems/ AssessOthers page
     *  [Related] - styles in recommend.scss
     *  @param {String} style_string - css styles for the htmlView
     *  @param {String} protocol_name - name of current protocol
     *  @param {Array} resources_list - list of resources related to current protocol
     *  @param {Array} recommendations_list - list of recommendations related to current protocol
     *  @param {Array} related_list - list of related protocols related to current protocol
     *  @param {Array} button_list - list of navigation buttons
     *  @param {Array} res_anchors - list of objects records the y position of each element
     *      - id - the id of the element
     *      - y - the y position of the element on the page
     *  @param {Object} ctnrSetting - variable to store screen-size sensitive classnames
     *  @prop {String} log_id - the id of the current document
     *  @prop {Number} protocol_id - the id of the current protocol
     * 
     *  =============================================================
     * **/

    import { mapActions, mapGetters } from 'vuex';
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

                ctnrSetting: "recommend-ctnr",
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
            /**
             *  Function to retrieve current protocol recomendation info and prepare button list accordingly from data storage
             * **/
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
            /**
             *  Function to record y position of each section
             * **/
            setupAnchors(args) {
                const page = args.object.page;
                const scrollView = args.object.page.getViewById("recommend-main-ctnr");
                this.button_list.forEach(elem => {
                    const view = page.getViewById(`recommend-item-ctnr-${elem.id}`);
                    this.res_anchors.push({
                        id: elem.id,
                        y: view.getLocationRelativeTo(scrollView).y
                    });
                });
            },
            /**
             *  Function to call when a resource link tapped
             *  @param {String} url - url to open
             * **/
            onLinkTap(url) {
                if (url === null || url === '' || url === 'null') {
                    console.log("=== Recommend === navigating to " + url);
                    utils.openUrl(url);
                }
            },
            /**
             *  Function to call when a button is tapped, scroll to the section
             *  @param {Object} args - event default obejct
             *  @param {Number} curr_id - button item id
             * **/
            onTabTap(args, curr_id) {
                const scrollView = args.object.page.getViewById("recommend-main-ctnr");
                const y = this.res_anchors.find(elem => { return elem.id === curr_id; }).y;
                scrollView.scrollToVerticalOffset(y, true);
            },
            /**
             *  Function to close the current modal
             * **/
            onCloseTap() {
                this.$modal.close();
            },
            /**
             *  Function to be called when the page is loaded
             * **/
            onNavigatedTo(args) {
                this.setupAnchors(args);
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                if (this.$refs.editGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.recommendGridRef.nativeView.getMeasuredWidth() );
                    if (width > 1000) {
                        ctnrSetting: "recommend-ctnr tablet-landscape"
                    } else {
                        ctnrSetting: "recommend-ctnr"
                    }
                }
            },
        },
        
    };
</script>

<style>
</style>