/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 * Updated by: DBTI - Charles Maverick Herrera
 * Date: Oct 25, 2024
 * 
 */
define(['N/record', 'N/currentRecord', 'N/url', 'N/search', 'N/runtime'],

    function (record, currRec, url, search, runtime) {

        const PARAM_ORIGIN_ID = 'origin_id';
        const PARAM_CATEGORY_ID = 'category';
        const FUND_REQUEST_TYPE_ID = 'customrecord_xrc_fund_request';
        const MODE_CREATE = 'create';
        const MODE_EDIT = 'edit';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const LIQUIDATION_FORM_ID = '231';
        const REPLENISHMENT_FORM_ID = '232';
        const REIMBURSEMENT_FORM_ID = '202';
        const TYPE_PCF_REPLEN = '1';
        const TYPE_RF_REPLEN = '2';
        const TYPE_CASH_FUND_LIQUIDATION = '3';
        const TYPE_CONSTRUCTION_FUND_REPLEN = '5';
        const TYPE_GENSET_FUND_REPLEN = '6';
        const TYPE_EMERGENCY_FUND_LIQUIDATION = '7';
        const TYPE_CONTIGENCY_FUND_REPLEN = '8';
        const TYPE_DIESEL_FUND_REPLEN = '9';
        const TYPE_EXP_REIMB = '4';
        const EMPLOYEE_FIELD_ID = 'entity';
        const FUND_REQUEST_NUMBER_FIELD_ID = 'custbody_xrc_fund_request_num';
        const PURPOSE_FIELD_ID = 'memo';
        const EMPLOYEE_TRANSACTION_FIELD_ID = 'custbody_xrc_emp_transact_category';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const ADVANCE_TO_APPLY_FIELD_ID = 'advance';
        const ADVANCE_TO_APPLY_ACCOUNT_FIELD_ID = 'advanceaccount';
        const FR_PURPOSE_FIELD_ID = 'custrecord_xrc_purpose';
        const FR_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const FR_EMPLOYEE_NAME_FIELD_ID = 'custrecord_xrc_fundreq_employee_name';
        const FR_TRANSFER_ACCOUNT_FIELD_ID = 'custrecord_xrc_transfer_account';
        const FR_BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const FR_LOCATION_FIELD_ID = 'custrecord_xrc_location';
        const FR_DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept';
        const FR_CLASS_FIELD_ID = 'custrecord_xrc_class';
        const EXPENSE_SUBLIST_ID = 'expense';
        const AMOUNT_SUBLIST_FIELD_ID = 'amount';
        const TOTAL_FIELD_ID = 'total';
        const REASON_FOR_EXPENSE_OVERAGE_FIELD_ID = 'custbody_xrc_reason_exp_over';
        const REQUESTOR_FIELD_ID = 'entity';
        const ACTUAL_REQUESTOR_FIELD_ID = 'custbody_xrc_expense_requestor';
        const CATEGORY_SUBLIST_FIELD_ID = 'category';
        const REQUESTOR_ROLE_ID = 1431;
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const STATUS_APPROVED = '2';

        const CURRENCY_FLD_ID = "expensereportcurrency";
        const XPNS_RPT_XPNSES_SUBLIST_XPNS_ACCNT_FLD_ID = "expenseaccount";
        const CURRENCY_IN_LINE_FLD_ID = 'currency';

        const DUMMY_EMPLOYEES_IDS = ['16233', '8002', '16245', '16244'];

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;


        function pageInit(context) {

            var currentRecord = context.currentRecord;

            var currentUser = runtime.getCurrentUser();

            // Get the origin id (Fund Request id)
            var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

            if (context.mode === MODE_CREATE) {

                if (currentUser.role === REQUESTOR_ROLE_ID) {

                    currentRecord.getField({ fieldId: ACTUAL_REQUESTOR_FIELD_ID }).isDisabled = true;

                    currentRecord.setValue(ACTUAL_REQUESTOR_FIELD_ID, currentUser.id);

                }

                var custom_form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

                if (custom_form === LIQUIDATION_FORM_ID || custom_form === REPLENISHMENT_FORM_ID || custom_form === REIMBURSEMENT_FORM_ID) {

                    var category = getParameterWithId(PARAM_CATEGORY_ID);

                    if (category) {

                        currentRecord.setValue({
                            fieldId: EMPLOYEE_TRANSACTION_FIELD_ID,
                            value: category,
                            ignoreFieldChange: true,
                        });

                    }

                    if (origin_id) {

                        initiateExpenseReport(origin_id, currentRecord);

                    }

                }

                if (!origin_id) {

                    var requestor = currentRecord.getValue(REQUESTOR_FIELD_ID);

                    if (requestor) {
                        currentRecord.setValue(ACTUAL_REQUESTOR_FIELD_ID, requestor);
                    }

                }

            } else if (context.mode === MODE_EDIT) {

                var fr_id = currentRecord.getValue(FUND_REQUEST_NUMBER_FIELD_ID);

                if (fr_id) {

                    var approval_status = currentRecord.getValue(APPROVAL_STATUS_FIELD_ID);

                    if (approval_status !== STATUS_APPROVED) {

                        var fr_balance = search.lookupFields({
                            type: FUND_REQUEST_TYPE_ID,
                            id: fr_id,
                            columns: [FR_BALANCE_FIELD_ID]
                        })[FR_BALANCE_FIELD_ID];

                        currentRecord.setValue(ADVANCE_TO_APPLY_FIELD_ID, fr_balance);
                    }

                }

            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;
            var sublist_id = context.sublistId;
            var fieldId = context.fieldId;

            if (fieldId === EMPLOYEE_TRANSACTION_FIELD_ID) {

                var exp_category = currentRecord.getValue(fieldId);

                var employee = currentRecord.getValue(EMPLOYEE_FIELD_ID);

                if (exp_category === TYPE_PCF_REPLEN || exp_category === TYPE_RF_REPLEN || exp_category === TYPE_CONSTRUCTION_FUND_REPLEN || exp_category === TYPE_GENSET_FUND_REPLEN || exp_category === TYPE_CONTIGENCY_FUND_REPLEN || exp_category === TYPE_DIESEL_FUND_REPLEN) {

                    // currentRecord.setValue(CUSTOM_FORM_FIELD_ID, REPLENISHMENT_FORM_ID);
                    location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/exprept.nl?cf=232&whence=&category=' + exp_category + '&entity=' + employee;

                } else if (exp_category === TYPE_CASH_FUND_LIQUIDATION || exp_category === TYPE_EMERGENCY_FUND_LIQUIDATION) {

                    // currentRecord.setValue(CUSTOM_FORM_FIELD_ID, LIQUIDATION_FORM_ID);
                    location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/exprept.nl?cf=231&whence=&category=' + exp_category + '&entity=' + employee;

                } else {

                    // currentRecord.setValue(CUSTOM_FORM_FIELD_ID, REIMBURSEMENT_FORM_ID);
                    location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/exprept.nl?cf=202&whence=&category=' + exp_category + '&entity=' + employee;

                }

            } else if (fieldId === REQUESTOR_FIELD_ID) {

                try {

                    var emp_id = currentRecord.getValue(REQUESTOR_FIELD_ID);

                    var emp_department = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: emp_id,
                        columns: [DEPARTMENT_FIELD_ID],
                    })[DEPARTMENT_FIELD_ID][0]?.value;

                    if (emp_department) {

                        currentRecord.setValue(DEPARTMENT_FIELD_ID, emp_department);

                    }

                    if (!DUMMY_EMPLOYEES_IDS.includes(emp_id)) {

                        currentRecord.getField({ fieldId: ACTUAL_REQUESTOR_FIELD_ID }).isDisabled = true;

                        currentRecord.setValue(ACTUAL_REQUESTOR_FIELD_ID, emp_id);

                    } else {

                        currentRecord.getField({ fieldId: ACTUAL_REQUESTOR_FIELD_ID }).isDisabled = false;

                        currentRecord.setValue(ACTUAL_REQUESTOR_FIELD_ID, null);

                    }

                } catch (error) {

                }

            } else if (fieldId === FUND_REQUEST_NUMBER_FIELD_ID) {

                var exp_rep_category = currentRecord.getValue(EMPLOYEE_TRANSACTION_FIELD_ID);

                if (exp_rep_category === TYPE_CASH_FUND_LIQUIDATION || exp_rep_category === TYPE_EMERGENCY_FUND_LIQUIDATION) {

                    var fund_request = currentRecord.getValue(FUND_REQUEST_NUMBER_FIELD_ID);

                    if (fund_request) {

                        var fr_fieldLookUp = search.lookupFields({
                            type: FUND_REQUEST_TYPE_ID,
                            id: fund_request,
                            columns: ['custrecord_xrc_balance', 'custrecord_xrc_transfer_account']
                        });

                        var balance = parseFloat(fr_fieldLookUp["custrecord_xrc_balance"]);

                        var transfer_account = fr_fieldLookUp["custrecord_xrc_transfer_account"][0]?.value;

                        currentRecord.setValue(ADVANCE_TO_APPLY_FIELD_ID, balance);

                        currentRecord.setValue(ADVANCE_TO_APPLY_ACCOUNT_FIELD_ID, transfer_account);

                    }

                }

            }

            if (sublist_id === EXPENSE_SUBLIST_ID) {

                if (fieldId === XPNS_RPT_XPNSES_SUBLIST_XPNS_ACCNT_FLD_ID) {
                    var body_currency = currentRecord.getValue(CURRENCY_FLD_ID);
                    currentRecord.setCurrentSublistValue({
                        sublistId: EXPENSE_SUBLIST_ID,
                        fieldId: CURRENCY_IN_LINE_FLD_ID,
                        value: body_currency,
                    });

                }

            }

        }

        function postSourcing(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            var fieldId = context.fieldId;

            // Get the origin id (Fund Request id)

            if (fieldId === EMPLOYEE_FIELD_ID) {

                var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

                if (!origin_id) {

                    currentRecord.setValue(ADVANCE_TO_APPLY_FIELD_ID, '');

                }

            } else if (fieldId === DEPARTMENT_FIELD_ID) {

                var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

                if (origin_id) {

                    currentRecord.setValue({ fieldId: FUND_REQUEST_NUMBER_FIELD_ID, value: origin_id, ignoreFieldChange: true });

                }

            }

            if (sublistId === EXPENSE_SUBLIST_ID) {

                if (fieldId === CATEGORY_SUBLIST_FIELD_ID) {

                    var department = currentRecord.getValue(DEPARTMENT_FIELD_ID);

                    if (department) {

                        currentRecord.setCurrentSublistValue({
                            sublistId: EXPENSE_SUBLIST_ID,
                            fieldId: DEPARTMENT_FIELD_ID,
                            value: department
                        });

                    }
                }

            }
        }

        function saveRecord(context) {

            var currentRecord = context.currentRecord;

            var total = currentRecord.getValue(TOTAL_FIELD_ID);

            var advance_to_apply = currentRecord.getValue(ADVANCE_TO_APPLY_ACCOUNT_FIELD_ID);

            if (advance_to_apply < total) {

                var reason_for_expense_overage = currentRecord.getValue(REASON_FOR_EXPENSE_OVERAGE_FIELD_ID);

                if (!reason_for_expense_overage) {

                    // alert('Required field(s):\n\nReason for Expense Overage');

                    // return false;
                }

            }


            return true;

        }

        function initiateExpenseReport(fr_id, currentRecord) {

            // Key = Fund Category from Fund Request
            // Value = Employee Transaction Category from ExpRep
            const employee_tran_categ = {
                '7': '3',
                '3': '5',
                '6': '8',
                '5': '7',
                '4': '6',
                '1': '1',
                '2': '2',
                '9': '9',
            };

            // Loading fund request record
            var fr_rec = record.load({
                type: FUND_REQUEST_TYPE_ID,
                id: fr_id,
            });

            // Setting value reference from fund request

            currentRecord.setValue(ACTUAL_REQUESTOR_FIELD_ID, fr_rec.getValue(FR_EMPLOYEE_NAME_FIELD_ID));

            currentRecord.setValue(PURPOSE_FIELD_ID, fr_rec.getValue(FR_PURPOSE_FIELD_ID));

            var exp_rep_category = employee_tran_categ[fr_rec.getValue(FR_FUND_CATEGORY_FIELD_ID)];

            currentRecord.setValue({
                fieldId: EMPLOYEE_TRANSACTION_FIELD_ID,
                value: exp_rep_category,
                ignoreFieldChange: true,
            });

            // currentRecord.setValue(FUND_REQUEST_NUMBER_FIELD_ID, fr_id);

            currentRecord.setValue({
                fieldId: ADVANCE_TO_APPLY_ACCOUNT_FIELD_ID,
                value: fr_rec.getValue(FR_TRANSFER_ACCOUNT_FIELD_ID),
                ignoreFieldChange: true
            });

            currentRecord.setValue(LOCATION_FIELD_ID, fr_rec.getValue(FR_LOCATION_FIELD_ID));

            currentRecord.setValue(DEPARTMENT_FIELD_ID, fr_rec.getValue(FR_DEPARTMENT_FIELD_ID));

            currentRecord.setValue(CLASS_FIELD_ID, fr_rec.getValue(FR_CLASS_FIELD_ID));

            if (exp_rep_category !== TYPE_CASH_FUND_LIQUIDATION || exp_rep_category !== TYPE_EMERGENCY_FUND_LIQUIDATION) {

                currentRecord.setValue(ADVANCE_TO_APPLY_FIELD_ID, fr_rec.getValue(FR_BALANCE_FIELD_ID));

            } else {

                currentRecord.setValue(ADVANCE_TO_APPLY_FIELD_ID, 0);

            }

            // Setting expenses sublist field

            currentRecord.setCurrentSublistValue({
                sublistId: EXPENSE_SUBLIST_ID,
                fieldId: AMOUNT_SUBLIST_FIELD_ID,
                value: fr_rec.getValue(FR_BALANCE_FIELD_ID),
            });

        }

        function getParameterWithId(param_id) {

            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;

        }

        function onSubmitForApprovalBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1640&deploy=1&action=submitforapproval&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }


        }

        function onApproveBtnClick(approve_field) {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1640&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


            } else {

                alert('You have already submitted the form.');

            }

        }

        function onRejectBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isRejectBtnClick) {

                g_isRejectBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1640&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onPrintAPVBtnClick() {

            var currentRecord = currRec.get();

            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_xrc_sl_print_apv',
                deploymentId: 'customdeploy_xrc_sl_print_apv',
                returnExternalUrl: false,
                params: {
                    rec_type: currentRecord.type,
                    rec_id: currentRecord.id,
                },
            });

            window.open(suiteletUrl);

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            saveRecord: saveRecord,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onPrintAPVBtnClick: onPrintAPVBtnClick,
        };
    }
);