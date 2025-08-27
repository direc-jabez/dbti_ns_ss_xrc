/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 01, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const BOM_FIELD_ID = 'custbody_xrc_bom';
        const BOM_RECORD_TYPE_ID = 'custompurchase_xrc_bom';
        const BOM_LOCATION_FIELD_ID = 'location';
        const BOM_ITEMS_SUBLIST_ID = 'item';
        const BOM_ITEM_SUBLIST_FIELD_ID = 'item';
        const BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID = 'custcol_xrc_billmat_qty_to_be_transf';
        const BOM_QTY_TRANSFERRED_FIELD_ID = 'custcol_xrc_billmat_qty_transferred';
        const BOM_QTY_RECEIVED_OTHERS_FIELD_ID = 'custcol_xrc_billmat_qty_received';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const LOCATION_SUBLIST_FIELD_ID = 'location';
        const PO_NUMBER_FIELD_ID = 'custbody_xrc_po_num';
        const TRANSFERRED_SUBLIST_FIELD_ID = 'custcol_xrc_transferred';
        const ORDERED_SUBLIST_FIELD_ID = 'custcol_xrc_ordered';
        const PO_CLOSED_SUBLIST_FIELD_ID = 'isclosed';
        const CREATED_FROM_FIELD_ID = 'createdfrom';
        const CLOSED_SUBLIST_FIELD_ID = 'isclosed';
        const BOM_QTY_RECEIVED_SITE_FIELD_ID = 'custcol_xrc_billmat_qty_received_site';
        const BOM_QTY_AVAILABLE_SITE_FIELD_ID = 'custcol_xrc_billmat_qty_avail_site'
        const TRANSMITTAL_FIELD_ID = 'custbody_xrc_transmittal'


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var created_from_id = newRecord.getValue(CREATED_FROM_FIELD_ID);

                var isVRA = isVendorReturn(created_from_id);

                var isFromTO = isFromTransferOrder(created_from_id);

                var bom_id = newRecord.getValue(BOM_FIELD_ID);

                if (bom_id) {

                    var bom_rec = record.load({
                        type: BOM_RECORD_TYPE_ID,
                        id: bom_id,
                    });

                    if (isVRA) {

                        deductQuantities(newRecord, bom_rec);

                        return;

                    }

                    updateAndCheckTransaction(created_from_id, newRecord);

                    var items_lines = newRecord.getLineCount({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    for (var line = 0; line < items_lines; line++) {

                        // Updateing BOM column values
                        var to_item_id = newRecord.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: ITEMS_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var bom_item_id = bom_rec.getSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: BOM_ITEM_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        // Checking if the items matches
                        if (to_item_id === bom_item_id) {

                            var bom_qty_transferred = bom_rec.getSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_TRANSFERRED_FIELD_ID,
                                line: line,
                            }) || 0;

                            var qty = newRecord.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: QUANTITY_SUBLIST_FIELD_ID,
                                line: line,
                            });

                            var new_qty = bom_qty_transferred + qty;

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_TRANSFERRED_FIELD_ID,
                                line: line,
                                value: new_qty, // Setting the new qty
                            });

                            var qty_received_others = bom_rec.getSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_RECEIVED_OTHERS_FIELD_ID,
                                line: line,
                            }) || 0;

                            if (qty_received_others) {

                                bom_rec.setSublistValue({
                                    sublistId: BOM_ITEMS_SUBLIST_ID,
                                    fieldId: BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID,
                                    line: line,
                                    value: qty_received_others - new_qty,
                                });

                            }
                        }

                    }

                    bom_rec.save({
                        ignoreMandatoryFields: true,
                    });


                }

                log.debug('isFromTO', isFromTO);

                if (isFromTO) {

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [TRANSMITTAL_FIELD_ID]: true,
                        }
                    });

                }


            }

        }

        function updateAndCheckTransaction(to_id, newRecord) {

            // Get the PO id from the linked Transfer Order
            var fieldLookUp = search.lookupFields({
                type: record.Type.TRANSFER_ORDER,
                id: to_id,
                columns: [PO_NUMBER_FIELD_ID]
            });

            var pr_id = fieldLookUp.custbody_xrc_po_num[0].value;

            // Laod the PR
            var pr_rec = record.load({
                type: record.Type.PURCHASE_ORDER,
                id: pr_id,
            });

            // var custom_form = pr_rec.getValue(CUSTOM_FORM_FIELD_ID);

            // if (!(custom_form === PR_FORM_ID)) return;

            var items_lines = pr_rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                var if_item = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                    line: line,
                });

                var pr_item = pr_rec.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (if_item === pr_item) {

                    var qty = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QUANTITY_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var pr_quantity = pr_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QUANTITY_SUBLIST_FIELD_ID,
                        line: line,
                    }) || 0;

                    var transferred = pr_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: TRANSFERRED_SUBLIST_FIELD_ID,
                        line: line,
                    }) || 0;

                    var ordered = pr_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ORDERED_SUBLIST_FIELD_ID,
                        line: line,
                    }) || 0;

                    var new_transferred = transferred + qty;

                    // Update PR's Transferred Column
                    pr_rec.setSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: TRANSFERRED_SUBLIST_FIELD_ID,
                        line: line,
                        value: new_transferred,
                    });

                    // Close the line the sum of transferred and ordered 
                    // is equal to PR quantity
                    if ((new_transferred + ordered) === pr_quantity) {

                        // Closing the PR line by line
                        pr_rec.setSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: PO_CLOSED_SUBLIST_FIELD_ID,
                            line: line,
                            value: true,
                        });

                    }

                }

            }

            pr_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function deductQuantities(newRecord, bom_rec) {

            var location = newRecord.getValue(LOCATION_SUBLIST_FIELD_ID);

            var bom_location = bom_rec.getValue(BOM_LOCATION_FIELD_ID);

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                var bill_cred_item_id = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                    line: line,
                });

                var bom_item_id = bom_rec.getSublistValue({
                    sublistId: BOM_ITEMS_SUBLIST_ID,
                    fieldId: BOM_ITEM_SUBLIST_FIELD_ID,
                    line: line,
                });

                // Check if the items matched between BOM record and Item Receipt
                if (bill_cred_item_id === bom_item_id) {

                    // Check if the request is direct or not
                    var is_direct = location === bom_location;

                    log.debug('is_direct', is_direct);

                    var bom_qty_received = bom_rec.getSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: is_direct ? BOM_QTY_RECEIVED_SITE_FIELD_ID : BOM_QTY_RECEIVED_OTHERS_FIELD_ID, // Column will be selected, depending on the is_direct variable 
                        line: line,
                    }) || 0;

                    log.debug('bom_qty_received', bom_qty_received);

                    var qty = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QUANTITY_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    if (is_direct) {

                        var aviablable_site_qty = bom_rec.getSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: BOM_QTY_AVAILABLE_SITE_FIELD_ID,
                            line: line,
                        }) || 0;

                        log.debug('aviablable_site_qty', aviablable_site_qty);

                        if (aviablable_site_qty > 0) {

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_AVAILABLE_SITE_FIELD_ID,
                                line: line,
                                value: aviablable_site_qty - qty,
                            });

                        }

                        if (bom_qty_received > 0) {

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_RECEIVED_SITE_FIELD_ID,
                                line: line,
                                value: bom_qty_received - qty,
                            });

                        }


                    } else {

                        bom_rec.setSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: BOM_QTY_RECEIVED_OTHERS_FIELD_ID,
                            line: line,
                            value: bom_qty_received - qty,
                        });

                    }

                }

            }

            bom_rec.save({
                ignoreMandatoryFields: true,
            });


        }

        function isVendorReturn(created_from_id) {

            var isVRA = true;

            try {

                record.load({
                    type: record.Type.VENDOR_RETURN_AUTHORIZATION,
                    id: created_from_id,
                    isDynamic: true,
                });

            } catch (error) {

                isVRA = false;

            }

            return isVRA;

        }

        function isFromTransferOrder(created_from_id) {

            var isFromTransferOrder = true;

            try {

                record.load({
                    type: record.Type.TRANSFER_ORDER,
                    id: created_from_id,
                    isDynamic: true,
                });

            } catch (error) {

                isFromTransferOrder = false;

            }

            return isFromTransferOrder;

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);