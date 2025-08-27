/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 31, 2024
 * 
 */
define(['N/runtime', 'N/record', 'N/redirect'],

    function (runtime, record, redirect) {

        const NEXT_APPROVER_FIELD_ID = 'nextapprover';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const APPROVED_STATUS = '2';
        const BOM_RECORD_TYPE_ID = 'customrecord_xrc_bill_of_materials';
        const BOM_ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_bom_link';
        const BOM_ITEM_SUBLIST_FIELD_ID = 'custrecord_xrc_bom_item';
        const BOM_QTY_PURCHASED_FIELD_ID = 'custrecord_xrc_bom_qty_purchased';
        const BOM_QTY_TO_BE_PURCHASED_FIELD_ID = 'custrecord_xrc_bom_to_be_purchased';
        const PO_ITEMS_SUBLIST_ID = 'item';
        const PO_ITEM_SUBLIST_FIELD_ID = 'item';
        const PO_QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const PO_BOM_FIELD_ID = 'custbody_xrc_bom';
        const PR_NUMBER_FIELD_ID = 'custbody_xrc_pr_num';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const PO_ORDERED_SUBLIST_FIELD_ID = 'custcol_xrc_ordered';

        function beforeLoad(context) {

            var parameters = context.request?.parameters;

            // Get the current session storage
            var currentSession = runtime.getCurrentSession();

            if (parameters) {
                
                // Save the parameters so we can access it to the
                // afterSubmit entry point
                currentSession.set({
                    name: "params",
                    value: JSON.stringify(context.request.parameters),
                });

            }


        }

        function afterSubmit(context) {

            // Get the current logged in user
            var currentUser = runtime.getCurrentUser();

            // Deserialize the save object
            var params = JSON.parse(runtime.getCurrentSession().get({ name: "params" }));

            if (!params.isApproval) return;

            var transaction = params.transaction;

            var po_rec = record.load({
                type: record.Type.PURCHASE_ORDER,
                id: transaction,
                isDynamic: true,
            });

            updateQtyPurchased(po_rec);

            updatePurchaseRequestOrdered(po_rec);

            record.submitFields({
                type: record.Type.PURCHASE_ORDER,
                id: params.transaction,
                values: {
                    [NEXT_APPROVER_FIELD_ID]: currentUser.id,
                    [APPROVAL_STATUS_FIELD_ID]: APPROVED_STATUS,
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

        }

        function updateQtyPurchased(rec) {

            var bom_id = rec.getValue(PO_BOM_FIELD_ID);

            if (!bom_id) return;

            // Load the associated BOM record
            var bom_rec = record.load({
                type: BOM_RECORD_TYPE_ID,
                id: bom_id,
            });

            var items_lines = rec.getLineCount({
                sublistId: PO_ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                try {

                    rec.selectLine({
                        sublistId: PO_ITEMS_SUBLIST_ID,
                        line: line,
                    });

                    var po_item_id = rec.getCurrentSublistValue({
                        sublistId: PO_ITEMS_SUBLIST_ID,
                        fieldId: PO_ITEM_SUBLIST_FIELD_ID,
                    });

                    var bom_item_id = bom_rec.getSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_ITEM_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    // Check if the items matched between the two records
                    if (po_item_id === bom_item_id) {

                        var po_qty = rec.getCurrentSublistValue({
                            sublistId: PO_ITEM_SUBLIST_FIELD_ID,
                            fieldId: PO_QUANTITY_SUBLIST_FIELD_ID,
                        });

                        var bom_qty_purchased = bom_rec.getSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: BOM_QTY_PURCHASED_FIELD_ID,
                            line: line,
                        }) || 0;

                        // var bom_qty_to_be_purchased = bom_rec.getSublistValue({
                        //     sublistId: BOM_ITEMS_SUBLIST_ID,
                        //     fieldId: BOM_QTY_TO_BE_PURCHASED_FIELD_ID,
                        //     line: line,
                        // });

                        // Set the new qty purchased
                        bom_rec.setSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: BOM_QTY_PURCHASED_FIELD_ID,
                            line: line,
                            value: po_qty + bom_qty_purchased,
                        });

                        // Set the new qty to be purchase
                        // bom_rec.setSublistValue({
                        //     sublistId: BOM_ITEMS_SUBLIST_ID,
                        //     fieldId: BOM_QTY_TO_BE_PURCHASED_FIELD_ID,
                        //     line: line,
                        //     value: bom_qty_to_be_purchased - (po_qty + bom_qty_purchased),
                        // });

                    }

                } catch (error) {

                    log.debug('error', error);

                }

            }

            bom_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function updatePurchaseRequestOrdered(rec) {

            var pr_id = rec.getValue(PR_NUMBER_FIELD_ID);

            if (!pr_id) return;

            var pr_rec = record.load({
                type: record.Type.PURCHASE_ORDER,
                id: pr_id,
            });

            var items_lines = rec.getLineCount({
                sublistId: PO_ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                try {

                    rec.selectLine({
                        sublistId: PO_ITEMS_SUBLIST_ID,
                        line: line,
                    });

                    var po_item_id = rec.getCurrentSublistValue({
                        sublistId: PO_ITEMS_SUBLIST_ID,
                        fieldId: ITEMS_SUBLIST_FIELD_ID,
                    });

                    var pr_item_id = pr_rec.getSublistValue({
                        sublistId: PO_ITEMS_SUBLIST_ID,
                        fieldId: ITEMS_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    // Check if the items matched between the two records
                    if (po_item_id === pr_item_id) {

                        var po_qty = rec.getCurrentSublistValue({
                            sublistId: PO_ITEMS_SUBLIST_ID,
                            fieldId: PO_QUANTITY_SUBLIST_FIELD_ID,
                        });

                        var qty_ordered = pr_rec.getSublistValue({
                            sublistId: PO_ITEMS_SUBLIST_ID,
                            fieldId: PO_ORDERED_SUBLIST_FIELD_ID,
                            line: line,
                        }) || 0;

                        // Set the new orered qty
                        pr_rec.setSublistValue({
                            sublistId: PO_ITEMS_SUBLIST_ID,
                            fieldId: PO_ORDERED_SUBLIST_FIELD_ID,
                            line: line,
                            value: po_qty + qty_ordered,
                        });

                    }

                } catch (error) {

                    log.debug('error', error);

                }

            }

            pr_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);