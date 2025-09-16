/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 25, 2024
 * 
 */
define(['N/record', 'N/search', 'N/runtime', 'N/ui/serverWidget'],

    function (record, search, runtime, serverWidget) {

        const CUSTOM_FORM_FIELD_ID = 'customform';
        const PR_FORM_ID = '225';
        const PO_FORM_ID = '228'
        const BOM_NUM_FIELD_ID = 'custbody_xrc_bom';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_STATUS_ID = '2';
        const REJECTED_STATUS_ID = '3';
        const PURCHASE_CATEGORY_FIELD_ID = 'custbody_xrc_purchase_category';
        const ENGINEERING_PR_ID = '1';
        const MARKETING_PR_ID = '2';
        const IT_PR_ID = '3';
        const BUSINESS_PR_ID = '6';
        const BUSINESS_PR_HO_ID = '4';
        const BUSINESS_PR_ACCOUNTING_ID = '5';
        const BUSINESS_PR_OPERATIONS_ID = '6';
        const OTHERS_FOR_PO_ID = '8';
        const BUSINESS_PR_DREAMWAVE_ID = '22';
        const BUSINESS_PR_CINEMA_ID = '23';
        const BUSINESS_PR_AGENCY_ID = '24';
        const BUSINESS_PR_BIR_DIVIDEND_AGENCY_ID = '25';
        const BUSINESS_PR_OTHERS_ID = '27';
        const DIRECT_PR_ID = '7';
        const ROLE_FIELD_ID = 'custentity_xrc_role';
        const DEPARTMENT_FIELD_ID = 'department';
        const REQUESTED_BY_FIELD_ID = 'employee';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVED_BY_FIELD_ID = 'nextapprover';
        const CHECKED_BY_FIELD_ID = 'custbody_xrc_checked_by';
        const NOTED_BY_FIELD_ID = 'custbody_xrc_noted_by';
        const VENDOR_FIELD_ID = 'entity';
        const PR_NUM_FIELD_ID = 'custbody_xrc_pr_num';
        const PO_NUMBER_FIELD_ID = 'custbody_xrc_po_num'
        const CLOSED_SUBLIST_FIELD_ID = 'isclosed';
        const TRANSFERRED_SUBLIST_FIELD_ID = 'custcol_xrc_billmat_qty_transferred';
        const ORDERED_SUBLIST_FIELD_ID = 'custcol_xrc_ordered';
        const QUANTITY_SUBLIST_FIELD_ID = 'custcol_xrc_ordered';
        const DOC_STATUS_FIELD_ID = 'statusRef';
        const CLOSED_STATUS_ID = 'closed';
        const PARENT_FIELD_ID = 'parent';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const ORDER_STATUS_FIELD_ID = 'orderstatus';
        const STATUS_PARTIALLY_RECEIVED_ID = 'D';
        const STATUS_PENDING_BILLING_PARTIALLY_RECEIVED_ID = 'E';
        const STATUS_PENDING_BILLING_ID = 'F';
        const STATUS_FULLY_BILLED_ID = 'G';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEM_SUBLIST_FIELD_ID = 'item';
        const DUMMY_INVENTORY_ITEM_ID = '5277';
        const REQUEST_REF_NO_SUBLIST_FIELD_ID = 'custcol_xrc_po_req_ref_no';
        const NET_AMOUNT_SUBLIST_FIELD_ID = "custcol_xrc_net_amount";
        const ITEM_TYPE_SUBLIST_FIELD_ID = 'itemtype';
        const NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID = 'custcol_non_dummy_req_item_ref_no';
        const PUCHASING_DIVISION_DEPT_ID = '11';
        const WH_AND_LOGISTICS_DEPT_ID = '132';
        const LINKS_SUBLSIT_ID = 'links';
        const LINKS_TYPE_SUBLIST_FIELD_ID = 'type';
        const VENDOR_PREPAYMENT_TYPE_ID = 'Vendor Prepayment';
        const TERMS_FIELD_ID = 'terms';
        const TERMS_CASH_FUND_ID = '7';
        const ADMIN_ROLE_ID = 3;
        const APPROVER_ONE_FIELD_ID = 'custbody_xrc_approver1';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const APPROVAL_THREE_FIELD_ID = 'custbody_xrc_approval3';
        const APPROVAL_FOUR_FIELD_ID = 'custbody_xrc_approval4';
        const APPROVAL_FIVE_FIELD_ID = 'custbody_xrc_approval5';
        const COO_ID = 1460;
        const PROJECT_FIELD_ID = 'custbody_xrc_project';
        const PROJECT_YES = '1';
        const PROJECT_NO = '2';
        const INVENTORY_ITEM_TYPE = 'InvtPart';
        const HAS_INVENTORY_ITEM_FIELD_ID = 'custbody_xrc_has_inventory_item';
        const HAS_DUMMY_INVENTORY_ITEM_FIELD_ID = 'custbody_xrc_po_has_dummy_inventory';
        const NET_TOTAL_FIELD_ID = 'custbody_xrc_net_total';
        const VOIDED_FIELD_ID = 'custbody_xrc_voided';
        const CANCELLED_FIELD_ID = 'custbody_xrc_cancelled';
        const SUPERSEDED_PR_FIELD_ID = 'custbody_xrc_superseded_pr';
        const REPROCESSED_FIELD_ID = 'custbody_xrc_reprocessed';
        const REPROCESSED_PR_FIELD_ID = 'custbody_xrc_reprocessed_pr';
        const STATUS_FIELD_ID = 'status';
        const STATUS_CLOSED_ID = 'Closed';
        const PR_NUMBER_FIELD_ID = 'custbody_xrc_pr_num';
        const PO_QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const PO_TRANSFERRED_SUBLIST_FIELD_ID = 'custcol_xrc_transferred';
        const PO_ORDERED_SUBLIST_FIELD_ID = 'custcol_xrc_ordered';
        const PO_CLOSED_SUBLIST_FIELD_ID = 'isclosed';
        const LINE_UNIQUE_KEY_SUBLIST_FIELD_ID = 'lineuniquekey';
        const PURCHASE_REQUESTOR_FIELD_ID = 'custbody_xrc_purchase_requestor';
        const REQUESTOR_ROLE_ID = 1431;
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FUND_REQUEST_FIELD_ID = 'custbody_xrc_fund_request_num';
        const FR_STATUS_PENDING_ISSUACE_ID = '2';


        function beforeLoad(context) {

            log.debug('flag', true);

            var newRecord = context.newRecord;

            var form = context.form;

            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var doc_status = newRecord.getValue(DOC_STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var currentUser = runtime.getCurrentUser();


            try {

                // Get the current form
                var fieldLookUp = search.lookupFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    columns: [CUSTOM_FORM_FIELD_ID, DEPARTMENT_FIELD_ID]
                });

                var custom_form = fieldLookUp.customform[0].value;

                var department = fieldLookUp.department[0].value;

                // Changing the transaction title
                // Defining a hidden that we will use for scripting
                var hideFld = form.addField({
                    id: 'custpage_hidden_element',
                    label: 'not shown - hidden',
                    type: serverWidget.FieldType.INLINEHTML
                });

                // Check if the form is for Purchase Request    
                if (custom_form === PR_FORM_ID) {

                    var scr = "";

                    scr += 'document.getElementsByTagName("h1")[0].innerHTML = "Purchase Request";';// Changing the title

                    hideFld.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>";

                }

            } catch (error) {

                log.debug('error', error);

            }

            try {

                hideColumnField(form, ITEMS_SUBLIST_ID, NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID);

                if (context.type === context.UserEventType.VIEW) {

                    var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                    var purchase_category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);


                    if ((!for_approval && (parseInt(prepared_by) === currentUser.id)) && approval_status === REJECTED_STATUS_ID) { // Showing Resubmit for Approval button

                        showResubmitButton(form);

                        return;

                    } else {

                        if ((!for_approval && (parseInt(prepared_by) === currentUser.id)) && approval_status === PENDING_APPROVAL_STATUS_ID) {

                            showSubmitButton(form);

                            return;

                        } else {

                            if (approval_status !== REJECTED_STATUS_ID) {

                                // Remove Edit button if the transaction is on Approval process
                                // form.removeButton({
                                //     id: 'edit',
                                // });

                            }

                        }

                    }

                    var terms = newRecord.getValue(TERMS_FIELD_ID);

                    if (custom_form === PR_FORM_ID) {

                        form.removeButton({
                            id: 'enterprepayment',
                        });

                        if (['1', '3', '2', '8'].includes(purchase_category)) {

                            form.removeButton({
                                id: 'receive',
                            });

                        }

                        // Hiding Bill button if Terms is Cash Fund/Deposit to PCF

                        if (terms === TERMS_CASH_FUND_ID) {

                            var fr_id = newRecord.getValue(FUND_REQUEST_FIELD_ID);

                            if (fr_id) {

                                var fr_fieldLookUp = search.lookupFields({
                                    type: FUND_REQUEST_TYPE_ID,
                                    id: fr_id,
                                    columns: ['custrecord_xrc_status']
                                });

                                var fr_status = fr_fieldLookUp['custrecord_xrc_status'][0]?.value;

                                log.debug('fr_status', fr_status);

                                if (fr_status === FR_STATUS_PENDING_ISSUACE_ID) {

                                    form.removeButton({
                                        id: 'bill',
                                    });

                                }
                            }

                        }

                    } else {

                        var isPBWithDownPayment = ['9', '10', '11'].includes(terms); // The array indicates the id of the progress billing with downpayment

                        if (isPBWithDownPayment) {

                            var isPrepaymentPresent = checkPrepayment(newRecord);

                            if (!isPrepaymentPresent) {

                                form.removeButton({
                                    id: 'receive',
                                });


                            }

                        }

                    }

                    var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                    var approver_1 = newRecord.getValue(APPROVER_ONE_FIELD_ID);

                    var cancelled = newRecord.getValue(CANCELLED_FIELD_ID);

                    var reprocessed = newRecord.getValue(REPROCESSED_FIELD_ID);

                    if (custom_form === PR_FORM_ID && !cancelled && for_approval) {

                        if (purchase_category === DIRECT_PR_ID || purchase_category === BUSINESS_PR_CINEMA_ID || purchase_category === BUSINESS_PR_DREAMWAVE_ID || purchase_category === BUSINESS_PR_HO_ID || purchase_category === BUSINESS_PR_OPERATIONS_ID) {

                            directPRApproval(newRecord, currentUser, form, custom_form);

                        } else if (purchase_category === BUSINESS_PR_ACCOUNTING_ID || purchase_category === BUSINESS_PR_BIR_DIVIDEND_AGENCY_ID) {

                            businessPRAccountingApproval(newRecord, currentUser, form, custom_form);

                        } else if (purchase_category === BUSINESS_PR_AGENCY_ID) {

                            businessPRAgency(newRecord, currentUser, form, custom_form);

                        } else if (purchase_category === ENGINEERING_PR_ID || purchase_category === IT_PR_ID || purchase_category === MARKETING_PR_ID) {

                            var project = newRecord.getValue(PROJECT_FIELD_ID);

                            if (project === PROJECT_NO || purchase_category === IT_PR_ID || purchase_category === MARKETING_PR_ID) {

                                engineeringPRWithoutProjectApproval(newRecord, currentUser, form);

                            } else {

                                engineeringPRWithProjectApproval(newRecord, currentUser, form);

                            }

                        } else if (purchase_category === OTHERS_FOR_PO_ID || purchase_category === BUSINESS_PR_OTHERS_ID) {

                            prOthersApproval(newRecord, currentUser, form);

                        }

                        if ((!reprocessed && cancelled) && currentUser.id == prepared_by) {

                            // Show the Checked button
                            form.addButton({
                                id: 'custpage_pr_reprocess',
                                label: 'Reprocess',
                                functionName: 'onReprocessBtnClick()',
                            });

                        }


                    } else {

                        if (!cancelled && currentUser.role == 1475) { // XRC - President

                            form.addButton({
                                id: 'custpage_pr_cancel',
                                label: 'Cancel',
                                functionName: 'onCancelBtnClick()',
                            });

                        }

                        if ((!reprocessed && cancelled) && currentUser.id == prepared_by) {

                            // Show the Checked button
                            form.addButton({
                                id: 'custpage_pr_reprocess',
                                label: 'Reprocess',
                                functionName: 'onReprocessBtnClick()',
                            });

                        }

                        poApproval(form, newRecord, currentUser);

                    }

                } else if (context.type === context.UserEventType.EDIT) {

                    if (for_approval && approval_status !== REJECTED_STATUS_ID) {

                        // log.debug('context', runtime.executionContext);
                        // throw new Error('Cannot edit approved transactions or submitted for approval.');

                    }

                } else if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY) {

                    var origin_id = context.request.parameters.origin_id;




                }

            } catch (error) {

                log.debug('error', error);

            }
        }


        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var currentUser = runtime.getCurrentUser();

            if (context.type === context.UserEventType.CREATE) {

                var superseded_pr = newRecord.getValue(SUPERSEDED_PR_FIELD_ID);

                var is_inventory_item_present = checkForInventoryItem(newRecord);

                var is_dummy_inventory_item_present = checkForDummyInventoryItem(newRecord);

                var net_total = getNetTotal(newRecord);

                var values = {
                    [HAS_INVENTORY_ITEM_FIELD_ID]: is_inventory_item_present,
                    [HAS_DUMMY_INVENTORY_ITEM_FIELD_ID]: is_dummy_inventory_item_present,
                    [NET_TOTAL_FIELD_ID]: net_total,
                };

                if (currentUser.role === REQUESTOR_ROLE_ID) {

                    values[PURCHASE_REQUESTOR_FIELD_ID] = runtime.getCurrentUser().id;

                }

                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: values,
                });

                if (superseded_pr) {

                    record.submitFields({
                        type: newRecord.type,
                        id: superseded_pr,
                        values: {
                            [REPROCESSED_FIELD_ID]: true,
                            [REPROCESSED_PR_FIELD_ID]: newRecord.id,
                        },
                    });

                }

                updatePurchaseRequestOrdered(null, newRecord);

            } else if (context.type === context.UserEventType.EDIT) {

                log.debug('has_inventory_item', checkForInventoryItem(newRecord));

                var oldRecord = context.oldRecord;

                updatePurchaseRequestOrdered(oldRecord, newRecord);

                var net_total = getNetTotal(newRecord);

                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        [NET_TOTAL_FIELD_ID]: net_total,
                    },
                });

            }

        }

        function poApproval(form, newRecord, currentUser) {

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            if (approval_3) {

                showVoidButton(newRecord, form, currentUser);

            }

            if (!for_approval || approval_status !== PENDING_APPROVAL_STATUS_ID) return;

            if (!approval_1 && currentUser.role === 1420) {

                showApprovalButtons(form, 'pr', approval_1 && approval_2 ? 'custbody_xrc_approval3' : 'custbody_xrc_approval1', '1415');

                return;

            } else if (approval_1 && !approval_2 && currentUser.role === 1415) {

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("custbody_xrc_approval2", "1475, 1460")',
                });

                return;

            } else if (approval_1 && approval_2 && !approval_3 && (currentUser.role === 1475 || currentUser.role === 1460)) {

                showApprovalButtons(form, 'pr', approval_1 && approval_2 ? 'custbody_xrc_approval3' : 'custbody_xrc_approval1', null);

                return;

            }

            // if ((!approval_1 && currentUser.role === 1420) || (!approval_3 && (currentUser.role === 1475 || currentUser.role === 1460))) {

            //     if (!approval_1) {

            //         showApprovalButtons(form, 'pr', approval_1 && approval_2 ? 'custbody_xrc_approval3' : 'custbody_xrc_approval1', '1415');

            //     } else {

            //         showApprovalButtons(form, 'pr', approval_1 && approval_2 ? 'custbody_xrc_approval3' : 'custbody_xrc_approval1', null);

            //     }


            //     return;

            // }

            // if (!approval_2 && currentUser.role === 1415) { // 1419 = id of XRC - A/P Senior Accounting Officer

            //     // Show the Checked button
            //     form.addButton({
            //         id: 'custpage_pr_check',
            //         label: 'Checked',
            //         functionName: 'onApproveBtnClick("custbody_xrc_approval2", "1475, 1460")',
            //     });

            //     return;

            // }

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function directPRApproval(newRecord, currentUser, form, custom_form) {

            var category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var cancelled = newRecord.getValue(CANCELLED_FIELD_ID);

            var checked_by = newRecord.getValue(CHECKED_BY_FIELD_ID);

            var checkedbtn_condition = category === BUSINESS_PR_DREAMWAVE_ID || category === BUSINESS_PR_HO_ID ? ((approval_1 && approval_2 && approval_3) && !checked_by) : ((approval_1 && approval_2 && !approval_3) && !checked_by);

            var showPoBtn_condition = category === BUSINESS_PR_DREAMWAVE_ID || category === BUSINESS_PR_HO_ID ? approval_4 : approval_3;

            var is_dreamwave_ho = (category === BUSINESS_PR_DREAMWAVE_ID || category === BUSINESS_PR_HO_ID);

            var canVoid_field = is_dreamwave_ho ? APPROVAL_FOUR_FIELD_ID : APPROVAL_THREE_FIELD_ID;

            var canVoid = newRecord.getValue(canVoid_field);

            if (canVoid) {

                showVoidButton(newRecord, form, currentUser);

            }

            // 1474 => XRC - Operations Head, 1475 => XRC - President, 1460 => XRC - Chief Operating Officer, 1418 => XRC - Chairman
            if (!cancelled && ((category === DIRECT_PR_ID && currentUser.role === 1418)
                || (is_dreamwave_ho && (currentUser.role === 1475 || currentUser.role === 1460))
                || (!is_dreamwave_ho && currentUser.role === 1474))
            ) {

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_cancel',
                    label: 'Cancel',
                    functionName: 'onCancelBtnClick()',
                });

            }

            var next_approver = getNextApproverRole(newRecord);

            if (checkedbtn_condition && currentUser.role === 1415) { // 1415 = id of XRC - A/P Senior Accounting Officer

                // Show the Approve button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: category === BUSINESS_PR_DREAMWAVE_ID || category === BUSINESS_PR_HO_ID ? 'onApproveBtnClick("custbody_xrc_approval4")' : 'onApproveBtnClick("custbody_xrc_approval3")',
                });

            } else if (showPoBtn_condition) {

                showPOButton(form, newRecord, custom_form);

            }


            log.debug('next_approver', next_approver);

            // Null check
            if (next_approver) {

                var is_coo = (category === BUSINESS_PR_DREAMWAVE_ID || category === BUSINESS_PR_HO_ID) ? (next_approver.field === APPROVAL_THREE_FIELD_ID && currentUser.role === COO_ID) : false;

                if (currentUser.role === next_approver.role || is_coo) {

                    showApprovalButtons(form, 'pr', next_approver.field, next_approver.role_to_email || '1415'); // If next_approver.role_to_email is undefined, next role to email is A/P Senior Accounting Officer

                }

            }

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function businessPRAccountingApproval(newRecord, currentUser, form, custom_form) {

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            if (approval_1) {

                showVoidButton(newRecord, form, currentUser);

                var cancelled = newRecord.getValue(CANCELLED_FIELD_ID);

                if (!cancelled && (currentUser.role === 1417 || currentUser.role === 1418)) { // 1417 => XRC - A/P Accounting Head, 1418 => XRC - Chairman

                    // Show the Checked button
                    form.addButton({
                        id: 'custpage_pr_cancel',
                        label: 'Cancel',
                        functionName: 'onCancelBtnClick()',
                    });

                }

            }

            var next_approver = getNextApproverRole(newRecord);

            // Null check
            if (next_approver) {

                if (currentUser.role === next_approver.role) {

                    showApprovalButtons(form, 'pr', next_approver.field, next_approver.role_to_email);

                }

            } else {

                showPOButton(form, newRecord, custom_form);

            }

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function businessPRAgency(newRecord, currentUser, form, custom_form) {

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var checked_by = newRecord.getValue(CHECKED_BY_FIELD_ID);

            if ((approval_1 && !checked_by) && currentUser.role === 1415) { // 1415 = id of XRC - A/R Senior Accounting Officer

                // Show the Approve button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("custbody_xrc_approval2")',
                });


            } else if (approval_2) {

                showPOButton(form, newRecord, custom_form);

            } else {

                var next_approver = getNextApproverRole(newRecord);

                // Null check
                if (next_approver) {

                    if (currentUser.role === next_approver.role) {

                        showApprovalButtons(form, 'pr', next_approver.field, next_approver.role_to_email);

                        if (next_approver.field === APPROVAL_TWO_FIELD_ID && currentUser.role === 1480) { // 1480 => XRC - Regional Operations Manager

                            var cancelled = newRecord.getValue(CANCELLED_FIELD_ID);

                            if (!cancelled) {

                                // Show the Checked button
                                form.addButton({
                                    id: 'custpage_pr_cancel',
                                    label: 'Cancel',
                                    functionName: 'onCancelBtnClick()',
                                });

                            }

                        }

                    }

                } else {

                    showPOButton(form, newRecord, custom_form);

                }

            }

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function showSubmitButton(form) {

            // Show the Resubmit for Approval button
            form.addButton({
                id: 'custpage_pr_submit_for_approval',
                label: 'Submit for Approval',
                functionName: 'onSubmitBtnClick()',
            });

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function showApprovalButtons(form, type, field, role_to_email, department = null, president = false, vendor_id = null) {

            // Show the Approve button
            form.addButton({
                id: 'custpage_pr_approve',
                label: 'Approve',
                functionName: 'onApproveBtnClick("' + field + '","' + role_to_email + '","' + department + '")',
            });

            if (president) {

                // Show the Approve with Task button
                form.addButton({
                    id: 'custpage_pr_approve_with_task',
                    label: 'Approve with Task',
                    functionName: 'onApproveBtnClick("' + field + "\"," + true + ',"' + vendor_id + '")',
                });

            }

            // Show the Reject button
            form.addButton({
                id: 'custpage_pr_reject',
                label: 'Reject',
                functionName: 'onRejectBtnClick("' + type + '")',
            });

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function showResubmitButton(form) {

            // Show the Resubmit for Approval button
            form.addButton({
                id: 'custpage_pr_resubmit_for_approval',
                label: 'Resubmit for Approval',
                functionName: 'onResubmitBtnClick()',
            });

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function showPOButton(form, newRecord, custom_form) {

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var order_status = newRecord.getValue(ORDER_STATUS_FIELD_ID);

            var purchase_category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            if (!(['1', '3', '2', '8'].includes(purchase_category))) return;

            if (approval_status === APPROVED_STATUS_ID && (custom_form === PR_FORM_ID || order_status === STATUS_PARTIALLY_RECEIVED_ID || order_status === STATUS_PENDING_BILLING_PARTIALLY_RECEIVED_ID || order_status === STATUS_PENDING_BILLING_ID || order_status === STATUS_FULLY_BILLED_ID)) {

                var type = 'po';

                if (custom_form === PR_FORM_ID) type = 'pr';

                form.addButton({
                    id: 'custpage_create_to_btn',
                    label: 'Transfer Order',
                    functionName: 'onTransferOrderBtnClick("' + type + '")',
                });

            }

            var status_ref = newRecord.getValue(DOC_STATUS_FIELD_ID);

            if (status_ref !== CLOSED_STATUS_ID && runtime.getCurrentUser().role !== 1431 && (approval_status === APPROVED_STATUS_ID && custom_form === PR_FORM_ID && purchase_category !== DIRECT_PR_ID && purchase_category !== BUSINESS_PR_ID && purchase_category !== OTHERS_FOR_PO_ID)) {

                var vendor_id = newRecord.getValue(VENDOR_FIELD_ID);

                if (runtime.getCurrentUser().role === 1477 || runtime.getCurrentUser().role === 1476) {

                    form.addButton({
                        id: 'custpage_create_po_btn',
                        label: 'Generate PO',
                        functionName: 'onGeneratePOClick(' + vendor_id + ')',
                    });

                }

            }

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

        }

        function showVoidButton(newRecord, form, currentUser) {

            var voided = newRecord.getValue(VOIDED_FIELD_ID);

            var cancelled = newRecord.getValue(CANCELLED_FIELD_ID);

            if (!cancelled && currentUser.role === 1457) { // 1457 => XRC - A/P Clerk

                if (!voided) {

                    // Show the Checked button
                    form.addButton({
                        id: 'custpage_pr_void',
                        label: 'Void',
                        functionName: 'onVoidBtnClick()',
                    });

                }

            }

        }

        function checkPrepayment(newRecord) {

            // Creating a saved search of Vendor Prepayment
            // This is to check if there's a linked vendor prepayment
            // on the associated Purchase Order
            var vendorprepaymentSearchObj = search.create({
                type: "vendorprepayment",
                filters:
                    [
                        ["type", "anyof", "VPrep"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["appliedtotransaction", "anyof", newRecord.id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "amount", label: "Amount" })
                    ]
            });

            var searchResultCount = vendorprepaymentSearchObj.runPaged().count;

            return searchResultCount > 0; // Returning true if  the searchResultCount is greater than 0, otherwise false

        }

        function engineeringPRWithoutProjectApproval(newRecord, currentUser, form) {

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            if (!for_approval) return;

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

            var category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var { department, is_user_dept_head } = isUserDepartmentHead(newRecord, currentUser);

            if ((is_user_dept_head && !approval_1) || ((category === MARKETING_PR_ID && approval_2 && (currentUser.role === 1475 || currentUser.role === 1460)) && !approval_3)) {

                if (category === MARKETING_PR_ID) {

                    showApprovalButtons(form, 'pr', (currentUser.role === 1475 || currentUser.role === 1460) ? 'custbody_xrc_approval3' : 'custbody_xrc_approval1', null);

                } else {

                    showApprovalButtons(form, 'pr', 'custbody_xrc_approval1', null, department);

                }


                return;

            }

            var is_user_sme = isUserSME(currentUser, category);

            if (is_user_sme && (approval_1 && !approval_2)) {

                // Show Recommend button
                form.addButton({
                    id: 'custpage_recommend_btn',
                    label: 'Recommend',
                    functionName: 'onRecommendBtnClick("custbody_xrc_approval2")',
                });

                // Show the Reject button
                form.addButton({
                    id: 'custpage_pr_reject',
                    label: 'Reject',
                    functionName: 'onRejectBtnClick("pr")',
                });

                return;
            }

            var status_ref = newRecord.getValue(DOC_STATUS_FIELD_ID);

            if ((approval_2 && !approval_3) && currentUser.role === 1419) { // 1419 = id of XRC - Logistics Manager

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("custbody_xrc_approval3","' + 1415 + '")',
                });

                return;

            } else if (approval_3 && currentUser.role === 1419) {

                form.addButton({
                    id: 'custpage_create_to_btn',
                    label: 'Transfer Order',
                    functionName: 'onTransferOrderBtnClick("pr")',
                });

            }


            if ((approval_3 && !approval_4) && currentUser.role === 1415) { // 1415 = id of XRC - A/P Senior Accounting Officer

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("custbody_xrc_approval4")',
                });

                return;

            } else if (approval_4 && status_ref !== CLOSED_STATUS_ID && runtime.getCurrentUser().role !== 1431) {

                log.debug('current role', runtime.getCurrentUser().role);

                var vendor_id = newRecord.getValue(VENDOR_FIELD_ID);

                if (runtime.getCurrentUser().role === 1477 || runtime.getCurrentUser().role === 1476) {

                    form.addButton({
                        id: 'custpage_create_po_btn',
                        label: 'Generate PO',
                        functionName: 'onGeneratePOClick(' + vendor_id + ')',
                    });

                }

                return;

            }

        }

        function engineeringPRWithProjectApproval(newRecord, currentUser, form) {

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            if (!for_approval) return;

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

            var status_ref = newRecord.getValue(DOC_STATUS_FIELD_ID);

            var purchase_category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var approval_5 = newRecord.getValue(APPROVAL_FIVE_FIELD_ID);

            if (!approval_1 && currentUser.role === 1479) { // => 1479 XRC - Quantity Surveyor Manager

                showApprovalButtons(form, 'pr', 'custbody_xrc_approval1', '1462');

                return;

            }

            if (!approval_2 && currentUser.role === 1462) { // => 1462 XRC - Engineering Head

                showApprovalButtons(form, 'pr', 'custbody_xrc_approval2', '1460');

                return;
            }

            if (!approval_3 && (currentUser.role === 1475 || currentUser.role === 1460)) { // => 1475 XRC - President || 1460 XRC - Chief Operating Officer

                showApprovalButtons(form, 'pr', 'custbody_xrc_approval3', '1419');

                return;
            }

            if (!approval_4 && currentUser.role === 1419) { // 1419 = id of XRC - Logistics Manager

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("custbody_xrc_approval4", "1415")',
                });

                form.addButton({
                    id: 'custpage_create_to_btn',
                    label: 'Transfer Order',
                    functionName: 'onTransferOrderBtnClick("pr")',
                });

                return;

            }

            if (!approval_5 && currentUser.role === 1415) { // 1415 = id of XRC - A/P Senior Accounting Officer

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("custbody_xrc_approval5")',
                });

                return;

            } else if (approval_5 && status_ref !== CLOSED_STATUS_ID && purchase_category !== OTHERS_FOR_PO_ID) { // 1420 XRC - Purchasing Head

                var vendor_id = newRecord.getValue(VENDOR_FIELD_ID);

                if (currentUser.role === 1420 || runtime.getCurrentUser().role === 1477 || runtime.getCurrentUser().role === 1476) {

                    form.addButton({
                        id: 'custpage_create_po_btn',
                        label: 'Generate PO',
                        functionName: 'onGeneratePOClick(' + vendor_id + ')',
                    });

                }

                return;
            }

        }

        function prOthersApproval(newRecord, currentUser, form) {

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            if (!for_approval) return;

            // Specify the client script
            form.clientScriptModulePath = './xrc_cs_purchase_order.js';

            var has_inventory_item = newRecord.getValue(HAS_INVENTORY_ITEM_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            if (!approval_1) {

                var { is_user_dept_head } = isUserDepartmentHead(newRecord, currentUser);

                if (is_user_dept_head) {

                    showApprovalButtons(form, 'pr', 'custbody_xrc_approval1', '1419');

                    return;

                }

            }

            var has_inventory_item = newRecord.getValue(HAS_INVENTORY_ITEM_FIELD_ID);

            var approver_1 = newRecord.getValue(APPROVER_ONE_FIELD_ID);

            if ((has_inventory_item && !approval_2) && currentUser.role === 1419) { // 1419 = id of XRC - Logistics Manager

                // showApprovalButtons(form, 'pr', 'custbody_xrc_approval2', '1415');

                form.addButton({
                    id: 'custpage_create_to_btn',
                    label: 'Transfer Order',
                    functionName: 'onTransferOrderBtnClick("pr")',
                });

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("custbody_xrc_approval2", "1415")',
                });

                return;

            }

            var status_ref = newRecord.getValue(DOC_STATUS_FIELD_ID);

            if (!has_inventory_item && currentUser.id == approver_1) {

                var cancelled = newRecord.getValue(CANCELLED_FIELD_ID);

                if (!cancelled) {

                    // Show the Checked button
                    form.addButton({
                        id: 'custpage_pr_cancel',
                        label: 'Cancel',
                        functionName: 'onCancelBtnClick()',
                    });

                }

                // Specify the client script
                form.clientScriptModulePath = './xrc_cs_purchase_order.js';
            }

            // var condition = has_inventory_item ? approval_2 : approval_1;

            if (((has_inventory_item ? approval_2 : approval_1) && (has_inventory_item ? !approval_3 : !approval_2)) && currentUser.role === 1415) { // 1415 = id of XRC - A/P Senior Accounting Officer

                var approval_field = has_inventory_item && approval_2 ? 'custbody_xrc_approval3' : 'custbody_xrc_approval2';

                // Show the Checked button
                form.addButton({
                    id: 'custpage_pr_check',
                    label: 'Checked',
                    functionName: 'onApproveBtnClick("' + approval_field + '")',
                });

                return;

            } else if ((has_inventory_item ? approval_1 && approval_2 && approval_3 : approval_1 && approval_2) && runtime.getCurrentUser().role !== 1431) { // has_inventory_item

                var vendor_id = newRecord.getValue(VENDOR_FIELD_ID);

                if (status_ref !== CLOSED_STATUS_ID && runtime.getCurrentUser().role === 1477 || runtime.getCurrentUser().role === 1476) {

                    form.addButton({
                        id: 'custpage_create_po_btn',
                        label: 'Generate PO',
                        functionName: 'onGeneratePOClick(' + vendor_id + ')',
                    });

                }

                showVoidButton(newRecord, form, currentUser);

                return;

            }

        }

        function getNextApproverRole(newRecord) {

            var purchase_category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var fields = getApprovalFieldsByCategory(purchase_category);

            var approval_fields = fields.approvalfields;

            var roles = fields.roles;

            for (var i = 0; i < approval_fields.length; i++) {

                var isFieldChecked = newRecord.getValue(approval_fields[i]);

                if (!isFieldChecked) {

                    return {
                        field: approval_fields[i],
                        role: roles[i],
                        role_to_email: roles.length > 1 ? roles[i + 1] : roles[i],
                    };
                }

            }

        }

        function getApprovalFieldsByCategory(category) {

            var fields = {
                '7': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                    roles: [1420, 1418, 1415],
                },
                '5': {
                    approvalfields: ['custbody_xrc_approval1'],
                    roles: [1417],
                },
                '24': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                    roles: [1480, 1415],
                },
                '25': {
                    approvalfields: ['custbody_xrc_approval1'],
                    roles: [1418],
                },
                '23': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                    roles: [1480, 1474],
                },
                '22': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3'],
                    roles: [1465, 1474, 1475], // Last approver can also be COO
                },
                '4': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3'],
                    roles: [1419, 1420, 1475], // Last approver can also be COO
                },
                '6': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                    roles: [1480, 1474],
                },
            };

            return fields[category];

        }

        function isUserDepartmentHead(newRecord, currentUser) {

            var requestor = newRecord.getValue(REQUESTED_BY_FIELD_ID);

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: requestor,
                columns: ['department']
            });

            var requestor_dept = fieldLookUp.department[0].value;

            fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: currentUser.id,
                columns: ['department', 'custentity_xrc_dept_head']
            });

            var currentUser_dept = fieldLookUp.department[0].value;

            var currentUser_is_dept_head = fieldLookUp.custentity_xrc_dept_head;

            return {
                department: requestor_dept,
                is_user_dept_head: (requestor_dept === currentUser_dept) && currentUser_is_dept_head
            };

        }

        function isUserSME(currentUser, category) {

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: currentUser.id,
                columns: ['department', 'custentity_xrc_role']
            });

            var currentUser_dept = fieldLookUp.department[0].value;

            var currentUser_is_sme = fieldLookUp.custentity_xrc_role.filter((role) => role.value === '4').length > 0;

            var department = getSMEDepartmentByCategory(category);

            return currentUser_dept === department && currentUser_is_sme;

        }

        function getSMEDepartmentByCategory(category) {

            var departments = {
                [ENGINEERING_PR_ID]: '8',
                [IT_PR_ID]: '9',
                [MARKETING_PR_ID]: '126',
            };

            return departments[category];
        }

        function checkForInventoryItem(newRecord) {

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var isInventoryItemPresent = false;

            for (var line = 0; line < items_lines; line++) {

                var item_type = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEM_TYPE_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (item_type === INVENTORY_ITEM_TYPE) {

                    isInventoryItemPresent = true;

                    break;
                }

            }

            return isInventoryItemPresent;

        }

        function checkForDummyInventoryItem(newRecord) {

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var is_dummy_item_present = false;

            for (var line = 0; line < items_lines; line++) {

                var item_id = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEM_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (item_id === DUMMY_INVENTORY_ITEM_ID) {

                    is_dummy_item_present = true;

                    break;
                }

            }

            return is_dummy_item_present;

        }

        function getNetTotal(newRecord) {

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var net_total = 0;

            for (var line = 0; line < items_lines; line++) {

                var net_amount = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: NET_AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                net_total += parseFloat(net_amount);

            }

            return net_total;

        }

        function updatePurchaseRequestOrdered(oldRecord, newRecord) {

            var pr_id = newRecord.getValue(PR_NUMBER_FIELD_ID);

            if (!pr_id) return;

            var pr_rec = record.load({
                type: record.Type.PURCHASE_ORDER,
                id: pr_id,
            });

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var pr_rec_item_lines = pr_rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                try {

                    var po_item_id = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ITEM_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var po_req_ref_no = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: REQUEST_REF_NO_SUBLIST_FIELD_ID,
                        line: line,
                    }) || newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID,
                        line: line,
                    });


                    for (var pr_line = 0; pr_line < pr_rec_item_lines; pr_line++) {

                        var pr_item_id = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: ITEM_SUBLIST_FIELD_ID,
                            line: pr_line,
                        });

                        var pr_line_unique_key = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: LINE_UNIQUE_KEY_SUBLIST_FIELD_ID,
                            line: pr_line,
                        });

                        // Check if the items matched between the two records
                        if (po_req_ref_no === pr_line_unique_key) {

                            var po_qty = newRecord.getSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_QUANTITY_SUBLIST_FIELD_ID,
                                line: line,
                            });

                            if (oldRecord) {

                                var old_po_qty = oldRecord.getSublistValue({
                                    sublistId: ITEMS_SUBLIST_ID,
                                    fieldId: PO_QUANTITY_SUBLIST_FIELD_ID,
                                    line: line,
                                });

                                po_qty -= old_po_qty;

                            }

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

                            var new_qty_ordered = po_qty + qty_ordered;

                            // Set the new ordered qty
                            pr_rec.setSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: PO_ORDERED_SUBLIST_FIELD_ID,
                                line: pr_line,
                                value: new_qty_ordered,
                            });

                            // pr_rec.setSublistValue({
                            //     sublistId: ITEMS_SUBLIST_ID,
                            //     fieldId: ITEM_SUBLIST_FIELD_ID,
                            //     line: pr_line,
                            //     value: po_item_id,
                            // });

                            // Close the line the sum of transferred and ordered 
                            // is equal to PR quantity
                            if ((qty_transferred + new_qty_ordered) === pr_quantity) {

                                // Closing the PR line by line
                                pr_rec.setSublistValue({
                                    sublistId: ITEMS_SUBLIST_ID,
                                    fieldId: PO_CLOSED_SUBLIST_FIELD_ID,
                                    line: pr_line,
                                    value: true,
                                });

                            }

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

        function hideColumnField(formObj, sublistId, fieldId) {

            try {

                var formSublist = formObj.getSublist({
                    id: sublistId
                });

                if (formSublist) {

                    var formField = formSublist.getField({
                        id: fieldId
                    });

                    if (formField && typeof formField !== 'undefined' && formField !== null) {

                        formField.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });

                    }

                }

            } catch (error) {
                log.error({
                    title: 'Error occurred when hiding field',
                    details: JSON.stringify({
                        sublistId: sublistId,
                        fieldId: fieldId
                    })
                });
            }
        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);