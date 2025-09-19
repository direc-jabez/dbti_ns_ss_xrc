/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 09, 2024
 * 
 */
define(['N/search', 'N/ui/serverWidget', 'N/record', 'N/runtime'],

    function (search, serverWidget, record, runtime) {

        const INITIAL_SOA_RECORD_TYPE_ID = 'customrecord_xrc_initial_soa';
        const ISOA_APPROVAL_STATUS_FIELD_ID = 'custrecord_xrc_approval_status4';
        const ISOA_PAID_ID = '3';
        const ISOA_TOTAL_AMOUNT_DUE_FIELD_ID = 'custrecord_total_amount_due';
        const ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID = 'custrecord_xrc_isoa_totalpay_amt';
        const PERCENTAGE_RATE_FIELD_ID = 'custbody_xrc_percentage_rate';
        const INITIAL_SOA_NUMBER_FIELD_ID = 'custbody_xrc_initial_soa';
        const HISTORICAL_VALUES_FIELD_ID = 'custbody_xrc_historical_values';
        const ESCALATION_SCHEDULE_SUBLIST_ID = 'custpage_escalation_schedule';
        const DOC_STATUS_FIELD_ID = 'custbody_xrc_doc_status';
        const STATUS_APPROVED_PENDING_SUBMISSION_ID = '1';
        const STATUS_SUBMITTED_ID = '2';
        const STATUS_SIGNED_ID = '3';
        const STATUS_SUBJECT_FOR_MANAGEMENT_APPROVAL_ID = '4';
        const STATUS_PENDING_APPROVAL_ID = '5';
        const STATUS_REJECTED = '6';
        const STATUS_CANCELLED_ID = '7';
        const STATUS_PROCESSED = 'Processed';
        const PRESIDENT_ROLE_ID = 1432;
        const NUMBER_ON_WORD_FIELD_ID = 'custbody_number_on_word';
        const LEASE_PERIOD_FIELD_ID = 'custbody_xrc_lease_period';
        const RENTAL_ESCALATION_PERC_FIELD_ID = 'custbody_xrc_rental_escalation_percent';
        const CUSA_ESCALATION_PERC_FIELD_ID = 'custbody_xrc_cusa_escalation_percent';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const LINKS_SUBLSIT_ID = 'links';

        const APPROVER1_FIELD_ID = 'custbody_xrc_approver1'
        const APPROVER2_FIELD_ID = 'custbody_xrc_approver2'


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            var currentUser = runtime.getCurrentUser();

            if (currentUser.id !== 7) {
                // Hiding Historical Values field
                form.getField({
                    id: HISTORICAL_VALUES_FIELD_ID,
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN,
                });
            }

            form.clientScriptModulePath = './xrc_cs_estimate.js';

            // Remove the Sales Order button
            form.removeButton({
                id: 'createsalesord',
            });

            if (context.type === context.UserEventType.VIEW) {

                var doc_status = newRecord.getValue(DOC_STATUS_FIELD_ID);

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if ((doc_status !== STATUS_CANCELLED_ID) && (currentUser.role === 1469 || currentUser.role === 3)) { // Lease Manager and Admin role id

                    // Then, show Lease Memorandum button
                    form.addButton({
                        id: 'custpage_cancel',
                        label: 'Cancel',
                        functionName: 'onCancelBtnClick()',
                    });

                }

                if (doc_status === STATUS_CANCELLED_ID) {

                    form.removeButton('edit');

                } else {

                    var canEdit = false;

                    if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                        // Adding button Submit for Aprpoval
                        form.addButton({
                            id: 'custpage_submit_for_approval',
                            label: doc_status === STATUS_REJECTED ? 'Resubmit for Approval' : 'Submit for Approval',
                            functionName: 'onSubmitForApprovalBtnClick("1469")',
                        });

                        canEdit = true

                    } else if (doc_status === STATUS_APPROVED_PENDING_SUBMISSION_ID && currentUser.role === 1470) { //  1470 => XRC - Leasing Officer

                        form.addButton({
                            id: 'custpage_submit',
                            label: 'Submit',
                            functionName: 'onSubmitBtnClick()',
                        });

                    } else if (doc_status === STATUS_SUBMITTED_ID && currentUser.role === 1470) { // 1470 => XRC - Leasing Officer

                        form.addButton({
                            id: 'custpage_signed',
                            label: 'Signed by Tenant',
                            functionName: 'onSignedByTenantBtnClick()',
                        });


                    } else if (doc_status === STATUS_SIGNED_ID) {

                        form.removeButton('edit');

                        var initial_soa = newRecord.getValue(INITIAL_SOA_NUMBER_FIELD_ID);

                        // Check if  there is no linked Initial SOA yet
                        if (!initial_soa && (currentUser.role === 1461 || currentUser.id === 7)) { // 1461 => XRC - Credit & Collection Officer

                            // If so, show Initial SOA button
                            form.addButton({
                                id: 'custpage_initial_soa',
                                label: 'Initial SOA',
                                functionName: 'onInitialSOBtnClick()',
                            });

                        } else {

                            var status = newRecord.getValue('status');

                            log.debug('status', status);

                            var links_lines = newRecord.getLineCount({ sublistId: LINKS_SUBLSIT_ID });

                            var has_so_not_cancelled = isSalesOrderCancelled();

                            if (!has_so_not_cancelled) {

                                // Then, show Lease Memorandum button
                                form.addButton({
                                    id: 'custpage_initial_soa',
                                    label: 'Lease Memorandum',
                                    functionName: 'onLeaseMemorandumBtnClick()',
                                });

                            }

                            if (initial_soa && links_lines < 1) { //  && status !== STATUS_PROCESSED

                                // Get the status of the linked Initial SOA 
                                var can_create_lease_memo = canCreateLeaseMemo(initial_soa);

                                log.debug('can_create_lease_memo', can_create_lease_memo);

                                // Check if the Initial SOA payment is greater than 0
                                if (can_create_lease_memo || (currentUser.role === '1470' || currentUser.role === '1469' || currentUser.role === '1421')) { // Visible only to Leasing roles

                                    // Then, show Lease Memorandum button
                                    form.addButton({
                                        id: 'custpage_initial_soa',
                                        label: 'Lease Memorandum',
                                        functionName: 'onLeaseMemorandumBtnClick()',
                                    });

                                }

                            }

                        }

                    } else if (doc_status === STATUS_SUBJECT_FOR_MANAGEMENT_APPROVAL_ID || doc_status === STATUS_PENDING_APPROVAL_ID) {

                        canEdit = false;

                        var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

                        var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

                        if (!for_approval) {
                            canEdit = false;

                        } else {

                            if (!approval_1 && currentUser.role === 1469) { // Lease Manager role id
                                showApprovalButtons(form, APPROVAL_ONE_FIELD_ID, "1421");
                                canEdit = true;

                            } else if (approval_1 && !approval_2 && currentUser.role === 1421) { // Leasing Head role id
                                showApprovalButtons(form, APPROVAL_TWO_FIELD_ID);
                                canEdit = true;

                            }
                        }
                    }

                    if (!canEdit) {
                        form.removeButton('edit');
                    }
                }

            }

            if (context.type === context.UserEventType.EDIT && currentUser.role !== 3) { // 3 => Admin role id

                var preparer = newRecord.getValue(PREPARED_BY_FIELD_ID)
                var approval1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID)
                var approval2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID)

                var isForApproval = newRecord.getValue(FOR_APPROVAL_FIELD_ID)


                var currentEmployeeId = currentUser.id;
                var currentEmployeeRole = currentUser.role

                const LEASEE_MANAGER_ROLE_ID = 1469 // Lease Manager role id
                const LEASEE_HEAD_ROLE_ID = 1421 // Leasing Head role id


                if (approval1 && approval2) {

                    throw ("This record has been fully approved and can no longer be edited.");

                }

                if (!isForApproval) {

                    if (parseInt(preparer) !== parseInt(currentEmployeeId)) {
                        throw ("Only the preparer can edit this record at this stage.");
                    }

                } else {

                    if (!approval1) {

                        if (parseInt(currentEmployeeRole) !== LEASEE_MANAGER_ROLE_ID) {
                            throw ("Only Lease Manager can edit this record at this stage.");
                        }

                    } else if (approval1 && !approval2) {

                        if (parseInt(currentEmployeeRole) !== LEASEE_HEAD_ROLE_ID) {
                            throw ("Only Leasing Head can edit this record at this stage.");
                        }

                    }

                }

                // else {

                //     if (parseInt(preparer) !== parseInt(currentEmployeeId)) {
                //         throw ("Only the preparer can edit this record at this stage.");
                //     }

                // }

            }

            buildEscalationScheduleSublist(newRecord, form);

            ['amount', 'grossamt', 'department', 'units', 'taxcode', 'taxrate1', 'tax1amt', 'quantityavailable', 'quantityonhand']
                .forEach(field => hideColumnField(context.form, 'item', field));

            // hideColumnField(context.form, 'item', 'amount');

            // hideColumnField(context.form, 'item', 'grossamt');

        }

        function showApprovalButtons(form, field, role_to_email = "") {

            // Show Apporove and Reject buttons 
            form.addButton({
                id: 'custpage_approve',
                label: 'Approve',
                functionName: 'onApproveBtnClick("' + field + '","' + role_to_email + '")',
            });

            form.addButton({
                id: 'custpage_reject',
                label: 'Reject',
                functionName: 'onRejectBtnClick()',
            });

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                var historical_values = updateHistoricalValues(newRecord);

                var year_words = numberToWords(Math.floor((newRecord.getValue(LEASE_PERIOD_FIELD_ID) / 12)));

                var month_words = numberToWords(newRecord.getValue(LEASE_PERIOD_FIELD_ID) % 12);

                var rental_escalation_words = numberToWords(parseInt(newRecord.getValue(RENTAL_ESCALATION_PERC_FIELD_ID)));

                var cusa_perc_words = numberToWords(parseInt(newRecord.getValue(CUSA_ESCALATION_PERC_FIELD_ID)));

                var percentage_rate = numberToWords(parseInt(newRecord.getValue(PERCENTAGE_RATE_FIELD_ID)));

                // Update the historical values field
                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        [HISTORICAL_VALUES_FIELD_ID]: historical_values,
                        // [DOC_STATUS_FIELD_ID]: STATUS_SUBJECT_FOR_MANAGEMENT_APPROVAL_ID,
                        [NUMBER_ON_WORD_FIELD_ID]: year_words + "," + month_words + "," + rental_escalation_words + "," + cusa_perc_words + "," + percentage_rate,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            }

        }

        function buildEscalationScheduleSublist(newRecord, form) {

            var fields = [
                {
                    id: 'custpage_year',
                    label: 'Year',
                    type: serverWidget.FieldType.TEXT,
                },
                {
                    id: 'custpage_lease_period',
                    label: 'Lease Period',
                    type: serverWidget.FieldType.TEXT,
                },
                {
                    id: 'custpage_true_billing_date',
                    label: 'Billing Date',
                    type: serverWidget.FieldType.TEXT,
                },
                {
                    id: 'custpage_billing_start_date',
                    label: 'Billing Period Start Date',
                    type: serverWidget.FieldType.TEXT,
                },
                {
                    id: 'custpage_billing_date',
                    label: 'Billing Period End Date',
                    type: serverWidget.FieldType.TEXT,
                },
                {
                    id: 'custpage_fixed_basic_rent',
                    label: 'Fixed Basic Rent',
                    type: serverWidget.FieldType.CURRENCY,
                },
                {
                    id: 'custpage_rental_escalation',
                    label: 'Rental Escalation %',
                    type: serverWidget.FieldType.FLOAT,
                },
                {
                    id: 'custpage_escalated_basic_rent',
                    label: 'Escalated Basic Rent',
                    type: serverWidget.FieldType.CURRENCY,
                },
                {
                    id: 'custpage_fixed_cusa',
                    label: 'Fixed CUSA',
                    type: serverWidget.FieldType.CURRENCY,
                },
                {
                    id: 'custpage_cusa_escalation',
                    label: 'CUSA Escalation %',
                    type: serverWidget.FieldType.FLOAT,
                },
                {
                    id: 'custpage_escalated_cusa',
                    label: 'Escalated CUSA',
                    type: serverWidget.FieldType.CURRENCY,
                },
                {
                    id: 'custpage_fixed_sec_dep',
                    label: 'Fixed Security Deposit',
                    type: serverWidget.FieldType.CURRENCY,
                },
                {
                    id: 'custpage_adj_sec_dep',
                    label: 'Adjusted Security Deposit',
                    type: serverWidget.FieldType.CURRENCY,
                },
                {
                    id: 'custpage_sec_dep_adj',
                    label: 'Additional Security Deposit',
                    type: serverWidget.FieldType.CURRENCY,
                },
            ];

            var esc_sched_sublist = form.addSublist({
                id: 'custpage_escalation_schedule',
                type: serverWidget.SublistType.INLINEEDITOR,
                label: 'Escalation Schedule',
                tab: 'items',
            });

            // Defining sublist fields
            fields.forEach((field, index) => {

                if (index === 1 || index === 2 || index === 3 || index === 4) {

                    esc_sched_sublist.addField({
                        id: field.id,
                        label: field.label,
                        type: field.type,
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN,
                    });

                } else {

                    esc_sched_sublist.addField({
                        id: field.id,
                        label: field.label,
                        type: field.type,
                    }).updateDisplayType({
                        displayType: field.type === serverWidget.FieldType.FLOAT || (field.id === 'custpage_fixed_sec_dep' || field.id === 'custpage_adj_sec_dep' || field.id === 'custpage_sec_dep_adj') ? serverWidget.FieldDisplayType.ENTRY : serverWidget.FieldDisplayType.DISABLED,
                    });

                }

            });

            esc_sched_sublist.addButton({
                id: 'custpage_generate',
                label: 'Generate',
                functionName: 'onGenerateBtnClick()',
            });

            esc_sched_sublist.addButton({
                id: 'custpage_remove_lines',
                label: 'Remove All Lines',
                functionName: 'onRemoveAllLinesBtnClick()',
            });

            esc_sched_sublist.addButton({
                id: 'custpage_recalc',
                label: 'Recalc',
                functionName: 'onRecalcBtnClick()',
            });

            var historical_values = newRecord.getValue(HISTORICAL_VALUES_FIELD_ID);

            if (historical_values) {

                var parsed_historical_values = JSON.parse(historical_values);

                var line = 0;

                parsed_historical_values.forEach((historical_value, index) => {

                    log.debug('lease_period', historical_value['custpage_lease_period']);

                    var lease_period = parseInt(historical_value['custpage_lease_period']);

                    if (isNewYear(lease_period)) {

                        for (var key in historical_value) {

                            try {

                                esc_sched_sublist.setSublistValue({
                                    id: key,
                                    value: historical_value[key],
                                    line: line,
                                });

                            } catch (error) {

                                log.debug('error', error);

                            }
                        }

                        line += 1;

                    }


                });

            }

        }

        // Getting the status of the Initial SOA record
        function canCreateLeaseMemo(isoa_id) {

            var fieldLookUp = search.lookupFields({
                type: INITIAL_SOA_RECORD_TYPE_ID,
                id: isoa_id,
                columns: [ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID, ISOA_TOTAL_AMOUNT_DUE_FIELD_ID, ISOA_APPROVAL_STATUS_FIELD_ID],
            });

            var isoa_status = fieldLookUp[ISOA_APPROVAL_STATUS_FIELD_ID][0]?.value;

            if (isoa_status === '1' || isoa_status === '4') { // 1 => Status: Pending Approval, 4 => Status: Rejected 
                return false;
            }

            var total_amount_due = parseFloat(fieldLookUp[ISOA_TOTAL_AMOUNT_DUE_FIELD_ID]);

            log.debug('total_amount_due', total_amount_due);

            // If total amount due, the lease proposal is renewal
            if (!total_amount_due) {
                return true;
            }

            var total_payment = parseFloat(fieldLookUp[ISOA_TOTAL_PAYMENT_AMOUNT_FIELD_ID]);

            return total_payment > 0;
        }

        function isSalesOrderCancelled() {

            var has_so_not_cancelled = false;

            var sales_order_search = search.create({
                type: "salesorder",
                settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }, { "name": "includeperiodendtransactions", "value": "F" }],
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["createdfrom", "anyof", "39926"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "statusref", label: "Status" })
                    ]
            });

            sales_order_search.run().each(function (result) {
                var status = result.getValue("statusref");
                if (status !== "closed" && status !== "cancelled") {
                    has_so_not_cancelled = true;
                }
                return true;
            });

            return has_so_not_cancelled;
        }


        function updateHistoricalValues(newRecord) {

            // Defining a list of ids from Escalation Schedule sublist
            var ids = ['custpage_year', 'custpage_lease_period', 'custpage_billing_date', 'custpage_rental_escalation', 'custpage_fixed_basic_rent', 'custpage_escalated_basic_rent', 'custpage_cusa_escalation', 'custpage_escalated_cusa', 'custpage_fixed_cusa', 'custpage_fixed_sec_dep', 'custpage_adj_sec_dep', 'custpage_sec_dep_adj', 'custbody_xrc_historical_values'];

            var esc_lines = newRecord.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            var values = [];

            for (var line = 0; line < esc_lines; line++) {

                // Each line of escalation schedule is 1 data object
                var data = {};

                ids.forEach(id => {

                    var value = newRecord.getSublistValue({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        fieldId: id,
                        line: line,
                    });

                    data[id] = value;

                });

                values.push(data);

            }

            return JSON.stringify(values);

        }

        function hideColumnField(formObj, sublistId, fieldId) {

            try {

                var formSublist = formObj.getSublist({
                    id: sublistId
                });

                if (formSublist) {

                    var formField = formSublist.getField({
                        id: fieldId
                    });

                    if (formField && typeof formField !== 'undefined' && formField !== null) {

                        formField.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });

                    }

                }

            } catch (error) {
                log.error({
                    title: 'Error occurred when hiding field',
                    details: JSON.stringify({
                        sublistId: sublistId,
                        fieldId: fieldId
                    })
                });
            }
        }

        function numberToWords(n) {
            var belowTwenty = [
                "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
                "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
                "seventeen", "eighteen", "nineteen"
            ];
            var tens = [
                "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
            ];

            if (n < 20) {
                return capitalizeFirstLetter(belowTwenty[n]);
            } else if (n < 100) {
                var tenPart = Math.floor(n / 10);
                var unitPart = n % 10;
                return unitPart === 0
                    ? capitalizeFirstLetter(tens[tenPart])
                    : capitalizeFirstLetter(tens[tenPart] + '-' + belowTwenty[unitPart]);
            } else if (n === 100) {
                return "One hundred"; // Capitalized as a special case
            } else {
                return "Invalid number";
            }
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function isNewYear(period) { // 🎇🎇🎇

            return period === 1 || ((period - 1) % 12 === 0);

        }



        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);