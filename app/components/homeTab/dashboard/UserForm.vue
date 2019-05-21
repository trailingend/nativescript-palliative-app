<template>
    <StackLayout class="user-ctnr">
        <Label class="user-q1 user-q" text="User Name:" textWrap="true"/>
        <TextField class="user-a1 user-a" v-model="u_name" hint="Enter your name..." />
        <Label class="user-q2 user-q" text="User email:" textWrap="true"/>
        <TextField class="user-a2 user-a" v-model="u_email" hint="Enter your email..." />
    </StackLayout>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                u_phone: '',
                u_name: '',
            }
        },
        created() {
        },
        components: {
        },
        computed: {
		},
        methods: {
            ...mapActions([
            ]),
        },
        
    };
</script>

<style>
</style>