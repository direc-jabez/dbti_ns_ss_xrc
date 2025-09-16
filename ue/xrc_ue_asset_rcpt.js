/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/record', 'N/runtime', 'N/search'],

    function (record, runtime, search) {

        const CUSTOM_FORM_FIELD_ID = 'customform';
        const IT_FORM_ID = '406';
        const STATUS_FIELD_ID = 'custrecord_xrc_araa_status';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_araa_for_approval';
        const EMPLOYEE_FIELD_ID = 'custrecord_xrc_asset_asgmt_employee';
        const DATE_FIELD_ID = 'custrecord_xrc_date1';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_araa_prepared_by';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_STATUS_ID = '2';
        const REJECTED_STATUS_ID = '3';
        const RETURNED_STATUS = '4';
        const FOR_IT_FIELD_ID = 'custrecord_xrc_asset_rcp_for_it';
        const APPROVAL_FOUR_FIELD_ID = 'custrecord_xrc_araa_approval4';
        const COO_ID = 1460;
        const DATE_RETURNED_FIELD_ID = 'custrecord_xrc_date_returned1';
        const ASSETS_SUBLIST_ID = 'recmachcustrecord_xrc_issuance_link';
        const ASSETS_SUBLIST_FIELD_ID = 'custrecord_xrc_asset';
        const FAM_ASSET_RECORD_TYPE = 'customrecord_ncfar_asset';
        const FAM_CUSTODIAN_FIELD_ID = 'custrecord_assetcaretaker';
        const FAM_DATE_ISSUED_FIELD_ID = 'custrecord_xrc_fam_date_issued';
        const FAM_RETURNED_FIELD_ID = 'custrecord_xrc_fam_returned';
        const FAM_DATE_RETURNED_FIELD_ID = 'custrecord_xrc_fam_date_returned';
        const ID_FIELD_ID = 'name';
        const ARASA_LAST_NUM_FIELD_ID = 'custscript_xrc_arasa_last_num';
        const LOCATION_FIELD_ID = 'custrecord_xrc_asset_asgmt_location';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            // Include the path of the client script
            form.clientScriptModulePath = './xrc_cs_rcpt.js';

            var currentUser = runtime.getCurrentUser();

            var status = newRecord.getValue(STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: status === REJECTED_STATUS_ID ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (status === PENDING_APPROVAL_STATUS_ID) {

                    var is_for_it = newRecord.getValue(FOR_IT_FIELD_ID);

                    var next_approver = getNextApproverRole(newRecord, is_for_it);

                    if (next_approver) {

                        var is_coo = next_approver.field === APPROVAL_FOUR_FIELD_ID ? currentUser.role === COO_ID : false;

                        if (currentUser.role === next_approver.role || is_coo) {

                            // Adding the button Approve
                            form.addButton({
                                id: 'custpage_approve',
                                label: currentUser.role === 1468 ? 'Check' : currentUser.role === 1467 ? 'Note' : 'Approve',
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

            } else if (context.type === context.UserEventType.CREATE) {

                var cf = context.request.parameters.cf || '388';

                if (cf === IT_FORM_ID) {

                    newRecord.setValue(FOR_IT_FIELD_ID, true);

                }

            }
        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.EDIT) {

                var status = newRecord.getValue(STATUS_FIELD_ID);

                var date_returned = newRecord.getValue(DATE_RETURNED_FIELD_ID);

                if (status === APPROVED_STATUS_ID && date_returned) {

                    updateFAMAsset(newRecord);

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [STATUS_FIELD_ID]: RETURNED_STATUS,
                        }
                    });

                    return;

                }

                if (status === APPROVED_STATUS_ID) {

                    var assets_lines = newRecord.getLineCount({
                        sublistId: ASSETS_SUBLIST_ID,
                    });

                    for (var line = 0; line < assets_lines; line++) {

                        var asset_id = newRecord.getSublistValue({
                            sublistId: ASSETS_SUBLIST_ID,
                            fieldId: ASSETS_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        record.submitFields({
                            type: FAM_ASSET_RECORD_TYPE,
                            id: asset_id,
                            values: {
                                [FAM_CUSTODIAN_FIELD_ID]: newRecord.getValue(EMPLOYEE_FIELD_ID),
                                [FAM_DATE_ISSUED_FIELD_ID]: newRecord.getValue(DATE_FIELD_ID),
                            }
                        });

                    }


                }

            } else if (context.type === context.UserEventType.CREATE) {

                var date = newRecord.getValue(DATE_FIELD_ID);

                // Generate series on CREATE context type and on date after opening balance
                isAfterOpeningBalance(date) && handleSeriesGeneration(newRecord);

            }

        }

        function getNextApproverRole(newRecord, is_for_it) {

            log.debug('is_for_it', is_for_it);

            var fields = getApprovalFields(is_for_it);

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

        function getApprovalFields(is_for_it) {

            return is_for_it ? {
                approvalfields: ['custrecord_xrc_araa_approval1', 'custrecord_xrc_araa_approval2', 'custrecord_xrc_araa_approval3', 'custrecord_xrc_araa_approval4'],
                roles: [1468, 1467, 1420, 1475], // IDs of the roles [IT Supervisor, HR Head, Purchasing Head, President/COO]
            } : {
                approvalfields: ['custrecord_xrc_araa_approval1', 'custrecord_xrc_araa_approval2', 'custrecord_xrc_araa_approval3', 'custrecord_xrc_araa_approval4'],
                roles: [1467, 1419, 1420, 1475], // IDs of the roles [HR Head, Logistics Manager, Purchasing Head, President/COO]
            };

        }

        function updateFAMAsset(newRecord) {

            var date_returned = newRecord.getValue(DATE_RETURNED_FIELD_ID);

            var assets_lines = newRecord.getLineCount({
                sublistId: ASSETS_SUBLIST_ID,
            });

            for (var line = 0; line < assets_lines; line++) {

                var asset_id = newRecord.getSublistValue({
                    sublistId: ASSETS_SUBLIST_ID,
                    fieldId: ASSETS_SUBLIST_FIELD_ID,
                    line: line,
                });

                record.submitFields({
                    type: FAM_ASSET_RECORD_TYPE,
                    id: asset_id,
                    values: {
                        [FAM_CUSTODIAN_FIELD_ID]: null,
                        [FAM_DATE_ISSUED_FIELD_ID]: null,
                        [FAM_RETURNED_FIELD_ID]: true,
                        [FAM_DATE_RETURNED_FIELD_ID]: date_returned,
                    }
                });

            }


        }

        function handleSeriesGeneration(newRecord) {

            var current_script = runtime.getCurrentScript();

            var json_string = current_script.getParameter({ name: ARASA_LAST_NUM_FIELD_ID });

            var last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(LOCATION_FIELD_ID));

            var next_num = (parseInt(last_num_obj[location_code]) || 0) + 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [ID_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'ARASA-'), // Attaching the generated new number on saving the record
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
                id: 2439, // Script Deployment ID
                values: {
                    [ARASA_LAST_NUM_FIELD_ID]: JSON.stringify(new_obj),
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