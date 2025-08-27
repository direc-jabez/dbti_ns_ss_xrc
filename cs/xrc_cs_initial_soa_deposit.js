/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 13, 2024
 * 
 */
define(['N/record', 'N/currentRecord', 'N/runtime'],

    function (record, m_currentRecord, runtime) {

        const PARAM_ORIGIN_ID = 'origin_id';
        const MODE_CREATE = 'create';
        const INITIAL_SOA_NUMBER_FIELD_ID = 'custrecord_xrc_initial_soa6';
        const INITIAL_SOA_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa';
        const ADVANCE_CHARGES_SUBLIST_ID = 'recmachcustrecord_xrc_initial_soa_num';
        const PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID = 'custrecord_xrc_prepayment_category';
        const ACCOUNT_DESCRIPTION_SUBLIST_FIELD_ID = 'custrecord_xrc_account_descript';
        const GROSS_AMOUNT_SUBLIST_FIELD_ID = 'custrecord_xrc_gross_amt';
        const ISOA_DEP_ADVANCE_CHARGES_SUBLIST_ID = 'recmachcustrecord_xrc_initial_soa_dep5';
        const INITIAL_SOA_DEP_SUBLIST_FIELD_ID = 'custrecord_xrc_initial_soa_dep5';
        const INITIAL_SOA_NUMBER_SUBLIST_FIELD_ID = 'custrecord_xrc_initial_soa_num';
        const BANK_CATEGORY_FIELD_ID = 'custrecord_xrc_isoa_dep_bank_category';
        const ACCOUNT_FIELD_ID = 'custrecord_xrc_isoa_dep_account';
        const ACCOUNT_CATEGORY_ID = '2';
        const APPLY_SUBLIST_ID = 'custpage_sublist_apply';
        const APPLY_SUBLIST_FIELD_ID = 'custpage_apply';
        const BALANCE_DUE_SUBLIST_FIELD_ID = 'custpage_balance_due';
        const PAYMENT_SUBLIST_FIELD_ID = 'custpage_payment';
        const PAYMENT_AMOUNT_FIELD_ID = 'custrecord_xrc_payment_amount6';
        const OVERPAYMENT_FIELD_ID = 'custrecord_xrc_overpayment';

        var g_historical_total = 0;
        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;
        var g_isGenerateDepositsBtnClick = false;
        var g_isGenerateSalesBtnClick = false;


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            g_historical_total = currentRecord.getValue(PAYMENT_AMOUNT_FIELD_ID);

            if (context.mode === MODE_CREATE) {

                var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

                currentRecord.setValue(INITIAL_SOA_NUMBER_FIELD_ID, origin_id || null);

                initiateInitialSOADeposit(origin_id, currentRecord);

            }

            var bank_category = currentRecord.getValue(BANK_CATEGORY_FIELD_ID);

            // Show Account field if bank category is Account
            showAccountField(currentRecord, bank_category === ACCOUNT_CATEGORY_ID)

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            var sublistId = context.sublistId;

            if (fieldId === BANK_CATEGORY_FIELD_ID) {

                var bank_category = currentRecord.getValue(fieldId);

                // Show Account field if bank category is Account
                showAccountField(currentRecord, bank_category === ACCOUNT_CATEGORY_ID);

            } else if (fieldId === PAYMENT_AMOUNT_FIELD_ID) {

                var payment_amount = currentRecord.getValue(PAYMENT_AMOUNT_FIELD_ID);

                // Get the overpayment
                var overpayment = payment_amount - g_historical_total;

                if (overpayment > 1) {

                    // Set the value for the overpayment field if it is greater than 0
                    currentRecord.setValue(OVERPAYMENT_FIELD_ID, overpayment);

                }

            }

            if (sublistId === APPLY_SUBLIST_ID) {

                // Getting the current operating line
                var index = currentRecord.getCurrentSublistIndex({
                    sublistId: APPLY_SUBLIST_ID,
                });

                if (fieldId === APPLY_SUBLIST_FIELD_ID) {

                    var apply = currentRecord.getCurrentSublistValue({
                        sublistId: APPLY_SUBLIST_ID,
                        fieldId: APPLY_SUBLIST_FIELD_ID,
                    });

                    // Check if apply is unticked
                    if (!apply) {

                        currentRecord.setCurrentSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: PAYMENT_SUBLIST_FIELD_ID,
                            value: '',
                            ignoreFieldChange: true,
                        });

                    } else {

                        var balance_due = currentRecord.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: BALANCE_DUE_SUBLIST_FIELD_ID,
                            line: index,
                        });

                        // Set balance due as default on apply tick
                        currentRecord.setCurrentSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: PAYMENT_SUBLIST_FIELD_ID,
                            value: balance_due,
                            ignoreFieldChange: true,
                        });


                    }

                    currentRecord.setValue(PAYMENT_AMOUNT_FIELD_ID, getAllAppliedPayments(currentRecord));

                } else if (fieldId === PAYMENT_SUBLIST_FIELD_ID) {

                    var payment = currentRecord.getCurrentSublistValue({
                        sublistId: APPLY_SUBLIST_ID,
                        fieldId: PAYMENT_SUBLIST_FIELD_ID,
                    });

                    // Auto mark the Apply field as checked if Payment field
                    // is not empty
                    currentRecord.setCurrentSublistValue({
                        sublistId: APPLY_SUBLIST_ID,
                        fieldId: APPLY_SUBLIST_FIELD_ID,
                        value: payment ? true : false,
                        ignoreFieldChange: true,
                    });

                    var balance_due = currentRecord.getSublistValue({
                        sublistId: APPLY_SUBLIST_ID,
                        fieldId: BALANCE_DUE_SUBLIST_FIELD_ID,
                        line: index,
                    });

                    // currentRecord.setValue(PAYMENT_AMOUNT_FIELD_ID, getTotalPayment(currentRecord));

                    currentRecord.setValue(PAYMENT_AMOUNT_FIELD_ID, getAllAppliedPayments(currentRecord));

                    // If payment is greater than the balance_due
                    // set payment as balance due
                    if (payment > balance_due) {

                        currentRecord.setCurrentSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: PAYMENT_SUBLIST_FIELD_ID,
                            value: balance_due,
                            ignoreFieldChange: true,
                        });

                    }

                }

            }

        }

        function saveRecord(context) {

            var currentRecord = context.currentRecord;

            var bank_category = currentRecord.getValue(BANK_CATEGORY_FIELD_ID);

            var hasApplied = false;

            var payment_amount = currentRecord.getValue(PAYMENT_AMOUNT_FIELD_ID);

            if (bank_category === ACCOUNT_CATEGORY_ID) {

                var account = currentRecord.getValue(ACCOUNT_FIELD_ID);

                if (!account) {

                    // Display require message if Account is empty
                    alert('Required field(s)\n\nAccount');

                    return false;
                }

            }

            var apply_lines = currentRecord.getLineCount({
                sublistId: APPLY_SUBLIST_ID,
            });

            // Checking if user did not apply at least one line
            for (let line = 0; line < apply_lines; line++) {

                var apply = currentRecord.getSublistValue({
                    sublistId: APPLY_SUBLIST_ID,
                    fieldId: APPLY_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (apply) {

                    hasApplied = true;

                    break;

                }

            }

            // Show require message
            if (!hasApplied) {

                alert('Please apply at least one Advance Charge.');

                return false;

            }

            var total_payment = getAllAppliedPayments(currentRecord);

            // Confirmation if the user wish to proceed
            // if it has overpayment
            if (payment_amount > total_payment) {

                var confirmation = confirm('Amount is greater than the applied payment in advance charges. Click Ok to recognize Overpayment or Cancel to revise amounts.');

                return confirmation;

                // Confirmation if the user wish to proceed
                // if it has underpayment
            } else if (payment_amount < total_payment) {

                var confirmation = confirm('Amount is less than the applied payment in advance charges. Click Ok to recalculate Amount field or cancel to revise amounts.');

                if (confirmation) {

                    currentRecord.setValue(PAYMENT_AMOUNT_FIELD_ID, getTotalPayment(currentRecord));

                }

                return confirmation;

            }

            return true;

        }

        function initiateInitialSOADeposit(id, currentRecord) {

            // Load the Initial SOA Deposit record
            var initial_soa_rec = record.load({
                type: INITIAL_SOA_RECORD_TYPE_ID,
                id: id,
            });

            var ac_lines = initial_soa_rec.getLineCount({
                sublistId: ADVANCE_CHARGES_SUBLIST_ID,
            });


            for (var line = 0; line < ac_lines; line++) {

                currentRecord.setCurrentSublistValue({
                    sublistId: ISOA_DEP_ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: INITIAL_SOA_DEP_SUBLIST_FIELD_ID,
                    value: currentRecord.id,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ISOA_DEP_ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: INITIAL_SOA_NUMBER_SUBLIST_FIELD_ID,
                    value: id,
                });


                // Getting and setting the advance charges from the origin record
                // to the current record

                var prepayment_category = initial_soa_rec.getSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID,
                    line: line,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ISOA_DEP_ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: PREPAYMENT_CATEGORY_SUBLIST_FIELD_ID,
                    value: prepayment_category,
                });

                var account_desc = initial_soa_rec.getSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: ACCOUNT_DESCRIPTION_SUBLIST_FIELD_ID,
                    line: line,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ISOA_DEP_ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: ACCOUNT_DESCRIPTION_SUBLIST_FIELD_ID,
                    value: account_desc,
                });

                var gross_amt = initial_soa_rec.getSublistValue({
                    sublistId: ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: ISOA_DEP_ADVANCE_CHARGES_SUBLIST_ID,
                    fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                    value: gross_amt,
                });

                currentRecord.commitLine({
                    sublistId: ISOA_DEP_ADVANCE_CHARGES_SUBLIST_ID,
                });
            }
        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        function showAccountField(currentRecord, show) {

            var account_field = currentRecord.getField({
                fieldId: ACCOUNT_FIELD_ID,
            });

            if (!show) {

                currentRecord.setValue(ACCOUNT_FIELD_ID, null);

            }

            account_field.isDisplay = show;

        }

        function getTotalPayment(currentRecord) {

            var advances_lines = currentRecord.getLineCount({
                sublistId: APPLY_SUBLIST_ID,
            });

            var total = 0;

            // Getting the total payment amount
            for (var line = 0; line < advances_lines; line++) {

                currentRecord.selectLine({
                    sublistId: APPLY_SUBLIST_ID,
                    line: line,
                });

                var payment = parseFloat(currentRecord.getCurrentSublistValue({
                    sublistId: APPLY_SUBLIST_ID,
                    fieldId: PAYMENT_SUBLIST_FIELD_ID,
                    line: line,
                }));

                if (payment) total += payment;


            }

            // Check if the total is greater than
            if (total > g_historical_total) {

                total = g_historical_total;

            }

            return total;

        }

        function getAllAppliedPayments(currentRecord) {

            var advances_lines = currentRecord.getLineCount({
                sublistId: APPLY_SUBLIST_ID,
            });

            var total = 0;

            // Getting the total payment amount
            for (var line = 0; line < advances_lines; line++) {

                currentRecord.selectLine({
                    sublistId: APPLY_SUBLIST_ID,
                    line: line,
                });

                var apply = currentRecord.getCurrentSublistValue({
                    sublistId: APPLY_SUBLIST_ID,
                    fieldId: APPLY_SUBLIST_FIELD_ID,
                });

                if (apply) {

                    var payment = parseFloat(currentRecord.getCurrentSublistValue({
                        sublistId: APPLY_SUBLIST_ID,
                        fieldId: PAYMENT_SUBLIST_FIELD_ID,
                    }));

                    if (payment) {

                        total += payment;

                    }
                }

            }

            return total;

        }

        function onSubmitForApprovalBtnClick(role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1652&deploy=1&action=submitforapproval&id=" + currentRecord.id + "&role_to_email=" + role_to_email;

            } else {

                alert('You have already submitted the form.');

            }


        }

        function onApproveBtnClick(approve_field, role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1652&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field + "&role_to_email=" + role_to_email;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onRejectBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isRejectBtnClick) {

                g_isRejectBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1652&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onGenerateDepositsClick() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isGenerateDepositsBtnClick) {

                g_isGenerateDepositsBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1652&deploy=1&action=gendep&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onGenerateSalesClick(customer) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isGenerateSalesBtnClick) {

                g_isGenerateSalesBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/accounting/transactions/cashsale.nl?cf=218&entity=" + customer + "&origin_id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onGenerateDepositsClick: onGenerateDepositsClick,
            onGenerateSalesClick: onGenerateSalesClick,
        };
    }
);