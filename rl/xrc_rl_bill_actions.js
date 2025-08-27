/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/search'],

    function (record, redirect, runtime, search) {

        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECT_STATUS = '3';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const REJECT_FIELD_ID = 'custbody1';
        const ITEM_SUBLIST_ID = 'item';
        const ITEM_SUBLIST_FIELD_ID = 'item';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const RATE_SUBLIST_FIELD_ID = 'rate';
        const TAXCODE_SUBLIST_FIELD_ID = 'taxcode';
        const OTHER_0001_ITEM_ID = '5344';
        const UNDEF_TAX_ID = '5';
        const BILL_TOTAL_FIELD_ID = 'usertotal';
        const TERMS_FIELD_ID = 'terms';
        const CASH_FUND_COD_ID = '7';
        const PURCHASE_ORDER_SUBLIST_ID = 'purchaseorders';
        const ID_SUBLIST_FIELD_ID = 'id';
        const FUND_REQUEST_RECORD_TYPE = 'customrecord_xrc_fund_request';
        const LIQUIDATED_FIELD_ID = 'custrecord_xrc_liquidated';
        const BALANCE_FIELD_ID = 'custrecord_xrc_balance';

        function _get(context) {

            var action = context.action;

            var field = context.field;

            var rec = record.load({
                type: record.Type.VENDOR_BILL,
                id: context.id,
                isDynamic: true,
            });

            var approval_status = rec.getValue(STATUS_FIELD_ID);

            if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {
                
                rec.setValue(FOR_APPROVAL_FIELD_ID, true);
                
                if (approval_status === REJECT_STATUS) {

                    rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                    rec.setValue(REJECT_FIELD_ID, false);

                }

            } else if (action === APPROVE_ACTION_ID) {

                rec.setValue(field, true);

                rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                if (field === APPROVAL_TWO_FIELD_ID) {

                    rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                    var terms = rec.getValue(TERMS_FIELD_ID);

                    if (terms === CASH_FUND_COD_ID) {

                        updateFundRequest(rec);

                        appendPaymentThroughCashFundItem(rec);

                    }

                }


            } else if (action === REJECT_ACTION_ID) {

                rec.setValue(STATUS_FIELD_ID, REJECT_STATUS);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                rec.setValue(REJECT_FIELD_ID, true);

                var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    rec.setValue(fields[i], false);

                }

            }

            rec.save({
                ignoreMandatoryFields: true,
            });

            redirect.toRecord({
                type: record.Type.VENDOR_BILL,
                id: context.id,
            });

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custbody_xrc_approval1': 'custbody_xrc_approver1',
                'custbody_xrc_approval2': 'custbody_xrc_approver2',
            };

            return approvers[field];

        }

        function appendPaymentThroughCashFundItem(rec) {

            var bill_total = rec.getValue(BILL_TOTAL_FIELD_ID);

            rec.selectNewLine({
                sublistId: ITEM_SUBLIST_ID,
            });

            rec.setCurrentSublistValue({
                sublistId: ITEM_SUBLIST_ID,
                fieldId: ITEM_SUBLIST_FIELD_ID,
                value: OTHER_0001_ITEM_ID,
                forceSyncSourcing: true,
            });

            rec.setCurrentSublistValue({
                sublistId: ITEM_SUBLIST_ID,
                fieldId: QUANTITY_SUBLIST_FIELD_ID,
                value: 1,
                forceSyncSourcing: true,
            });

            rec.setCurrentSublistValue({
                sublistId: ITEM_SUBLIST_ID,
                fieldId: RATE_SUBLIST_FIELD_ID,
                value: (bill_total * -1),
                forceSyncSourcing: true,
            });

            rec.setCurrentSublistValue({
                sublistId: ITEM_SUBLIST_ID,
                fieldId: TAXCODE_SUBLIST_FIELD_ID,
                value: UNDEF_TAX_ID,
                forceSyncSourcing: true,
            });

            rec.commitLine({
                sublistId: ITEM_SUBLIST_ID,
            });

        }

        function updateFundRequest(rec) {

            var bill_total = rec.getValue(BILL_TOTAL_FIELD_ID);

            var po_lines = rec.getLineCount({
                sublistId: PURCHASE_ORDER_SUBLIST_ID,
            });

            if (po_lines > 0) {

                var po_id = rec.getSublistValue({
                    sublistId: PURCHASE_ORDER_SUBLIST_ID,
                    fieldId: ID_SUBLIST_FIELD_ID,
                    line: 0, // Get the first PO in the list
                });

                var field_lookup = search.lookupFields({
                    type: search.Type.PURCHASE_ORDER,
                    id: po_id,
                    columns: ['custbody_xrc_fund_request_num'],
                });

                var fr_id = field_lookup['custbody_xrc_fund_request_num']?.[0]?.value;

                if (fr_id) {

                    record.submitFields({
                        type: FUND_REQUEST_RECORD_TYPE,
                        id: fr_id,
                        values: {
                            [LIQUIDATED_FIELD_ID]: bill_total,
                            [BALANCE_FIELD_ID]: 0, // Clear balance
                        },
                        options: {
                            ignoreMandatoryFields: true,
                        },
                    });

                }

            }

        }

        return {
            get: _get,
        };
    }
);
