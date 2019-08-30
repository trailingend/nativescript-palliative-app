<template>
    <Page class="page notes-page">
        <GridLayout rows="auto, *" columns="*" 
                    :class="ctnrSetting.class" 
                    ref="notesGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <ScrollView>
                <StackLayout row="1" col="0" class="notes-main-ctnr">
                    <Label class="notes-title" text="Additional Notes" ></Label>   
                    <StackLayout class="notes-free-ctnr">
                        <TextView v-model="c_notes" 
                                  id="notes-free"
                                  class="notes-free"
                                  hint="Additional Notes."
                                  @textChange="saveNotes"
                                  ref="notesTextRef"
                                  editable="true" />
                    </StackLayout>
                    <Button class="form-btn notes-btn" text="save" @tap="onSaveTap" />
                </StackLayout>
            </ScrollView>

            <Image row="0" col="0" width=30 class="close-btn" src="~/assets/images/close.png" stretch="aspectFit" @tap="onCloseTap"></Image>
        </GridLayout>
    </Page>
</template>

<script>
    /**
     *  =============================================================
     * 
     *  Modal to let user input any additional / uncategoried notes
     *  [Description] - used in ClientBlock, in every client document related pages.
     *  [Related] - styles in clientBlock.scss
     *  @param {String} c_id - id of client
     *  @param {String} c_notes - content of notes
     *  @param {Object} ctnrSetting - variable to store screen-size sensitive classnames information 
     *  @prop {String} log_id - id the current client document
     * 
     *  =============================================================
     * **/

    import { mapActions, mapGetters } from 'vuex';
    import * as utils from "tns-core-modules/utils/utils";
    
    export default {
        data() {
            return {
                c_id: '',
                c_notes: '',

                ctnrSetting: {
                    class: "notes-ctnr",
                },
            }
        },
        created() {
        },
        mounted() {
            this.loadExistingNote();
        },
        components: {
        },
        props: {
            log_id: {
                type: String,
                required: false,
            }
        },
        computed: {
            ...mapGetters([
                'logs',
            ]),
		},
        methods: {
            ...mapActions([
                'changeClientNotes',
            ]),
            /**
             *  Function to retrieve previously saved notes
             * **/
            loadExistingNote() {
                if (this.log_id) {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    this.c_notes = curr_log.notes;
                }
            },
            /**
             *  Function to save user response to data storage
             *  @param args - the event object
             * **/
            saveNotes(args) {
                const entry = {
                    log_id: this.log_id,
                    content: args.value
                };
                this.changeClientNotes(entry);
            },
            /**
             *  Function to close current modal
             * **/
            onSaveTap(args) {
                this.$modal.close();
            },
            /**
             *  Function to close current modal
             * **/
            onCloseTap() {
                this.$modal.close();
            },
            /**
             *  Function to dismiss keyboard if tapping on any non-hotspot places on the screen
             * **/
            clearTextfieldFocus(args) {
                const aTextfield = args.object.getViewById(`notes-free`);
                aTextfield.dismissSoftInput();
            },
            /**
             *  Function to swap class-level classnames on media query changes
             * **/
            onLayoutUpdate() {
                if (this.$refs.notesGridRef) {
                    const width = utils.layout.toDeviceIndependentPixels( this.$refs.notesGridRef.nativeView.getMeasuredWidth() );
                    if (width > 800) {
                        this.ctnrSetting.class = "notes-ctnr tablet-landscape";
                    } else {
                        this.ctnrSetting.class = "notes-ctnr";
                    }
                }
            },
            
        }
        
    };
</script>