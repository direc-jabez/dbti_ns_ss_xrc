/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/runtime'],

    function (runtime) {

        const STATUS_FIELD_ID = 'custrecord_xrc_status8';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_tapo_for_approval';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by8';
        const PENDING_APPROVAL_STATUS = '1';
        const REJECTED_STATUS = '3';
        const COO_ID = 1460;
        const APPROVAL_THREE_FIELD_ID = 'custrecord_xrc_tapo_approval3';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            // Include the path of the client script
            form.clientScriptModulePath = './xrc_cs_tenant_asset_pullout.js'

            var approval_status = newRecord.getValue(STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var currentUser = runtime.getCurrentUser();

            if (context.type === context.UserEventType.VIEW) {

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === REJECTED_STATUS ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (approval_status === PENDING_APPROVAL_STATUS) {

                    var next_approver = getNextApproverRole(newRecord);

                    if (next_approver) {

                        var is_coo = next_approver.field === APPROVAL_THREE_FIELD_ID && currentUser.role === COO_ID;

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

                        }
                    }


                }

                form.addButton({
                    id: 'custpage_cancel',
                    label: 'Cancel',
                    functionName: 'onCancelBtnClick()',
                });

            }

        }

        function getNextApproverRole(newRecord) {

            var fields = ['custrecord_xrc_tapo_approval1', 'custrecord_xrc_tapo_approval2', 'custrecord_xrc_tapo_approval3'];

            var roles = [1419, 1420, 1475]; // IDs of the roles [Logistics Manager, Purchasing Head, President]

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