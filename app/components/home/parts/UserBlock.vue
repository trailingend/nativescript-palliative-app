<template>
    <StackLayout class="user-ctnr" @tap="onEditTap">
        <FlexboxLayout justifyContent="space-between" alignItems="flex-start" v-if="curr_user_id != -1">
            <StackLayout class="user-head" :background="user.color"></StackLayout>
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
    /**
     *  =============================================================
     * 
     *  Component to show current logged-in user information
     *  [Description] - used in Dashboard
     *  [Related] - styles in dashboard.scss
     *  @param {Object} user - current user's information
     *      - {String} id - user's employee ID
     *      - {String} name - user's first name and the initial of their last name
     * 
     *  =============================================================
     * **/
    import SelectUser from '../SelectUser.vue';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                user: {
                    id: '000000',
                    name: 'Nomen Nescio',
                    shift_start: '5:30',
                    shift_end: '8:30',
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
            /**
             *  Function to prepare current user infomration
             *  @event userChange - ask Dashboard to change style on user change
             * **/
            prepareUser() {
                if (this.curr_user_id != -1) {
                    this.user = this.users.find((user)=> {return user.id === this.curr_user_id; });
                    this.$emit("userChange");
                } 
            },
            /**
             *  Function to open SelectUser page when the component is tapped
             * **/
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