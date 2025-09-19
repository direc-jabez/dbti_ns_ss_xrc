/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 13, 2024
 * 
 */
define(['N/record', 'N/ui/serverWidget', 'N/search', 'N/runtime'],

    function (record, serverWidget, search, runtime) {

        const LEASE_PERIOD_RECORD_TYPE_ID = 'estimate';
        const INITIAL_SOA_TOTAL_AMOUNT_FIELD_ID = 'custbody_xrc_isoa_amount';
        const INITIAL_SOA_TOTAL_PAYMENT_FIELD_ID = 'custbody_xrc_isoa_total_pay';
        const INITIAL_SOA_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_isoa_unpaid_bal';
        const INITIAL_SOA_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa';
        const ISOA_LEASE_PROPOSAL_FIELD_ID = 'custrecord_xrc_lease_proposal';
        const ISOA_CUSTOMER_FIELD_ID = 'custrecord_xrc_customer_name';
        const ISOA_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_isoa_subsidiary';
        const ISOA_LOCATION_FIELD_ID = 'custrecord_xrc_isoa_location';
        const ISOA_DEPARTMENT_FIELD_ID = 'custrecord_xrc_isoa_department';
        const ISOA_CLASS_FIELD_ID = 'custrecord_xrc_isoa_class';
        const ISOA_APPROVAL_STATUS_FIELD_ID = 'custrecord_xrc_approval_status4';
        const ISOA_PAID_STATUS_ID = '3';
        const ISOA_TOTAL_AMOUNT_DUE_FIELD_ID = 'custrecord_total_amount_due';
        const ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID = 'custrecord_xrc_isoa_totalpay_amt';
        const ISOA_UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_isoa_unpaid_bal';
        const INITIAL_SOA_NUMBER_FIELD_ID = 'custrecord_xrc_initial_soa6';
        const APPLY_SUBLIST_ID = 'custpage_sublist_apply';
        const APPLY_SUBLIST_FIELD_ID = 'custpage_apply';
        const ID_SUBLIST_FIELD_ID = 'custpage_id';
        const ITEM_ID_SUBLIST_FIELD_ID = 'custpage_item_id';
        const APPLY_ACCOUNT_DESCRIPTION_FIELD_ID = 'custpage_acct_desc';
        const BALANCE_DUE_SUBLIST_FIELD_ID = 'custpage_balance_due';
        const PAYMENT_SUBLIST_FIELD_ID = 'custpage_payment';
        const ADVANCE_CHARGE_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa_item';
        const AC_BALANCE_DUE_FIELD_ID = 'custrecord_xrc_balance_due';
        const CREATE_MODE = 'create';
        const EDIT_MODE = 'edit';
        const HISTORICAL_VALUES_FIELD_ID = 'custrecord_xrc_isoa_dep_historical_vals';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_isoadep_for_approval';
        const APPROVAL_STATUS_FIELD_ID = 'custrecord_xrc_isoa_dep_approval_status';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const STATUS_APPROVED = '2';
        const REJECTED_STATUS_ID = '3';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_isoadep_preparedby';
        const CUSTOMER_NAME_FIELD_ID = 'custrecord_xrc_customer_name6';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_isoadep_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_isoadep_approval2';
        const DEPOSITED_FIELD_ID = 'custrecord_xrc_isoa_dep_deposited';
        const SALES_GENERATED_FIELD_ID = 'custrecord_xrc_isoa_dep_sales_generated';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            form.clientScriptModulePath = './xrc_cs_initial_soa_deposit.js';

            var currentUser = runtime.getCurrentUser();

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            if (currentUser.id != 7) {
                form.getField({
                    id: HISTORICAL_VALUES_FIELD_ID,
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN,
                });
            }

            if (context.type === context.UserEventType.CREATE) {

                var origin_id = context.request.parameters.origin_id;

                var mode = 'create';

            } else if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (context.type === context.UserEventType.VIEW && !for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === REJECTED_STATUS_ID ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick("1458")',
                    });

                } else if (context.type === context.UserEventType.VIEW && approval_status === PENDING_APPROVAL_STATUS_ID) {

                    var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

                    var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

                    if (!approval_1 && currentUser.role === 1458) { // 1458 => XRC - A/R Senior Accounting Officer

                        // Show the Checked button
                        form.addButton({
                            id: 'custpage_isoa_check',
                            label: 'Check',
                            functionName: 'onApproveBtnClick("custrecord_xrc_isoadep_approval1", "1483")',
                        });

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Reject',
                            functionName: 'onRejectBtnClick()',
                        });


                    } else if (!approval_2 && currentUser.role === 1483) { // 1483 => XRC - Treasury Head

                        // Show the Checked button
                        form.addButton({
                            id: 'custpage_isoa_note',
                            label: 'Approve',
                            functionName: 'onApproveBtnClick("custrecord_xrc_isoadep_approval2", "")',
                        });

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Reject',
                            functionName: 'onRejectBtnClick()',
                        });

                    }

                } else if (context.type === context.UserEventType.VIEW && approval_status === STATUS_APPROVED) {

                    var deposited = newRecord.getValue(DEPOSITED_FIELD_ID);

                    var sales_generated = newRecord.getValue(SALES_GENERATED_FIELD_ID);

                    if (!deposited && !sales_generated && (currentUser.role === 3 || currentUser.role === 1416)) { // 3 => Administator, 1416 => A/R Junior Accntng Officer

                        // Show the Checked button
                        form.addButton({
                            id: 'custpage_isoa_note',
                            label: 'Generate Deposit',
                            functionName: 'onGenerateDepositsClick()',
                        });

                        var customer = newRecord.getValue(CUSTOMER_NAME_FIELD_ID);

                        // Adding the button Reject
                        form.addButton({
                            id: 'custpage_reject',
                            label: 'Generate Sales',
                            functionName: 'onGenerateSalesClick("' + customer + '")',
                        });

                    }

                }

                var origin_id = newRecord.getValue(INITIAL_SOA_NUMBER_FIELD_ID);

                var mode = context.type === context.UserEventType.VIEW ? 'view' : 'edit';

            }

            // Build sublist if Initial SOA id is not empty
            if (origin_id) {

                buildApplySublist(newRecord, form, origin_id, mode);
            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var values = [];

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            // Referencing fields from Initial SOA record
            // Immediate referencing so we can save governance units
            var isoa_fieldLookUp = search.lookupFields({
                type: INITIAL_SOA_RECORD_TYPE_ID,
                id: newRecord.getValue(INITIAL_SOA_NUMBER_FIELD_ID),
                columns: [ISOA_CUSTOMER_FIELD_ID, ISOA_LEASE_PROPOSAL_FIELD_ID, ISOA_SUBSIDIARY_FIELD_ID, ISOA_LOCATION_FIELD_ID, ISOA_DEPARTMENT_FIELD_ID, ISOA_CLASS_FIELD_ID, ISOA_TOTAL_AMOUNT_DUE_FIELD_ID, ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID]
            });

            var lease_proposal_id = isoa_fieldLookUp[ISOA_LEASE_PROPOSAL_FIELD_ID][0].value;

            var isoa_id = newRecord.getValue(INITIAL_SOA_NUMBER_FIELD_ID);

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                var isoa_total_amount_due = parseFloat(isoa_fieldLookUp[ISOA_TOTAL_AMOUNT_DUE_FIELD_ID]) || 0;

                // var isoa_total_payment_amount = parseFloat(isoa_fieldLookUp[ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID]) || 0;

                var total_payment = 0;

                var apply_lines = newRecord.getLineCount({
                    sublistId: APPLY_SUBLIST_ID,
                });

                for (var line = 0; line < apply_lines; line++) {

                    var apply = newRecord.getSublistValue({
                        sublistId: APPLY_SUBLIST_ID,
                        fieldId: APPLY_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    // Check if Apply is check marked
                    if (apply === 'T') {

                        var ac_id = newRecord.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: ID_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var item_id = newRecord.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: ITEM_ID_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var acct_description = newRecord.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: APPLY_ACCOUNT_DESCRIPTION_FIELD_ID,
                            line: line,
                        });

                        var balance_due = newRecord.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: BALANCE_DUE_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var payment = newRecord.getSublistValue({
                            sublistId: APPLY_SUBLIST_ID,
                            fieldId: PAYMENT_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        total_payment += parseFloat(payment);

                        // Saving the values, to be set at the historical values field
                        values.push({
                            id: ac_id,
                            item_id: item_id,
                            acct_description: acct_description,
                            balance_due: balance_due,
                            payment: payment,
                        });

                        var new_balance_due = parseFloat(balance_due) - parseFloat(payment);

                        // Updating the Advance Charge record
                        record.submitFields({
                            type: ADVANCE_CHARGE_RECORD_TYPE_ID,
                            id: ac_id,
                            values: {
                                [AC_BALANCE_DUE_FIELD_ID]: new_balance_due,
                            },
                            options: {
                                ignoreMandatoryFields: true
                            }
                        });


                    }
                }

                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        ['custrecord_xrc_payment_amount6']: total_payment,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                if (approval_status === REJECTED_STATUS_ID) {

                    var isoa_rec = record.load({
                        type: INITIAL_SOA_RECORD_TYPE_ID,
                        id: isoa_id
                    });

                    var ac_lines = isoa_rec.getLineCount({ sublistId: "recmachcustrecord_xrc_initial_soa_num" });

                    var historical_values = JSON.parse(newRecord.getValue("custrecord_xrc_isoa_dep_historical_vals"));

                    for (var line = 0; line < historical_values.length; line++) {

                        var id = historical_values[line].id;

                        for (var ac_line = 0; ac_line < ac_lines; ac_line++) {

                            var isoa_ac_id = isoa_rec.getSublistValue({
                                sublistId: "recmachcustrecord_xrc_initial_soa_num",
                                fieldId: "id",
                                line: ac_line,
                            });

                            if (id === isoa_ac_id) {

                                var payment = historical_values[line].payment;

                                var isoa_balance_due = isoa_rec.getSublistValue({
                                    sublistId: "recmachcustrecord_xrc_initial_soa_num",
                                    fieldId: "custrecord_xrc_balance_due",
                                    line: ac_line,
                                });

                                record.submitFields({
                                    type: ADVANCE_CHARGE_RECORD_TYPE_ID,
                                    id: id,
                                    values: {
                                        [AC_BALANCE_DUE_FIELD_ID]: parseFloat(isoa_balance_due) + parseFloat(payment),
                                    },
                                    options: {
                                        ignoreMandatoryFields: true
                                    }
                                });

                            }

                        }

                    }

                }


                // if (approval_status === STATUS_APPROVED) {

                // Getting the total balance of the Initial SOA record
                var total_balance = getTotalBalance(isoa_id);

                if (total_balance === 0) {

                    // Updating the Initial SOA record 
                    record.submitFields({
                        type: INITIAL_SOA_RECORD_TYPE_ID,
                        id: isoa_id,
                        values: {
                            [ISOA_APPROVAL_STATUS_FIELD_ID]: ISOA_PAID_STATUS_ID, // Set Paid if balance due reaches 0
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });

                }

                var total_payment_amount = getTotalPaymentAmount(isoa_id);

                var unpaid_balance = isoa_total_amount_due - total_payment_amount;

                // Updating the Initial SOA record 
                record.submitFields({
                    type: INITIAL_SOA_RECORD_TYPE_ID,
                    id: isoa_id,
                    values: {
                        [ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID]: total_payment_amount,
                        [ISOA_UNPAID_BALANCE_FIELD_ID]: unpaid_balance,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                // Updating the Lease Proposal record 
                record.submitFields({
                    type: LEASE_PERIOD_RECORD_TYPE_ID,
                    id: lease_proposal_id,
                    values: {
                        [INITIAL_SOA_TOTAL_AMOUNT_FIELD_ID]: isoa_total_amount_due,
                        [INITIAL_SOA_TOTAL_PAYMENT_FIELD_ID]: total_payment_amount,
                        [INITIAL_SOA_UNPAID_BALANCE_FIELD_ID]: unpaid_balance,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                var so_id = getSalesOrder(lease_proposal_id);

                if (so_id) {

                    // Updating the Sales Order record 
                    record.submitFields({
                        type: record.Type.SALES_ORDER,
                        id: so_id,
                        values: {
                            [INITIAL_SOA_TOTAL_AMOUNT_FIELD_ID]: isoa_total_amount_due,
                            [INITIAL_SOA_TOTAL_PAYMENT_FIELD_ID]: total_payment_amount,
                            [INITIAL_SOA_UNPAID_BALANCE_FIELD_ID]: unpaid_balance,
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });

                }

                // }

                if (values.length) {

                    // Updating fields on current record
                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [HISTORICAL_VALUES_FIELD_ID]: JSON.stringify(values),
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });

                }
            }

        }

        function buildApplySublist(newRecord, form, origin_id, mode) {

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            // Creating the apply sublist and assigning it to the Advance Charges subtab
            var apply_sublist = form.addSublist({
                id: 'custpage_sublist_apply',
                type: serverWidget.SublistType.LIST,
                label: 'Apply',
                tab: 'custom783',
            });

            // Creating the sublist fields, make sure the ids of each fields are unique to each other

            apply_sublist.addField({
                id: 'custpage_id',
                label: 'ID',
                type: serverWidget.FieldType.TEXT,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN,
            });

            apply_sublist.addField({
                id: 'custpage_item_id',
                label: 'Item ID',
                type: serverWidget.FieldType.TEXT,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN,
            });

            apply_sublist.addField({
                id: 'custpage_apply',
                label: 'Apply',
                type: serverWidget.FieldType.CHECKBOX,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.ENTRY,
            });

            apply_sublist.addField({
                id: 'custpage_prepayment_categ',
                label: 'Prepayment Category',
                type: serverWidget.FieldType.TEXT,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            apply_sublist.addField({
                id: 'custpage_account_id',
                label: 'Account ID',
                type: serverWidget.FieldType.TEXT,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            apply_sublist.addField({
                id: 'custpage_acct_desc',
                label: 'Account Description',
                type: serverWidget.FieldType.TEXT,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            apply_sublist.addField({
                id: 'custpage_gross_amt',
                label: 'Gross Amount',
                type: serverWidget.FieldType.CURRENCY,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            apply_sublist.addField({
                id: 'custpage_balance_due',
                label: 'Balance Due',
                type: serverWidget.FieldType.CURRENCY,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            apply_sublist.addField({
                id: 'custpage_payment',
                label: 'Payment',
                type: serverWidget.FieldType.CURRENCY,
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.ENTRY,
            });

            var historical_values = newRecord.getValue(HISTORICAL_VALUES_FIELD_ID);

            if (historical_values) {

                var values = JSON.parse(historical_values);

                var ids = values.map(item => item.id);

            }

            var ac_search = createSearch(origin_id, mode, for_approval, ids);

            var line = 0;

            var total_payment = 0;

            // Setting the values from the referenced Initial SOA document
            ac_search.run().each(function (result) {

                apply_sublist.setSublistValue({
                    id: 'custpage_id',
                    value: result.id,
                    line: line,
                });

                apply_sublist.setSublistValue({
                    id: 'custpage_item_id',
                    value: result.getValue('custrecord_xrc_prepayment_category'),
                    line: line,
                });

                apply_sublist.setSublistValue({
                    id: 'custpage_apply',
                    value: 'T',
                    line: line,
                });

                apply_sublist.setSublistValue({
                    id: 'custpage_prepayment_categ',
                    value: result.getText('custrecord_xrc_prepayment_category'),
                    line: line,
                });

                apply_sublist.setSublistValue({
                    id: 'custpage_account_id',
                    value: result.getText('custrecord_xrc_account_id'),
                    line: line,
                });

                apply_sublist.setSublistValue({
                    id: 'custpage_acct_desc',
                    value: result.getValue('custrecord_xrc_account_descript'),
                    line: line,
                });

                apply_sublist.setSublistValue({
                    id: 'custpage_gross_amt',
                    value: result.getValue('custrecord_xrc_gross_amt'),
                    line: line,
                });

                // Make the gross amount as the default value if
                // balance due is empty
                var balance_due = result.getValue("custrecord_xrc_balance_due") || result.getValue('custrecord_xrc_gross_amt');

                // log.debug('balance_due', balance_due);

                total_payment += parseFloat(balance_due);

                apply_sublist.setSublistValue({
                    id: 'custpage_balance_due',
                    value: balance_due,
                    line: line,
                });

                apply_sublist.setSublistValue({
                    id: 'custpage_payment',
                    value: balance_due,
                    line: line,
                });

                line += 1;

                return true;

            });

            if (historical_values) {

                total_payment = 0;

                line = 0;

                if (approval_status !== REJECTED_STATUS_ID) {

                    // Setting values from historical values
                    JSON.parse(historical_values).forEach(value => {

                        if (value.balance_due) {

                            apply_sublist.setSublistValue({
                                id: 'custpage_balance_due',
                                value: value.balance_due,
                                line: line,
                            });

                        }

                        if (value.payment) {

                            apply_sublist.setSublistValue({
                                id: 'custpage_payment',
                                value: value.payment,
                                line: line,
                            });

                            total_payment += parseFloat(value.payment);

                        }

                        line += 1;

                    });
                    
                }

            }

            newRecord.setValue('custrecord_xrc_payment_amount6', total_payment);


        }

        function createSearch(isoa_id, mode, for_approval, ids = null) {

            // Saved search for all the Advance Charges with the id of the
            // Initial SOA
            // Filter: if CREATE_MODE, show all advance charges,
            // otherwise, show only what's included in historical values
            var advance_charge_search = search.create({
                type: "customrecord_xrc_initial_soa_item",
                filters:
                    mode === CREATE_MODE ? [
                        ["custrecord_xrc_initial_soa_num", "anyof", isoa_id],
                        "AND",
                        ["custrecord_xrc_balance_due", "greaterthan", "0.00"]
                    ]
                        : mode === EDIT_MODE && !for_approval ? [
                            ["custrecord_xrc_initial_soa_num", "anyof", isoa_id],
                        ]
                            : [
                                ["custrecord_xrc_initial_soa_num", "anyof", isoa_id],
                                "AND",
                                ["internalid", "anyof", ids],
                            ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_apply5", label: "Apply" }),
                        search.createColumn({ name: "custrecord_xrc_prepayment_category", label: "Prepayment Category" }),
                        search.createColumn({ name: "custrecord_xrc_account_id", label: "Account ID" }),
                        search.createColumn({ name: "custrecord_xrc_account_descript", label: "Account Description" }),
                        search.createColumn({ name: "custrecord_xrc_gross_amt", label: "Gross Amount" }),
                        search.createColumn({ name: "custrecord_xrc_applied_amount", label: "Applied Amount" }),
                        search.createColumn({ name: "custrecord_xrc_balance_due", label: "Balance Due" }),
                        search.createColumn({ name: "custrecord_xrc_amount_paid", label: "Amount Paid" }),
                    ]
            });

            return advance_charge_search;

        }

        function getTotalBalance(isoa_id) {

            log.debug('isoa_id', isoa_id);

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

        function getTotalPaymentAmount(isoa_id) {

            var total_payment_amount = 0;

            var isoa_total_payment = search.create({
                type: "customrecord_xrc_initial_soa_dep",
                filters:
                    [
                        ["custrecord_xrc_initial_soa6", "anyof", isoa_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_payment_amount6", label: "Payment Amount" })
                    ]
            });

            isoa_total_payment.run().each(function (result) {
                total_payment_amount += parseFloat(result.getValue('custrecord_xrc_payment_amount6'));
                return true;
            });

            return total_payment_amount;
        }

        function getSalesOrder(lease_proposal_id) {

            var so_id = '';

            var sales_order_search = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["createdfrom", "anyof", lease_proposal_id],
                        "AND",
                        ["mainline", "is", "T"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            sales_order_search.run().each(function (result) {

                so_id = result.id;

                return true;
            });

            return so_id;

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);