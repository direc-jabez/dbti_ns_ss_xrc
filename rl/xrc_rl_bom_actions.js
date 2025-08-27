    /**
     * 
    *@NApiVersion 2.1
    *@NScriptType Restlet
    */
    define(['N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/email'],

        function (record, redirect, runtime, search, email) {

            const BILL_OF_MATERIALS_RECORD_TYPE = 'custompurchase_xrc_bom';
            const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
            const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
            const APPROVE_ACTION_ID = 'approve';
            const REJECT_ACTION_ID = 'reject';
            const STATUS_FIELD_ID = 'transtatus';
            const PENDING_REVISION_APPROVAL_STATUS = 'B';
            const REVISION_APPROVED_STATUS = 'C';
            const REVISION_REJECTED_STATUS = 'D';
            const PENDING_APPROVAL_STATUS = 'F';
            const REJECT_STATUS = 'G';
            const APPROVED_STATUS = 'H';
            const APPROVAL_SIX_FIELD_ID = 'custbody_xrc_approval6';
            const REVISION_FOUR_FIELD_ID = 'custbody_xrc_billmat_rev4';
            const BOM_ITEMS_SUBLIST_ID = 'item';
            const BOM_ORIGINAL_QTY_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_orig_qty';
            const BOM_UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_unapproved_adj';
            const BOM_ADJUSTMENTS_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_adjustments';
            const QTY_SUBLIST_FIELD_ID = 'quantity';
            const BOM_QTY_TO_BE_REQUESTED_FIELD_ID = 'custcol_xrc_billmat_qty_to_be_req';
            const BOM_QTY_REQUESTED_FIELD_ID = 'custcol_xrc_billmat_requested';
            const BOM_ESTIMATED_RATE_FIELD_ID = 'rate';
            const ESTIMATED_TOTAL_AMOUNT_FIELD_ID = 'amount';
            const SUBSIDIARY_FIELD_ID = 'subsidiary';
            const BOQ_NUM_FIELD_ID = 'tranid';
            const NOTIF_TYPE_REMINDER = 1;
            const NOTIF_TYPE_APPROVED = 2;
            const NOTIF_TYPE_REJECTED = 3;
            const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';


            function _get(context) {

                var action = context.action;

                var field = context.field;

                var role_to_email = context.role_to_email;

                log.debug('role_to_email', role_to_email);

                var currentUser = runtime.getCurrentUser();

                try {

                    // Loading Tenant Asset Pullout
                    var bom_rec = record.load({
                        type: BILL_OF_MATERIALS_RECORD_TYPE,
                        id: context.id,
                        isDynamic: true,
                    });

                    var approval_status = bom_rec.getValue(STATUS_FIELD_ID);

                    var boq_num = bom_rec.getValue(BOQ_NUM_FIELD_ID);

                    if (role_to_email) {

                        var employee_ids = getEmployeeIdsWithRole(role_to_email);

                    }

                    var prepared_by = bom_rec.getValue(PREPARED_BY_FIELD_ID);

                    if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                        bom_rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                        if (approval_status === REVISION_REJECTED_STATUS || approval_status === PENDING_REVISION_APPROVAL_STATUS) {

                            bom_rec.setValue(STATUS_FIELD_ID, PENDING_REVISION_APPROVAL_STATUS);

                        } else {

                            bom_rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                        }

                        (employee_ids && employee_ids.length > 0) && sendEmail(context.id, boq_num, currentUser.id, employee_ids);

                    } else if (action === APPROVE_ACTION_ID) {

                        bom_rec.setValue(field, true);

                        bom_rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                        if (field === APPROVAL_SIX_FIELD_ID) {

                            bom_rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                            (employee_ids && employee_ids.length > 0) && sendEmail(context.id, boq_num, currentUser.id, [prepared_by], false, NOTIF_TYPE_APPROVED);

                        } else if (field === REVISION_FOUR_FIELD_ID) {

                            bom_rec.setValue(STATUS_FIELD_ID, REVISION_APPROVED_STATUS);

                            adjustQty(bom_rec);

                            (employee_ids && employee_ids.length > 0) && sendEmail(context.id, boq_num, currentUser.id, [prepared_by], true, NOTIF_TYPE_APPROVED);

                        } else {

                            (employee_ids && employee_ids.length > 0) && sendEmail(context.id, boq_num, currentUser.id, employee_ids);

                        }

                    } else if (action === REJECT_ACTION_ID) {

                        bom_rec.setValue(STATUS_FIELD_ID, approval_status === PENDING_APPROVAL_STATUS ? REJECT_STATUS : REVISION_REJECTED_STATUS);

                        bom_rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                        var fields = approval_status === PENDING_APPROVAL_STATUS ?
                            ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4', 'custbody_xrc_approval5', 'custbody_xrc_approval6'] :
                            ['custbody_xrc_billmat_rev1', 'custbody_xrc_billmat_rev2', 'custbody_xrc_billmat_rev3', 'custbody_xrc_billmat_rev4'];

                        for (var i = 0; i < fields.length; i++) {

                            var isChecked = bom_rec.getValue(fields[i]);

                            if (!isChecked) {

                                break;

                            }

                            bom_rec.setValue(fields[i], false);

                        }

                        (employee_ids && employee_ids.length > 0) && sendEmail(context.id, boq_num, subsidiary, [prepared_by], approval_status === PENDING_APPROVAL_STATUS, NOTIF_TYPE_REJECTED);

                    }

                    bom_rec.save({
                        ignoreMandatoryFields: true,
                    });

                } catch (error) {

                    log.debug('error', error);

                }

                redirect.toRecord({
                    type: BILL_OF_MATERIALS_RECORD_TYPE,
                    id: context.id,
                });

            }

            function adjustQty(rec) {

                var items_lines = rec.getLineCount({
                    sublistId: BOM_ITEMS_SUBLIST_ID,
                });

                for (var line = 0; line < items_lines; line++) {

                    rec.selectLine({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        line: line,
                    });

                    var unapproved_adjustments = rec.getCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID,
                    });

                    // Reset the Unapproved Adjustments
                    rec.setCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_UNAPPROVED_ADJUSTMENTS_SUBLIST_FIELD_ID,
                        value: null,
                    });

                    // If there are no unapproved adjustments, skip the line
                    if (!unapproved_adjustments) continue;

                    var adjustments = rec.getCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_ADJUSTMENTS_SUBLIST_FIELD_ID,
                    }) || 0;

                    var new_adjustments = adjustments + unapproved_adjustments;

                    rec.setCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_ADJUSTMENTS_SUBLIST_FIELD_ID,
                        value: new_adjustments,
                    });

                    var original_qty = rec.getCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_ORIGINAL_QTY_SUBLIST_FIELD_ID,
                    });

                    var update_qty = original_qty + new_adjustments;

                    // Set the Adjusted Qty to original qty plus the new adjustments
                    rec.setCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: QTY_SUBLIST_FIELD_ID,
                        value: update_qty,
                    });

                    var qty_requested = rec.getCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_REQUESTED_FIELD_ID,
                    }) || 0;

                    rec.setCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_QTY_TO_BE_REQUESTED_FIELD_ID,
                        value: update_qty - qty_requested,
                    });

                    // Setting the new values for Estimated Total Amount
                    var estimated_rate = rec.getCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: BOM_ESTIMATED_RATE_FIELD_ID,
                    });

                    rec.setCurrentSublistValue({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                        fieldId: ESTIMATED_TOTAL_AMOUNT_FIELD_ID,
                        value: update_qty * estimated_rate,
                    });

                    rec.commitLine({
                        sublistId: BOM_ITEMS_SUBLIST_ID,
                    });

                }

            }

            function getApproverFieldId(field) {

                var approvers = {
                    'custbody_xrc_approval1': 'custbody_xrc_approver1',
                    'custbody_xrc_approval2': 'custbody_xrc_approver2',
                    'custbody_xrc_approval3': 'custbody_xrc_approver3',
                    'custbody_xrc_approval4': 'custbody_xrc_approver4',
                    'custbody_xrc_approval5': 'custbody_xrc_approver5',
                    'custbody_xrc_approval6': 'custbody_xrc_approver6',
                    'custbody_xrc_billmat_rev1': 'custbody_xrc_approver1',
                    'custbody_xrc_billmat_rev2': 'custbody_xrc_approver2',
                    'custbody_xrc_billmat_rev3': 'custbody_xrc_approver3',
                    'custbody_xrc_billmat_rev4': 'custbody_xrc_approver4',
                };

                return approvers[field];

            }

            function getEmployeeIdsWithRole(role) {

                var employee_ids = [];

                var employee_search = search.create({
                    type: "employee",
                    filters:
                        [
                            ["role", "anyof", role],
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

            function sendEmail(id, boq_num, senderId, recipients, is_revision = false, type = NOTIF_TYPE_REMINDER) {

                log.debug('recipients', recipients);

                var body = type === NOTIF_TYPE_REMINDER ?
                    `Good day,<br /><br />
                        The Bill of Quantities${is_revision ? '(Revision)' : ''} is ready for your review and approval.<br /><br />
                        Details:<br /><br />
                        Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/cutrprch.nl?id=${id}&whence=&customtype=112><b>${boq_num}</b></a><br />
                        Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                        Best regards,`
                    : type === NOTIF_TYPE_APPROVED ?
                        `Good day,<br /><br />
                        The Bill of Quantities${is_revision ? '(Revision)' : ''} has been approved.<br /><br />
                        Details:<br /><br />
                        Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/cutrprch.nl?id=${id}&whence=&customtype=112><b>${boq_num}</b></a><br />
                        If you have any questions, feel free to reach out.<br /><br />
                        Best regards,`
                        :
                        `Good day,<br /><br />
                        The Bill of Quantities${is_revision ? '(Revision)' : ''} has been reviewed and rejected.<br /><br />
                        Details:<br /><br />
                        Reference Number: <a href=https://9794098.app.netsuite.com/app/accounting/transactions/cutrprch.nl?id=${id}&whence=&customtype=112><b>${boq_num}</b></a><br />
                        If you have any questions or need further clarification, feel free to reach out.<br /><br />
                        Best regards,`
                    ;

                email.send({
                    author: senderId,
                    recipients: recipients,
                    subject: type === NOTIF_TYPE_REMINDER ? `Approval Needed: Bill of Quantities${is_revision ? '(Revision)' : ''}` : type === NOTIF_TYPE_APPROVED ? `Approval Notification: Bill of Quantities${is_revision ? '(Revision)' : ''}` : `Rejection Notification: Bill of Quantities${is_revision ? '(Revision)' : ''}`,
                    body: body,
                });

            }

            return {
                get: _get,
            };
        }
    );
