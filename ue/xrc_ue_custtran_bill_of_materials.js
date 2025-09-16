/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define(['N/record', 'N/ui/serverWidget', 'N/runtime', 'N/search'],

    function (record, serverWidget, runtime, search) {

        const BOQ_NUM_FIELD_ID = 'tranid';
        const APPROVAL_STATUS_FIELD_ID = 'transtatus';
        const PENDING_REVISION_APPROVAL_STATUS = 'B';
        const REVISION_APPROVED_STATUS = 'C';
        const REVISION_REJECTED_STATUS = 'D';
        const PENDING_APPROVAL_STATUS = 'F';
        const REJECTED_STATUS = 'G';
        const APPROVED_STATUS = 'H';
        const ITEMS_SUBLIST_ID = 'item';
        const QTY_SUBLIST_FIELD_ID = 'quantity';
        const ORIGINAL_QTY_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_orig_qty';
        const UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_unapproved_adj';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const ESTIMATED_RATE_FIELD_ID = 'rate';
        const VENDOR_FIELD_ID = 'entity';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const APPROVAL_THREE_FIELD_ID = 'custbody_xrc_approval3';
        const APPROVAL_FOUR_FIELD_ID = 'custbody_xrc_approval4';
        const REVISION_ONE_FIELD_ID = 'custbody_xrc_billmat_rev1';
        const REVISION_TWO_FIELD_ID = 'custbody_xrc_billmat_rev2';
        const REVISION_THREE_FIELD_ID = 'custbody_xrc_billmat_rev3';
        const REVISION_FOUR_FIELD_ID = 'custbody_xrc_billmat_rev4';
        const HISTORICAL_VALUES_FIELD_ID = 'custbody_xrc_historical_values';
        const LINE_UNIQUE_KEY_SUBLIST_FIELD_ID = 'lineuniquekey';
        const APPROVER_ROLE_IDS = [1479, 1462, 1486, 1487, 1475, 1460]; // Roles IDs = [QSM, Engineering Head, Design Head, MEPF Head, President, COO]
        const REVISION_APPROVER_ROLE_IDS = [1479, 1462, 1475, 1418]; // [QSM, Engineering Head, President, Chairman]
        const BOQ_LAST_NUM_FIELD_ID = 'custscript_xrc_boq_last_num';
        const LOCATION_FIELD_ID = 'location';
        const DATE_FIELD_ID = 'trandate';


        function beforeLoad(context) {

            try {


                var newRecord = context.newRecord;

                var currentUser = runtime.getCurrentUser();

                var form = context.form;

                var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                // Referencing the sublist Items
                var sublist = form.getSublist({
                    id: ITEMS_SUBLIST_ID,
                });

                // Disabling the Update Qty column
                form.getSublist(ITEMS_SUBLIST_ID)
                    .getField(QTY_SUBLIST_FIELD_ID)
                    .updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED });

                if (context.type === context.UserEventType.VIEW) {

                    var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                    // if (for_approval && currentUser.id === parseInt(prepared_by)) {

                    //     form.removeButton({
                    //         id: "edit",
                    //     });

                    // }

                    if (!for_approval && (parseInt(prepared_by) === currentUser.id || currentUser.id === 7)) {

                        // Adding button Submit for Aprpoval
                        form.addButton({
                            id: 'custpage_submit_for_approval',
                            label: approval_status === REJECTED_STATUS || approval_status === REVISION_REJECTED_STATUS ? 'Resubmit for Approval' : 'Submit for Approval',
                            functionName: 'onSubmitForApprovalBtnClick("' + APPROVER_ROLE_IDS[0] + '")',
                        });

                    } else if (approval_status === PENDING_APPROVAL_STATUS || approval_status === PENDING_REVISION_APPROVAL_STATUS) {

                        var next_approver = getNextApproverRole(newRecord);

                        log.debug('next_approver', next_approver);
                        
                        if (currentUser.role === next_approver.role) {

                            // var for_revision = approval_status === PENDING_REVISION_APPROVAL_STATUS;

                            // Adding the button Approve
                            form.addButton({
                                id: 'custpage_approve',
                                label: 'Approve',
                                functionName: 'onApproveBtnClick("' + next_approver.field + '","' + next_approver.role_to_email + '")',
                            });

                            // Adding the button Reject
                            form.addButton({
                                id: 'custpage_reject',
                                label: 'Reject',
                                functionName: 'onRejectBtnClick()',
                            });

                        }

                    } else if (approval_status !== APPROVED_STATUS && approval_status !== REVISION_APPROVED_STATUS) {

                        // Adding the button Close
                        form.addButton({
                            id: 'custpage_close',
                            label: 'Close',
                            functionName: 'onCloseBtnClick()',
                        });

                    }

                    // Include the path of the client script
                    form.clientScriptModulePath = './xrc_cs_custtran_bill_of_materials.js';

                } else if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY) {

                    newRecord.setValue('tranid', "To Be Generated");

                    newRecord.setValue('transtatus', 'F');

                    // Setting default value for vendor field that has all the
                    // subsidiary
                    form.getField({
                        id: VENDOR_FIELD_ID,
                    }).defaultValue = '23';

                    // Disable Unapproved Adjustments on EDIT
                    var unapproved_adjustments_field = sublist.getField({
                        id: UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID,
                    });

                    unapproved_adjustments_field.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED,
                    });

                } else if (context.type === context.UserEventType.EDIT) {

                    if (approval_status !== PENDING_APPROVAL_STATUS) {

                        form.getSublist(ITEMS_SUBLIST_ID)
                            .getField(ORIGINAL_QTY_SUBLIST_FIELD_ID)
                            .updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED });

                    }
                }

                // Hiding Vendor field
                form.getField({
                    id: VENDOR_FIELD_ID,
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN,
                });

                // Hiding Vendor field
                form.getField({
                    id: HISTORICAL_VALUES_FIELD_ID,
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN,
                });

            } catch (error) {

                log.debug('error', error);

            }

        }

        function beforeSubmit(context) {

            var newRecord = context.newRecord;

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            if (context.type === context.UserEventType.EDIT) {

                if (approval_status === APPROVED_STATUS || approval_status === REVISION_APPROVED_STATUS) {

                    var oldRecord = context.oldRecord;

                    var old_items_lines = oldRecord.getLineCount({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    var items_lines = newRecord.getLineCount({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    if (old_items_lines !== items_lines) {

                        newRecord.setValue(FOR_APPROVAL_FIELD_ID, false);

                        newRecord.setValue(APPROVAL_STATUS_FIELD_ID, PENDING_REVISION_APPROVAL_STATUS);

                        newRecord.setValue(REVISION_ONE_FIELD_ID, false);

                        newRecord.setValue(REVISION_TWO_FIELD_ID, false);

                        newRecord.setValue(REVISION_THREE_FIELD_ID, false);

                        newRecord.setValue(REVISION_FOUR_FIELD_ID, false);

                        return;

                    }

                    for (var line = 0; line < items_lines; line++) {

                        // var old_line = oldRecord.getSublistValue({
                        //     sublistId: ITEMS_SUBLIST_ID,
                        //     fieldId: 'line',
                        //     line: line,
                        // });

                        // var new_line = newRecord.getSublistValue({
                        //     sublistId: ITEMS_SUBLIST_ID,
                        //     fieldId: 'line',
                        //     line: line,
                        // });

                        // if (old_line) {

                        //     var old_estimated_rate = oldRecord.getSublistValue({
                        //         sublistId: ITEMS_SUBLIST_ID,
                        //         fieldId: ESTIMATED_RATE_FIELD_ID,
                        //         line: old_line,
                        //     });

                        //     var new_estimated_rate = newRecord.getSublistValue({
                        //         sublistId: ITEMS_SUBLIST_ID,
                        //         fieldId: ESTIMATED_RATE_FIELD_ID,
                        //         line: old_line,
                        //     });

                        //     log.debug('rates', 'old: ' + old_estimated_rate + ' new: ' + new_estimated_rate);

                        //     if (old_estimated_rate !== 0 && old_estimated_rate) {

                        //         if (new_estimated_rate !== old_estimated_rate) {

                        //             throw 'Cannot modify Estimated Rate on existing lines.';

                        //         }

                        //     }

                        // }

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

                        // Reset approval if Unapproved Adjustment column was changed
                        if (old_unpproved_adjustment !== new_unpproved_adjustment) {

                            newRecord.setValue(FOR_APPROVAL_FIELD_ID, false);

                            newRecord.setValue(APPROVAL_STATUS_FIELD_ID, PENDING_REVISION_APPROVAL_STATUS);

                            newRecord.setValue(REVISION_ONE_FIELD_ID, false);

                            newRecord.setValue(REVISION_TWO_FIELD_ID, false);

                            newRecord.setValue(REVISION_THREE_FIELD_ID, false);

                            newRecord.setValue(REVISION_FOUR_FIELD_ID, false);
                        }
                    }

                }
            }


        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var currentUser = runtime.getCurrentUser();

            // var user_can_edit = canEdit(newRecord, currentUser);

            // if (user_can_edit) return;

            // if (context.type === context.UserEventType.EDIT) {

            //     if (approval_status === APPROVED_STATUS) {

            //         record.submitFields({
            //             type: newRecord.type,
            //             id: newRecord.id,
            //             values: {
            //                 [APPROVAL_ONE_FIELD_ID]: false,
            //                 [APPROVAL_TWO_FIELD_ID]: false,
            //                 [APPROVAL_THREE_FIELD_ID]: false,
            //                 [APPROVAL_FOUR_FIELD_ID]: false,
            //                 [FOR_APPROVAL_FIELD_ID]: false,
            //                 [APPROVAL_STATUS_FIELD_ID]: PENDING_APPROVAL_STATUS,
            //             },
            //             options: {
            //                 ignoreMandatoryFields: true
            //             }
            //         });

            //     } else if (approval_status === REVISION_APPROVED_STATUS) {

            //         record.submitFields({
            //             type: newRecord.type,
            //             id: newRecord.id,
            //             values: {
            //                 [REVISION_ONE_FIELD_ID]: false,
            //                 [REVISION_TWO_FIELD_ID]: false,
            //                 [REVISION_THREE_FIELD_ID]: false,
            //                 [REVISION_FOUR_FIELD_ID]: false,
            //                 [FOR_APPROVAL_FIELD_ID]: false,
            //                 [APPROVAL_STATUS_FIELD_ID]: PENDING_REVISION_APPROVAL_STATUS,
            //             },
            //             options: {
            //                 ignoreMandatoryFields: true
            //             }
            //         });

            //     }

            // }

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                try {
                    updateHistoricalValues(newRecord);

                    var date = newRecord.getValue(DATE_FIELD_ID);

                    // Generate series on CREATE context type and on date after opening balance
                    (isAfterOpeningBalance(date)) && handleSeriesGeneration(newRecord);

                } catch (error) {
                    log.debug('error', error);
                }

            }

        }

        function getNextApproverRole(newRecord) {

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var fields = approval_status === PENDING_APPROVAL_STATUS ? ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4', 'custbody_xrc_approval5', 'custbody_xrc_approval6'] : ['custbody_xrc_billmat_rev1', 'custbody_xrc_billmat_rev2', 'custbody_xrc_billmat_rev3', 'custbody_xrc_billmat_rev4'];

            var roles = approval_status === PENDING_APPROVAL_STATUS ? APPROVER_ROLE_IDS : REVISION_APPROVER_ROLE_IDS;

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked) {

                    return {
                        field: fields[i],
                        role: roles[i],
                        role_to_email: roles[i + 1],
                    };
                }

            }

        }

        function canEdit(newRecord, currentUser) {

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var fields = approval_status === PENDING_APPROVAL_STATUS ? ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4', 'custbody_xrc_approval5', 'custbody_xrc_approval6'] : ['custbody_xrc_billmat_rev1', 'custbody_xrc_billmat_rev2', 'custbody_xrc_billmat_rev3', 'custbody_xrc_billmat_rev4'];

            var roles = approval_status === PENDING_APPROVAL_STATUS ? APPROVER_ROLE_IDS : REVISION_APPROVER_ROLE_IDS;

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked && currentUser.role === roles[i]) {

                    return true;
                }

            }

            return false;

        }

        function updateHistoricalValues(newRecord) {

            var values = [];

            var boq_rec = record.load({
                type: newRecord.type,
                id: newRecord.id
            });

            var items_lines = boq_rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                var line_unique_key = boq_rec.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: LINE_UNIQUE_KEY_SUBLIST_FIELD_ID,
                    line: line,
                });

                var estimated_rate = boq_rec.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ESTIMATED_RATE_FIELD_ID,
                    line: line,
                });

                values.push({ line_unique_key, estimated_rate });
            }

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [HISTORICAL_VALUES_FIELD_ID]: JSON.stringify(values),
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

        }

        function handleSeriesGeneration(newRecord) {

            try {

                var current_script = runtime.getCurrentScript();

                var json_string = current_script.getParameter({ name: BOQ_LAST_NUM_FIELD_ID });

                var last_num_obj = JSON.parse(json_string);

                var location_code = getLocationCode(newRecord.getValue(LOCATION_FIELD_ID));

                var next_num = (parseInt(last_num_obj[location_code]) || 0) + 1;

                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        [BOQ_NUM_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'BOQTY-'), // Attaching the generated new number on saving the record
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                last_num_obj[location_code] = next_num;

                updateLastNumber(last_num_obj);

            } catch (error) {

                log.debug('error', error);
            }


        }

        function getLocationCode(location_id) {

            const fieldLookUp = search.lookupFields({
                type: search.Type.LOCATION,
                id: location_id,
                columns: ['tranprefix']
            });

            return fieldLookUp['tranprefix'];

        }

        function updateLastNumber(new_obj) {

            record.submitFields({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 2202, // Script Deployment ID
                values: {
                    [BOQ_LAST_NUM_FIELD_ID]: JSON.stringify(new_obj),
                },
                options: {
                    ignoreMandatoryFields: true,
                }
            });

        }

        function appendLeadingZeros(newCode, prefix) {

            var leadingZeros = '0000';
            var zerosLength = 4;

            newCode = newCode.toString();

            if (newCode.length <= zerosLength) {
                leadingZeros = leadingZeros.slice(0, zerosLength - newCode.length);
                newCode = prefix + leadingZeros + newCode;
            } else {
                newCode = prefix + newCode;
            }

            return newCode;
        }

        function isAfterOpeningBalance(date) {

            return date >= new Date("2024-11-01");

        }

        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit,
        };
    }
);