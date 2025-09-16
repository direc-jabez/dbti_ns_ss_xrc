/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 07, 2024
 * 
 */
define(['N/record', 'N/ui/serverWidget', 'N/search'],

    function (record, serverWidget, search) {

        const AMOUNT_FIELD_ID = 'custrecord_xrc_amount';
        const REQUESTOR_FIELD_ID = 'custrecord_xrc_requestor';
        const FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category';
        const STATUS_FIELD_ID = 'custrecord_xrc_status';
        const APPROVED_PENDING_ISSUANCE_ID = '2';
        const ISSUED_PENDING_LIQUIDATION = '3';
        const CLOSED_STATUS_ID = '4';
        const BALANCE_FIELD_ID = 'custrecord_xrc_balance';
        const FOR_ATD_FIELD_ID = 'custrecord_xrc_for_atd';
        const ATD_FIELD_ID = 'custrecord_xrc_atd';

        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            var status = newRecord.getValue(STATUS_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var requestor = newRecord.getValue(REQUESTOR_FIELD_ID);

                if (status === APPROVED_PENDING_ISSUANCE_ID) {

                    // Show Write Check button if approved
                    form.addButton({
                        id: 'custpage_write_check',
                        label: 'Write Check',
                        functionName: 'onWriteCheckBtnClick("' + requestor + '")',
                    });

                } else if (status === ISSUED_PENDING_LIQUIDATION) {

                    // Show Fund Return button
                    form.addButton({
                        id: 'custpage_fund_return',
                        label: 'Fund Return',
                        functionName: 'onFundReturnBtnClick()',
                    });

                    var fund_category = newRecord.getValue(FUND_CATEGORY_FIELD_ID);

                    // Show Liquidate button
                    form.addButton({
                        id: 'custpage_liquidate',
                        label: 'Liquidate',
                        functionName: 'onLiquidateBtnClick("' + requestor + '","' + fund_category + '")',
                    });

                }

                var for_atd = newRecord.getValue(FOR_ATD_FIELD_ID);

                var atd = newRecord.getValue(ATD_FIELD_ID);

                if (for_atd && !atd) {

                    // Show Liquidate button
                    form.addButton({
                        id: 'custpage_authority_to_deduct',
                        label: 'Authority To Deduct',
                        functionName: 'onAuthorityToDeductBtnClick()',
                    });

                }

                form.clientScriptModulePath = './xrc_cs_fund_request.js';

                // buildRelatedRecords(newRecord, form);

            }


        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE) {

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

                var requestor = newRecord.getValue(REQUESTOR_FIELD_ID);

                var fund_category = newRecord.getValue(FUND_CATEGORY_FIELD_ID);

                log.debug('fund_category', fund_category);

                // Load the employee record of the requestor
                var emp_rec = record.load({
                    type: record.Type.EMPLOYEE,
                    id: requestor,
                });

                var amount = newRecord.getValue(AMOUNT_FIELD_ID);

                log.debug('field', fund_categories[fund_category]);

                var cash_fund = emp_rec.getValue(fund_categories[fund_category]) || 0;

                var new_amount = cash_fund + amount;

                // Set the new amount
                emp_rec.setValue(fund_categories[fund_category], new_amount);

                emp_rec.save({
                    ignoreMandatoryFields: true,
                });

                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        [BALANCE_FIELD_ID]: amount,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            }

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

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);  