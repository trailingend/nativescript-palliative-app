<template>
    <Page class="page home-page">
        <GridLayout class="home-ctnr" rows="auto, auto, *, auto" columns="*">
            <Image row="0" class="home-logo" src="~/assets/images/vch-logo.png" stretch="aspectFill" ></Image>
            <UserForm row="1" />
            <Logs row="2" />
            <Button row="3" class="home-add-btn" text="+" @tap="onNewTap" />
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