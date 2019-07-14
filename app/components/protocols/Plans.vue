<template>
    
</template>

<script lang="ts">


    export default {
        data() {
            return {

            }
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
        computed: {
            ...mapGetters([
                'logs',
			]),
		},
        methods: {
            ...mapActions([
            ]),
            
        },
        
    };
</script>

<style>
</style>