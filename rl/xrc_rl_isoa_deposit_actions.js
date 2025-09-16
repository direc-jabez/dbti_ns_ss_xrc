/**
 * 
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/search', 'N/redirect', 'N/runtime', 'N/email'],

    function (record, search, redirect, runtime, email) {

        const INITIAL_SOA_DEPOSIT_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa_dep';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_isoadep_for_approval';
        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const GENERATE_DEPOSIT_ACTION_ID = 'gendep';
        const GENERATE_SALES_ACTION_ID = 'gensales';
        const STATUS_FIELD_ID = 'custrecord_xrc_isoa_dep_approval_status';
        const PENDING_APPROVAL_STATUS = '1';
        const APPROVED_STATUS = '2';
        const REJECT_STATUS = '3';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_isoadep_approval2';
        const REJECT_FIELD_ID = 'custrecord_xrc_isoadep_rejected';
        const TRANID_FIELD_ID = 'name';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary4';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_isoadep_preparedby';

        const INITIAL_SOA_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa';
        const DATE_FIELD_ID = 'custrecord_xrc_deposit_date';
        const ISOA_LEASE_PROPOSAL_FIELD_ID = 'custrecord_xrc_lease_proposal';
        const ISOA_CUSTOMER_FIELD_ID = 'custrecord_xrc_customer_name';
        const ISOA_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_isoa_subsidiary';
        const ISOA_LOCATION_FIELD_ID = 'custrecord_xrc_isoa_location';
        const ISOA_DEPARTMENT_FIELD_ID = 'custrecord_xrc_isoa_department';
        const ISOA_CLASS_FIELD_ID = 'custrecord_xrc_isoa_class';
        const ISOA_DEP_ACCOUNT_FIELD_ID = 'custrecord_xrc_isoa_dep_account';
        const ISOA_APPROVAL_STATUS_FIELD_ID = 'custrecord_xrc_approval_status4';
        const ISOA_PAID_STATUS_ID = '3';
        const ISOA_TOTAL_AMOUNT_DUE_FIELD_ID = 'custrecord_total_amount_due';
        const ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID = 'custrecord_xrc_isoa_totalpay_amt';
        const INITIAL_SOA_NUMBER_FIELD_ID = 'custrecord_xrc_initial_soa6';
        const APPLY_SUBLIST_ID = 'custpage_sublist_apply';
        const APPLY_SUBLIST_FIELD_ID = 'custpage_apply';
        const ID_SUBLIST_FIELD_ID = 'custpage_id';
        const ITEM_ID_SUBLIST_FIELD_ID = 'custpage_item_id';
        const APPLY_PREPAYMENT_CATEGORY_FIELD_ID = 'custpage_prepayment_categ';
        const APPLY_ACCOUNT_DESCRIPTION_FIELD_ID = 'custpage_acct_desc';
        const BALANCE_DUE_SUBLIST_FIELD_ID = 'custpage_balance_due';
        const PAYMENT_SUBLIST_FIELD_ID = 'custpage_payment';
        const ADVANCE_CHARGE_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa_item';
        const AC_BALANCE_DUE_FIELD_ID = 'custrecord_xrc_balance_due';
        const REMARKS_FIELD_ID = 'custrecord_xrc_rem';
        const DEPOSIT_NUMBER_FIELD_ID = 'custrecord_xrc_deposit_num6';
        const OVERPAYMENT_FIELD_ID = 'custrecord_xrc_overpayment';
        const STATUS_APPROVED = '2';
        const CUST_DEP_CUSTOMER_FIELD_ID = 'customer';
        const CUST_DEP_DATE_FIELD_ID = 'trandate';
        const CUST_DEP_DEPOSIT_NUMBER_FIELD_ID = 'tranid';
        const CUST_DEP_UNDEPOSITED_FUNDS_FIELD_ID = 'undepfunds';
        const CUST_DEP_PAYMENT_FIELD_ID = 'payment';
        const CUST_DEP_REMARKS_FIELD_ID = 'memo';
        const CIUST_DEP_ACCOUNT_FIELD_ID = 'account';
        const CUST_DEP_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const CUST_DEP_LOCATION_FIELD_ID = 'location';
        const CUST_DEP_DEPARTMENT_FIELD_ID = 'department';
        const CUST_DEP_CLASS_FIELD_ID = 'class';
        const CUST_DEP_ISOA_DEP_LINK_FIELD_ID = 'custbody_xrc_isoa_dep_link';
        const CUST_DEP_DEPOSIT_CATEGORY_FIELD_ID = 'custbody_xrc_deposit_category';
        const CUST_DEP_ITEM_REFERENCE_FIELD_ID = 'custbody_xrc_item_ref';
        const DEPOSITED_FIELD_ID = 'custrecord_xrc_isoa_dep_deposited';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            var role_to_email = context.role_to_email;

            try {

                // Loading Initial SOA record
                var rec = record.load({
                    type: INITIAL_SOA_DEPOSIT_RECORD_TYPE_ID,
                    id: context.id,
                    isDynamic: true,
                });

                var approval_status = rec.getValue(STATUS_FIELD_ID);

                var tran_id = rec.getValue(TRANID_FIELD_ID);

                var subsidiary = rec.getValue(SUBSIDIARY_FIELD_ID);

                if (role_to_email) {

                    var employee_ids = getEmployeeIdsWithRole(role_to_email);

                }

                var prepared_by = rec.getValue(PREPARED_BY_FIELD_ID);

                if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                    rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                    if (approval_status === REJECT_STATUS) {

                        rec.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);

                        rec.setValue(REJECT_FIELD_ID, false);

                    }

                    sendEmail(context.id, tran_id, subsidiary, employee_ids);

                } else if (action === APPROVE_ACTION_ID) {

                    rec.setValue(field, true);

                    rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                    if (field === APPROVAL_TWO_FIELD_ID) {

                        rec.setValue(STATUS_FIELD_ID, APPROVED_STATUS);

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_APPROVED);

                    if (employee_ids && field !== APPROVAL_TWO_FIELD_ID) {

                        sendEmail(context.id, tran_id, subsidiary, employee_ids);

                    }

                } else if (action === REJECT_ACTION_ID) {

                    rec.setValue(STATUS_FIELD_ID, REJECT_STATUS);

                    rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                    rec.setValue(REJECT_FIELD_ID, true);

                    var fields = ['custrecord_xrc_isoadep_approval1', 'custrecord_xrc_isoadep_approval2'];

                    for (var i = 0; i < fields.length; i++) {

                        var isChecked = rec.getValue(fields[i]);

                        if (!isChecked) {

                            break;

                        }

                        rec.setValue(fields[i], false);

                    }

                    sendEmail(context.id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_REJECTED);

                } else if (action === GENERATE_DEPOSIT_ACTION_ID) {

                    generateCustomerDeposits(rec);

                    rec.setValue(DEPOSITED_FIELD_ID, true);

                }

                rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }

            redirect.toRecord({
                type: INITIAL_SOA_DEPOSIT_RECORD_TYPE_ID,
                id: context.id,
            });

        }

        function generateCustomerDeposits(rec) {

            try {
                // Referencing fields from Initial SOA record
                // Immediate referencing so we can save governance units
                var isoa_fieldLookUp = search.lookupFields({
                    type: INITIAL_SOA_RECORD_TYPE_ID,
                    id: rec.getValue(INITIAL_SOA_NUMBER_FIELD_ID),
                    columns: [ISOA_CUSTOMER_FIELD_ID, ISOA_LEASE_PROPOSAL_FIELD_ID, ISOA_SUBSIDIARY_FIELD_ID, ISOA_LOCATION_FIELD_ID, ISOA_DEPARTMENT_FIELD_ID, ISOA_CLASS_FIELD_ID, ISOA_TOTAL_AMOUNT_DUE_FIELD_ID, ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID]
                });

                log.debug('isoa_fieldLookUp', isoa_fieldLookUp);

                var overpayment = rec.getValue(OVERPAYMENT_FIELD_ID);

                var total_payment = 0;

                var apply_lines = rec.getLineCount({
                    sublistId: APPLY_SUBLIST_ID,
                });

                log.debug('apply_lines', apply_lines);

                for (var line = 0; line < apply_lines; line++) {

                    var apply = rec.getSublistValue({
                        sublistId: APPLY_SUBLIST_ID,
                        fieldId: APPLY_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    // Check if Apply is check marked
                    if (apply === true) {

                        var item_id = rec.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: ITEM_ID_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var prepayment_category = rec.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: APPLY_PREPAYMENT_CATEGORY_FIELD_ID,
                            line: line,
                        });

                        var acct_description = rec.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: APPLY_ACCOUNT_DESCRIPTION_FIELD_ID,
                            line: line,
                        });

                        var payment = rec.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: PAYMENT_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        total_payment += parseFloat(payment);

                        var custom_customer_dep_id = rec.getValue(DEPOSIT_NUMBER_FIELD_ID) + '-' + getAccountAbbr(prepayment_category) + '-' + (line + 1);

                        var account = rec.getValue(ISOA_DEP_ACCOUNT_FIELD_ID);

                        var deposit_category = getDepositCategory(acct_description);

                        var remarks = rec.getValue(REMARKS_FIELD_ID);

                        // Creating Customer Deposit(s) on approval
                        var cust_dep_id = createCustomerDeposit(
                            account,
                            item_id,
                            deposit_category,
                            parseFloat(payment),
                            isoa_fieldLookUp[ISOA_CUSTOMER_FIELD_ID]?.[0]?.value ?? null, // Customer
                            rec.getValue(DATE_FIELD_ID), // Date
                            isoa_fieldLookUp[ISOA_SUBSIDIARY_FIELD_ID]?.[0]?.value ?? null, // Subsidiary
                            isoa_fieldLookUp[ISOA_LOCATION_FIELD_ID]?.[0]?.value ?? null, // Location
                            isoa_fieldLookUp[ISOA_DEPARTMENT_FIELD_ID]?.[0]?.value ?? null, // Department
                            isoa_fieldLookUp[ISOA_CLASS_FIELD_ID]?.[0]?.value ?? null, // Class
                            remarks,
                            rec.id,
                        );

                        record.submitFields({
                            type: record.Type.CUSTOMER_DEPOSIT,
                            id: cust_dep_id,
                            values: {
                                'tranid': custom_customer_dep_id,
                            },
                            options: {
                                ignoreMandatoryFields: true,
                            }
                        });

                    }
                }

                if (overpayment) {

                    var custom_customer_dep_id = rec.getValue(DEPOSIT_NUMBER_FIELD_ID) + '-' + 'OVER';

                    var account = rec.getValue(ISOA_DEP_ACCOUNT_FIELD_ID);

                    var deposit_category = getDepositCategory('OVERPAYMENT');

                    // Creating Customer Deposit(s) on approval
                    var cust_dep_id = createCustomerDeposit(
                        account,
                        item_id,
                        deposit_category,
                        parseFloat(overpayment),
                        isoa_fieldLookUp[ISOA_CUSTOMER_FIELD_ID]?.[0]?.value ?? null, // Customer
                        rec.getValue(DATE_FIELD_ID), // Date
                        isoa_fieldLookUp[ISOA_SUBSIDIARY_FIELD_ID]?.[0]?.value ?? null, // Subsidiary
                        isoa_fieldLookUp[ISOA_LOCATION_FIELD_ID]?.[0]?.value ?? null, // Location
                        isoa_fieldLookUp[ISOA_DEPARTMENT_FIELD_ID]?.[0]?.value ?? null, // Department
                        isoa_fieldLookUp[ISOA_CLASS_FIELD_ID]?.[0]?.value ?? null, // Class
                        remarks,
                        rec.id,
                    );

                    record.submitFields({
                        type: record.Type.CUSTOMER_DEPOSIT,
                        id: cust_dep_id,
                        values: {
                            'tranid': custom_customer_dep_id,
                        },
                        options: {
                            ignoreMandatoryFields: true,
                        }
                    });

                }

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createCustomerDeposit(account, item_id, deposit_category, payment_amount, customer, date, subsidiary, location, department, isoa_class, remarks, isoa_dep_id) {

            // Creating Customer Deposit transaction
            var customer_dep_rec = record.create({
                type: record.Type.CUSTOMER_DEPOSIT,
                isDynamic: true,
            });

            // Setting customer deposit values

            customer_dep_rec.setValue({ fieldId: CUST_DEP_CUSTOMER_FIELD_ID, value: customer });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_DATE_FIELD_ID, value: date });

            // customer_dep_rec.setValue({ fieldId: CUST_DEP_DEPOSIT_NUMBER_FIELD_ID, value: cust_dep_id, ignoreFieldChange: true });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_SUBSIDIARY_FIELD_ID, value: subsidiary, ignoreFieldChange: true });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_LOCATION_FIELD_ID, value: location });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_DEPARTMENT_FIELD_ID, value: department });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_CLASS_FIELD_ID, value: isoa_class });

            // TODO: Set account if account is non-null value

            if (!account) {

                customer_dep_rec.setValue({ fieldId: CUST_DEP_UNDEPOSITED_FUNDS_FIELD_ID, value: 'T', ignoreFieldChange: true });

            } else {

                log.debug('account', account);

                customer_dep_rec.setValue({ fieldId: CUST_DEP_UNDEPOSITED_FUNDS_FIELD_ID, value: 'F', ignoreFieldChange: true });

                // 58: placeholder for account
                // To be replace by selected account in ISOA DEP record
                customer_dep_rec.setValue({ fieldId: CIUST_DEP_ACCOUNT_FIELD_ID, value: account, ignoreFieldChange: true });

            }

            customer_dep_rec.setValue({ fieldId: CUST_DEP_PAYMENT_FIELD_ID, value: payment_amount });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_REMARKS_FIELD_ID, value: remarks });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_ISOA_DEP_LINK_FIELD_ID, value: isoa_dep_id });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_DEPOSIT_CATEGORY_FIELD_ID, value: deposit_category });

            customer_dep_rec.setValue({ fieldId: CUST_DEP_ITEM_REFERENCE_FIELD_ID, value: item_id });

            return customer_dep_rec.save({
                ignoreMandatoryFields: true,
            });
        }

        function getAccountAbbr(account_id) {

            var account_descs = {
                'PAY-0001': 'RENT',
                'PAY-0002': 'AC',
                'PAY-0003': 'CUSA',
                'PAY-0004': 'WATER',
                'PAY-0005': 'ELEC',
                'PAY-0006': 'MSF',
                'PAY-0007': 'SECDEP',
                'PAY-0008': 'CONST',
                'PAY-0009': 'ELECBILL',
                'PAY-0010': 'ELECMETER',
                'PAY-0011': 'WATBILL',
                'PAY-0012': 'WATMETER',
                'PAY-0013': 'DST',
            };

            return account_descs[account_id];
        }

        function getDepositCategory(acct_description) {

            var acct_descriptions = {
                'ADVANCE RENT': 1,
                'ADVANCE A/C CHARGE/S': 2,
                'ADVANCE CUSA CHARGE/S': 3,
                'ADVANCE WATER': 4,
                'ADVANCE ELECTRIC CHARGE/S': 5,
                'MARKETING SUPPORT FUND': 6,
                'SECURITY DEPOSIT': 7,
                'CONSTRUCTION BOND': 8,
                'ELECTRICITY BILL DEPOSIT': 9,
                'ELECTRIC METER DEPOSIT': 10,
                'WATER BILL DEPOSIT': 11,
                'WATER METER DEPOSIT': 12,
                'DOCUMENTARY STAMP': 13,
                'OVERPAYMENT': 14,
            };

            // Return the id of the deposit category depending on the account description
            return acct_descriptions[acct_description];

        }

        function getTotalBalance(isoa_id) {

            var total_balance = 0;

            // Create a search for the total balance of the Initial SOA
            var initial_soa_advance_chages_search = search.create({
                type: "customrecord_xrc_initial_soa_item",
                filters:
                    [
                        ["custrecord_xrc_initial_soa_num", "anyof", isoa_id]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_xrc_balance_due",
                            summary: "SUM",
                            label: "Balance Due"
                        })
                    ]
            });

            initial_soa_advance_chages_search.run().each(function (result) {
                total_balance = parseFloat(result.getValue(result.columns[0]));
                return true;
            });

            return total_balance;

        }

        function getApproverFieldId(field) {

            var approvers = {
                'custrecord_xrc_isoadep_approval1': 'custrecord_xrc_isoadep_checkedby',
                'custrecord_xrc_isoadep_approval2': 'custrecord_xrc_isoadep_approvedby',
            };

            return approvers[field];

        }

        function getEmployeeIdsWithRole(role) {

            var employee_ids = [];

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["role", "anyof", role],
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            var search_result = employee_search.run();

            var results = search_result.getRange({
                start: 0,
                end: 8,
            });

            for (var i = 0; i < results.length; i++) {

                employee_ids.push(results[i].id);

            }

            return employee_ids;

        }

        function sendEmail(id, tran_id, subsidiary, recipients, type = NOTIF_TYPE_REMINDER) {

            // var fromEmail = getEmailSender(subsidiary);

            var author = runtime.getCurrentUser().id;

            var body = type === NOTIF_TYPE_REMINDER ?
                `Good day,<br /><br />
                The Initial SOA Deposit is ready for your review and approval.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}><b>${tran_id}</b></a><br />
                Please review the details and approve at your earliest convenience. Let me know if you have any questions or require additional information.<br /><br />
                Best regards,`
                : type === NOTIF_TYPE_APPROVED ?
                    `Good day,<br /><br />
                The Initial SOA Deposit has been approved.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}><b>${tran_id}</b></a><br />
                If you have any questions, feel free to reach out.<br /><br />
                Best regards,`
                    :
                    `Good day,<br /><br />
                The Initial SOA Deposit has been reviewed and rejected.<br /><br />
                Details:<br /><br />
                Reference Number: <a href=https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1228&id=${id}><b>${tran_id}</b></a><br />
                If you have any questions or need further clarification, feel free to reach out.<br /><br />
                Best regards,`
                ;

            log.debug('body', body);

            // email.send({
            //     author: author,
            //     recipients: recipients,
            //     subject: type === NOTIF_TYPE_REMINDER ? 'Approval Needed: Initial SOA Deposit' : type === NOTIF_TYPE_APPROVED ? 'Approval Notification: Initial SOA Deposit' : 'Rejection Notification: Initial SOA Deposit',
            //     body: body,
            // });

        }

        function getEmailSender(subsidiary) {

            var subsidiary_fieldLookUp = search.lookupFields({
                type: search.Type.SUBSIDIARY,
                id: subsidiary,
                columns: ['email']
            });

            return subsidiary_fieldLookUp.email;
        }

        return {
            get: _get,
        };
    }
);
