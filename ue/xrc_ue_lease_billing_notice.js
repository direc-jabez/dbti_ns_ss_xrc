/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Mar 01, 2025
 * 
 */
define(['N/search', 'N/record', 'N/runtime'],

    function (search, record, runtime) {

        const APPROVAL_STATUS_FIELD_ID = 'custrecord_xrc_lbn_approval_status';
        const STATUS_PENDING_APPROVAL = '1';
        const STATUS_APPROVED = '2';
        const STATUS_REJECTED = '3';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_lbn_for_approval';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_lbn_preapred_by';
        const TREASURY_ASSISTANT_ROLE_ID = 1482;
        const TENANT_FIELD_ID = 'custrecord_xrc_lbn_tenant';
        const BALANCE_FIELD_ID = 'custrecord_xrc_lbn_balance';
        const REFUND_AMOUNT_FIELD_ID = 'custrecord_xrc_lbn_refund_amount';
        const REFUNDED_FIELD_ID = 'custrecord_xrc_lbn_refunded';


        function beforeLoad(context) {

            var currentUser = runtime.getCurrentUser();

            var newRecord = context.newRecord;

            var form = context.form;

            form.clientScriptModulePath = './xrc_cs_lease_billing_notice.js';

            if (context.type === context.UserEventType.VIEW) {

                var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!for_approval && currentUser.id === parseInt(prepared_by)) {

                    // Show the Submit for Approval button
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === STATUS_PENDING_APPROVAL ? 'Submit for Approval' : 'Resubmit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (approval_status === STATUS_PENDING_APPROVAL) {

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

                } else if (approval_status === STATUS_APPROVED && currentUser.role === TREASURY_ASSISTANT_ROLE_ID) {

                    var tenant = newRecord.getValue(TENANT_FIELD_ID);

                    var balance = newRecord.getValue(BALANCE_FIELD_ID);

                    if (balance > 0) {

                        // Adding the button Refund
                        form.addButton({
                            id: 'custpage_refund',
                            label: 'Refund',
                            functionName: 'onRefundBtnClick("' + newRecord.id + '","' + tenant + '")',
                        });
                    }


                }

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                var refund_amount = newRecord.getValue(REFUND_AMOUNT_FIELD_ID);

                var refunded = newRecord.getValue(REFUNDED_FIELD_ID) || 0;

                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        'custrecord_xrc_lbn_balance': refund_amount - refunded,
                    },
                });

            }

        }

        function getNextApproverRole(newRecord) {

            var fields = getApprovalFields();

            var approval_fields = fields.approvalfields;

            var roles = fields.roles;

            for (var i = 0; i < approval_fields.length; i++) {

                var isFieldChecked = newRecord.getValue(approval_fields[i]);

                if (!isFieldChecked) {

                    return {
                        field: approval_fields[i],
                        role: roles[i],
                    };
                }

            }

        }

        function getApprovalFields() {

            return {
                approvalfields: ['custrecord_xrc_lbn_approval_1', 'custrecord_xrc_lbn_approval_2'],
                roles: [1458, 1483], // IDs of the roles [A/R Senior Accounting Officer, Treasury Head]
            };

        }


        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);