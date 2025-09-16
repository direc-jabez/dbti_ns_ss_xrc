/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Sept. 23, 2024
 * 
 */
define(['N/record', 'N/search', 'N/runtime'],

    function (record, search, runtime) {

        const VOID_OF_FIELD_ID = 'createdfrom';
        const CHECK_FUND_REQUEST_FIELD_ID = 'custbody_xrc_fund_request_num';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FR_STATUS_FIELD_ID = 'custrecord_xrc_status';
        const FR_OLD_STATUS_FIELD_ID = 'custrecord_xrc_old_status';
        const FR_APPROVED_PENDING_ISSUANCE_STATUS_ID = '2';
        const FR_ISSUED_PENDING_LIQUIDATION_STATUS_ID = '3';
        const FR_AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const FR_REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const STATUS_PENDING_APPROVAL_ID = '1';
        const STATUS_REJECTED_ID = '3';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const JE_CATEGORY_FIELD_ID = 'custbody_xrc_je_category';
        const JE_CATEGORY_GENERAL = '1';
        const JE_CATEGORY_AP = '2';
        const JE_CATEGORY_AR = '3';
        const TRANSFORM_FIELD_ID = 'transform';
        const CHECK_TRANSFORM = 'check';
        const CUSTOMER_REFUND_TRANSFORM = 'custrfnd';
        const CF_LBN_NO_FIELD_ID = 'custbody_xrc_lbn_no';
        const CF_TOTAL_FIELD_ID = 'total';
        const LEASE_BILLING_NOTICE_RECORD_TYPE = 'customrecord_xrc_lease_billing_notice';
        const REFUNDED_LBN_FIELD_ID = 'custrecord_xrc_lbn_refunded';
        const BALANCE_LBN_FIELD_ID = 'custrecord_xrc_lbn_balance';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            form.clientScriptModulePath = './xrc_cs_journal_entry.js';

            var currentUser = runtime.getCurrentUser();

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                var category = newRecord.getValue(JE_CATEGORY_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    var initial_role_to_email = getRoleToEmail(category);

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === STATUS_REJECTED_ID ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick("' + initial_role_to_email + '")',
                    });

                    return;
                } else if (status === STATUS_PENDING_APPROVAL_ID) {

                    var next_approver = getNextApproverRole(newRecord);

                    if (next_approver) {

                        if (currentUser.role === next_approver.role) {

                            // Adding the button Approve
                            form.addButton({
                                id: 'custpage_approve',
                                label: 'Approve',
                                functionName: 'onApproveBtnClick("' + next_approver.field + '","' + next_approver.role_to_email + '")',
                            });

                            // Adding the button Reject
                            form.addButton({
                                id: 'custpage_reject',
                                label: 'Reject',
                                functionName: 'onRejectBtnClick()',
                            });

                        }
                    }

                }

            }
        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                // This block of code will only run if the record type
                // of Void Of Field is Check
                try {

                    var transform = newRecord.getValue(TRANSFORM_FIELD_ID);

                    if (transform !== CHECK_TRANSFORM && transform !== CUSTOMER_REFUND_TRANSFORM) return;

                    var id = newRecord.getValue(VOID_OF_FIELD_ID);

                    if (id) {

                        var fieldLookUp = search.lookupFields({
                            type: transform === CHECK_TRANSFORM ? search.Type.CHECK : search.Type.CUSTOMER_REFUND,
                            id: id,
                            columns: transform === CHECK_TRANSFORM ? [CHECK_FUND_REQUEST_FIELD_ID] : [CF_LBN_NO_FIELD_ID, CF_TOTAL_FIELD_ID],
                        });

                        transform === CHECK_TRANSFORM ? voidCheck(fieldLookUp) : voidCustomerRefund(fieldLookUp);

                    }

                    // if (transform === CHECK_TRANSFORM) {

                    //     var check_id = newRecord.getValue(VOID_OF_FIELD_ID);

                    //     if (check_id) {

                    //         var fieldLookUp = search.lookupFields({
                    //             type: search.Type.CHECK,
                    //             id: check_id,
                    //             columns: [CHECK_FUND_REQUEST_FIELD_ID]
                    //         });

                    //         voidCheck(fieldLookUp);

                    //     }

                    // } else if (transform === CUSTOMER_REFUND_TRANSFORM) {

                    //     var customer_refund_id = newRecord.getValue(VOID_OF_FIELD_ID);

                    //     if (customer_refund_id) {

                    //         var fieldLookUp = search.lookupFields({
                    //             type: search.Type.CUSTOMER_REFUND,
                    //             id: customer_refund_id,
                    //             columns: [CF_LBN_NO_FIELD_ID, CF_TOTAL_FIELD_ID]
                    //         });

                    //         voidCustomerRefund(fieldLookUp);

                    //     }

                    // }

                } catch (error) {

                    log.debug('error', error);

                }

            }
        }

        function voidCheck(fieldLookUp) {

            var fr_id = fieldLookUp[CHECK_FUND_REQUEST_FIELD_ID]?.[0]?.value;

            // Attaching the check number on the Fund Request 
            record.submitFields({
                type: FUND_REQUEST_TYPE_ID,
                id: fr_id,
                values: {
                    [FR_STATUS_FIELD_ID]: FR_APPROVED_PENDING_ISSUANCE_STATUS_ID, // Revert the status to Approved/Pending Issuance
                    [FR_OLD_STATUS_FIELD_ID]: FR_ISSUED_PENDING_LIQUIDATION_STATUS_ID, // Change the old status to Issued/Pending Liquidation
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            fieldLookUp = search.lookupFields({
                type: FUND_REQUEST_TYPE_ID,
                id: fr_id,
                columns: [FR_AMOUNT_FIELD_ID, FR_REQUESTOR_FIELD_ID, FR_FUND_CATEGORY_FIELD_ID]
            });

            // Params: Employee ID, Fund Category, Amount
            updateEmployeeRecord(fieldLookUp[FR_REQUESTOR_FIELD_ID]?.[0]?.value, fieldLookUp[FR_FUND_CATEGORY_FIELD_ID]?.[0]?.value, fieldLookUp[FR_AMOUNT_FIELD_ID]);

        }

        function voidCustomerRefund(fieldLookUp) {

            var lbn_id = fieldLookUp[CF_LBN_NO_FIELD_ID][0].value;

            var total = parseFloat(fieldLookUp[CF_TOTAL_FIELD_ID]);

            const lbn_rec = record.load({
                type: LEASE_BILLING_NOTICE_RECORD_TYPE,
                id: lbn_id,
            });

            var new_refunded = lbn_rec.getValue(REFUNDED_LBN_FIELD_ID) - Math.abs(total);

            var new_balance = lbn_rec.getValue(BALANCE_LBN_FIELD_ID) + Math.abs(total);

            lbn_rec.setValue(REFUNDED_LBN_FIELD_ID, new_refunded);

            lbn_rec.setValue(BALANCE_LBN_FIELD_ID, new_balance);

            lbn_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function updateEmployeeRecord(emp_id, fund_category, amount) {

            // Fields related to employee Fund Monitoring fields
            const fund_categories = {
                '8': 'custentity_xrc_cash_advance',
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

            // Deduct the new amount amount to the employee record
            emp_rec.setValue(field, current_fund_bal - amount);

            emp_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function getNextApproverRole(newRecord) {

            var category = newRecord.getValue(JE_CATEGORY_FIELD_ID);

            var approvers = getApproversByCategory(category);

            var fields = approvers.fields;

            var roles = approvers.roles; // IDs of the roles [XRC - A/P Senior Accounting Officer, XRC - A/P Accounting Head]

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked) {

                    return {
                        field: fields[i],
                        role: roles[i],
                        role_to_email: roles[i + 1],
                    };
                }

            }

        }

        function getApproversByCategory(category) {

            const approvers = {
                '1': {
                    roles: [1463], // => XRC - General Accounting Head
                    fields: ['custbody_xrc_approval1'],
                },
                '2': {
                    roles: [1417, 1463], // 1417 => XRC - A/P Accounting Head, 1463 => XRC - General Accounting Head
                    fields: ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                },
                '3': {
                    roles: [1483, 1463], // 1483 => XRC - Treasury Head, 1463 => XRC - General Accounting Head
                    fields: ['custbody_xrc_approval1', 'custbody_xrc_approval2'],
                },
            };

            return approvers[category];

        }

        function getRoleToEmail(category) {

            if (category === JE_CATEGORY_GENERAL) {

                return 1463; // => XRC - General Accounting Head

            } else if (category === JE_CATEGORY_AP) {

                return 1417;  // 1417 => XRC - A/P Accounting Head

            } else {

                return 1483; // 1483 => XRC - Treasury Head

            }

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);