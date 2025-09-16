/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search', 'N/runtime'],

    function (record, search, runtime) {

        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const FR_AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const FR_ISSUED_FIELD_ID = 'custrecord_xrc_fundreq_issued';
        const FR_RETURNED_FIELD_ID = 'custrecord_xrc_returned';
        const FR_LIQUIDATED_FIELD_ID = 'custrecord_xrc_liquidated';
        const FR_ATD_FIELD_ID = 'custrecord_xrc_atd';
        const FR_BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const LIQUIDATION_FORM_ID = '231';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const STATUS_FIELD_ID = 'approvalstatus';
        const OLD_STATUS_FIELD_ID = 'oldapprovalstatus';
        const STATUS_PENDING_APPROVAL = '1';
        const STATUS_APPROVED = '2';
        const STATUS_REJECTED = '3';
        const ADVANCE_TO_APPLY_FIELD_ID = 'advance';
        const FUND_REQUEST_NUMBER_FIELD_ID = 'custbody_xrc_fund_request_num';
        // const EMPLOYEE_FIELD_ID = 'entity';
        const EMPLOYEE_FIELD_ID = 'custbody_xrc_check_payee_name';
        const REQUESTOR_FIELD_ID = 'custbody_xrc_expense_requestor';
        const FR_OLD_STATUS_FIELD_ID = 'custrecord_xrc_old_status';
        const FR_STATUS_FIELD_ID = 'custrecord_xrc_status';
        const FR_CLOSED_STATUS_ID = '4';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVAL_THREE_FIELD_ID = 'custbody_xrc_approval3';
        const APPROVAL_FIVE_FIELD_ID = 'custbody_xrc_approval5';
        const APPROVAL_SIX_FIELD_ID = 'custbody_xrc_approval6';
        const EMP_TRAN_CATEGORY_FIELD_ID = 'custbody_xrc_emp_transact_category';
        const PCF_REPLEN_CATEGORY_ID = '1';
        const RF_REPLEN_CATEGORY_ID = '2';
        const CONSTRUCTION_FUND_CATEGORY_ID = '5';
        const COO_ID = 1460;
        const AP_SAO_ID = 1415;
        const AP_AH_ID = 1417;
        const AP_CLERK_ID = 1457;
        const OTHER_ROLES_FIELD_ID = 'custentity_xrc_role';
        const TREASURY_ASSISTANT_ROLE_ID = 1482;
        const TREASURY_HEAD_ROLE_ID = 1483;


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var currentUser = runtime.getCurrentUser();

            var form = context.form;

            // Include the path of the client script
            form.clientScriptModulePath = './xrc_cs_expense_report.js';

            var approval_status = newRecord.getValue(STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var exp_category = newRecord.getValue(EMP_TRAN_CATEGORY_FIELD_ID);

            var next_approver = null;

            if (context.type !== context.UserEventType.DELETE) {

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                log.debug('status', approval_status);

                if (!for_approval && prepared_by != currentUser.id) {
                    form.removeButton({
                        id: 'edit'
                    });
                    // if (context.type === context.UserEventType.EDIT) {
                    //     throw "Only the preparer can edit the transaction. Please contact the preparer."
                    // }
                }

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === STATUS_REJECTED ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                    return;
                }

                if (for_approval && approval_status === STATUS_PENDING_APPROVAL) {

                    next_approver = getNextApproverRole(newRecord, "approve");

                    log.debug('next_approver', next_approver);

                    if (next_approver) {

                        var is_coo = exp_category === RF_REPLEN_CATEGORY_ID ? (next_approver.field === APPROVAL_THREE_FIELD_ID && currentUser.role === COO_ID) : false;

                        if (currentUser.role === next_approver.role || is_coo) {

                            // Adding the button Approve
                            form.addButton({
                                id: 'custpage_approve',
                                label: 'Approve',
                                functionName: 'onApproveBtnClick("' + next_approver.field + '")',
                            });

                            // Adding the button Reject
                            form.addButton({
                                id: 'custpage_reject',
                                label: 'Reject',
                                functionName: 'onRejectBtnClick()',
                            });

                        } else {

                            form.removeButton({
                                id: 'edit'
                            });

                            // if (context.type === context.UserEventType.EDIT) {
                            //     throw "Only the preparer can edit the transaction. Please contact the preparer."
                            // }

                        }

                    } else {

                        next_approver = getNextApproverRole(newRecord, "check");

                        log.debug('check next_approver', next_approver);

                        if (next_approver) {

                            if (currentUser.role === next_approver.role) {

                                // Adding the button Checked
                                form.addButton({
                                    id: 'custpage_checked',
                                    label: 'Checked',
                                    functionName: 'onApproveBtnClick("' + next_approver.field + '")',
                                });

                            } else {

                                form.removeButton({
                                    id: 'edit'
                                });

                                // if (context.type === context.UserEventType.EDIT) {
                                //     throw "Only the preparer can edit the transaction. Please contact the preparer."
                                // }

                            }

                        }

                    }
                }

            }

            if (context.type === context.UserEventType.VIEW) {

                var status = newRecord.getValue("status");

                var is_status_valid = status === "Approved by Accounting" || status === "In Progress" || status === "Paid In Full" || status === "Payment In Transit";

                // Adding button Submit for Aprpoval
                if (is_status_valid && (runtime.getCurrentUser().role === AP_SAO_ID || runtime.getCurrentUser().role === AP_AH_ID || runtime.getCurrentUser().role === AP_CLERK_ID)) {
                    form.addButton({
                        id: 'custpage_print_apv',
                        label: 'Print APV',
                        functionName: 'onPrintAPVBtnClick()',
                    });
                }

                if (currentUser.role !== TREASURY_ASSISTANT_ROLE_ID && currentUser.role !== TREASURY_HEAD_ROLE_ID) {

                    form.removeButton({
                        id: 'payment',
                    });

                }

            } else if (context.type === context.UserEventType.EDIT) {

                // next_approver = getNextApproverRole(newRecord, "approve") || getNextApproverRole(newRecord, "check");

                // if ((for_approval && approval_status === STATUS_PENDING_APPROVAL) && currentUser.role !== next_approver.role) {

                // throw new Error("Transaction currently on approval process cannot be modified.");

                // }

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var status = newRecord.getValue(STATUS_FIELD_ID);

            var old_status = newRecord.getValue(OLD_STATUS_FIELD_ID);

            var custom_form = newRecord.getValue(CUSTOM_FORM_FIELD_ID);

            if (context.type === context.UserEventType.EDIT) {

                // Check if status is approved
                if (old_status === STATUS_PENDING_APPROVAL && status === STATUS_APPROVED && custom_form === LIQUIDATION_FORM_ID) {

                    var fr_id = newRecord.getValue(FUND_REQUEST_NUMBER_FIELD_ID);

                    if (fr_id) {

                        // Load fund request load
                        var fr_rec = record.load({
                            type: FUND_REQUEST_TYPE_ID,
                            id: fr_id,
                        });

                        updateFundRequest(newRecord, fr_rec);

                        var emp_id = newRecord.getValue(EMPLOYEE_FIELD_ID);

                        updateEmployeeRecord(emp_id, fr_rec.getValue(FR_FUND_CATEGORY_FIELD_ID), newRecord.getValue(ADVANCE_TO_APPLY_FIELD_ID));

                    }

                }

            }

        }

        function updateFundRequest(newRecord, fr_rec) {

            // Get the amount of fund request
            var total_amount = fr_rec.getValue(FR_AMOUNT_FIELD_ID);

            // Get the current issued fund
            var issued = fr_rec.getValue(FR_ISSUED_FIELD_ID);

            // Get the current returned fund
            var returned = fr_rec.getValue(FR_RETURNED_FIELD_ID) || 0;

            // Get the current liquidated fund
            var liquidated = fr_rec.getValue(FR_LIQUIDATED_FIELD_ID) || 0;

            var atd = fr_rec.getValue(FR_ATD_FIELD_ID) || 0;

            var advance_to_apply = newRecord.getValue(ADVANCE_TO_APPLY_FIELD_ID);

            // Add the values on advance to apply field and add it to the
            // current liquidated value
            liquidated += advance_to_apply;

            var new_balance = issued - returned - liquidated - atd;

            fr_rec.setValue(FR_LIQUIDATED_FIELD_ID, liquidated);

            fr_rec.setValue(FR_BALANCE_FIELD_ID, new_balance);

            if (new_balance === 0) {

                // Closing Fund Request record if the balance is 0 

                var fr_current_status = fr_rec.getValue(FR_STATUS_FIELD_ID);

                fr_rec.setValue(FR_OLD_STATUS_FIELD_ID, fr_current_status);

                fr_rec.setValue(FR_STATUS_FIELD_ID, FR_CLOSED_STATUS_ID);

            }

            fr_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function updateEmployeeRecord(emp_id, fund_category, liquidated) {

            // Fields related to employee Fund Monitoring fields
            const fund_categories = {
                '7': 'custentity_xrc_cash_fund',
                '3': 'custentity_xrc_constru_fund',
                '6': 'custentity_xrc_contingency_fund',
                '5': 'custentity_xrc_emergency_fund',
                '4': 'custentity_xrc_genset_fund',
                '1': 'custentity_xrc_pcf',
                '2': 'custentity_xrc_revolving_fund',
            };

            // Load requestor employee record
            var emp_rec = record.load({
                type: record.Type.EMPLOYEE,
                id: emp_id,
            });

            // Get the fund field based on request's fund category 
            var field = fund_categories[fund_category];

            var current_fund_bal = emp_rec.getValue(field);

            // Deduct the new liquidated amount to the employee record
            emp_rec.setValue(field, current_fund_bal - liquidated);

            emp_rec.save({
                ignoreMandatoryFields: true,
            });


        }

        function getNextApproverRole(newRecord, type) {

            var exp_category = newRecord.getValue(EMP_TRAN_CATEGORY_FIELD_ID);

            var employee = newRecord.getValue(REQUESTOR_FIELD_ID);

            if (employee) {

                if (exp_category === RF_REPLEN_CATEGORY_ID) {

                    exp_category = 'others';

                    var is_user_dept_head = isRequestorDepartmentHead(employee);

                    if (is_user_dept_head) {

                        exp_category = '2-head';
                    }

                } else if (exp_category !== PCF_REPLEN_CATEGORY_ID && exp_category !== CONSTRUCTION_FUND_CATEGORY_ID) {

                    exp_category = 'others';

                }

                var fields = type === "approve" ? getApprovalFieldsByCategory(exp_category, employee) : getCheckedFieldsByCategory(exp_category);

                var approval_fields = fields.approvalfields;

                var roles = fields.roles;

                for (var i = 0; i < approval_fields.length; i++) {

                    var isFieldChecked = newRecord.getValue(approval_fields[i]);

                    if (!isFieldChecked) {

                        return {
                            field: approval_fields[i],
                            role: roles[i]
                        };
                    }

                }
            }

        }

        function getApprovalFieldsByCategory(category, employee) {

            var emp_other_roles = getEmployeeOtherRoles(employee);

            var is_mall_admin = emp_other_roles.find(role => role.value === '14');

            var fields = {
                '1': {
                    approvalfields: is_mall_admin ? ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3'] : ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                    roles: is_mall_admin ? [1480, 1474, 1483] : [1482, 1483],
                },
                '2-head': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3'],
                    roles: [1482, 1483, 1475],
                },
                '5': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2', 'custbody_xrc_approval3', 'custbody_xrc_approval4', 'custbody_xrc_approval5'],
                    roles: [1479, 1462, 1420, 1482, 1483],
                },
                'others': {
                    approvalfields: ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                    roles: [1482, 1483],
                },
            };

            log.debug('fields', fields[category]);

            return fields[category];

        }

        function getCheckedFieldsByCategory(category) {

            var fields = {
                '1': {
                    approvalfields: ['custbody_xrc_approval5', 'custbody_xrc_approval6'],
                    roles: [1457, 1415],
                },
                '2-head': {
                    approvalfields: ['custbody_xrc_approval4', 'custbody_xrc_approval5'],
                    roles: [1457, 1415],
                },
                '5': {
                    approvalfields: ['custbody_xrc_approval6', 'custbody_xrc_approval7'],
                    roles: [1457, 1415],
                },
                'others': {
                    approvalfields: ['custbody_xrc_approval3', 'custbody_xrc_approval4'],
                    roles: [1457, 1415],
                },
            };

            return fields[category];

        }

        function getEmployeeOtherRoles(emp_id) {

            var emp_fieldLookUp = search.lookupFields({
                type: record.Type.EMPLOYEE,
                id: emp_id,
                columns: [OTHER_ROLES_FIELD_ID]
            });

            return emp_fieldLookUp[OTHER_ROLES_FIELD_ID];

        }

        function isRequestorDepartmentHead(emp_id) {

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: emp_id,
                columns: ['custentity_xrc_dept_head']
            });

            return fieldLookUp.custentity_xrc_dept_head;

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);