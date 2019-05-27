<template>
    <Page>
        <TabView>
            <TabViewItem title="Home">
                <Frame id="homeFrame">
                    <DashBoard />
                </Frame>
            </TabViewItem>
            <TabViewItem title="Log">
                <Frame id="logFrame">
                    <Placeholder />
                </Frame>
            </TabViewItem>
            <TabViewItem title="Resources">
                <GridLayout columns="*" rows="*">
                    <Label class="message" text="Placeholder for Resources" col="0" row="0"/>
                </GridLayout>
            </TabViewItem>
            <TabViewItem title="Glossary">
                <GridLayout columns="*" rows="*">
                    <Label class="message" text="Placeholder for Glossary" col="0" row="0"/>
                </GridLayout>
            </TabViewItem>
            <TabViewItem title="Settings">
                <GridLayout columns="*" rows="*">
                    <Label class="message" text="Placeholder for Settings" col="0" row="0"/>
                </GridLayout>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script lang="ts">
    import DashBoard from './homeTab/Dashboard.vue';
    
    import Placeholder from './logTab/Placeholder.vue';

    export default {
        data() {
            return {
                
            }
        },
        components: {
            DashBoard,
            Placeholder
        },
    }
</script>

<style scoped>

</style>
