<template>
    <Frame id="tutorialFrame" ref="tFrameRef">
        <FirstTime v-if="is_first_time" :parent_modal="$modal" />
        <Journey v-else :parent_modal="$modal" :item_idx="0" :is_first_time="is_first_time" />
    </Frame>
</template>

<script lang="ts">
    /**
     *  =============================================================
     * 
     *  Modal frame for tutorial pages
     *  [Description] - called in Tutorials page, note that this frame cannot solely exists without a pop-up page. Depending on whether the user is first-time here, this frame navigate to FirstTime or Journey
     *  [Related] - styles in tutorial.scss
     *  @prop {Boolean} is_first_time - variable indicating whether current user is a first-time user
     * 
     *  =============================================================
     * **/

    import FirstTime from './FirstTime.vue';
    import Journey from './Journey.vue';

    import { mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";

    export default {
        data() {
            return {
                
            }
        },
        created() {
        },
        props: {
            is_first_time: {
                type: Boolean,
                required: true,
            },
        },
        components: {
            FirstTime,
            Journey,
        },
        computed: {
            ...mapGetters([
                'tutorials'
			]),
        },
        methods: {
        },
        
    };
</script>

<style>
</style>