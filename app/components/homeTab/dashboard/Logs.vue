<template>
    <ScrollView class="patient-list" row="0" col="0">
        <ListView for="patient in patients" @itemTap="onItemTap">
            <v-template>
                <FlexboxLayout flexDirection="row" class="patient-item">
                    <Label :text="patient.name" class="patient-name patient-text"/>
                    <Label :text="patient.phone" class="patient-phone patient-text"/>
                </FlexboxLayout>
            </v-template>
        </ListView>
    </ScrollView>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
            }
        },
        created() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
				'patients',
			])
		},
        methods: {
            ...mapActions([
            ]),
        },
        
    };
</script>

<style>
</style>