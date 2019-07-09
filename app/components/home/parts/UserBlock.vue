<template>
    <StackLayout class="user-ctnr" @tap="onEditTap">
        <FlexboxLayout justifyContent="space-between" alignItems="flex-start">
            <StackLayout>
                <Label class="user-item user-bold" :text="user.name" />
                <Label class="user-item" :text="`ID #: ${user.id}`" />
                <Label class="user-item user-shift" :text="`Shift ends: ${user.shift}`" />
            </StackLayout>
            <StackLayout>
                <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </StackLayout>
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