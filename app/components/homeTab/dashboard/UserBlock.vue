<template>
    <StackLayout class="user-ctnr" @tap="onEditTap">
        <GridLayout rows="auto, auto" columns="auto, *">
            <Label row="0" col="0" class="user-q1 user-q" text="Name:" textWrap="true"/>
            <Label row="0" col="1" class="user-a1 user-a" :text="user.name" />
            <Label row="1" col="0" class="user-q2 user-q" text="ID #:" textWrap="true"/>
            <Label row="1" col="1" class="user-a2 user-a" :text="user.id" />
        </GridLayout>
        <FlexboxLayout justifyContent="space-between" alignItems="flex-end">
            <StackLayout>
                <Label class="user-q user-q3" text="Shift ends:" />
                <Label class="user-a user-a3 " :text="user.shift" />
            </StackLayout>
            <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
        </FlexboxLayout>
    </StackLayout>
</template>

<script lang="ts">
    import UserForm from './UserForm.vue';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                user: {
                    id: '888888',
                    name: 'Nomen Nescio',
                    shift: '5:30PM'
                },
            }
        },
        mounted() {
            this.prepareUser();
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
            prepareUser() {
                if (this.currUserIdx != -1) {
                    this.user = this.users[this.currUserIdx];
                } 
            },
            onEditTap() {
                this.$showModal(UserForm, { 
                    fullscreen: true,
                }).then(data => {
                    this.prepareUser();
                });
            },
        },
       
    };
</script>

<style>
</style>