<template>
    <StackLayout class="user-ctnr">
        <FlexboxLayout orientation="horizontal" alignItems="flex-start">
            <Image class="user-head" src="~/assets/images/head1.png" stretch="aspectFit"></Image>
            <GridLayout rows="auto, auto" columns="auto, *">
                <Label row="0" col="0" class="user-q1 user-q" text="Name:" textWrap="true"/>
                <TextField row="0" col="1" class="user-a1 user-a" v-model="u_name" hint="Enter your name..." />
                <Label row="1" col="0" class="user-q2 user-q" text="ID #:" textWrap="true"/>
                <TextField row="1" col="1" class="user-a2 user-a" v-model="u_email" hint="Enter your id..." />
            </GridLayout>
        </FlexboxLayout>
        <Label class="user-q user-q3" text="Shift ends:" />
        <TextField class="user-a user-a3 " v-model="u_shift" hint="Enter your shift time..." />
        <Image class="edit-icon" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
    </StackLayout>
</template>

<script lang="ts">
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                u_phone: '',
                u_name: '',
                u_shift: '3:25',
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