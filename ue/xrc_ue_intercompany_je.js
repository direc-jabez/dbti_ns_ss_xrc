/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Oct 1, 2024
 * 
 */
define(['N/record', 'N/runtime'],

    function (record, runtime) {

        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const REJECTED_STATUS_ID = '3';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approver1';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            var currentUser = runtime.getCurrentUser();

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === REJECTED_STATUS_ID ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (approval_status === PENDING_APPROVAL_STATUS_ID) {

                    var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

                    if (!approval_1 && currentUser.role === 1463) { // 1463 => XRC - General Accounting Head

                        // Show the Checked button
                        form.addButton({
                            id: 'custpage_approve',
                            label: 'Approve',
                            functionName: 'onApproveBtnClick("custbody_xrc_approval1")',
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

            form.clientScriptModulePath = './xrc_cs_intercompany_je.js';

        }

        return {
            beforeLoad: beforeLoad,
        };
    }
);