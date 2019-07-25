<template>
    <Page class="page notes-page" @navigatingFrom="onNavigatingFrom">
        <GridLayout rows="auto, *" columns="*" 
                    :class="ctnrSetting.class" 
                    ref="notesGridRef" 
                    @tap="clearTextfieldFocus"
                    @layoutChanged="onLayoutUpdate">
            <ScrollView>
                <StackLayout row="1" col="0" class="notes-main-ctnr">
                    <Label class="notes-title" text="Additioanl Notes" ></Label>   
                    <StackLayout>
                        <TextView v-model="c_info" 
                                  id="notes-free"
                                  class="notes-free"
                                  hint="Additional Notes."
                                  @textChange="resetTextviewModel"
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
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';
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
            loadExistingNote() {
                if (this.log_id) {
                    const curr_log = this.logs.find((elem) => { return elem.id === this.log_id; });
                    this.c_notes = curr_log.info;
                }
            },
            resetTextviewModel(args) {
                this.c_info = args.value;
            },
            onSaveTap(args) {
                const entry = {
                    id: this.log_id,
                    notes: this.c_notes
                };
                this.changeClientNotes(entry);

                this.$modal.close();
            },
            onCloseTap() {
                this.$modal.close();
            },
            clearTextfieldFocus(args) {
                const aTextfield = args.object.getViewById(`notes-free`);
                aTextfield.dismissSoftInput();
            },
            onNavigatingFrom() {
                
            },
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