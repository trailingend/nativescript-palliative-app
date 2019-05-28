<template>
    <StackLayout class="user-ctnr">
        <GridLayout rows="auto, auto" columns="auto, *">
            <Label row="0" col="0" class="user-q1 user-q" text="Name:" textWrap="true"/>
            <TextField row="0" col="1" class="user-a1 user-a" 
                                        v-model="user.name" 
                                        hint="Firstname Lastname"
                                        @returnPress="onUserUpdate" />
            <Label row="1" col="0" class="user-q2 user-q" text="ID #:" textWrap="true"/>
            <TextField row="1" col="1" class="user-a2 user-a" 
                                        v-model="user.id" 
                                        hint="Enter your id..."
                                        @returnPress="onUserUpdate" />
        </GridLayout>
        <FlexboxLayout justifyContent="space-between" alignItems="flex-end">
            <StackLayout>
                <Label class="user-q user-q3" text="Shift ends:" />
                <TextField class="user-a user-a3 " 
                        v-model="user.shift" 
                        hint="Enter your shift time..."
                        @returnPress="onUserUpdate" />
            </StackLayout>
            <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
        </FlexboxLayout>
    </StackLayout>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                user: {
                    id: '',
                    name: '',
                    shift: '3:25'
                },
            }
        },
        mounted() {
        },
        components: {
        },
        computed: {
            ...mapGetters([
                'currUserIdx',
                'users'
			]),
		},
        methods: {
            ...mapActions([
                'saveUserInfo'
            ]),
            onUserUpdate(args) {
                this.saveUserInfo(this.user);
            },
        },
        
    };
</script>

<style>
</style>