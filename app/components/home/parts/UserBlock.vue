<template>
    <StackLayout class="user-ctnr" @tap="onEditTap">
        <FlexboxLayout justifyContent="space-between" alignItems="flex-start" v-if="curr_user_id != -1">
            <StackLayout class="user-head" :background="user.color" @tap="onDotTap"></StackLayout>
            <StackLayout>
                <Label class="user-item user-bold" :text="user.name" />
                <Label class="user-item user-text" :text="`ID #: ${user.id}`" />
                <Label class="user-item user-shift" :text="`Shift: ${user.shift_start} - ${user.shift_end}`" />
            </StackLayout>
            <StackLayout class="edit-ctnr">
                <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
            </StackLayout>
        </FlexboxLayout>
        <FlexboxLayout justifyContent="center" alignItems="center" v-else>
            <StackLayout >
                <Label class="user-item user-begin-text" text="START" />
                <Label class="user-item user-begin-text" text="MY SHIFT" />
            </StackLayout>   
            <StackLayout>
                <Image class="edit-icon" src="~/assets/images/arrow.png" stretch="aspectFit"></Image>
            </StackLayout>
        </FlexboxLayout>
    </StackLayout>
</template>

<script lang="ts">
    import SelectUser from '../SelectUser.vue';
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
                'curr_user_id',
                'users'
			]),
		},
        methods: {
            prepareUser() {
                if (this.curr_user_id != -1) {
                    this.user = this.users.find((user)=> {return user.id === this.curr_user_id; });
                    this.$emit("userChange");
                } 
            },
            onDotTap() {

            },
            onEditTap() {
                this.$showModal(SelectUser, { 
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