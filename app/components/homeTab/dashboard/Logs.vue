<template>
        <ScrollView class="patient-list">
            <ListView for="patient in patients" @itemTap="onItemTap">
                <v-template>
                    <FlexboxLayout alignItems="center" >
                        <Image width="50" class="user-head" src="~/assets/images/loading.png" stretch="aspectFit"></Image>
                        <StackLayout width="72%">
                            <Label :text="patient.client" class="patient-name patient-top patient-text"/>
                            <Label :text="patient.phone" class="patient-phone patient-text"/>
                            <Label :text="patient.patient" class="patient-name patient-text"/>
                            <Label :text="patient.createdTime" class="patient-time patient-text"/>
                        </StackLayout>
                        <Button text="DELETE"></Button>
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