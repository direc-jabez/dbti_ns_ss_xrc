/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/email'],

    function (record, redirect, runtime, search, email) {

        const CUSTOM_FORM_FIELD_ID = 'customform';
        const PR_FORM_ID = '225';
        const PO_FORM_ID = '228';
        const IC_PO_FORM_ID = '229';
        const BOM_RECORD_TYPE_ID = 'custompurchase_xrc_bom';
        const BOM_ITEMS_SUBLIST_ID = 'item';
        const BOM_ITEM_SUBLIST_FIELD_ID = 'item';
        const BOM_ORIGINAL_QTY_SUBLIST_FIELD_ID = 'quantity';
        const BOM_UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_unapproved_adj';
        const BOM_ADJUSTMENTS_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_adjustments';
        const BOM_ADJUSTED_QTY_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_adjusted_qty';
        const BOM_QTY_PURCHASED_FIELD_ID = 'custcol_xrc_billmat_qty_purchased';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const QTY_SUBLIST_FIELD_ID = 'quantity';
        const CLOSED_SUBLIST_FIELD_ID = 'isclosed';
        const BOM_QTY_TO_BE_REQUESTED_FIELD_ID = 'custcol_xrc_billmat_qty_to_be_req';
        const BOM_QTY_REQUESTED_FIELD_ID = 'custcol_xrc_billmat_requested';
        const PURCHASE_CATEGORY_FIELD_ID = 'custbody_xrc_purchase_category';
        const BOM_NUM_FIELD_ID = 'custbody_xrc_bom';
        const ENGINEERING_PR_ID = '1';
        const MARKETING_PR_ID = '2';
        const IT_PR_ID = '3';
        const BUSINESS_PR_HO_ID = '4';
        const BUSINESS_PR_ACCOUNTING_ID = '5';
        const BUSINESS_PR_OPERATIONS_ID = '6';
        const BUSINESS_PR_CATEGORY_ID = '6';
        const DIRECT_PR_CATEGORY_ID = '7';
        const OTHERS_PR_ID = '8';
        const BUSINESS_PR_OTHERS_ID = '27';
        const BUSINESS_PR_DREAMWAVE_ID = '22';
        const BUSINESS_PR_CINEMA_ID = '23';
        const BUSINESS_PR_AGENCY_ID = '24';
        const BUSINESS_PR_BIR_DIVIDEND_AGENCY_ID = '25';
        const PO_APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const APPROVAL_STATUS_FIELD_ID = 'transtatus';
        const PENDING_APPROVAL_STATUS = '1';
        const BOM_APPROVED_STATUS = 'C';
        const BOM_REJECTED_STATUS = 'D';
        const BOM_CLOSED_STATUS = 'E';
        const APPROVED_STATUS = '2';
        const REJECT_STATUS = '3';
        const TERMS_FIELD_ID = 'terms';
        const DATE_FIELD_ID = 'trandate';
        const PURPOSE_FIELD_ID = 'memo';
        const TOTAL_FIELD_ID = 'total';
        const NET_TOTAL_FIELD_ID = 'custbody_xrc_net_total';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const PURCHASE_REQUESTOR_FIELD_ID = 'custbody_xrc_purchase_requestor';
        const PR_DEPOSIT_TO_FIELD_ID = 'custbody_xrc_check_payee_name';
        const EMPLOYEE_FIELD_ID = 'employee';
        const FUND_REQUEST_NUMBER_FIELD_ID = 'custbody_xrc_fund_request_num';
        const APPROVED_BY_FIELD_ID = 'custbody_xrc_approved_by';
        const NEXT_APPROVER_FIELD_ID = 'nextapprover';
        const CHECKED_BY_FIELD_ID = 'custbody_xrc_checked_by';
        const NOTED_BY_FIELD_ID = 'custbody_xrc_noted_by';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const PO_ITEMS_SUBLIST_ID = 'item';
        const PO_ITEM_SUBLIST_FIELD_ID = 'item';
        const PO_QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const PO_BOM_FIELD_ID = 'custbody_xrc_bom';
        const PO_CLOSED_SUBLIST_FIELD_ID = 'isclosed';
        const PO_ORDERED_SUBLIST_FIELD_ID = 'custcol_xrc_ordered';
        const PO_TRANSFERRED_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_qty_transferred';
        const BOM_ESTIMATED_RATE_FIELD_ID = 'rate';
        const ESTIMATED_TOTAL_AMOUNT_FIELD_ID = 'amount';
        const PR_NUMBER_FIELD_ID = 'custbody_xrc_pr_num';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FR_DATE_FIELD_ID = 'custrecord_xrc_fr_date';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const FR_CASH_FUND_ID = '7';
        const FR_PURPOSE_FIELD_ID = 'custrecord_xrc_purpose';
        const FR_TRANSFER_ACCOUNT_FIELD_ID = 'custrecord_xrc_transfer_account';
        const FR_AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const FR_PR_NUMBER_FIELD_ID = 'custrecord_xrc_pr_num';
        const FR_CHECK_NUMBER_FIELD_ID = 'custrecord_xrc_check_num';
        const FR_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary';
        const FR_LOCATION_FIELD_ID = 'custrecord_xrc_location';
        const FR_DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept';
        const FR_CLASS_FIELD_ID = 'custrecord_xrc_class';
        const FR_REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const FR_PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by';
        const FR_DEPOSIT_TO_FIELD_ID = 'custrecord_xrc_fundreq_deposit_to';
        const FR_EMPLOYEE_NAME_FIELD_ID = 'custrecord_xrc_fundreq_employee_name';
        const FR_FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_fundreq_for_approval';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const APPROVAL_THREE_FIELD_ID = 'custbody_xrc_approval3';
        const REJECT_FIELD_ID = 'custbody1';
        const HAS_INVENTORY_ITEM_FIELD_ID = 'custbody_xrc_has_inventory_item';
        const ACTION_VOID = 'void';
        const ACTION_CANCEL = 'cancel';
        const VOIDED_FIELD_ID = 'custbody_xrc_voided';
        const VOID_REASON_FIELD_ID = 'custbody_xrc_void_reason';
        const CANCELLED_FIELD_ID = 'custbody_xrc_cancelled';
        const CANCEL_REASON_FIELD_ID = 'custbody_xrc_cancel_reason';
        const TRANID_FIELD_ID = 'tranid';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID = 'custcol_non_dummy_req_item_ref_no';
        const REQUEST_REF_NO_SUBLIST_FIELD_ID = 'custcol_xrc_po_req_ref_no';
        const LINE_UNIQUE_KEY_SUBLIST_FIELD_ID = 'lineuniquekey';


        function _get(context) {

            var currentUser = runtime.getCurrentUser();

            var recType = context.recType;

            try {

                var rec = record.load({
                    type: recType,
                    id: context.id,
                    isDynamic: true,
                });

                if (recType === record.Type.PURCHASE_ORDER) {

                    var custom_form = rec.getValue(CUSTOM_FORM_FIELD_ID);

                    var action = context.action;

                    if (action === ACTION_VOID) {

                        var void_reason = context.void_reason;

                        rec.setValue(VOIDED_FIELD_ID, true);

                        rec.setValue(VOID_REASON_FIELD_ID, void_reason);

                    } else if (action === ACTION_CANCEL) {

                        var cancel_reason = context.cancel_reason;

                        rec.setValue(CANCELLED_FIELD_ID, true);

                        rec.setValue(CANCEL_REASON_FIELD_ID, cancel_reason);

                        updatePurchaseRequestOrderedOnCancel(rec);

                        closePR(rec);

                    }

                    if (custom_form === PR_FORM_ID) {

                        var purchase_category = rec.getValue(PURCHASE_CATEGORY_FIELD_ID);

                        if (purchase_category === DIRECT_PR_CATEGORY_ID ||
                            purchase_category === BUSINESS_PR_ACCOUNTING_ID ||
                            purchase_category === BUSINESS_PR_AGENCY_ID ||
                            purchase_category === BUSINESS_PR_CINEMA_ID ||
                            purchase_category === BUSINESS_PR_DREAMWAVE_ID ||
                            purchase_category === BUSINESS_PR_HO_ID ||
                            purchase_category === BUSINESS_PR_OPERATIONS_ID ||
                            purchase_category === BUSINESS_PR_BIR_DIVIDEND_AGENCY_ID
                        ) {

                            directPRApproval(rec, context, currentUser, purchase_category);

                        } else if (purchase_category === ENGINEERING_PR_ID || purchase_category === IT_PR_ID || purchase_category === MARKETING_PR_ID || purchase_category === OTHERS_PR_ID || purchase_category === BUSINESS_PR_OTHERS_ID) {

                            engineeringPRApproval(rec, context, currentUser);

                        }

                    } else if (custom_form === PO_FORM_ID || custom_form === IC_PO_FORM_ID) {

                        poApproval(rec, context, currentUser);

                    }

                }

                rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

                // This is to catch the error when submitting the purchase request for approval.
                // It will only work if the current role is XRC - Requestor
                if (runtime.getCurrentUser().role === 1431) {

                    rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                    rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                    rec.save({
                        ignoreMandatoryFields: true,
                    });

                }

            }

            redirect.toRecord({
                type: recType,
                id: context.id,
            });


        }

        function _delete(context) {

        }

        function post(context) {

        }

        function put(context) {

        }

        function updateQtyPurchased(rec, action) {

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

                        // Set the new qty purchased
                        bom_rec.setSublistValue({
                            sublistId: BOM_ITEMS_SUBLIST_ID,
                            fieldId: BOM_QTY_PURCHASED_FIELD_ID,
                            line: line,
                            value: po_qty + bom_qty_purchased,
                        });

                    }

                } catch (error) {

                    log.debug('error', error);

                }

            }

            bom_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function updateBomRecord(newRecord, bom_id) {

            var bom_rec = record.load({
                type: BOM_RECORD_TYPE_ID,
                id: bom_id,
            });


            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (let line = 0; line < items_lines; line++) {

                var pr_item_id = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                    line: line,
                });

                var bom_item_id = bom_rec.getSublistValue({
                    sublistId: BOM_ITEMS_SUBLIST_ID,
                    fieldId: BOM_ITEM_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (pr_item_id === bom_item_id) {

                    var pr_qty = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var bom_qty_to_be_requested = bom_rec.getSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_TO_BE_REQUESTED_FIELD_ID,
                        line: line,
                    });

                    var bom_qty_requested = bom_rec.getSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_REQUESTED_FIELD_ID,
                        line: line,
                    }) || 0;

                    bom_rec.setSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_TO_BE_REQUESTED_FIELD_ID,
                        line: line,
                        value: bom_qty_to_be_requested - pr_qty,
                    });

                    bom_rec.setSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_REQUESTED_FIELD_ID,
                        line: line,
                        value: bom_qty_requested + pr_qty,
                    });

                }

            }

            bom_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function updatePurchaseRequestOrderedOnCancel(rec) {

            var pr_id = rec.getValue(PR_NUMBER_FIELD_ID);

            if (!pr_id) return;

            var pr_rec = record.load({
                type: record.Type.PURCHASE_ORDER,
                id: pr_id,
            });

            var items_lines = rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var pr_rec_item_lines = pr_rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                try {

                    var po_item_id = rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ITEMS_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var po_req_ref_no = rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: REQUEST_REF_NO_SUBLIST_FIELD_ID,
                        line: line,
                    }) || rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID,
                        line: line,
                    });


                    for (var pr_line = 0; pr_line < pr_rec_item_lines; pr_line++) {

                        var pr_item_id = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: ITEMS_SUBLIST_FIELD_ID,
                            line: pr_line,
                        });

                        var pr_line_unique_key = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: LINE_UNIQUE_KEY_SUBLIST_FIELD_ID,
                            line: pr_line,
                        });

                        // Check if the items matched between the two records
                        if (po_req_ref_no === pr_line_unique_key) {

                            var po_qty = rec.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_QUANTITY_SUBLIST_FIELD_ID,
                                line: line,
                            });

                            var pr_quantity = pr_rec.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_QUANTITY_SUBLIST_FIELD_ID,
                                line: pr_line,
                            }) || 0;

                            var qty_transferred = pr_rec.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_TRANSFERRED_SUBLIST_FIELD_ID,
                                line: pr_line,
                            }) || 0;

                            var qty_ordered = pr_rec.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_ORDERED_SUBLIST_FIELD_ID,
                                line: pr_line,
                            }) || 0;

                            var new_qty_ordered = Math.abs(qty_ordered - po_qty);

                            // Set the new ordered qty  
                            pr_rec.setSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_ORDERED_SUBLIST_FIELD_ID,
                                line: pr_line,
                                value: new_qty_ordered,
                            });

                        }

                    }

                } catch (error) {

                    log.debug('error', error);

                }

            }

            pr_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function directPRApproval(rec, context, currentUser, purchase_category) {

            var id = context.id;

            var requested_by = rec.getValue(EMPLOYEE_FIELD_ID);

            var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

            var role_to_email = context.role_to_email;

            log.debug('role_to_email', role_to_email);

            var tran_num = rec.getValue(TRANID_FIELD_ID);

            var employee_ids = null;

            if (role_to_email && role_to_email !== 'null') {

                employee_ids = getEmployeeIdsWithRole(role_to_email);

            }

            var approve = context.approve;

            // If no approve param, then the transaction is
            // for resubmitting for approval
            if (!approve) {

                employee_ids = getEmployeeIdsWithRole(getFirstReceiver(purchase_category));

                var resubmit = context.resubmit;

                if (resubmit === 'T') {

                    // Resubmit the transaction for approval
                    resubmitForApproval(rec);

                    // (employee_ids && employee_ids.length > 0) && sendEmail(id, tran_num, currentUser.id, employee_ids);

                } else {

                    // Submit the transaction for approval
                    submitForApproval(rec);

                    // (employee_ids && employee_ids.length > 0) && sendEmail(id, tran_num, currentUser.id, employee_ids);

                }

                return;

            }

            log.debug('employee_ids', employee_ids);

            // Check if the paramater has T value
            if (approve === 'T') {

                var field = context.field;

                var is_check = context.is_check.toString();

                log.debug('is_check', is_check);

                var approver_field = getApproverField(field, rec.getValue(PURCHASE_CATEGORY_FIELD_ID));

                rec.setValue(field, true);

                rec.setValue(approver_field, currentUser.id);

                var final_approval_field = getFinalApprovalFieldByCategory(rec.getValue(PURCHASE_CATEGORY_FIELD_ID));

                if (field === final_approval_field) {

                    rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, APPROVED_STATUS);

                    var terms = rec.getValue(TERMS_FIELD_ID);

                    if (terms === FR_CASH_FUND_ID) {

                        createFundRequest(rec);

                    }

                    // sendEmail(context.id, tran_num, currentUser.id, [requested_by, prepared_by], false, NOTIF_TYPE_APPROVED);

                }

                // (employee_ids && employee_ids.length > 0) && sendEmail(context.id, tran_num, currentUser.id, employee_ids, is_check == 'true', NOTIF_TYPE_REMINDER);

            } else {

                rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, REJECT_STATUS);

                rec.setValue(REJECT_FIELD_ID, true);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    var approver_field = getApproverField(fields[i], rec.getValue(PURCHASE_CATEGORY_FIELD_ID));

                    rec.setValue(approver_field, null);

                    rec.setValue(fields[i], false);

                }

                // sendEmail(context.id, tran_num, currentUser.id, [requested_by, prepared_by], false, NOTIF_TYPE_REJECTED);

            }

        }

        function engineeringPRApproval(rec, context, currentUser) {

            var id = context.id;

            var requestor = rec.getValue(EMPLOYEE_FIELD_ID);

            var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

            var role_to_email = context.role_to_email;

            log.debug('role_to_email', role_to_email);

            var department = context.department;

            log.debug('department', department);

            var is_dept_head_approval = context.is_dept_head_approval;

            log.debug('is_dept_head_approval', is_dept_head_approval);

            var tran_num = rec.getValue(TRANID_FIELD_ID);

            var employee_ids = null;

            var approval_2 = rec.getValue(APPROVAL_TWO_FIELD_ID);

            var approve = context.approve;

            // If no approve param, then the transaction is
            // for resubmitting for approval
            if (!approve) {

                var resubmit = context.resubmit;

                // employee_ids = getManagerIds(getEmployeeDepartment(requestor), true);

                if (resubmit === 'T') {

                    // Resubmit the transaction for approval
                    resubmitForApproval(rec);

                } else {

                    // Submit the transaction for approval
                    submitForApproval(rec);

                }

                // (employee_ids && employee_ids.length > 0) && sendEmail(id, tran_num, currentUser.id, employee_ids);

                return;

            }

            if (role_to_email && role_to_email !== 'null') {

                // employee_ids = getEmployeeIdsWithRole(role_to_email);

            } else if (department && department !== 'null') {

                // employee_ids = getManagerIds(department, false);

            }

            // Check if the paramater has T value
            if (approve === 'T') {

                var field = context.field;

                var is_check = context.is_check.toString();

                var purchase_category = rec.getValue(PURCHASE_CATEGORY_FIELD_ID);

                var has_inventory_item = rec.getValue(HAS_INVENTORY_ITEM_FIELD_ID);

                var approver_field = getApproverField(field, purchase_category);

                log.debug('approver_field', approver_field);

                rec.setValue(field, true);

                log.debug('currentUser.id', currentUser.id);

                rec.setValue(approver_field, currentUser.id);

                var final_approval_field = getFinalApprovalFieldByCategory(rec.getValue(PURCHASE_CATEGORY_FIELD_ID), has_inventory_item);

                if (field === final_approval_field) {

                    rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, APPROVED_STATUS);


                    if (purchase_category === ENGINEERING_PR_ID) {

                        var bom_id = rec.getValue(BOM_NUM_FIELD_ID);

                        if (bom_id) {

                            updateBomRecord(rec, bom_id);

                        }

                    }

                    var terms = rec.getValue(TERMS_FIELD_ID);

                    if (terms === FR_CASH_FUND_ID) {

                        createFundRequest(rec);

                    }

                    // sendEmail(context.id, tran_num, currentUser.id, [requestor, prepared_by], false, NOTIF_TYPE_APPROVED);

                }

                // (employee_ids && employee_ids.length > 0) && sendEmail(context.id, tran_num, currentUser.id, employee_ids, is_check == 'true', NOTIF_TYPE_REMINDER);

            } else {

                rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, REJECT_STATUS);

                rec.setValue(REJECT_FIELD_ID, true);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    var approver_field = getApproverField(fields[i], rec.getValue(PURCHASE_CATEGORY_FIELD_ID));

                    rec.setValue(fields[i], false);

                    rec.setValue(approver_field, null);

                }

                // sendEmail(context.id, tran_num, currentUser.id, [requestor, prepared_by], false, NOTIF_TYPE_REJECTED);

            }
        }

        function poApproval(rec, context, currentUser) {

            var id = context.id;

            var requested_by = rec.getValue(EMPLOYEE_FIELD_ID);

            var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

            var role_to_email = context.role_to_email;

            var tran_num = rec.getValue(TRANID_FIELD_ID);

            var employee_ids = null;

            if (role_to_email && role_to_email !== 'null') {

                employee_ids = getEmployeeIdsWithRole(role_to_email);

            }

            var approve = context.approve;

            log.debug('approve', approve);

            // If no approve param, then the transaction is
            // for resubmitting for approval
            if (!approve) {

                employee_ids = getEmployeeIdsWithRole('1420'); // 1420 => XRC - Purchasing Head

                var resubmit = context.resubmit;

                if (resubmit === 'T') {

                    // Resubmit the transaction for approval
                    resubmitForApproval(rec);

                } else {

                    // Submit the transaction for approval
                    submitForApproval(rec);

                }

                // (employee_ids && employee_ids.length > 0) && sendEmail(id, tran_num, currentUser.id, employee_ids);

                return;

            }

            if (approve === 'T') {

                var field = context.field;

                var is_check = context.is_check.toString();

                var approver_field = getApproverField(field, 'po');

                rec.setValue(field, true);

                rec.setValue(approver_field, currentUser.id);

                if (field === APPROVAL_THREE_FIELD_ID) {

                    rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, APPROVED_STATUS);

                    updateQtyPurchased(rec, 'approve');

                    // updatePurchaseRequestOrdered(rec);

                    var terms = rec.getValue(TERMS_FIELD_ID);

                    if (terms === FR_CASH_FUND_ID) {

                        createFundRequest(rec);

                    }

                    // sendEmail(context.id, tran_num, currentUser.id, [requested_by, prepared_by], false, NOTIF_TYPE_APPROVED);

                }

                // (employee_ids && employee_ids.length > 0) && sendEmail(context.id, tran_num, currentUser.id, employee_ids, is_check == 'true', NOTIF_TYPE_REMINDER);

            } else {

                // Reject transaction
                rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, REJECT_STATUS);

                rec.setValue(REJECT_FIELD_ID, true);

                rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4'];

                for (var i = 0; i < fields.length; i++) {

                    var isChecked = rec.getValue(fields[i]);

                    if (!isChecked) {

                        break;

                    }

                    var approver_field = getApproverField(fields[i], 'po');

                    rec.setValue(fields[i], false);

                    rec.setValue(approver_field, null);

                }

                // sendEmail(context.id, tran_num, currentUser.id, [requested_by, prepared_by], false, NOTIF_TYPE_REJECTED);


            }

        }

        function resubmitForApproval(rec) {

            rec.setValue(PO_APPROVAL_STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

            rec.setValue(REJECT_FIELD_ID, false);

            rec.setValue(FOR_APPROVAL_FIELD_ID, true);


        }

        function submitForApproval(rec) {

            rec.setValue(FOR_APPROVAL_FIELD_ID, true);

        }

        function createFundRequest(rec) {

            var fr_rec = record.create({
                type: FUND_REQUEST_TYPE_ID,
            });

            fr_rec.setValue(FR_DATE_FIELD_ID, rec.getValue(DATE_FIELD_ID));

            fr_rec.setValue(FR_FUND_CATEGORY_FIELD_ID, FR_CASH_FUND_ID);

            fr_rec.setValue(FR_PURPOSE_FIELD_ID, rec.getValue(PURPOSE_FIELD_ID));

            fr_rec.setValue(FR_AMOUNT_FIELD_ID, rec.getValue(NET_TOTAL_FIELD_ID));

            fr_rec.setValue(FR_PR_NUMBER_FIELD_ID, rec.id);

            fr_rec.setValue(FR_SUBSIDIARY_FIELD_ID, rec.getValue(SUBSIDIARY_FIELD_ID));

            fr_rec.setValue(FR_LOCATION_FIELD_ID, rec.getValue(LOCATION_FIELD_ID));

            var pr_preparer = rec.getValue(PREPARED_BY_FIELD_ID);

            var preparer_department = getEmployeeDepartment(pr_preparer);

            fr_rec.setValue(FR_DEPARTMENT_FIELD_ID, preparer_department);

            fr_rec.setValue(FR_CLASS_FIELD_ID, rec.getValue(CLASS_FIELD_ID));

            fr_rec.setValue(FR_DEPOSIT_TO_FIELD_ID, rec.getValue(PR_DEPOSIT_TO_FIELD_ID));

            fr_rec.setValue(FR_REQUESTOR_FIELD_ID, rec.getValue(PURCHASE_REQUESTOR_FIELD_ID));

            fr_rec.setValue(FR_PREPARED_BY_FIELD_ID, pr_preparer);

            fr_rec.setValue(FR_EMPLOYEE_NAME_FIELD_ID, rec.getValue(EMPLOYEE_FIELD_ID));

            fr_rec.setValue(FR_FOR_APPROVAL_FIELD_ID, true);

            var fr_id = fr_rec.save({
                ignoreMandatoryFields: true,
            });

            rec.setValue(FUND_REQUEST_NUMBER_FIELD_ID, fr_id);

        }

        function getApproverField(approval_field, category = null) {

            log.debug('getApproverField params', [approval_field, category])

            var fields = {
                'custbody_xrc_approval1': 'custbody_xrc_approver1',
                'custbody_xrc_approval2': category === BUSINESS_PR_AGENCY_ID || category === 'po' ? 'custbody_xrc_checked_by' : 'custbody_xrc_approver2',
                'custbody_xrc_approval3': category === ENGINEERING_PR_ID ? 'custbody_xrc_notedby_logistics' : category === DIRECT_PR_CATEGORY_ID || category === BUSINESS_PR_OPERATIONS_ID || category === BUSINESS_PR_CINEMA_ID ? 'custbody_xrc_checked_by' : 'custbody_xrc_approver3',
                'custbody_xrc_approval4': category === BUSINESS_PR_DREAMWAVE_ID || category === BUSINESS_PR_HO_ID || category === ENGINEERING_PR_ID || category === IT_PR_ID || category === MARKETING_PR_ID || category === OTHERS_PR_ID ? 'custbody_xrc_checked_by' : 'custbody_xrc_approver4',
            };

            return fields[approval_field];

        }

        function getFinalApprovalFieldByCategory(category, has_inventory_item = false) {

            var approval_field = {
                '7': 'custbody_xrc_approval3',
                '5': 'custbody_xrc_approval1',
                '24': 'custbody_xrc_approval2',
                '25': 'custbody_xrc_approval1',
                '23': 'custbody_xrc_approval3',
                '22': 'custbody_xrc_approval4',
                '27': 'custbody_xrc_approval2',
                '4': 'custbody_xrc_approval4',
                '6': 'custbody_xrc_approval3',
                '1': 'custbody_xrc_approval4',
                '3': 'custbody_xrc_approval4',
                '2': 'custbody_xrc_approval4',
                '8': has_inventory_item ? 'custbody_xrc_approval3' : 'custbody_xrc_approval2',
            };

            return approval_field[category];

        }

        function closePR(rec) {

            var items_lines = rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                rec.selectLine({
                    sublistId: ITEMS_SUBLIST_ID,
                    line: line,
                });

                rec.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: CLOSED_SUBLIST_FIELD_ID,
                    value: true,
                });

                rec.commitLine({
                    sublistId: ITEMS_SUBLIST_ID,
                });

            }

        }

        function getEmployeeIdsWithRole(role) {

            var employee_ids = [];

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["role", "anyof", role.toString().split(',')],
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            var search_result = employee_search.run();

            var results = search_result.getRange({
                start: 0,
                end: 8,
            });

            for (var i = 0; i < results.length; i++) {

                employee_ids.push(results[i].id);

            }

            return employee_ids;

        }

        function getManagerIds(department, is_dept_head_search) {

            var employee_ids = [];

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["department", "anyof", department],
                        "AND",
                        is_dept_head_search ? ["custentity_xrc_dept_head", "is", "T"] : ["custentity_xrc_role", "anyof", "4"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            var search_result = employee_search.run();

            var results = search_result.getRange({
                start: 0,
                end: 8,
            });

            for (var i = 0; i < results.length; i++) {

                employee_ids.push(results[i].id);

            }

            return employee_ids;

        }

        function sendEmail(id, tran_num, senderId, recipients, is_check = false, type = NOTIF_TYPE_REMINDER) {

            log.debug('recipients', recipients);

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                                    The Purchase Request is ready for your ${is_check ? 'checking.' : 'review and approval.'}<br /><br />
                                    Details:<br /><br />
                                    Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=${id}&compid=9794098&whence=><b>${tran_num}</b></a><br />
                                    Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                                    Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                                    The Purchase Request has been approved.<br /><br />
                                    Details:<br /><br />
                                    Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=${id}&compid=9794098&whence=><b>${tran_num}</b></a><br />
                                    If you have any questions, feel free to reach out.<br /><br />
                                    Best regards,`
                    :
                    `Good day,<br /><br />
                                    The Purchase Request has been reviewed and rejected.<br /><br />
                                    Details:<br /><br />
                                    Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=${id}&compid=9794098&whence=><b>${tran_num}</b></a><br />
                                    If you have any questions or need further clarification, feel free to reach out.<br /><br />
                                    Best regards,`
                ;

            email.send({
                author: senderId,
                recipients: recipients,
                subject: type === NOTIF_TYPE_REMINDER ? `${is_check ? 'Check' : 'Approval'} Needed: Purchase Request` : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Purchase Request' : 'Rejection Notification: Purchase Request',
                body: body,
            });

        }

        function getFirstReceiver(category) {

            var categories = {
                '7': 1420,
                '5': 1417,
                '24': 1480,
                '25': 1418,
                '23': 1480,
                '22': 1465,
                '4': 1419,
                '6': 1480,
            };

            return categories[category];
        }

        function getEmployeeDepartment(employee) {

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: employee,
                columns: ['department']
            });

            var requestor_dept = fieldLookUp.department[0].value;

            return requestor_dept;
        }

        return {
            get: _get,
            delete: _delete,
            post: post,
            put: put
        };
    });

