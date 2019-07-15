<template>
    <StackLayout>
        <Label text="one protocol summary" />
    </StackLayout>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
            }
        },
        created() {
            this.prepareSummary();
        },
        components: {
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
                'protocols',
                'assessment_letters'
			]),
		},
        methods: {
            ...mapActions([
            ]),
            prepareSummary() {
            },
        },
        
    };
</script>