/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 01, 2024
 * 
 */
define(['N/record'],

    function (record) {

        const BOM_FIELD_ID = 'custbody_xrc_bom';
        const PO_FIELD_ID = 'custbody_xrc_po_num';
        const BOM_RECORD_TYPE_ID = 'customrecord_xrc_bill_of_materials';
        const BOM_ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_bom_link';
        const BOM_ITEM_SUBLIST_FIELD_ID = 'custrecord_xrc_bom_item';
        const BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID = 'custrecord_xrc_bom_qty_to_be_transferred';
        const BOM_QTY_TRANSFERRED_FIELD_ID = 'custrecord_xrc_bom_qty_transferred';
        const BOM_QTY_RECEIVED_OTHERS_FIELD_ID = 'custrecord_xrc_bom_qty_received';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const PO_TRANSFERRED_SUBLIST_FIELD_ID = 'custcol_xrc_transferred';


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var bom_id = newRecord.getValue(BOM_FIELD_ID);

                if (bom_id) {

                    var bom_rec = record.load({
                        type: BOM_RECORD_TYPE_ID,
                        id: bom_id,
                    });

                    var items_lines = newRecord.getLineCount({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    for (var line = 0; line < items_lines; line++) {

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
                            });

                            bom_rec.setSublistValue({
                                sublistId: BOM_ITEMS_SUBLIST_ID,
                                fieldId: BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID,
                                line: line,
                                value: qty_received_others - new_qty,
                            });

                        }

                    }

                    bom_rec.save({
                        ignoreMandatoryFields: true,
                    });

                }

                var po_id = newRecord.getValue(PO_FIELD_ID);

                if (po_id) {

                    var po_rec = record.load({
                        type: record.Type.PURCHASE_ORDER,
                        id: po_id,
                    });

                    var items_lines = newRecord.getLineCount({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    for (var line = 0; line < items_lines; line++) {

                        var to_item_id = newRecord.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: ITEMS_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var po_item_id = po_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: ITEMS_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        if (to_item_id === po_item_id) {

                            var po_qty_transferred = po_rec.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_TRANSFERRED_SUBLIST_FIELD_ID,
                                line: line,
                            }) || 0;

                            var qty = newRecord.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: QUANTITY_SUBLIST_FIELD_ID,
                                line: line,
                            });

                            var new_qty = po_qty_transferred + qty;

                            po_rec.setSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_TRANSFERRED_SUBLIST_FIELD_ID,
                                line: line,
                                value: new_qty, // Setting the new qty
                            });

                        }

                    }

                    po_rec.save({
                        ignoreMandatoryFields: true,
                    });

                }

            }

        }

        return {
            afterSubmit: afterSubmit,
        };
    }
);