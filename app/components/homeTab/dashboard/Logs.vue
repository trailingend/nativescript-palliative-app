<template>
        <ScrollView class="patient-list">
            <ListView for="patient in patients" @itemTap="onItemTap">
                <v-template>
                    <FlexboxLayout alignItems="stretch" >
                        <Image width="50" class="user-head" src="~/assets/images/loading.png" stretch="aspectFit"></Image>
                        <StackLayout flexGrow="2">
                            <Label :text="patient.client" class="patient-name patient-top patient-text"/>
                            <Label :text="patient.phone" class="patient-phone patient-text"/>
                            <Label :text="patient.patient" class="patient-name patient-text"/>
                            <Label :text="patient.createdTime" class="patient-time patient-text" />
                        </StackLayout>
                        <!-- <Image class="edit-icon" padding="25" alignSelf="flex-end" src="~/assets/images/pen.png" stretch="aspectFit"></Image> -->
                        <Button class="patient-btn" text="DELETE" @itemTap="onDeleteTap"></Button>
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