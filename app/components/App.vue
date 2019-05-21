<template>
    <Page>
        <TabView>
            <TabViewItem title="Home">
                <GridLayout columns="*" rows="*">
                    <Label class="message" text="Tab1" col="0" row="0"/>
                </GridLayout>
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
    export default {
        data() {
            return {
                
            }
        }
    }
</script>

<style scoped>

</style>
