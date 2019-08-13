<template>
    <Frame id="tutorialFrame" ref="tFrameRef">
        <FirstTime v-if="is_first_time" :parent_modal="$modal" />
        <Journey v-else :parent_modal="$modal" :item_idx="0" />
    </Frame>
</template>

<script lang="ts">
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