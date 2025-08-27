/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/record', 'N/search', 'N/runtime'],

    function (record, search, runtime) {

        const VEND_PREP_NUM_FIELD_ID = 'custbody_xrc_vend_prep_num';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECTED_STATUS = '3';
        const VENDOR_PREPAYMENT_LAST_NUM_FIELD_ID = 'custscript_xrc_vend_prep_last_num';
        const LOCATION_FIELD_ID = 'location';
        const DATE_FIELD_ID = 'trandate';

        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            form.clientScriptModulePath = './xrc_cs_vendor_prepayment.js';

            var currentUser = runtime.getCurrentUser();

            if (context.type === context.UserEventType.VIEW) {

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === REJECTED_STATUS ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (approval_status === PENDING_APPROVAL_STATUS) {

                    form.removeButton({
                        id: 'edit'
                    });

                    var next_approver = getNextApproverRole(newRecord);

                    if (next_approver) {

                        if (currentUser.role === next_approver.role) { // 1483 = XRC - Treasury Head role id

                            // var for_revision = approval_status === PENDING_REVISION_APPROVAL_STATUS;

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
                    id: 'custpage_print_check',
                    label: 'Print Check',
                    functionName: 'onPrintCheckClick()',
                });

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var date = newRecord.getValue(DATE_FIELD_ID);

                // Generate series on create and if date is on or after Nov. 1, 2024
                isAfterOpeningBalance(date) && handleSeriesGeneration(newRecord);

            }

        }

        function getNextApproverRole(newRecord) {

            var fields = ['custbody_xrc_approval1'];

            var roles = [1483]; // IDs of the roles [Treasury Head]

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

        function canEdit(newRecord, currentUser) {

            var fields = ['custbody_xrc_approval1'];

            var roles = [1483]; // IDs of the roles [Treasury Head]

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked && currentUser.role === roles[i]) {

                    return true;
                }

            }

            return false;

        }

        function handleSeriesGeneration(newRecord) {

            var current_script = runtime.getCurrentScript();

            var json_string = current_script.getParameter({ name: VENDOR_PREPAYMENT_LAST_NUM_FIELD_ID });

            var last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(LOCATION_FIELD_ID));

            var next_num = (parseInt(last_num_obj[location_code]) || 0) + 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [VEND_PREP_NUM_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'VENPP-'), // Attaching the generated new number on saving the record
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            last_num_obj[location_code] = next_num;

            updateLastNumber(last_num_obj);

        }

        function getLocationCode(location_id) {

            const fieldLookUp = search.lookupFields({
                type: search.Type.LOCATION,
                id: location_id,
                columns: ['tranprefix']
            });

            return fieldLookUp['tranprefix'];

        }

        function updateLastNumber(new_obj) {

            record.submitFields({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 2218, // Script Deployment ID
                values: {
                    [VENDOR_PREPAYMENT_LAST_NUM_FIELD_ID]: JSON.stringify(new_obj),
                },
                options: {
                    ignoreMandatoryFields: true,
                }
            });

        }

        function appendLeadingZeros(newCode, prefix) {

            var leadingZeros = '0000';
            var zerosLength = 4;

            newCode = newCode.toString();

            if (newCode.length <= zerosLength) {
                leadingZeros = leadingZeros.slice(0, zerosLength - newCode.length);
                newCode = prefix + leadingZeros + newCode;
            } else {
                newCode = prefix + newCode;
            }

            return newCode;
        }

        function isAfterOpeningBalance(date) {

            return date >= new Date("2024-11-01");

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);