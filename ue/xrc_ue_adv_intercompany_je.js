/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/search', 'N/record', 'N/runtime'],

    function (search, record, runtime) {

        const FOR_APPROVAL_FIELD_ID = 'custbody_gvi_for_approval';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const PREPARED_BY_FIELD_ID = 'custbody_gvi_prepared_by';


        function beforeLoad(context) {

            var currentUser = runtime.getCurrentUser();

            var newRecord = context.newRecord;

            var form = context.form;

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

            }

            form.clientScriptModulePath = './gvi_cs_bill.js';

        }


        function getNextApproverRole(newRecord) {

            var fields = ['custbody_gvi_approval_1'];

            var roles = [1466]; // IDs of the roles [XRC - A/P Senior Accounting Officer, XRC - A/P Accounting Head]

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
            beforeLoad: beforeLoad,
        };
    }
);