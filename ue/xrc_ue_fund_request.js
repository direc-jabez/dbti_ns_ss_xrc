/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/record', 'N/ui/serverWidget', 'N/search', 'N/runtime'],

    function (record, serverWidget, search, runtime) {

        const ID_FIELD_ID = 'name';
        const AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const ISSUED_FIELD_ID = 'custrecord_xrc_fundreq_issued';
        const FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const FOR_ATD_FIELD_ID = 'custrecord_xrc_for_atd';
        const ATD_FIELD_ID = 'custrecord_xrc_atd';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by';
        const REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const EMPLOYEE_NAME_FIELD_ID = 'custrecord_xrc_fundreq_employee_name';
        const STATUS_FIELD_ID = 'custrecord_xrc_status';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_PENDING_ISSUANCE_ID = '2';
        const ISSUED_PENDING_LIQUIDATION = '3';
        const CANCEL_ID = '6';
        const CLOSED_STATUS_ID = '4';
        const REJECTED_STATUS_ID = '5';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_fundreq_for_approval';
        const OTHER_FUNDS_CATEGORY_ID = '11';
        const REVOLVING_FUND_CATEGORY_ID = '2';
        const CASH_ADVANCE_CATEGORY_ID = '8';
        const CASH_FUND_ID = '7';
        const EMERGENCY_FUND_ID = '5';
        const FUND_TRANSFER_CATEGORY_ID = '10';
        const IC_FUND_TRANSFER_CATEGORY_ID = '12';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_fundreq_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_fundreq_approval2';
        const COO_ID = 1460;
        const FUND_REQ_ACC_PER_SUBSIDIARY_RECORD_TYPE = 'customrecord_xrc_fundreq_qcct_subs';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary';
        const TRANSFER_POSTING_ACCOUNT_FIELD_ID = 'custrecord_xrc_transfer_account';
        const TREASURY_ASSISTANT_ROLE_ID = 1482;
        const TREASURY_HEAD_ROLE_ID = 1483;
        const A_P_CLERK_ROLE_ID = 1457;
        const FR_LAST_NUM_FIELD_ID = 'custscript_xrc_fund_req_last_num';
        const LOCATION_FIELD_ID = 'custrecord_xrc_location';
        const DATE_FIELD_ID = 'custrecord_xrc_fr_date';
        const TRANSFEREE_COMPANY_FIELD_ID = 'custrecord_xrc_fundreq_transferee';
        const INTERCOMPANY_FIELD_ID = 'custrecord_xrc_fundreq_interco';
        const IC_PAYEE_FIELD_ID = 'custrecord_xrc_fundreq_interco_payee';
        const ADMIN_ROLE_ID = 3;


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            // Include the path of the client script
            form.clientScriptModulePath = './xrc_cs_fund_request.js';

            var currentUser = runtime.getCurrentUser();

            var status = newRecord.getValue(STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var fund_category = newRecord.getValue(FUND_CATEGORY_FIELD_ID);

            if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                log.debug('for_approval', !for_approval);
                log.debug('prepared_by', prepared_by);
                log.debug('currentUser.id', currentUser.id);

                if (!for_approval && prepared_by != currentUser.id) {

                    form.removeButton({
                        id: 'edit',
                    });

                    if (context.type === context.UserEventType.EDIT && currentUser.role !== ADMIN_ROLE_ID) {
                        throw "Only the preparer can edit the transaction. Please contact the preparer.";
                    }

                }

                if (status !== CANCEL_ID && !for_approval && parseInt(prepared_by) === currentUser.id) {

                    if (fund_category === REVOLVING_FUND_CATEGORY_ID) {

                        var is_requestor_dept_head = isRequestorDepartmentHead(newRecord);

                        if (is_requestor_dept_head) fund_category += '-head';

                    }

                    var initial_role_to_email = getRoleToEmail(fund_category);

                    log.debug('initial_role_to_email', initial_role_to_email);

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: status === REJECTED_STATUS_ID ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick("' + initial_role_to_email + '")',
                    });

                    return;

                }

                if (status === PENDING_APPROVAL_STATUS_ID && for_approval) {

                    if (fund_category !== CASH_ADVANCE_CATEGORY_ID && fund_category !== REVOLVING_FUND_CATEGORY_ID && fund_category !== FUND_TRANSFER_CATEGORY_ID && fund_category !== IC_FUND_TRANSFER_CATEGORY_ID) {

                        otherFundsApproval(newRecord, currentUser, form, context.type, context.UserEventType);

                    } else {

                        if (fund_category === REVOLVING_FUND_CATEGORY_ID) {

                            var is_requestor_dept_head = isRequestorDepartmentHead(newRecord);

                            if (is_requestor_dept_head) fund_category += '-head';

                        }

                        var next_approver = getNextApproverRole(newRecord, fund_category);

                        if (next_approver) {

                            var is_coo = fund_category === CASH_ADVANCE_CATEGORY_ID ?
                                (next_approver.field === APPROVAL_TWO_FIELD_ID && currentUser.role === COO_ID) : fund_category === '2-head' ?
                                    (next_approver.field === APPROVAL_ONE_FIELD_ID && currentUser.role === COO_ID) : fund_category === REVOLVING_FUND_CATEGORY_ID ?
                                        (next_approver.field === APPROVAL_TWO_FIELD_ID && currentUser.role === COO_ID) : false;

                            if (currentUser.role === next_approver.role || is_coo) {

                                showApprovalButtons(form, next_approver.field, next_approver.role_to_email);

                            } else {

                                if (currentUser.role !== ADMIN_ROLE_ID) {

                                    form.removeButton({
                                        id: 'edit',
                                    });

                                    if (context.type === context.UserEventType.EDIT) {
                                        throw "Cannot edit transaction while in approval process.";
                                    }

                                }

                            }
                        }

                    }

                } else {

                    if (currentUser.role !== ADMIN_ROLE_ID) {

                        form.removeButton({
                            id: 'edit',
                        });

                        if (context.type === context.UserEventType.EDIT) {
                            throw "Cannot edit approved transaction.";
                        }

                    }

                }
            }

            if (context.type === context.UserEventType.VIEW) {

                if (status !== CANCEL_ID && (status === PENDING_APPROVAL_STATUS_ID || status === APPROVED_PENDING_ISSUANCE_ID)) {

                    // Adding custom action on Actions menu
                    var inlineHtmlField = form.addField({
                        id: 'custpage_add_menu_item',
                        label: 'Inject Menu Item',
                        type: serverWidget.FieldType.INLINEHTML
                    });

                    inlineHtmlField.defaultValue = getStringifiedCustomActionScript();

                }

                if (status === APPROVED_PENDING_ISSUANCE_ID) {

                    form.removeButton({
                        id: 'edit',
                    });
                }

                var entity = newRecord.getValue(REQUESTOR_FIELD_ID) || newRecord.getValue(TRANSFEREE_COMPANY_FIELD_ID);

                if (fund_category !== FUND_TRANSFER_CATEGORY_ID && fund_category !== IC_FUND_TRANSFER_CATEGORY_ID && fund_category !== OTHER_FUNDS_CATEGORY_ID) {

                    var entity = newRecord.getValue(REQUESTOR_FIELD_ID);

                }

                var is_intercompany = newRecord.getValue(INTERCOMPANY_FIELD_ID);

                if (fund_category === FUND_TRANSFER_CATEGORY_ID && !is_intercompany) {

                    var entity = newRecord.getValue(REQUESTOR_FIELD_ID);

                } else if (fund_category === FUND_TRANSFER_CATEGORY_ID && is_intercompany) {

                    var entity = newRecord.getValue(IC_PAYEE_FIELD_ID) || newRecord.getValue(REQUESTOR_FIELD_ID);

                } else if (fund_category === IC_FUND_TRANSFER_CATEGORY_ID) {

                    var entity = newRecord.getValue(TRANSFEREE_COMPANY_FIELD_ID);

                }

                var amount = newRecord.getValue(AMOUNT_FIELD_ID);

                var issued = newRecord.getValue(ISSUED_FIELD_ID) || 0;

                var has_balance = newRecord.getValue(BALANCE_FIELD_ID);

                if ((status === APPROVED_PENDING_ISSUANCE_ID || (status === ISSUED_PENDING_LIQUIDATION && amount > issued)) && (runtime.getCurrentUser().role === TREASURY_ASSISTANT_ROLE_ID || runtime.getCurrentUser().role === TREASURY_HEAD_ROLE_ID)) {

                    // Show Write Check button if approved
                    form.addButton({
                        id: 'custpage_write_check',
                        label: 'Write Check',
                        functionName: 'onWriteCheckBtnClick("' + entity + '")',
                    });

                }

                if (
                    status === ISSUED_PENDING_LIQUIDATION &&
                    fund_category !== FUND_TRANSFER_CATEGORY_ID &&
                    fund_category !== IC_FUND_TRANSFER_CATEGORY_ID &&
                    has_balance
                ) {

                    if (runtime.getCurrentUser().role === TREASURY_ASSISTANT_ROLE_ID) {
                        // Show Fund Return button
                        form.addButton({
                            id: 'custpage_fund_return',
                            label: 'Fund Return',
                            functionName: 'onFundReturnBtnClick()',
                        });
                    }

                    if (
                        (fund_category === CASH_FUND_ID || fund_category === EMERGENCY_FUND_ID) &&
                        (parseInt(prepared_by) === parseInt(currentUser.id) || currentUser.role === TREASURY_ASSISTANT_ROLE_ID || currentUser.role === A_P_CLERK_ROLE_ID)
                    ) {

                        // log.debug('Liquidate','fund_category ('+ fund_category +')');
                        // Show Liquidate button
                        form.addButton({
                            id: 'custpage_liquidate',
                            label: 'Liquidate',
                            functionName: 'onLiquidateBtnClick("' + entity + '","' + fund_category + '")',
                        });

                    }

                }

                var for_atd = newRecord.getValue(FOR_ATD_FIELD_ID);

                var atd = newRecord.getValue(ATD_FIELD_ID);

                if (status !== PENDING_APPROVAL_STATUS_ID && for_atd && !atd) {

                    // Show Liquidate button
                    form.addButton({
                        id: 'custpage_authority_to_deduct',
                        label: 'Authority To Deduct',
                        functionName: 'onAuthorityToDeductBtnClick()',
                    });

                }

                form.clientScriptModulePath = './xrc_cs_fund_request.js';

                buildRelatedRecords(newRecord, form);

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

            var date = newRecord.getValue(DATE_FIELD_ID);

            // Generate series on CREATE context type and on date after opening balance
            (context.type === context.UserEventType.CREATE && isAfterOpeningBalance(date)) && handleSeriesGeneration(newRecord);

        }

        function buildRelatedRecords(newRecord, form) {

            // Adding Fund Returns sublist
            var fund_returns_sublist = form.addSublist({
                id: 'custpage_fund_returns',
                type: serverWidget.SublistType.LIST,
                label: 'Fund Returns',
                tab: 'custom780',
            });

            // Defining sublist fields
            var fr_id_field = fund_returns_sublist.addField({
                id: 'custpage_id',
                label: 'ID',
                type: serverWidget.FieldType.TEXT,
            });

            fr_id_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var fr_amount_field = fund_returns_sublist.addField({
                id: 'custpage_amount',
                label: 'Amount',
                type: serverWidget.FieldType.TEXT,
            });

            fr_amount_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            // Calling the created search
            var fr_search_values = createFundReturnSearch(newRecord.id).run().getRange({
                start: 0,
                end: 1000,
            });

            // Putting the values on the list
            for (var i = 0; i < fr_search_values.length; i++) {

                var result = fr_search_values[i];

                fund_returns_sublist.setSublistValue({
                    id: 'custpage_id',
                    value: '<a class="dottedlink viewitem" href="/app/common/custom/custrecordentry.nl?rectype=1216&id=' + result.id + '">' + result.getValue('name') + '</a>',
                    line: i,
                });

                fund_returns_sublist.setSublistValue({
                    id: 'custpage_amount',
                    value: result.getValue('custrecord_xrc_amount1'),
                    line: i,
                });

            }

            // Sublist for Expense Reports
            var expense_reports_sublist = form.addSublist({
                id: 'custpage_expense_reports',
                type: serverWidget.SublistType.LIST,
                label: 'Expense Reports',
                tab: 'custom780',
            });

            var fr_id_field = expense_reports_sublist.addField({
                id: 'custpage_exp_rep_id',
                label: 'ID',
                type: serverWidget.FieldType.TEXT,
            });

            fr_id_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var exprep_amount_field = expense_reports_sublist.addField({
                id: 'custpage_exp_rep_amount',
                label: 'Amount',
                type: serverWidget.FieldType.TEXT,
            });

            exprep_amount_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var exprep_search = createExpenseReportSearch(newRecord.id);

            var line = 0;

            exprep_search.run().each(function (result) {

                expense_reports_sublist.setSublistValue({
                    id: 'custpage_exp_rep_id',
                    value: '<a class="dottedlink viewitem" href="/app/accounting/transactions/exprept.nl?&whence=&id=' + result.getValue(result.columns[0]) + '">' + result.getValue(result.columns[1]) + '</a>',
                    line: line,
                });

                expense_reports_sublist.setSublistValue({
                    id: 'custpage_exp_rep_amount',
                    value: result.getValue(result.columns[2]),
                    line: line,
                });


                line++;

                return true;
            });


        }

        function createFundReturnSearch(fr_id) {

            // Creating fund return search
            var fundReturns_search = search.create({
                type: "customrecord_xrc_fund_return",
                filters:
                    [
                        ["custrecord_xrc_fund_req2", "anyof", fr_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "name", label: "ID" }),
                        search.createColumn({ name: "custrecord_xrc_date_returned", label: "Date Returned" }),
                        search.createColumn({ name: "custrecord_xrc_fund_custodian", label: "Fund Custodian" }),
                        search.createColumn({ name: "custrecord_xrc_fund_category2", label: "Fund Category" }),
                        search.createColumn({ name: "custrecord_xrc_remarks", label: "Remarks" }),
                        search.createColumn({ name: "custrecord_xrc_fund_origin", label: "Fund Origin" }),
                        search.createColumn({ name: "custrecord_dbti_deposited_account", label: "Deposited to Account" }),
                        search.createColumn({ name: "custrecord_xrc_deposit_num", label: "Deposit #" }),
                        search.createColumn({ name: "custrecord_xrc_amount1", label: "Amount" }),
                        search.createColumn({ name: "custrecord_xrc_fund_ret_status", label: "Status" })
                    ]
            });

            return fundReturns_search;

        }

        function createExpenseReportSearch(fr_id) {

            var expense_report_search = search.create({
                type: "expensereport",
                filters:
                    [
                        ["type", "anyof", "ExpRept"],
                        "AND",
                        ["custbody_xrc_fund_request_num", "anyof", fr_id],
                        "AND",
                        ["transactionlinetype", "noneof", "ADVANCETOAPPLY"],
                        "AND",
                        ["amount", "greaterthan", "0.00"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "tranid",
                            summary: "GROUP",
                            label: "Document Number"
                        }),
                        search.createColumn({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });

            return expense_report_search;

        }

        function otherFundsApproval(newRecord, currentUser, form, type, userEventType) {

            var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

            var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

            var is_user_dept_head = isUserDepartmentHead(newRecord, currentUser);

            log.debug('is_user_dept_head', is_user_dept_head);

            if (is_user_dept_head && !approval_1) {

                showApprovalButtons(form, 'custrecord_xrc_fundreq_approval1');

                return;

            } else {

                if (currentUser.role !== ADMIN_ROLE_ID) {

                    form.removeButton({
                        id: 'edit'
                    });

                    if (type === userEventType.EDIT) {
                        throw "Cannot edit transaction while in approval process.";
                    }

                }

            }

            if ((approval_1 && !approval_2) && (currentUser.role === 1475 || currentUser.role === 1460)) {

                showApprovalButtons(form, 'custrecord_xrc_fundreq_approval2');

            } else {

                if (currentUser.role !== ADMIN_ROLE_ID) {

                    form.removeButton({
                        id: 'edit'
                    });

                    if (type === userEventType.EDIT) {
                        throw "Cannot edit transaction while in approval process.";
                    }

                }
            }

        }

        function showApprovalButtons(form, field, role_to_email) {

            // Adding the button Approve
            form.addButton({
                id: 'custpage_approve',
                label: 'Approve',
                functionName: 'onApproveBtnClick("' + field + '","' + role_to_email + '")',
            });

            // Adding the button Reject
            form.addButton({
                id: 'custpage_reject',
                label: 'Reject',
                functionName: 'onRejectBtnClick()',
            });

        }

        function getNextApproverRole(newRecord, fund_category) {

            var fields = getApprovalFieldsByCategory(fund_category);

            var approval_fields = fields.approvalfields;

            var roles = fields.roles;

            for (var i = 0; i < approval_fields.length; i++) {

                var isFieldChecked = newRecord.getValue(approval_fields[i]);

                if (!isFieldChecked) {

                    return {
                        field: approval_fields[i],
                        role: roles[i],
                        role_to_email: roles[i + 1],
                    };
                }

            }

        }

        function getRoleToEmail(category) {

            if (category === '8') {

                return 1467; // => 1467 => XRC - HR Head

            } else if (category === '10') {

                return 1483;  // 1483 => XRC - Treasury Head

            } else if (category === '2-head') {

                return 1475; // 1475 => XRC - President

            } else {

                return 1467; // 1467 => XRC - HR Head

            }

        }

        function getApprovalFieldsByCategory(category) {

            var fields = {
                '8': {
                    approvalfields: ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2', 'custrecord_xrc_fundreq_approval3', 'custrecord_xrc_fundreq_approval4'],
                    roles: [1467, 1475, 1415, 1483], // IDs of the roles [HR- Head, President/COO, AP Senior Accounting Officer, Treasury Head]
                },
                '10': {
                    approvalfields: ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2'],
                    roles: [1483, 1484], // IDs of the roles [Treasury Head, VP - Finance]
                },
                '12': {
                    approvalfields: ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2'],
                    roles: [1483, 1484], // IDs of the roles [Treasury Head, VP - Finance]
                },
                '2-head': {
                    approvalfields: ['custrecord_xrc_fundreq_approval1'],
                    roles: [1475], // IDs of the roles [President/COO]
                },
                '2': {
                    approvalfields: ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2'],
                    roles: [1467, 1475], // IDs of the roles [HR Head, President/COO]
                },
            };

            return fields[category];

        }

        function canEdit(newRecord, currentUser) {

            var fields = ['custrecord_xrc_fundreq_approval1', 'custrecord_xrc_fundreq_approval2', 'custrecord_xrc_fundreq_approval3', 'custrecord_xrc_fundreq_approval4'];

            var roles = [1467, 1475, 1415, 1483]; // IDs of the roles [HR- Head, President/COO, AP Senior Accounting Officer, Treasury Head]

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked && currentUser.role === roles[i]) {

                    return true;
                }

            }

            return false;

        }

        function isUserDepartmentHead(newRecord, currentUser) {

            var employee_name = newRecord.getValue(EMPLOYEE_NAME_FIELD_ID);

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: employee_name,
                columns: ['department']
            });

            var requestor_dept = fieldLookUp.department[0].value;

            fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: currentUser.id,
                columns: ['department', 'custentity_xrc_dept_head']
            });

            var currentUser_dept = fieldLookUp.department[0].value;

            var currentUser_is_dept_head = fieldLookUp.custentity_xrc_dept_head;

            return (requestor_dept === currentUser_dept) && currentUser_is_dept_head;

        }

        function isRequestorDepartmentHead(newRecord) {

            var employee_name = newRecord.getValue(EMPLOYEE_NAME_FIELD_ID);

            var fieldLookUp = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: employee_name,
                columns: ['custentity_xrc_dept_head']
            });

            return fieldLookUp.custentity_xrc_dept_head;

        }

        function getAccount(subsidiary, category) {

            // Get the field bassed on the chosen category
            var field = getField(category);

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

        function handleSeriesGeneration(newRecord) {

            var current_script = runtime.getCurrentScript();

            var json_string = current_script.getParameter({ name: FR_LAST_NUM_FIELD_ID });

            var last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(LOCATION_FIELD_ID));

            var next_num = (parseInt(last_num_obj[location_code]) || 0) + 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [ID_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'FNDRQ-'), // Attaching the generated new number on saving the record
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
                id: 1877, // Script Deployment ID
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

        function getStringifiedCustomActionScript() {

            var stringified_script = `
                        <script>
                            document.addEventListener('DOMContentLoaded', function () {
                                var menuContainer = document.querySelector('td[data-automation-id="button-menu-actionmenu"] ul.ns-menu > li.ns-menuitem > ul.ns-menu');

                                if (menuContainer) {
                                    // Create a custom action item
                                    var customItem = document.createElement('li');
                                    customItem.className = 'ns-menuitem';
                                    customItem.innerHTML = '<a href="javascript:void(0)" onclick="runCancelAction()">Cancel</a>';

                                    // Append a separator and then the custom item at the end
                                    menuContainer.appendChild(document.createElement('li')).className = 'ns-menuseparator';
                                    menuContainer.appendChild(customItem);
                                }
                            });
                        </script>
                        `;

            return stringified_script;
        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);  