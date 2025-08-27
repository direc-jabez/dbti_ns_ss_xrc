/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/record', 'N/runtime', 'N/ui/serverWidget', 'N/search'],

    function (record, runtime, serverWidget, search) {

        const ID_FIELD_ID = 'name';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const FUND_REQUEST_NUMBER_FIELD_ID = 'custrecord_xrc_fund_req2';
        const AMOUNT_FIELD_ID = 'custrecord_xrc_amount1';
        const FUND_CUSTODIAN_FIELD_ID = 'custrecord_xrc_fund_custodian';
        const REMARKS_FIELD_ID = 'custrecord_xrc_remarks';
        const DATE_RETURNED_FIELD_ID = 'custrecord_xrc_date_returned';
        const FR_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary2';
        const FR_DATE_FIELD_ID = 'custrecord_xrc_date_returned';
        const FR_LOCATION_FIELD_ID = 'custrecord_xrc_location1';
        const FR_DEPARTMENT_FIELD_ID = 'custrecord_xrc_department1';
        const FR_CLASS_FIELD_ID = 'custrecord_xrc_class1';
        const FR_DEPOSITED_TO_ACCOUNT_FIELD_ID = 'custrecord_dbti_deposited_account';
        const FUND_ORIGIN_FIELD_ID = 'custrecord_xrc_fund_origin';
        const JOURNAL_ENTRY_NUMBER_FIELD_ID = 'custrecord_xrc_je_num2';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const FR_AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const FR_ISSUED_FIELD_ID = 'custrecord_xrc_fundreq_issued';
        const FR_RETURNED_FIELD_ID = 'custrecord_xrc_returned';
        const FR_LIQUIDATED_FIELD_ID = 'custrecord_xrc_liquidated';
        const FR_ATD_FIELD_ID = 'custrecord_xrc_atd';
        const FR_BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const FR_OLD_STATUS_FIELD_ID = 'custrecord_xrc_old_status';
        const FR_STATUS_FIELD_ID = 'custrecord_xrc_status';
        const FR_CLOSED_STATUS_ID = '4';
        const STATUS_FIELD_ID = 'custrecord_xrc_fund_ret_status';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_STATUS_ID = '2';
        const REJECTED_STATUS_ID = '3';
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
        const FUND_RETURN_NUMBER_FIELD_ID = 'custbody_xrc_fund_return_num';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const APPROVED_STATUS = '2';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_fundret_for_approval';
        const PREPARED_BY_FIELD_ID = 'custrecord_dbti_prepared_by1';
        const FR_LAST_NUM_FIELD_ID = 'custscript_xrc_fund_ret_last_num';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var currentUser = runtime.getCurrentUser();

            var form = context.form;

            // Include the path of the client script
            form.clientScriptModulePath = './xrc_cs_fund_return.js';

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

                    if (currentUser.role === 1483) { // 1483 = Treasury Head role id

                        // Adding the button Approve
                        form.addButton({
                            id: 'custpage_approve',
                            label: 'Approve',
                            functionName: 'onApproveBtnClick("custrecord_xrc_fundret_approval1")',
                        });

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Reject',
                            functionName: 'onRejectBtnClick()',
                        });

                    }

                }

            } else if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                form.getField({
                    id: ID_FIELD_ID,
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED,
                });


            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var status = newRecord.getValue(STATUS_FIELD_ID);

            if (context.type === context.UserEventType.EDIT) {

                // Check if status is confirmed
                if (status === APPROVED_STATUS_ID) {

                    var fr_id = newRecord.getValue(FUND_REQUEST_NUMBER_FIELD_ID);

                    if (fr_id) {

                        // Load fund request load
                        var fr_rec = record.load({
                            type: FUND_REQUEST_TYPE_ID,
                            id: fr_id,
                        });

                        updateFundRequest(newRecord, fr_rec);

                        var emp_id = newRecord.getValue(FUND_CUSTODIAN_FIELD_ID);

                        updateEmployeeRecord(emp_id, fr_rec.getValue(FR_FUND_CATEGORY_FIELD_ID), newRecord.getValue(AMOUNT_FIELD_ID));

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

            } else if (context.type === context.UserEventType.CREATE) {

                var date = newRecord.getValue(FR_DATE_FIELD_ID);

                // Generate series on CREATE context type and on date after opening balance
                isAfterOpeningBalance(date) && handleSeriesGeneration(newRecord);

            }

        }

        function updateFundRequest(newRecord, fr_rec) {

            // Get the amount of fund request
            var total_amount = fr_rec.getValue(FR_AMOUNT_FIELD_ID);

            // Get the current issued fund
            var issued = fr_rec.getValue(FR_ISSUED_FIELD_ID);

            // Get the current returned fund
            var returned = fr_rec.getValue(FR_RETURNED_FIELD_ID);

            // Get the current liquidated fund
            var liquidated = fr_rec.getValue(FR_LIQUIDATED_FIELD_ID);

            var atd = fr_rec.getValue(FR_ATD_FIELD_ID);

            var amount = newRecord.getValue(AMOUNT_FIELD_ID);

            // Add the current fund return transcation and add it to the
            // current returned value
            returned += amount;

            // var new_balance = total_amount - (returned + liquidated + atd);

            var new_balance = issued - returned - liquidated - atd;

            fr_rec.setValue(FR_RETURNED_FIELD_ID, returned);

            fr_rec.setValue(FR_BALANCE_FIELD_ID, new_balance);

            if (new_balance === 0) {

                // Closing Fund Request record if the balance is 0 

                var fr_current_status = fr_rec.getValue(FR_STATUS_FIELD_ID);

                fr_rec.setValue(FR_OLD_STATUS_FIELD_ID, fr_current_status);

                fr_rec.setValue(FR_STATUS_FIELD_ID, FR_CLOSED_STATUS_ID);

            }

            fr_rec.save({
                ignoreMandatoryFields: true,
            });

            return amount;

        }

        function updateEmployeeRecord(emp_id, fund_category, returned) {

            // Fields related to employee Fund Monitoring fields
            const fund_categories = {
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

            // Deduct the new returned amount to the employee record
            emp_rec.setValue(field, current_fund_bal - returned);

            emp_rec.save({
                ignoreMandatoryFields: true,
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

            journal_entry.setValue(FUND_RETURN_NUMBER_FIELD_ID, newRecord.id);

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

        function getNextApproverRole(newRecord) {

            var fund_category = newRecord.getValue(FUND_CATEGORY_FIELD_ID);

            var fields = getApprovalFieldsByCategory(fund_category);

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

        function getApprovalFieldsByCategory(category) {

            var fields = {
                '8': {
                    approvalfields: ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2', 'custrecord_xrc_fundreq_approval3', 'custrecord_xrc_fundreq_approval4'],
                    roles: [1483], // IDs of the roles [HR- Head, President/COO, AP Senior Accounting Officer, Treasury Head]
                },
            };

            return fields[category];

        }

        function handleSeriesGeneration(newRecord) {

            var current_script = runtime.getCurrentScript();

            var json_string = current_script.getParameter({ name: FR_LAST_NUM_FIELD_ID });

            var last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(FR_LOCATION_FIELD_ID));

            var next_num = (parseInt(last_num_obj[location_code]) || 0) + 1;

            last_num_obj[location_code] = next_num;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [ID_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'FNDRT-'), // Attaching the generated new number on saving the record
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

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
                id: 1881, // Script Deployment ID
                values: {
                    [FR_LAST_NUM_FIELD_ID]: JSON.stringify(new_obj),
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