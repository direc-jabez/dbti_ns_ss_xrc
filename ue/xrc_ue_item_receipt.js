/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 25, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const BOM_FIELD_ID = 'custbody_xrc_bom';
        const BOM_RECORD_TYPE_ID = 'custompurchase_xrc_bom';
        const BOM_ITEMS_SUBLIST_ID = 'item';
        const BOM_ITEM_SUBLIST_FIELD_ID = 'item';
        const BOM_QTY_RECEIVED_OTHERS_FIELD_ID = 'custcol_xrc_billmat_qty_received';
        const BOM_QTY_RECEIVED_SITE_FIELD_ID = 'custcol_xrc_billmat_qty_received_site';
        const BOM_QTY_TRANSFERRED_FIELD_ID = 'custcol_xrc_billmat_qty_transferred';
        const BOM_QTY_AVAILABLE_SITE_FIELD_ID = 'custcol_xrc_billmat_qty_avail_site';
        const BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID = 'custcol_xrc_billmat_qty_to_be_transf';
        const BOM_ACTUAL_TOTAL_AMOUNT_FIELD_ID = 'custcol_xrc_billmat_actual_total_amt';
        const BOM_LOCATION_FIELD_ID = 'location';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const LOCATION_SUBLIST_FIELD_ID = 'location';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const RATE_SUBLIST_FIELD_ID = 'rate';
        const CREATED_FROM_FIELD_ID = 'createdfrom';


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var created_from_id = newRecord.getValue(CREATED_FROM_FIELD_ID);

                var isFromPO = isFromPurchaseOrder(created_from_id);

                var bom_id = newRecord.getValue(BOM_FIELD_ID);

                if (!bom_id) return;

                var bom_rec = record.load({
                    type: BOM_RECORD_TYPE_ID,
                    id: bom_id,
                });

                var bom_location = bom_rec.getValue(BOM_LOCATION_FIELD_ID);

                var items_lines = newRecord.getLineCount({
                    sublistId: ITEMS_SUBLIST_ID,
                });

                for (var line = 0; line < items_lines; line++) {

                    var po_item_id = newRecord.getSublistValue({
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
                    if (po_item_id === bom_item_id) {

                        var ir_location = newRecord.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: LOCATION_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        // Check if the request is direct or not
                        var is_direct = ir_location === bom_location;

                        var bom_qty_received = bom_rec.getSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: is_direct ? BOM_QTY_RECEIVED_SITE_FIELD_ID : BOM_QTY_RECEIVED_OTHERS_FIELD_ID, // Column will be selected, depending on the is_direct variable 
                            line: line,
                        }) || 0;

                        var qty = newRecord.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: QUANTITY_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var rate = newRecord.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: RATE_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var amount = qty * rate;

                        var new_qty = bom_qty_received + qty;

                        if (isFromPO) {

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: is_direct ? BOM_QTY_RECEIVED_SITE_FIELD_ID : BOM_QTY_RECEIVED_OTHERS_FIELD_ID,
                                line: line,
                                value: new_qty, // Setting the new qty
                            });

                        }

                        var qty_transferred = bom_rec.getSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: BOM_QTY_TRANSFERRED_FIELD_ID,
                            line: line,
                        }) || 0;

                        if (is_direct) {

                            var aviablable_site_qty = newRecord.getSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_AVAILABLE_SITE_FIELD_ID,
                                line: line,
                            }) || 0;

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_AVAILABLE_SITE_FIELD_ID,
                                line: line,
                                value: new_qty + aviablable_site_qty,
                            });

                        } else {

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID,
                                line: line,
                                value: Math.abs(qty_transferred - new_qty),
                            });

                        }


                        if (isFromPO) {

                            var actual_total_amt = bom_rec.getSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_ACTUAL_TOTAL_AMOUNT_FIELD_ID,
                                line: line,
                            }) || 0;

                            var new_actual_total_amt = actual_total_amt + amount;

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_ACTUAL_TOTAL_AMOUNT_FIELD_ID,
                                line: line,
                                value: new_actual_total_amt,
                            });
                            
                        }

                    }

                }

                bom_rec.save({
                    ignoreMandatoryFields: true,
                });
            }

        }

        function isFromPurchaseOrder(rec_id) {

            try {

                // Try to load the record as PURCHASE ORDER
                record.load({ type: record.Type.PURCHASE_ORDER, id: rec_id });

            } catch (error) {

                // Return false if it catches an error
                return false;
            }

            return true;
        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);