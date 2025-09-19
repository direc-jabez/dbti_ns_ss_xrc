/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 13, 2024
 * 
 */
define(['N/record', 'N/runtime'],

    function (record, runtime) {

        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_isoa_for_approval';
        const APPROVAL_STATUS_FIELD_ID = 'custrecord_xrc_approval_status4';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_STATUS_ID = '2';
        const PAID_STATUS_ID = '3';
        const REJECTED_STATUS_ID = '4';
        const LEASE_PROPOSAL_FIELD_ID = 'custrecord_xrc_lease_proposal';
        const INITIAL_SOA_FIELD_ID = 'custbody_xrc_initial_soa';
        const ADVANCE_CHARGES_SUBLIST_ID = 'recmachcustrecord_xrc_initial_soa_num';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by4';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_isoa_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_isoa_approval2';
        const APPROVAL_THREE_FIELD_ID = 'custrecord_xrc_isoa_approval3';
        const TOTAL_AMOUNT_DUE_FIELD_ID = 'custrecord_total_amount_due';
        const UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_isoa_unpaid_bal';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            var currentUser = runtime.getCurrentUser();

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                var total_amount_due = newRecord.getValue(TOTAL_AMOUNT_DUE_FIELD_ID);

                var unpaid_balance = newRecord.getValue(UNPAID_BALANCE_FIELD_ID);

                log.debug('total_amount_due', total_amount_due);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === REJECTED_STATUS_ID ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (approval_status === PENDING_APPROVAL_STATUS_ID) {

                    var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

                    var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

                    var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

                    if (!approval_1 && currentUser.role === 1416) { // 1416 => XRC - A/R Junior Accounting Officer

                        // Show the Checked button
                        form.addButton({
                            id: 'custpage_isoa_check',
                            label: 'Checked',
                            functionName: 'onApproveBtnClick("custrecord_xrc_isoa_approval1")',
                        });

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Reject',
                            functionName: 'onRejectBtnClick()',
                        });


                    } else if (!approval_2 && currentUser.role === 1458) { // 1458 => XRC - A/R Senior Accounting Officer

                        // Show the Checked button
                        form.addButton({
                            id: 'custpage_isoa_note',
                            label: 'Note',
                            functionName: 'onApproveBtnClick("custrecord_xrc_isoa_approval2")',
                        });

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Reject',
                            functionName: 'onRejectBtnClick()',
                        });

                    } else if (!approval_3 && currentUser.role === 1483) { // 1483 => XRC - Treasury Head

                        // Adding the button Approve
                        form.addButton({
                            id: 'custpage_approve',
                            label: 'Approve',
                            functionName: 'onApproveBtnClick("custrecord_xrc_isoa_approval3")',
                        });

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Reject',
                            functionName: 'onRejectBtnClick()',
                        });

                    }

                } else if ((approval_status === APPROVED_STATUS_ID || approval_status === PAID_STATUS_ID) && unpaid_balance != 0 && (currentUser.role === 1416 || currentUser.role === 3)) {

                    // Showing Deposit button on Initial SOA approval
                    form.addButton({
                        id: 'custpage_deposit',
                        label: 'Deposit',
                        functionName: 'onDepositBtnClick()',
                    });

                }

            }

            form.clientScriptModulePath = './xrc_cs_initial_soa.js';

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var lease_proposal_id = newRecord.getValue(LEASE_PROPOSAL_FIELD_ID);

                if (lease_proposal_id) {

                    log.debug('lease_proposal_id', lease_proposal_id);

                    // Link the Initial SOA on Estimate on save
                    record.submitFields({
                        type: record.Type.ESTIMATE,
                        id: lease_proposal_id,
                        values: {
                            [INITIAL_SOA_FIELD_ID]: newRecord.id,
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            "custrecord_xrc_isoa_unpaid_bal": newRecord.getValue("custrecord_total_amount_due"),
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });



                }

            }

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);