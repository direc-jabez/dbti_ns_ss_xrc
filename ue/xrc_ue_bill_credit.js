/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/record'],

    function (record) {

        const LOCATION_FIELD_ID = 'location';
        const BOM_FIELD_ID = 'custbody_xrc_bom';
        const BOM_RECORD_TYPE_ID = 'custompurchase_xrc_bom';
        const BOM_ITEMS_SUBLIST_ID = 'item';
        const BOM_ITEM_SUBLIST_FIELD_ID = 'item';
        const BOM_QTY_RECEIVED_OTHERS_FIELD_ID = 'custcol_xrc_billmat_qty_received';
        const BOM_QTY_RECEIVED_SITE_FIELD_ID = 'custcol_xrc_billmat_qty_received_site';
        const BOM_QTY_AVAILABLE_SITE_FIELD_ID = 'custrecord_xrc_bom_qty_avail_site';
        const BOM_LOCATION_FIELD_ID = 'location';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                var bom_id = newRecord.getValue(BOM_FIELD_ID);

                if (!bom_id) return;

                var bom_rec = record.load({
                    type: BOM_RECORD_TYPE_ID,
                    id: bom_id,
                });

                var bom_location = bom_rec.getValue(BOM_LOCATION_FIELD_ID);

                var location = newRecord.getValue(LOCATION_FIELD_ID);

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

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);