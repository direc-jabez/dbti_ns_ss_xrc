/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Sept. 23, 2024
 * 
 */
define(['N/record', 'N/search', 'N/runtime', 'N/ui/serverWidget'],

    function (record, search, runtime, serverWidget) {

        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const STATUS_PENDING_APPROVAL = '1';
        const STATUS_APPROVED = '2';
        const PURCHASE_CATEGORY_FIELD_ID = 'custbody_xrc_purchase_category';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const PR_FORM_ID = '225';
        const PO_FORM_ID = '228'
        const BOM_NUM_FIELD_ID = 'custbody_xrc_bom';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_STATUS_ID = '2';
        const REJECTED_STATUS_ID = '3';
        const ENGINEERING_PR_ID = '1';
        const MARKETING_PR_ID = '2';
        const IT_PR_ID = '3';
        const BUSINESS_PR_ID = '6';
        const BUSINESS_PR_HO_ID = '4';
        const BUSINESS_PR_ACCOUNTING_ID = '5';
        const BUSINESS_PR_OPERATIONS_ID = '6';
        const OTHERS_FOR_PO_ID = '8';
        const BUSINESS_PR_OTHERS_ID = '27';
        const BUSINESS_PR_DREAMWAVE_ID = '22';
        const BUSINESS_PR_CINEMA_ID = '23';
        const BUSINESS_PR_AGENCY_ID = '24';
        const BUSINESS_PR_BIR_DIVIDEND_AGENCY_ID = '25';
        const DIRECT_PR_ID = '7';
        const ROLE_FIELD_ID = 'custentity_xrc_role';
        const DEPARTMENT_FIELD_ID = 'department';
        const REQUESTED_BY_FIELD_ID = 'employee';
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

            var newRecord = context.newRecord;

            var form = context.form;

            var currentUser = runtime.getCurrentUser();

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var purchase_category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            if ((context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) && currentUser.role !== ADMIN_ROLE_ID) {

                // Get the current form
                var fieldLookUp = search.lookupFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    columns: [CUSTOM_FORM_FIELD_ID, DEPARTMENT_FIELD_ID]
                });

                var custom_form = fieldLookUp.customform[0].value;

                if (custom_form === PR_FORM_ID) {

                    if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {
                        var next_approver = getNextApproverRole(newRecord);
                        log.debug('next_approver', next_approver);
                    }

                    if (purchase_category === MARKETING_PR_ID) {
                        blockersOnMarketingCategory(context.type, context.UserEventType, newRecord, form, currentUser);
                    } else if (purchase_category === IT_PR_ID) {
                        blockersOnITCategory(context.type, context.UserEventType, newRecord, form, currentUser);
                    } else if (purchase_category === ENGINEERING_PR_ID) {
                        var project = newRecord.getValue(PROJECT_FIELD_ID);
                        if (project === PROJECT_NO) {
                            blockersOnITCategory(context.type, context.UserEventType, newRecord, form, currentUser);
                        } else {
                            blockersOnEngineeringCategory(context.type, context.UserEventType, newRecord, form, currentUser);
                        }
                    } else if (purchase_category === OTHERS_FOR_PO_ID || purchase_category === BUSINESS_PR_OTHERS_ID) {
                        blockersOnOthersCategory(context.type, context.UserEventType, newRecord, form, currentUser);
                    } else {

                        if (next_approver) {

                            if (context.type === context.UserEventType.VIEW) {

                                if (!for_approval && currentUser.id != prepared_by) {
                                    hideEdit(form);
                                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && ((currentUser.id == prepared_by) && (currentUser.role != next_approver.role) || ((purchase_category == '22' || purchase_category == '4') && currentUser.role != '1460'))) {
                                    hideEdit(form);
                                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role != next_approver.role || ((purchase_category == '22' || purchase_category == '4') && currentUser.role != '1460'))) {
                                    hideEdit(form);
                                } else if (approval_status === STATUS_APPROVED) {
                                    hideEdit(form);
                                }

                            } else if (context.type === context.UserEventType.EDIT) {

                                if (!for_approval && currentUser.id != prepared_by) {
                                    blockEdit();
                                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && ((currentUser.id == prepared_by) && (currentUser.role != next_approver.role))) {
                                    blockEdit();
                                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role != next_approver.role)) {
                                    blockEdit();
                                } else if (approval_status === STATUS_APPROVED) {
                                    blockEdit();
                                }
                            }

                        } else {
                            hideEdit(form);
                            if (context.type === context.UserEventType.EDIT) {
                                blockEdit("Cannot edit approved transaction.");
                            }
                        }

                    }

                } else {

                    blockersOnPurchaseOrder(context.type, context.UserEventType, newRecord, form, currentUser);

                }

            }

        }

        function blockersOnEngineeringCategory(type, userEventTypes, newRecord, form, currentUser) {

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var approval_5 = newRecord.getValue(APPROVAL_FIVE_FIELD_ID);

            var can_edit = true;

            if (type !== userEventTypes.DELETE) {

                var message = '';

                if (!for_approval && currentUser.id == prepared_by) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role == 1479 && !approval_1)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role == 1462 && approval_1 && !approval_2)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && ((currentUser.role === 1475 || currentUser.role === 1460) && approval_1 && approval_2 && !approval_3)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role == 1419 && approval_1 && approval_2 && approval_3 && !approval_4)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role == 1415 && approval_1 && approval_2 && approval_3 && approval_4 && !approval_5)) {
                    showEdit(form, true);
                }
                else {
                    showEdit(form, false);
                    can_edit = false;
                }

                if (type === userEventTypes.EDIT) {
                    if (!for_approval && currentUser.id != prepared_by) {
                        message = 'Only the preparer can modify the purchase request. Please notify the preparer.';
                    }
                    if (!can_edit) {
                        blockEdit(message);
                    }
                }

            }

        }

        function blockersOnITCategory(type, userEventTypes, newRecord, form, currentUser) {

            var category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var { department, is_user_dept_head } = isUserDepartmentHead(newRecord, currentUser);

            var is_user_sme = isUserSME(currentUser, category);

            var can_edit = true;

            if (type !== userEventTypes.DELETE) {

                var message = '';

                if (!for_approval && currentUser.id == prepared_by) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (is_user_dept_head && !approval_1)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (is_user_sme && approval_1 && !approval_2)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role == 1419 && approval_1 && approval_2 && !approval_3)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role == 1415 && approval_1 && approval_2 && approval_3 && !approval_4)) {
                    showEdit(form, true);
                } else {
                    showEdit(form, false);
                    can_edit = false;
                }

                if (type === userEventTypes.EDIT) {
                    if (!for_approval && currentUser.id != prepared_by) {
                        message = 'Only the preparer can modify the purchase request. Please notify the preparer.';
                    }
                    if (!can_edit) {
                        blockEdit(message);
                    }
                }

            }

        }

        function blockersOnMarketingCategory(type, userEventTypes, newRecord, form, currentUser) {

            var category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var has_inventory_item = newRecord.getValue(HAS_INVENTORY_ITEM_FIELD_ID);

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var { department, is_user_dept_head } = isUserDepartmentHead(newRecord, currentUser);

            var is_user_sme = isUserSME(currentUser, category);

            var can_edit = true;

            if (type !== userEventTypes.DELETE) {

                var message = '';

                if (!for_approval && currentUser.id == prepared_by) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (is_user_dept_head && !approval_1)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (is_user_sme && approval_1 && !approval_2)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && ((currentUser.role === 1475 || currentUser.role === 1460) && approval_1 && approval_2 && !approval_3)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role == 1415 && approval_1 && approval_2 && approval_3 && !approval_4)) {
                    showEdit(form, true);
                } else {
                    showEdit(form, false);
                    can_edit = false;
                }

                if (type === userEventTypes.EDIT) {
                    if (!for_approval && currentUser.id != prepared_by) {
                        message = 'Only the preparer can modify the purchase request. Please notify the preparer.';
                    }
                    if (!can_edit) {
                        blockEdit(message);
                    }
                }
            }

        }

        function blockersOnOthersCategory(type, userEventTypes, newRecord, form, currentUser) {

            log.debug('flag', true);

            var category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var has_inventory_item = newRecord.getValue(HAS_INVENTORY_ITEM_FIELD_ID);

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var approval_4 = newRecord.getValue(APPROVAL_FOUR_FIELD_ID);

            var { department, is_user_dept_head } = isUserDepartmentHead(newRecord, currentUser);

            var is_user_sme = isUserSME(currentUser, category);

            var can_edit = true;

            if (type !== userEventTypes.DELETE) {

                var message = '';

                if (!for_approval && currentUser.id == prepared_by) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (is_user_dept_head && !approval_1)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && ((has_inventory_item && !approval_2) && currentUser.role === 1419)) {
                    showEdit(form, true);
                } else if (((has_inventory_item ? approval_2 : approval_1) && (has_inventory_item ? !approval_3 : !approval_2)) && currentUser.role === 1415) {
                    showEdit(form, true);
                } else {
                    showEdit(form, false);
                    can_edit = false;
                }

                if (type === userEventTypes.EDIT) {
                    if (!for_approval && currentUser.id != prepared_by) {
                        message = 'Only the preparer can modify the purchase request. Please notify the preparer.';
                    }
                    if (!can_edit) {
                        blockEdit(message);
                    }
                }
            }

        }

        function blockersOnPurchaseOrder(type, userEventTypes, newRecord, form, currentUser) {

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

            var can_edit = true;

            if (type !== userEventTypes.DELETE) {

                var message = '';

                if (!for_approval && currentUser.id == prepared_by) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role === 1420 && !approval_1)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && (currentUser.role === 1415 && approval_1 && !approval_2)) {
                    showEdit(form, true);
                } else if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && ((currentUser.role === 1475 || currentUser.role === 1460) && approval_1 && approval_2 && !approval_3)) {
                    showEdit(form, true);
                } else {
                    showEdit(form, false);
                    can_edit = false;
                }

                if (type === userEventTypes.EDIT) {
                    if (!for_approval && currentUser.id != prepared_by) {
                        message = 'Only the preparer can modify the purchase request. Please notify the preparer.';
                    }
                    if (!can_edit) {
                        blockEdit(message);
                    }
                }

            }

        }

        function getNextApproverRole(newRecord) {

            var purchase_category = newRecord.getValue(PURCHASE_CATEGORY_FIELD_ID);

            var fields = getApprovalFieldsByCategory(purchase_category);

            if (fields) {

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

        function showEdit(form, show) {

            if (!show) {
                form.removeButton({
                    id: 'edit',
                });
            }
        }

        function hideEdit(form) {

            // Remove Edit button if the transaction is on Approval process
            form.removeButton({
                id: 'edit',
            });

        }

        function blockEdit(message = null) {

            throw message || "Cannot edit transaction while in approval process.";

        }

        return {
            beforeLoad: beforeLoad,
        };
    }
);