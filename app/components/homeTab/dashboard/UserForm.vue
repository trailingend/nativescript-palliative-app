<template>
    <StackLayout class="user-ctnr">
        <StackLayout orientation="horizontal">
            <Image width="50" class="user-head" src="~/assets/images/head1.png" stretch="aspectFit"></Image>
            <StackLayout orientation="vertical">
                <FlexboxLayout flexDirection="row">
                    <Label class="user-q1 user-q" text="Name:" textWrap="true"/>
                    <TextField class="user-a1 user-a" v-model="u_name" hint="Enter your name..." />
                </FlexboxLayout>
                <FlexboxLayout flexDirection="row">
                    <Label class="user-q2 user-q" text="ID #:" textWrap="true"/>
                    <TextField class="user-a2 user-a" v-model="u_email" hint="Enter your id..." />
                </FlexboxLayout>
            </StackLayout>
        </StackLayout>
        <StackLayout orientation="vertical">
            <Label class="user-q3 user-q" text="Shift ends:" textWrap="true"/>
            <TextField width="90" class="user-a3 user-a" v-model="u_shift" hint="Enter your shift time..." />
        </StackLayout>
        <Image width="20" class="user-head" src="~/assets/images/pen.png" stretch="aspectFit"></Image>
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