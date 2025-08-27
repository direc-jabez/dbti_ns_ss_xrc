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

        const CV_NUM_FIELD_ID = 'custbody_xrc_cv_num';
        const FUND_REQUEST_FIELD_ID = 'custbody_xrc_fund_request_num';
        const DATE_FIELD_ID = 'trandate';
        const FR_CHECK_NUMBER_FIELD_ID = 'custrecord_xrc_check_num';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const OLD_STATUS_FIELD_ID = 'custrecord_xrc_old_status';
        const STATUS_FIELD_ID = 'custrecord_xrc_status';
        const APPROVED_PENDING_ISSUANCE_ID = '2';
        const ISSUED_PENDING_LIQUIDATION = '3';
        const FR_REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const CHECK_TOTAL_FIELD_ID = 'usertotal';
        const CHECK_NO_FIELD_ID = 'tranid';
        const PAYEE_FIELD_ID = 'entity';
        const FR_PURPOSE_FIELD_ID = 'custrecord_xrc_purpose';
        const FR_RETURN_TO_OFFICE_FIELD_ID = 'custrecord_xrc_return_to_office';
        const FR_AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const FR_ISSUED_FIELD_ID = 'custrecord_xrc_fundreq_issued';
        const FR_RETURNED_FIELD_ID = 'custrecord_xrc_returned';
        const FR_LIQUIDATED_FIELD_ID = 'custrecord_xrc_liquidated';
        const FR_ATD_FIELD_ID = 'custrecord_xrc_atd';
        const FR_BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const IS_IC_FUND_TRANSFER_FIELD_ID = 'custbody_xrc_is_ic_fund_transfer';
        const IC_JE_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const IC_JE_FUND_REQUEST_FIELD_ID = 'custbody_xrc_fund_request_num';
        const IC_JE_CATEGORY_FIELD_ID = 'custbody_xrc_je_category';
        const IC_JE_CATEGORY_GENERAL = '1';
        const IC_JE_DATE_FIELD_ID = 'trandate';
        const IC_JE_APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const IC_JE_STATUS_APPROVED = '2';
        const IC_JE_LINE_SUBLIST_ID = 'line';
        const IC_JE_ACCOUNT_SUBLIST_FIELD_ID = 'account';
        const IC_JE_SUBSIDIARY_SUBLIST_FIELD_ID = 'linesubsidiary';
        const IC_JE_DEBIT_SUBLIST_FIELD_ID = 'debit';
        const IC_JE_CREDIT_SUBLIST_FIELD_ID = 'credit';
        const IC_JE_LINE_DESCRIPTION_SUBLIST_FIELD_ID = 'memo';
        const IC_JE_LOCATION_SUBLIST_FIELD_ID = 'location';
        const IC_JE_DEPARTMENT_SUBLIST_FIELD_ID = 'department';
        const IC_JE_ENTITY_NAME_SUBLIST_FIELD_ID = 'entity';
        const CHECK_DATE_FIELD_ID = 'trandate';
        const ACCOUNT_ACCOUNTS_RECEIVABLE_ID = "537";
        const ACCOUNT_INTERCOMPANY_CLEARING_ACCOUNT_ID = "1048";
        const ACCOUNT_ACCOUNTS_PAYABLE_ID = "1045";
        const CHECK_LAST_NUM_FIELD_ID = 'custscript_xrc_check_last_num';
        const LOCATION_FIELD_ID = 'location';


        function beforeLoad(context) {

            var newRedcord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                newRedcord.setValue(CV_NUM_FIELD_ID, 'To Be Generated');

            } else if (context.type === context.UserEventType.VIEW) {

                var form = context.form;

                form.clientScriptModulePath = './xrc_cs_write_check.js';

                form.addButton({
                    id: 'custpage_print_check',
                    label: 'Print Check',
                    functionName: 'onPrintCheckClick()',
                });

                form.addButton({
                    id: 'custpage_print_check',
                    label: 'Print Voucher',
                    functionName: 'onPrintVoucherClick()',
                });

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

                var fr_id = newRecord.getValue(FUND_REQUEST_FIELD_ID);

                var is_ic_fund_transfer = newRecord.getValue(IS_IC_FUND_TRANSFER_FIELD_ID);

                if (fr_id) {

                    var fieldLookUp = search.lookupFields({
                        type: FUND_REQUEST_TYPE_ID,
                        id: fr_id,
                        columns: [FR_REQUESTOR_FIELD_ID, FR_FUND_CATEGORY_FIELD_ID, FR_PURPOSE_FIELD_ID, FR_RETURN_TO_OFFICE_FIELD_ID, FR_AMOUNT_FIELD_ID, FR_ISSUED_FIELD_ID]
                    });

                }

                if (is_ic_fund_transfer) {

                    createIntercompanyJournalEntry(newRecord);

                } else {

                    if (fr_id) {

                        var check_total = newRecord.getValue(CHECK_TOTAL_FIELD_ID);

                        // Params: Employee ID, Fund Category, Amount
                        updateEmployeeRecord(fieldLookUp[FR_REQUESTOR_FIELD_ID]?.[0]?.value, fieldLookUp[FR_FUND_CATEGORY_FIELD_ID]?.[0]?.value, check_total);

                        notifyRequestor(
                            newRecord.id,
                            newRecord.getValue(CHECK_NO_FIELD_ID),
                            fieldLookUp[FR_REQUESTOR_FIELD_ID]?.[0]?.value,
                            fieldLookUp[FR_REQUESTOR_FIELD_ID]?.[0]?.text,
                            fieldLookUp[FR_PURPOSE_FIELD_ID],
                            check_total,
                            fieldLookUp[FR_RETURN_TO_OFFICE_FIELD_ID],
                        );

                    }

                }

                if (fr_id) {

                    var new_issued = ((parseFloat(fieldLookUp[FR_ISSUED_FIELD_ID]) || 0)) + newRecord.getValue(CHECK_TOTAL_FIELD_ID);

                    var new_bal = new_issued - (parseFloat(fieldLookUp[FR_RETURNED_FIELD_ID]) || 0) - (parseFloat(fieldLookUp[FR_LIQUIDATED_FIELD_ID]) || 0) - (parseFloat(fieldLookUp[FR_ATD_FIELD_ID]) || 0);

                    // Attaching the check number on the Fund Request 
                    record.submitFields({
                        type: FUND_REQUEST_TYPE_ID,
                        id: fr_id,
                        values: {
                            // [FR_CHECK_NUMBER_FIELD_ID]: newRecord.id,
                            [FR_ISSUED_FIELD_ID]: new_issued,
                            [FR_BALANCE_FIELD_ID]: new_bal,
                            [OLD_STATUS_FIELD_ID]: APPROVED_PENDING_ISSUANCE_ID, // Change the old status to approved
                            [STATUS_FIELD_ID]: ISSUED_PENDING_LIQUIDATION, // Change the status to issued
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });
                }

                var date = newRecord.getValue(DATE_FIELD_ID);

                // Generate series on create and if date is on or after Nov. 1, 2024
                isAfterOpeningBalance(date) && handleSeriesGeneration(newRecord);

            }
        }

        function updateEmployeeRecord(emp_id, fund_category, amount) {


            // Fields related to employee Fund Monitoring fields
            const fund_categories = {
                '9': 'custentity_xrc_diesel_fund',
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

            if (field) {

                var current_fund_bal = emp_rec.getValue(field);

                // Add the new amount amount to the employee record
                emp_rec.setValue(field, current_fund_bal + amount);

                emp_rec.save({
                    ignoreMandatoryFields: true,
                });

            }

        }

        function createIntercompanyJournalEntry(newRecord) {

            try {

                var ic_je_rec = record.create({
                    type: record.Type.ADV_INTER_COMPANY_JOURNAL_ENTRY,
                    isDynamic: true,
                });

                var fr_id = newRecord.getValue(FUND_REQUEST_FIELD_ID);

                var fund_request_fieldLookUp = search.lookupFields({
                    type: FUND_REQUEST_TYPE_ID,
                    id: fr_id,
                    columns: [
                        'custrecord_xrc_subsidiary', 'custrecord_xrc_amount', 'custrecord_xrc_purpose', 'custrecord_xrc_location',
                        'custrecord_xrc_dept', 'custrecord_xrc_fundreq_transferee', 'custrecord_xrc_fundreq_to_subsidiary', 'custrecord_xrc_fundreq_transfer_to',
                        'custrecord_xrc_fundreq_to_location', 'custrecord_xrc_fundreq_transferor',
                    ],
                });

                ic_je_rec.setValue(IC_JE_FUND_REQUEST_FIELD_ID, fr_id);

                ic_je_rec.setValue(IC_JE_SUBSIDIARY_FIELD_ID, fund_request_fieldLookUp['custrecord_xrc_subsidiary'][0].value);

                ic_je_rec.setValue(IC_JE_CATEGORY_FIELD_ID, IC_JE_CATEGORY_GENERAL);

                ic_je_rec.setValue(IC_JE_DATE_FIELD_ID, newRecord.getValue(CHECK_DATE_FIELD_ID));

                ic_je_rec.setValue(IC_JE_APPROVAL_STATUS_FIELD_ID, IC_JE_STATUS_APPROVED);

                createLine(
                    ic_je_rec,
                    true,
                    fund_request_fieldLookUp['custrecord_xrc_subsidiary'][0].value,
                    ACCOUNT_ACCOUNTS_RECEIVABLE_ID,
                    parseFloat(fund_request_fieldLookUp['custrecord_xrc_amount']),
                    fund_request_fieldLookUp['custrecord_xrc_purpose'],
                    fund_request_fieldLookUp['custrecord_xrc_location'][0].value,
                    fund_request_fieldLookUp['custrecord_xrc_dept'][0].value,
                    fund_request_fieldLookUp['custrecord_xrc_fundreq_transferee'][0].value
                );

                createLine(
                    ic_je_rec,
                    false,
                    fund_request_fieldLookUp['custrecord_xrc_subsidiary'][0].value,
                    ACCOUNT_INTERCOMPANY_CLEARING_ACCOUNT_ID,
                    parseFloat(fund_request_fieldLookUp['custrecord_xrc_amount']),
                    fund_request_fieldLookUp['custrecord_xrc_purpose'],
                    fund_request_fieldLookUp['custrecord_xrc_location'][0].value,
                    fund_request_fieldLookUp['custrecord_xrc_dept'][0].value,
                );

                createLine(
                    ic_je_rec,
                    true,
                    fund_request_fieldLookUp['custrecord_xrc_fundreq_to_subsidiary'][0].value,
                    parseInt(fund_request_fieldLookUp['custrecord_xrc_fundreq_transfer_to'][0].value),
                    parseFloat(fund_request_fieldLookUp['custrecord_xrc_amount']),
                    fund_request_fieldLookUp['custrecord_xrc_purpose'],
                    fund_request_fieldLookUp['custrecord_xrc_fundreq_to_location'][0].value,
                    fund_request_fieldLookUp['custrecord_xrc_dept'][0].value,
                );

                createLine(
                    ic_je_rec,
                    false,
                    fund_request_fieldLookUp['custrecord_xrc_fundreq_to_subsidiary'][0].value,
                    ACCOUNT_ACCOUNTS_PAYABLE_ID,
                    parseFloat(fund_request_fieldLookUp['custrecord_xrc_amount']),
                    fund_request_fieldLookUp['custrecord_xrc_purpose'],
                    fund_request_fieldLookUp['custrecord_xrc_fundreq_to_location'][0].value,
                    fund_request_fieldLookUp['custrecord_xrc_dept'][0].value,
                    fund_request_fieldLookUp['custrecord_xrc_fundreq_transferor'][0].value
                );

                ic_je_rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }

        }

        function createLine(ic_je_rec, isDebit, subsidiary, account, amount, purpose, location, department, entity = null) {

            log.debug('params', [isDebit, subsidiary, account, amount, purpose, location, department, entity]);

            ic_je_rec.setCurrentSublistValue({
                sublistId: IC_JE_LINE_SUBLIST_ID,
                fieldId: IC_JE_SUBSIDIARY_SUBLIST_FIELD_ID,
                value: subsidiary,
            });

            ic_je_rec.setCurrentSublistValue({
                sublistId: IC_JE_LINE_SUBLIST_ID,
                fieldId: IC_JE_ACCOUNT_SUBLIST_FIELD_ID,
                value: account,
            });

            ic_je_rec.setCurrentSublistValue({
                sublistId: IC_JE_LINE_SUBLIST_ID,
                fieldId: isDebit ? IC_JE_DEBIT_SUBLIST_FIELD_ID : IC_JE_CREDIT_SUBLIST_FIELD_ID,
                value: amount,
            });

            ic_je_rec.setCurrentSublistValue({
                sublistId: IC_JE_LINE_SUBLIST_ID,
                fieldId: IC_JE_LINE_DESCRIPTION_SUBLIST_FIELD_ID,
                value: purpose,
            });

            ic_je_rec.setCurrentSublistValue({
                sublistId: IC_JE_LINE_SUBLIST_ID,
                fieldId: IC_JE_LOCATION_SUBLIST_FIELD_ID,
                value: location,
            });

            ic_je_rec.setCurrentSublistValue({
                sublistId: IC_JE_LINE_SUBLIST_ID,
                fieldId: IC_JE_DEPARTMENT_SUBLIST_FIELD_ID,
                value: department,
            });

            entity && ic_je_rec.setCurrentSublistValue({
                sublistId: IC_JE_LINE_SUBLIST_ID,
                fieldId: IC_JE_ENTITY_NAME_SUBLIST_FIELD_ID,
                value: entity,
            });

            ic_je_rec.commitLine({
                sublistId: IC_JE_LINE_SUBLIST_ID,
            });

        }

        function getRecipients() {

            var recipients = [];

            var recipients_search = search.create({
                type: "employee",
                filters:
                    [
                        ["role", "anyof", "1415"],
                        "AND",
                        ["isinactive", "is", "F"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            recipients_search.run().each(function (result) {

                recipients.push(result.id);

                return true;
            });

            return recipients;

        }

        function notifyRequestor(id, tran_id, emp_id, emp_name, purpose, total, date) {

            var recipients = getRecipients();

            recipients.push(emp_id);

            total = parseFloat(Math.abs(total)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            var body = `Good Day,<br /><br />
                        This is to inform you that an Authority to Deduct (ATD) has been issued on ${date}.<br /><br />
                        Reason for Deduction: ${purpose}<br />
                        Amount: ₱${total}<br />
                        Reference/Details: <b><a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?id=${id}&rectype=1213&whence=>${tran_id}</a></b><br /><br />
                        If you have any questions or would like to discuss this further, please feel free to reach out.<br /><br />
                        Thank you for your attention to this matter.<br /><br />
                        Best regards,`
                ;

            log.debug('body', body);

            // email.send({
            //     author: fromEmail,
            //     recipients: recipients,
            //     subject: 'Notification of Authority to Deduct (ATD)',
            //     body: body,
            // });
        }

        function isAfterOpeningBalance(date) {

            return date >= new Date("2024-11-01");

        }

        function handleSeriesGeneration(newRecord) {

            var script_deployment_rec = record.load({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 1879, // Script Deployment ID
            });

            var json_string = script_deployment_rec.getValue(CHECK_LAST_NUM_FIELD_ID);

            var vendor_pay_last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(LOCATION_FIELD_ID));

            var next_num = (parseInt(vendor_pay_last_num_obj[location_code]) || 0) + 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [CV_NUM_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'FRCV-'), // Attaching the generated new number on saving the record
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            vendor_pay_last_num_obj[location_code] = next_num;

            updateCheckLastNumber(script_deployment_rec, vendor_pay_last_num_obj);

        }

        function getLocationCode(location_id) {

            const fieldLookUp = search.lookupFields({
                type: search.Type.LOCATION,
                id: location_id,
                columns: ['tranprefix']
            });

            return fieldLookUp['tranprefix'];

        }

        function updateCheckLastNumber(script_deployment_rec, new_obj) {

            script_deployment_rec.setValue(CHECK_LAST_NUM_FIELD_ID, JSON.stringify(new_obj));

            script_deployment_rec.save({
                ignoreMandatoryFields: true,
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

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);