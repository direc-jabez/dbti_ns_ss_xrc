/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define(['N/record', 'N/ui/serverWidget', 'N/runtime'],

    function (record, serverWidget, runtime) {

        const BOM_NUMBER_FIELD_ID = 'z';
        const CUSTOM_IDS_RECORD_ID = 'customrecord_xrc_custom_ids';
        const LAST_BOM_NUMBER_FIELD_ID = 'custrecord_xrc_last_bom_num';
        const BOM_PREFIX = 'BOM';
        const APPROVAL_STATUS_FIELD_ID = 'custrecord_xrc_bom_approval_status';
        const PENDING_APPROVAL_STATUS = '2';
        const BOM_CLOSED_STATUS = '4';
        const ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_bom_link';
        const ORIGINAL_QTY_SUBLIST_FIELD_ID = 'custrecord_xrc_bom_original_qty';
        const UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID = 'custrecord_xrc_bom_unapproved_adj';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_bom_for_approval';
        const ESTIMATED_RATE_FIELD_ID = 'custrecord_xrc_bom_est_rate';
        const ADMIN_ROLE_ID = 3;
        const BOSSSS_CHAIRMAN_ID = 1435;
        const APPROVED_STATUS = '2';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var currentUser = runtime.getCurrentUser();

            var form = context.form;

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            // Referencing the sublist Items
            var sublist = form.getSublist({
                id: ITEMS_SUBLIST_ID,
            });

            if (context.type === context.UserEventType.VIEW) {

                log.debug('currentUser.role', currentUser.role);

                if ((for_approval && approval_status === PENDING_APPROVAL_STATUS) && (currentUser.role === ADMIN_ROLE_ID || currentUser.role === BOSSSS_CHAIRMAN_ID)) {

                    // Adding the button Approve
                    form.addButton({
                        id: 'custpage_approve',
                        label: 'Approve',
                        functionName: 'onApproveBtnClick()',
                    });

                    // Adding the button Reject
                    form.addButton({
                        id: 'custpage_reject',
                        label: 'Reject',
                        functionName: 'onRejectBtnClick()',
                    });

                }

                if (approval_status !== BOM_CLOSED_STATUS) {

                    // Adding the button Close
                    form.addButton({
                        id: 'custpage_close',
                        label: 'Close',
                        functionName: 'onCloseBtnClick()',
                    });

                }


                // Include the path of the client script
                form.clientScriptModulePath = './xrc_cs_bill_of_materials.js';

            } else if (context.type === context.UserEventType.CREATE) {

                // Disable Unapproved Adjustments on EDIT
                var unapproved_adjustments_field = sublist.getField({
                    id: UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID,
                });

                unapproved_adjustments_field.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED,
                });

            } else if (context.type === context.UserEventType.EDIT) {

                // if the record is approved, disable the Original Qty column
                // to prevent the alteration
                if (approval_status === APPROVED_STATUS) {

                    // var field = sublist.getField({
                    //     id: ORIGINAL_QTY_SUBLIST_FIELD_ID,
                    // });

                    // field.updateDisplayType({
                    //     displayType: serverWidget.FieldDisplayType.DISABLED,
                    // });

                }

                // Disable Estimated Rate on EDIT
                var est_rate_field = sublist.getField({
                    id: ESTIMATED_RATE_FIELD_ID,
                });

                est_rate_field.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED,
                });

            }

        }

        function beforeSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.EDIT) {

                var oldRecord = context.oldRecord;

                var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

                var items_lines = newRecord.getLineCount({
                    sublistId: ITEMS_SUBLIST_ID,
                });

                for (var line = 0; line < items_lines; line++) {

                    var new_unpproved_adjustment = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var old_unpproved_adjustment = oldRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    // Reset approval if Unapproved Adkustment column was changed
                    if (old_unpproved_adjustment !== new_unpproved_adjustment) {

                        newRecord.setValue(FOR_APPROVAL_FIELD_ID, true);

                        if (approval_status === APPROVED_STATUS) {

                            newRecord.setValue(APPROVAL_STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                        }

                    }
                }
            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                // Getting the last saved BOM number
                var last_number = getLastBOMNumber();

                // Increment the last number
                last_number += 1;

                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        [BOM_NUMBER_FIELD_ID]: appendLeadingZeros(last_number, BOM_PREFIX), // Attaching the generated new number on saving the record
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                // Updating the last current number
                updateLastBOMNumber(last_number);

            }

        }

        // Returns the number of the last created vendor record based on the selected category
        function getLastBOMNumber() {

            var custom_ids = record.load({
                type: CUSTOM_IDS_RECORD_ID,
                id: 1, // Internal id of the custom record
            });

            return custom_ids.getValue(LAST_BOM_NUMBER_FIELD_ID);

        }

        // Updates the number of the last created vendor record based on the selected category
        function updateLastBOMNumber(next_number) {

            var custom_ids = record.load({
                type: CUSTOM_IDS_RECORD_ID,
                id: 1, // Internal id of the custom record
            });

            custom_ids.setValue(LAST_BOM_NUMBER_FIELD_ID, next_number);

            custom_ids.save();
        }

        /**
         * Generating new series number for the current record
         * 
         * @param {*} newCode - the next number
         * @param {*} prefix - BOM series prefix
         * @returns new generated number series
         * 
         */
        function appendLeadingZeros(newCode, prefix) {

            var leadingZeros = '000000';
            var zerosLength = 6;

            newCode = newCode.toString();

            if (newCode.length <= zerosLength) {
                leadingZeros = leadingZeros.slice(0, zerosLength - newCode.length);
                newCode = prefix + leadingZeros + newCode;
            } else {
                newCode = prefix + newCode;
            }

            return newCode;
        }

        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit,
        };
    }
);