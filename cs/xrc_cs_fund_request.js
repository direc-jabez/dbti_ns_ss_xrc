/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/record', 'N/currentRecord', 'N/runtime', 'N/search'],

    function (record, m_currentRecord, runtime, search) {

        const CUSTOM_FORM_FIELD_ID = 'customform';
        const PARAM_ORIGIN_ID = 'origin_id';
        const PARAM_CATEGORY = 'category';
        const TRANSFER_ACCOUNT_FIELD_ID = 'custrecord_xrc_transfer_account';
        const ADMIN_ROLE_ID = 3;
        const DEPARTMENT_FIELD_ID = 'department';
        const FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary';
        const TO_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_fundreq_to_subsidiary';
        const MODE_EDIT = 'edit';
        const FUND_REQ_ACC_PER_SUBSIDIARY_RECORD_TYPE = 'customrecord_xrc_fundreq_qcct_subs';
        const CATEGORY_FUND_TRANSFER = '10';
        const CATEGORY_IC_FUND_TRANSFER = '12';
        const FORM_FUND_TRANSFER = '414';
        const FORM_IC_FUND_TRANSFER = '413';
        const FORM_FUND_REQUEST = '389';
        const TRANSFEROR_COMPANY_FIELD_ID = 'custrecord_xrc_fundreq_transferor';
        const TRANSFEREE_COMPANY_FIELD_ID = 'custrecord_xrc_fundreq_transferee';

        const MODE_COPY = "copy";
        const PREPARED_BY_FLD_ID = "custrecord_xrc_prepared_by";
        const APPROVAL_1_FLD_ID = "custrecord_xrc_fundreq_approval1";
        const APPROVAL_2_FLD_ID = "custrecord_xrc_fundreq_approval2";
        const APPROVAL_3_FLD_ID = "custrecord_xrc_fundreq_approval3";
        const APPROVAL_4_FLD_ID = "custrecord_xrc_fundreq_approval4";
        const APPROVER_1_FLD_ID = "custrecord_xrc_fundreq_approver1";
        const APPROVER_2_FLD_ID = "custrecord_xrc_fundreq_approver2";
        const APPROVER_3_FLD_ID = "custrecord_xrc_fundreq_approver3";
        const APPROVER_4_FLD_ID = "custrecord_xrc_fundreq_approver4";
        const FOR_APPROVAL_FLD_ID = "custrecord_xrc_fundreq_for_approval";
        const REJECTED_FLD_ID = "custrecord_xrc_fundreq_rejected";
        const STATUS_FIELD_ID = 'custrecord_xrc_status';
        const PENDING_APPROVAL_STATUS = '1';

        var g_isSubmitForApprovalBtnClick = false;
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;
        var g_isaCancelClick = false;
        var g_mode = '';


        function pageInit(context) {

            window.onbeforeunload = null;

            g_mode = context.mode;

            var currentRecord = context.currentRecord;

            var currentUser = runtime.getCurrentUser();

            var param_category = getParameterWithId(PARAM_CATEGORY);

            // Setting category based on the url parameters
            param_category
                && currentRecord.setValue({
                    fieldId: FUND_CATEGORY_FIELD_ID,
                    value: param_category,
                    ignoreFieldChange: true,
                });

            // if (currentUser.role !== ADMIN_ROLE_ID && !isUserOnAccountingDivision(currentUser)) {

            //     // Get the Transfer Account field
            //     var transfer_account_field = currentRecord.getField({
            //         fieldId: TRANSFER_ACCOUNT_FIELD_ID,
            //     });

            //     // Disable the field
            //     transfer_account_field.isDisabled = true;

            // }

            if (context.mode === MODE_COPY) {
                currentRecord.setValue(PREPARED_BY_FLD_ID, currentUser.id);
                currentRecord.setValue(APPROVAL_1_FLD_ID, false);
                currentRecord.setValue(APPROVAL_2_FLD_ID, false);
                currentRecord.setValue(APPROVAL_3_FLD_ID, false);
                currentRecord.setValue(APPROVAL_4_FLD_ID, false);
                currentRecord.setValue(APPROVER_1_FLD_ID, null);
                currentRecord.setValue(APPROVER_2_FLD_ID, null);
                currentRecord.setValue(APPROVER_3_FLD_ID, null);
                currentRecord.setValue(APPROVER_4_FLD_ID, null);
                currentRecord.setValue(FOR_APPROVAL_FLD_ID, false);
                currentRecord.setValue(REJECTED_FLD_ID, false);
                currentRecord.setValue(STATUS_FIELD_ID, PENDING_APPROVAL_STATUS);
            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === SUBSIDIARY_FIELD_ID) {

                var subsidiary = currentRecord.getValue(SUBSIDIARY_FIELD_ID);

                var fund_category = currentRecord.getValue(FUND_CATEGORY_FIELD_ID);

                if (subsidiary && fund_category) {

                    var account = getAccount(subsidiary, fund_category);

                    if (account) {

                        currentRecord.setValue(TRANSFER_ACCOUNT_FIELD_ID, account);

                    }

                }

            } else if (fieldId === FUND_CATEGORY_FIELD_ID) {

                var fund_category = currentRecord.getValue(FUND_CATEGORY_FIELD_ID);

                var custom_form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

                if (fund_category) {

                    if (fund_category === CATEGORY_FUND_TRANSFER) {

                        window.location.href = `/app/common/custom/custrecordentry.nl?rectype=1213&cf=${FORM_FUND_TRANSFER}&category=${fund_category}&whence=`;

                    } else if (fund_category === CATEGORY_IC_FUND_TRANSFER) {

                        window.location.href = `/app/common/custom/custrecordentry.nl?rectype=1213&cf=${FORM_IC_FUND_TRANSFER}&category=${fund_category}&whence=`;

                    } else if (custom_form !== FORM_FUND_REQUEST) {

                        window.location.href = `/app/common/custom/custrecordentry.nl?rectype=1213&cf=389&category=${fund_category}&whence=`;

                    }

                }

            } else if (fieldId === TRANSFEROR_COMPANY_FIELD_ID) {

                var transferor_company_id = currentRecord.getValue(TRANSFEROR_COMPANY_FIELD_ID);

                var represent_subsidiary = getRepresentSubsidiary(search.Type.VENDOR, transferor_company_id);

                currentRecord.setValue(SUBSIDIARY_FIELD_ID, represent_subsidiary);

            } else if (fieldId === TRANSFEREE_COMPANY_FIELD_ID) {

                var transferee_company_id = currentRecord.getValue(TRANSFEREE_COMPANY_FIELD_ID);

                var represent_subsidiary = getRepresentSubsidiary(search.Type.CUSTOMER, transferee_company_id);

                currentRecord.setValue(TO_SUBSIDIARY_FIELD_ID, represent_subsidiary);

            }

        }

        function saveRecord(context) {

            var currentRecord = context.currentRecord;

            var fund_category = currentRecord.getValue(FUND_CATEGORY_FIELD_ID);

            var requestor = currentRecord.getValue(REQUESTOR_FIELD_ID);

            if (requestor) {

                var fund_field = getFundField(fund_category);

                // Get the department of the current user
                var fieldLookUp = search.lookupFields({
                    type: record.Type.EMPLOYEE,
                    id: requestor,
                    columns: [fund_field]
                });

                var balance = parseFloat(fieldLookUp[fund_field]);

                if (balance > 0) {

                    return confirm('Selected fund category has an existing fund balance. Do you wish to proceed?');

                }

            }

            return true;
        }

        function isUserOnAccountingDivision(currentUser) {

            // Get the department of the current user
            var currentUser_fieldLookUp = search.lookupFields({
                type: record.Type.EMPLOYEE,
                id: currentUser.id,
                columns: [DEPARTMENT_FIELD_ID]
            });

            const accounting_depts = ['7', '114', '116', '115', '113'];

            return accounting_depts.includes(currentUser_fieldLookUp.department[0].value);

        }

        function onSubmitForApprovalBtnClick(role_to_email) {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isSubmitForApprovalBtnClick) {

                g_isSubmitForApprovalBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1638&deploy=1&action=submitforapproval&id=" + currentRecord.id + "&role_to_email=" + role_to_email;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1638&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field + "&role_to_email=" + role_to_email;


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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1638&deploy=1&action=reject&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onWriteCheckBtnClick(payee) {

            var currentRecord = m_currentRecord.get();

            // Redirect to creating write check
            window.location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/check.nl?whence=&cf=206&origin_id=' + currentRecord.id + "&entity=" + payee;

        }

        function onFundReturnBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Redirect to creating write check
            window.location.href = 'https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1216&whence=&origin_id=' + currentRecord.id;

        }

        function onLiquidateBtnClick(payee, fund_category) {

            var currentRecord = m_currentRecord.get();

            var cf = '231';

            var for_replenishment = ['1', '2', '9'].includes(fund_category);

            if (for_replenishment) {

                cf = '232';
            }

            // Redirect to creating write check
            window.location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/exprept.nl?cf=' + cf + '&entity=' + payee + '&whence=&origin_id=' + currentRecord.id;

        }

        function onAuthorityToDeductBtnClick() {

            var currentRecord = m_currentRecord.get();

            // Redirect to creating write check
            window.location.href = 'https://9794098.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1220&origin_id=' + currentRecord.id;

        }

        function getFundField(category) {

            // Fields related to employee Fund Monitoring fields
            const fund_categories = {
                '9': 'custentity_xrc_diesel_fund',
                '8': 'custentity_xrc_cash_advance',
                '7': 'custentity_xrc_cash_fund',
                '3': 'custentity_xrc_constru_fund',
                '6': 'custentity_xrc_contingency_fund',
                '5': 'custentity_xrc_emergency_fund',
                '4': 'custentity_xrc_genset_fund',
                '1': 'custentity_xrc_pcf',
                '2': 'custentity_xrc_revolving_fund',
            };

            return fund_categories[category];

        }

        function getAccount(subsidiary, category) {

            // Get the field bassed on the chosen category
            var field = getField(category);

            if (field) {

                var account_search = search.create({
                    type: FUND_REQ_ACC_PER_SUBSIDIARY_RECORD_TYPE,
                    columns: [
                        { name: field },
                    ],
                    filters: [
                        {
                            name: 'custrecord_xrc_fracct_subsidiary',
                            operator: 'is',
                            values: [subsidiary]
                        },
                    ],
                });

                var account = '';

                account_search.run().each(function (result) {
                    account = result.getValue(field);
                    return true;
                });

                return account;

            } else {

                return;

            }

        }

        function getField(category) {

            const fields = {
                '8': 'custrecord_xrc_fracct_ca_account',
                '7': 'custrecord_xrc_fracct_cashfund_acct',
                '3': 'custrecord_xrc_fracct_constructacct',
                '6': 'custrecord_xrc_fracct_contingency',
                '9': 'custrecord_xrc_fracct_diesel',
                '5': 'custrecord_xrc_fracct_emergency',
                '4': 'custrecord_xrc_fracct_genset',
                '1': 'custrecord_xrc_fracct_pcf',
                '2': 'custrecord_xrc_fracct_revolving',
            };

            return fields[category];

        }

        function getParameterWithId(param_id) {
            var url = new URL(window.location.href);

            var value = url.searchParams.get(param_id);

            return value;
        }

        function getRepresentSubsidiary(type, id) {

            var fieldLookUp = search.lookupFields({
                type: type,
                id: id,
                columns: ['representingsubsidiary'] // Vendor Subsidiary || Customer Subsidiary
            });

            return fieldLookUp['representingsubsidiary'][0].value;

        }

        function cancelAction() {

            var currentRecord = m_currentRecord.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isaCancelClick) {

                g_isaCancelClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1638&deploy=1&action=cancel&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        window.runCancelAction = cancelAction;

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onWriteCheckBtnClick: onWriteCheckBtnClick,
            onFundReturnBtnClick: onFundReturnBtnClick,
            onLiquidateBtnClick: onLiquidateBtnClick,
            onAuthorityToDeductBtnClick: onAuthorityToDeductBtnClick,
        };
    }
);