/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 01, 2024
 * 
 */
define(['N/record', 'N/runtime'],

    function (record, runtime) {

        const CREATE_MODE = 'create';
        const PARAM_PR_ID = 'origin_id';
        const PARAM_FROM_LOCATION_ID = 'from_location';
        const PARAM_TYPE_ID = 'type';
        const PO_NUMBER_FIELD_ID = 'custbody_xrc_po_num';
        const BOM_NUM_FIELD_ID = 'custbody_xrc_bom';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';
        const FROM_LOCATION_FIELD_ID = 'location';
        const TO_LOCATION_FIELD_ID = 'transferlocation';
        const PREPARED_BY_FIELD_ID = 'employee';
        const ITEMS_SUBLIST_ID = 'item';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const BOM_RECORD_TYPE_ID = 'custompurchase_xrc_bom';
        const BOM_ITEMS_SUBLIST_ID = 'item';
        const BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID = 'custcol_xrc_billmat_qty_to_be_transf';
        const HO_LOCATION_ID = '3';
        const BOM_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const BOM_LOCATION_FIELD_ID = 'location';
        const TRANSFERRED_SUBLIST_FIELD_ID = 'custcol_xrc_transferred';
        const ORDERED_SUBLIST_FIELD_ID = 'custcol_xrc_ordered';
        const AVERAGE_COST_SUBLSIT_FIELD_ID = 'averagecost';

        var g_mode = '';

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            var currentUser = runtime.getCurrentUser();

            g_mode = context.mode;

            if (g_mode === CREATE_MODE) {

                currentRecord.setValue(PREPARED_BY_FIELD_ID, currentUser.id);

                var po_id = getParameterWithId(PARAM_PR_ID);

                if (po_id) {

                    initiateTransferOrder(po_id, currentRecord);

                }


            }


        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === FROM_LOCATION_FIELD_ID) {

                console.log(currentRecord.getValue(FROM_LOCATION_FIELD_ID));

                if (g_mode === CREATE_MODE) {

                    var po_id = getParameterWithId(PARAM_PR_ID);

                    if (po_id) {

                        window.location.href = '/app/accounting/transactions/trnfrord.nl?whence=&origin_id=' + po_id + '&type=pr&from_location=' + currentRecord.getValue(FROM_LOCATION_FIELD_ID);
                    }


                }

            }

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            if (sublistId === ITEMS_SUBLIST_ID) {

                var type = getParameterWithId(PARAM_TYPE_ID);

                if (!type) return true;

                if (type === 'po') {

                    var bom_id = currentRecord.getValue(BOM_NUM_FIELD_ID);

                    if (!bom_id) return;

                    // Load the linked BOM record if type is PO
                    var rec = record.load({
                        type: BOM_RECORD_TYPE_ID,
                        id: bom_id,
                        isDynamic: true,
                    });

                } else {

                    var po_id = currentRecord.getValue(PO_NUMBER_FIELD_ID);

                    if (!po_id) return;

                    // Otherwise, load the PR record
                    var rec = record.load({
                        type: record.Type.PURCHASE_ORDER,
                        id: po_id,
                        isDynamic: true,
                    });

                }

                var qty = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: QUANTITY_SUBLIST_FIELD_ID,
                });

                var line = currentRecord.getCurrentSublistIndex({
                    sublistId: ITEMS_SUBLIST_ID,
                });

                if (type === 'po') {

                    var bom_qty_to_be_transferred = rec.getSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID,
                        line: line,
                    });

                    if (qty > bom_qty_to_be_transferred) {

                        alert('Quantity cannot be greater than the BOM\'s Quantity to be Transferred.');

                        return false;
                    }

                } else {

                    var pr_qty = rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QUANTITY_SUBLIST_FIELD_ID,
                        line: line,
                    }) || 0;

                    var transferred = rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: TRANSFERRED_SUBLIST_FIELD_ID,
                        line: line,
                    }) || 0;

                    var ordered = rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ORDERED_SUBLIST_FIELD_ID,
                        line: line,
                    }) || 0;

                    var allowed_qty = pr_qty - (transferred + ordered);

                    console.log('allowed_qty', allowed_qty);

                    if (qty > allowed_qty) {

                        alert('Quantity cannot be greater than the PR\'s available quantity.');

                        return false;
                    }

                }

            }

            return true;
        }

        function initiateTransferOrder(rec_id, currentRecord) {

            var isPurchaseOrder = true;

            try {

                var rec = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: rec_id,
                });

            } catch (error) {

                var rec = record.load({
                    type: BOM_RECORD_TYPE_ID,
                    id: rec_id,
                });

                isPurchaseOrder = false;

            }

            console.log(isPurchaseOrder);

            if (isPurchaseOrder) {

                var po_location = rec.getValue(LOCATION_FIELD_ID);

                currentRecord.setValue(PO_NUMBER_FIELD_ID, rec.id);

                var body_field_ids = ['custbody_xrc_purchase_category', 'custbody_xrc_bom', 'subsidiary', 'department', 'class'];

                // Populating the body fields of the Purchase Order
                for (var id of body_field_ids) {

                    var value = rec.getValue(id);

                    if (value) {

                        currentRecord.setValue({
                            fieldId: id,
                            value: value,
                            ignoreFieldChange: true,
                        });

                    }

                }

                var from_location_id = getParameterWithId(PARAM_FROM_LOCATION_ID);

                if (from_location_id) {

                    currentRecord.setValue({ fieldId: FROM_LOCATION_FIELD_ID, value: from_location_id, ignoreFieldChange: true });

                }

                currentRecord.setValue(TO_LOCATION_FIELD_ID, po_location);

            } else {

                currentRecord.setValue(BOM_NUM_FIELD_ID, rec.id);

                currentRecord.setValue({
                    fieldId: SUBSIDIARY_FIELD_ID,
                    value: rec.getValue(BOM_SUBSIDIARY_FIELD_ID),
                    ignoreFieldChange: true,
                });

                currentRecord.setValue({
                    fieldId: LOCATION_FIELD_ID,
                    value: HO_LOCATION_ID,
                    ignoreFieldChange: true,
                });

                currentRecord.setValue({
                    fieldId: TO_LOCATION_FIELD_ID,
                    value: rec.getValue(BOM_LOCATION_FIELD_ID),
                    ignoreFieldChange: true,
                });

            }

            var item_fields_id = ['item', 'description', 'quantity'];

            var bom_fields_id = ['item', 'description', 'custcol_xrc_billmat_qty_to_be_transf'];

            // Populating the items tab
            var items_lines = rec.getLineCount({
                sublistId: isPurchaseOrder ? ITEMS_SUBLIST_ID : BOM_ITEMS_SUBLIST_ID,
            });

            console.log(items_lines);

            for (var line = 0; line < items_lines; line++) {

                if (!isPurchaseOrder) {

                    var qty_to_be_transferred = rec.getSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_TO_BE_TRANSFERRED_FIELD_ID,
                        line: line,
                    });

                    if (!qty_to_be_transferred) {

                        continue;

                    }

                }

                currentRecord.selectNewLine({
                    sublistId: ITEMS_SUBLIST_ID,
                });

                var fields = isPurchaseOrder ? item_fields_id : bom_fields_id;

                for (var i = 0; i < fields.length; i++) {

                    if (!(fields[i])) return;

                    var value = rec.getSublistValue({
                        sublistId: isPurchaseOrder ? ITEMS_SUBLIST_ID : BOM_ITEMS_SUBLIST_ID,
                        fieldId: fields[i],
                        line: line,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: item_fields_id[i],
                        value: value,
                        // ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });


                }

                currentRecord.commitLine({
                    sublistId: ITEMS_SUBLIST_ID,
                });

            }

        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateLine: validateLine,
        };
    }
);