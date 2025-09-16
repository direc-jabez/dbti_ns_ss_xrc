/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/record', 'N/search', 'N/runtime'],

    function (record, search, runtime) {

        const ID_FIELD_ID = 'name';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FUND_REQUEST_NUMBER_FIELD_ID = 'custrecord_xrc_fund_req3';
        const AMOUNT_FIELD_ID = 'custrecord_xrc_amount3';
        const FUND_CUSTODIAN_FIELD_ID = 'custrecord_xrc_fund_custodian3';
        const REMARKS_FIELD_ID = 'custrecord_xrc_remarks3';
        const DATE_RETURNED_FIELD_ID = 'custrecord_xrc_date3';
        const FR_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary3';
        const FR_LOCATION_FIELD_ID = 'custrecord_xrc_location3';
        const FR_DEPARTMENT_FIELD_ID = 'custrecord_xrc_department3';
        const FR_CLASS_FIELD_ID = 'custrecord_xrc_class3';
        const FR_DEPOSITED_TO_ACCOUNT_FIELD_ID = 'custrecord_xrc_deposited_to_account';
        const FUND_ORIGIN_FIELD_ID = 'custrecord_xrc_fund_account';
        const JOURNAL_ENTRY_NUMBER_FIELD_ID = 'custrecord_xrc_je_num3';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const FR_BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const FR_OLD_STATUS_FIELD_ID = 'custrecord_xrc_old_status';
        const FR_STATUS_FIELD_ID = 'custrecord_xrc_status';
        const FR_ISSUED_PENDING_LIQUIDATION_ID = '3';
        const FR_CLOSED_STATUS_ID = '4';
        const FR_ATD_FIELD_ID = 'custrecord_xrc_atd';
        const STATUS_FIELD_ID = 'custrecord_xrc_atd_status';
        const STATUS_PENDING_APPROVAL = '1';
        const STATUS_APPROVED = '2';
        const STATUS_RECEIVED = '3';
        const STATUS_REJECTED = '6';
        const STATUS_REQUEST_FOR_CANCELLATION = '4';
        const DATE_FIELD_ID = 'trandate';
        const MEMO_FIELD_ID = 'memo';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const LINE_SUBLIST_ID = 'line';
        const ACCOUNT_SUBLIST_FIELD_ID = 'account';
        const DEBIT_SUBLIST_FIELD_ID = 'debit';
        const CREDIT_SUBLIST_FIELD_ID = 'credit';
        const ATD_NUMBER_FIELD_ID = 'custbody_xrc_atd_num';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const APPROVED_STATUS = '2';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_atd_for_approval';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by3';
        const ATD_LAST_NUM_FIELD_ID = 'custscript_xrc_atd_last_num';
        const ATD_LOCATION_FIELD_ID = 'custrecord_xrc_location3';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            // Include the path of the client script
            
            var currentUser = runtime.getCurrentUser();
            
            var status = newRecord.getValue(STATUS_FIELD_ID);
            
            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);
            
            if (context.type === context.UserEventType.VIEW) {
                
                form.clientScriptModulePath = './xrc_cs_authority_to_deduct.js';

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: status === STATUS_REJECTED ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (status === STATUS_PENDING_APPROVAL) {

                    if (currentUser.role === 1475 || currentUser.role === 1460) { // 1483 = President, 1460 = COO

                        // Adding the button Approve
                        form.addButton({
                            id: 'custpage_approve',
                            label: 'Approve',
                            functionName: 'onApproveBtnClick("custrecord_xrc_atd_approval1")',
                        });

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Reject',
                            functionName: 'onRejectBtnClick()',
                        });

                    }

                }

                if (status === STATUS_APPROVED) {

                    // Show Receive button if status is approved
                    form.addButton({
                        id: 'custpage_receive',
                        label: 'Receive',
                        functionName: 'onReceiveBtnClick()',
                    });

                    // Show Cancel button if status is approved
                    form.addButton({
                        id: 'custpage_receive',
                        label: 'Cancel',
                        functionName: 'onCancelBtnClick()',
                    });


                } else if (status === STATUS_REQUEST_FOR_CANCELLATION) {

                    // Show Approve Cancellation button if status is approved
                    form.addButton({
                        id: 'custpage_receive',
                        label: 'Approve Cancellation',
                        functionName: 'onApproveCancelBtnClick()',
                    });

                    // Show Reject Cancellation button if status is approved
                    form.addButton({
                        id: 'custpage_receive',
                        label: 'Reject Cancellation',
                        functionName: 'onReceiveBtnClick()',
                    });

                }

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var status = newRecord.getValue(STATUS_FIELD_ID);

            if (context.type === context.UserEventType.CREATE) {

                var date = newRecord.getValue(DATE_RETURNED_FIELD_ID);

                // Generate series on CREATE context type and on date after opening balance
                isAfterOpeningBalance(date) && handleSeriesGeneration(newRecord);

            } else if (context.type === context.UserEventType.EDIT) {

                // Check if status is confirmed
                if (status === STATUS_RECEIVED) {

                    var fr_id = newRecord.getValue(FUND_REQUEST_NUMBER_FIELD_ID);

                    if (fr_id) {

                        // Load fund request load
                        var fr_rec = record.load({
                            type: FUND_REQUEST_TYPE_ID,
                            id: fr_id,
                        });

                        updateFundRequest(fr_id, fr_rec.getValue(FR_BALANCE_FIELD_ID));

                        var emp_id = newRecord.getValue(FUND_CUSTODIAN_FIELD_ID);

                        updateEmployeeRecord(emp_id, fr_rec.getValue(FR_FUND_CATEGORY_FIELD_ID));

                        var je_id = createJournalEntry(newRecord);

                        record.submitFields({
                            type: newRecord.type,
                            id: newRecord.id,
                            values: {
                                [JOURNAL_ENTRY_NUMBER_FIELD_ID]: je_id,
                            },
                            options: {
                                ignoreMandatoryFields: true
                            }
                        });

                    }
                }
            }

        }

        function updateFundRequest(fr_id, balance) {

            record.submitFields({
                type: FUND_REQUEST_TYPE_ID,
                id: fr_id,
                values: {
                    [FR_BALANCE_FIELD_ID]: 0, // Clear balance
                    [FR_ATD_FIELD_ID]: balance,
                    [FR_OLD_STATUS_FIELD_ID]: FR_ISSUED_PENDING_LIQUIDATION_ID,
                    [FR_STATUS_FIELD_ID]: FR_CLOSED_STATUS_ID,
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

        }

        function updateEmployeeRecord(emp_id, fund_category) {

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

            record.submitFields({
                type: record.Type.EMPLOYEE,
                id: emp_id,
                values: {
                    [fund_categories[fund_category]]: 0, // Clear the fund balance
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });


        }

        function createJournalEntry(newRecord) {

            // Creating journal entry record
            var journal_entry = record.create({
                type: record.Type.JOURNAL_ENTRY,
                isDynamic: true,
            });

            // Setting body fields
            journal_entry.setValue(DATE_FIELD_ID, newRecord.getValue(DATE_RETURNED_FIELD_ID));

            journal_entry.setValue(MEMO_FIELD_ID, newRecord.getValue(REMARKS_FIELD_ID));

            journal_entry.setValue(SUBSIDIARY_FIELD_ID, newRecord.getValue(FR_SUBSIDIARY_FIELD_ID));

            journal_entry.setValue(LOCATION_FIELD_ID, newRecord.getValue(FR_LOCATION_FIELD_ID));

            journal_entry.setValue(DEPARTMENT_FIELD_ID, newRecord.getValue(FR_DEPARTMENT_FIELD_ID));

            journal_entry.setValue(CLASS_FIELD_ID, newRecord.getValue(FR_CLASS_FIELD_ID));

            journal_entry.setValue(ATD_NUMBER_FIELD_ID, newRecord.id);

            journal_entry.setValue(APPROVAL_STATUS_FIELD_ID, APPROVED_STATUS);

            // Setting line sublist fields

            // Debit line
            journal_entry.selectNewLine({
                sublistId: LINE_SUBLIST_ID,
            });

            journal_entry.setCurrentSublistValue({
                sublistId: LINE_SUBLIST_ID,
                fieldId: ACCOUNT_SUBLIST_FIELD_ID,
                value: newRecord.getValue(FR_DEPOSITED_TO_ACCOUNT_FIELD_ID),
            });

            journal_entry.setCurrentSublistValue({
                sublistId: LINE_SUBLIST_ID,
                fieldId: DEBIT_SUBLIST_FIELD_ID,
                value: newRecord.getValue(AMOUNT_FIELD_ID),
            });

            journal_entry.commitLine({
                sublistId: LINE_SUBLIST_ID,
            });

            // Credit line
            journal_entry.selectNewLine({
                sublistId: LINE_SUBLIST_ID,
            });

            journal_entry.setCurrentSublistValue({
                sublistId: LINE_SUBLIST_ID,
                fieldId: ACCOUNT_SUBLIST_FIELD_ID,
                value: newRecord.getValue(FUND_ORIGIN_FIELD_ID),
            });

            journal_entry.setCurrentSublistValue({
                sublistId: LINE_SUBLIST_ID,
                fieldId: CREDIT_SUBLIST_FIELD_ID,
                value: newRecord.getValue(AMOUNT_FIELD_ID),
            });

            journal_entry.commitLine({
                sublistId: LINE_SUBLIST_ID,
            });

            var je_id = journal_entry.save({
                ignoreMandatoryFields: true,
            });

            return je_id;

        }

        function handleSeriesGeneration(newRecord) {

            var current_script = runtime.getCurrentScript();

            var json_string = current_script.getParameter({ name: ATD_LAST_NUM_FIELD_ID });

            var last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(ATD_LOCATION_FIELD_ID));

            var next_num = (parseInt(last_num_obj[location_code]) || 0) + 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [ID_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'AUTDD-'), // Attaching the generated new number on saving the record
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
                id: 1886, // Script Deployment ID
                values: {
                    [ATD_LAST_NUM_FIELD_ID]: JSON.stringify(new_obj),
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