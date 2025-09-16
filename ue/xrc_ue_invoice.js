/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 21, 2024
 * 
 * Updated by: DBTI - John Jabez Serrano
 * Date: July 25, 2025
 * 
 */
define(['N/record', 'N/runtime', 'N/ui/serverWidget'],

    function (record, runtime, serverWidget) {

        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_STATUS_ID = '2';
        const BILL_SCHED_FIELD_ID = 'custbody_xrc_bill_sched_link';
        const BILLING_SCHEDULE_RECORD_TYPE_ID = 'customrecord_xrc_escalation_schedule';
        const BSCHED_SOA_DATE_FIELD_ID = 'custrecord_xrc_soa_date';
        const BSCHED_SOA_FIELD_ID = 'custrecord_xrc_soa_num';
        const BSCHED_SOA_AMOUNT_FIELD_ID = 'custrecord_xrc_bes_soa_amount';
        const FINAL_SOA_FIELD_ID = 'custbody_xrc_final_soa';
        const LEASE_MEMORANDUM_FIELD_ID = 'custbody_xrc_lease_memorandum';
        const FINAL_SOA_NO_FIELD_ID = 'custbody_xrc_final_soa_num';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const DATE_FIELD_ID = 'trandate';
        const TOTAL_FIELD_ID = 'total';

        const ADDITIONAL_SEC_DEP_FIELD_ID = 'custbody_xrc_add_secdep';
        const PAID_SEC_DEP_FIELD_ID = 'custbody_xmdi_paid_secdep'

        function beforeLoad(context) {

            var currentUser = runtime.getCurrentUser();

            var form = context.form;

            var newRecord = context.newRecord;

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                if (!for_approval && currentUser.id === parseInt(prepared_by)) {

                    // Show the Submit for Approval button
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === PENDING_APPROVAL_STATUS_ID ? 'Submit for Approval' : 'Resubmit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                }

                if (approval_status === PENDING_APPROVAL_STATUS_ID) {

                    var next_approver = getNextApproverRole(newRecord);

                    if (next_approver) {

                        if (currentUser.role === next_approver.role) {

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

                        }
                    }
                }

                let additionalSecDepositValue = parseInt(newRecord.getValue({ fieldId: ADDITIONAL_SEC_DEP_FIELD_ID }) || 0);

                let paidSecDepositValue = parseInt(newRecord.getValue({ fieldId: PAID_SEC_DEP_FIELD_ID }) || 0);

                if (additionalSecDepositValue > paidSecDepositValue) {

                    form.addButton({
                        id: 'custpage_xrc_make_cust_deposit',
                        label: 'Deposit',
                        functionName: 'onDepositBtnClick()'
                    });

                }

                form.clientScriptModulePath = './xrc_cs_invoice.js';

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var final_soa = newRecord.getValue(FINAL_SOA_FIELD_ID);

                if (final_soa) {

                    var lease_memorandum = newRecord.getValue(LEASE_MEMORANDUM_FIELD_ID);

                    if (lease_memorandum) {

                        record.submitFields({
                            type: record.Type.SALES_ORDER,
                            id: lease_memorandum,
                            values: {
                                [FINAL_SOA_NO_FIELD_ID]: newRecord.id,
                                [FINAL_SOA_FIELD_ID]: false,
                            },
                            options: {
                                ignoreMandatoryFields: true,
                            }
                        });

                    }

                } else {

                    var bill_sched = newRecord.getValue(BILL_SCHED_FIELD_ID);

                    if (bill_sched) {

                        var date = newRecord.getValue(DATE_FIELD_ID);

                        var total = newRecord.getValue(TOTAL_FIELD_ID);

                        record.submitFields({
                            type: BILLING_SCHEDULE_RECORD_TYPE_ID,
                            id: bill_sched,
                            values: {
                                [BSCHED_SOA_DATE_FIELD_ID]: date,
                                [BSCHED_SOA_FIELD_ID]: newRecord.id,
                                [BSCHED_SOA_AMOUNT_FIELD_ID]: total,
                            },
                            options: {
                                ignoreMandatoryFields: true,
                            }
                        });

                    }

                }

            }

        }

        function getNextApproverRole(newRecord) {

            var fields = ['custbody_xrc_approval1'];

            var roles = [1458]; // IDs of the roles [XRC - A/R Senior Accounting Officer]

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked) {

                    return {
                        field: fields[i],
                        role: roles[i]
                    };
                }

            }

        }

        return {
            // beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);