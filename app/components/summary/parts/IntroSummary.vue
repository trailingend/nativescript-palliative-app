<template>
    <StackLayout class="sum-sec-ctnr">
        <Label text="Introduction" class="sum-sec-title"/>
        </FlexboxLayout>
        <StackLayout>
            <FlexboxLayout orientation="horizontal" alignItems="center" justifyContent="space-between">
                <Label text="step 1" class="sum-item-title"/>
                <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </FlexboxLayout>
        </StackLayout>
    </StackLayout>
</template>

<script lang="ts">
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
        },
        computed: {
            ...mapGetters([
                'logs',
                'intro'
			]),
		},
        methods: {
            prepareSummary() {
                const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                if (curr_log) {
                    
                }
            },
        },
        
    };
</script>