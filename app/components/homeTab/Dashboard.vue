<template>
    <Page class="page home-page">
        <ActionBar title="Dashboard"></ActionBar>

        <GridLayout class="home-ctnr" rows="auto, auto, *, 250" columns="*, *">
            <StackLayout row="0" col="0" class="home-logo-ctnr">
                <Image class="home-logo" src="~/assets/images/logo.png" stretch="aspectFill" ></Image>
            </StackLayout>
            <StackLayout row="0" col="1" class="home-user-ctnr">
                <UserForm row="1" />
            </StackLayout>
            <FlexboxLayout row="1" col="0" colSpan="2" flexDirection="column" class="log-title-ctnr">
                <Label class="log-title" text="Log" />
                <Label class="log-title" text="Progress" />
            </FlexboxLayout>
            <Logs row="2" col="0" colSpan="2" class="home-log-ctnr" />
            <StackLayout row="3" col="0" colSpan="2" class="home-btn-ctnr" @tap="onNewTap">
                <Image class="home-add" src="~/assets/images/plus.png" stretch="aspectFit"></Image>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
    import Logs from './dashboard/Logs.vue';
    import UserForm from './dashboard/UserForm.vue';

    export default {
        data() {
            return {
            }
        },
        created() {
        },
        components: {
            Logs,
            UserForm,
        },
        computed: {
           
		},
        methods: {
           
        },
        
    };
</script>

<style>
</style>