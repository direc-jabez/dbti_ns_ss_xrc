/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 21, 2024
 * 
 */
define(['N/search', 'N/ui/serverWidget', 'N/record', 'N/runtime', 'N/format'],

    function (search, serverWidget, record, runtime, format) {

        const HISTORICAL_VALUES_FIELD_ID = 'custbody_xrc_historical_values';
        const ORDER_STATUS_FIELD_ID = 'orderstatus';
        const PENDING_APPROVAL_STATUS_ID = 'A';
        const PENDING_FULFILLMENT_STATUS_ID = 'B';
        const CANCELLED_STATUS_ID = 'C';
        const PENDING_BILLING_STATUS_ID = 'F';
        const CLOSED_STATUS_ID = 'H';
        const PERMITTED_FIELD_ID = 'custbody_xrc_lm_permitted';
        const PTO_FIELD_ID = 'custbody_xrc_pto_checkbox';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const LEASE_MEMORANDUM_FORM_ID = '233';
        const INTERCO_SO_FORM_ID = '237';
        const COMPANY_FIELD_ID = 'entity';
        const BASIC_RENT_FIELD_ID = 'custbody_xrc_basic_rent';
        const ACTUAL_RATE_PER_SQM_FIELD_ID = 'custbody_xrc_actual_rate_per_sqm';
        const LEASE_EXPIERY_FIELD_ID = 'custbody_xrc_lease_expiry';
        const LEASE_PERIOD_TYPE_FIELD_ID = 'custbody_xrc_lease_period_type';
        const LEASABLE_SPACE_RECORD_TYPE = 'customrecord_xrc_leasable_spaces';
        const SPACE_NO_FIELD_ID = 'custbody_xrc_space_num';
        const LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
        const LS_LEASE_MEMORANDUM_FIELD_ID = 'custrecord_xrc_lease_memo14';
        const LS_TENANT_FIELD_ID = 'custrecord_xrc_tenant';
        const LS_ACTUAL_RATE_PER_SQM_FIELD_ID = 'custrecord_xrc_ls_actual_rate_per_sqm';
        const LS_ACTUAL_BASIC_RENT_FIELD_ID = 'custrecord_xrc_actual_basic_rent';
        const LS_LEASE_EXPIRY_FIELD_ID = 'custrecord_xrc_ls_lease_expiry';
        const LS_LEASE_PERIOD_TYPE_FIELD_ID = 'custrecord_xrc_ls_lease_period_type';
        const LS_LEASE_TYPE_FIELD_ID = 'custrecord_xrc_lease_type';
        const LS_LEASE_STATUS_FIELD_ID = 'custrecord_xrc_ls_lease_status';
        const LS_PROPERTY_CLASS_FIELD_ID = 'custrecord_xrc_ls_property_class';
        const LS_OCCUPIED_STATUS_ID = '1';
        const ESCALATION_SCHEDULE_SUBLIST_ID = 'recmachcustrecord_xrc_esc_sched_estimate';
        const LEASE_COMMENCEMENT_FIELD_ID = 'custbody_xrc_lease_commencement';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const APPROVAL_ONE_FIELD_ID = 'custbody_xrc_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const APPROVAL_THREE_FIELD_ID = 'custbody_xrc_approval3';
        const APPROVER_TWO_FIELD_ID = 'custbody_xrc_approver2';
        const APPROVER_THREE_FIELD_ID = 'custbody_xrc_approver3';
        const REJECT_FIELD_ID = 'custbody1';
        const FINAL_SOA_NO_FIELD_ID = 'custbody_xrc_final_soa_num';
        const LEASE_PERIOD_FIELD_ID = 'custbody_xrc_lease_period';
        const RENTAL_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_rental_escalation_percent';
        const CUSA_FIELD_ID = 'custbody_xrc_cusa';
        const CUSA_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_cusa_escalation_percent';
        const CURRENT_LEASE_PERIOD_FIELD_ID = 'custbody_xrc_current_lease_period';
        const SOURCE_FIELD_ID = 'source';
        const SOURCE_CSV = 'CSV';
        const INITIALIZED_FIELD_ID = 'custbody_xrc_initialized';
        const PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID = 'custbody_xrc_period_sec_dep';
        const TRANID_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const PRO_RATED_LEASE_EXPIRTY_FIELD_ID = 'custbody_xrc_pro_rated_lease_expiry';
        const ONE_TIME_PAYMENT_TYPE_ID = '3';
        const LEASE_EXPIRY_FIELD_ID = 'custbody_xrc_lease_expiry';
        const PAIRED_INTERCO_PO_FIELD_ID = 'intercotransaction';
        const RENEWAL_FIELD_ID = 'custbody_xrc_renewal';
        const INITIAL_SOA_FIELD_ID = 'custbody_xrc_initial_soa';
        const INITIAL_SOA_TOTAL_AMOUNT_FIELD_ID = 'custbody_xrc_isoa_amount';
        const INITIAL_SOA_TOTAL_PAYMENT_FIELD_ID = 'custbody_xrc_isoa_total_pay';
        const INITIAL_SOA_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_isoa_unpaid_bal';
        const PROPERTY_CLASS_FIELD_ID = 'custbody_xrc_property_class';
        const OPENING_BALANCE_FIELD_ID = 'custbody_xrc_open_bal';
        const BSCHED_TENANT_FIELD_ID = 'custrecord_xrc_tenant7';
        const BSCHED_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary7';
        const BSCHED_LOCATION_FIELD_ID = 'custrecord_xrc_loc7';
        const BSCHED_DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept7';
        const BSCHED_CLASS_FIELD_ID = 'custrecord_xrc_class7';
        const BSCHED_LEASE_TYPE_FIELD_ID = 'custrecord_xrc_lease_type7';
        const BSCHED_INTEREST_RATE_FIELD_ID = 'custrecord_xrc_bes_interestrate';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const TENANT_FIELD_ID = 'entity';
        const BSCHED_NEXT_ESCALATION_DATE_FIELD_ID = 'custrecord_xrc_next_esc_sched';
        const INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_interest_rate_unpaid';



        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            var parameters = context?.request?.parameters;

            form.clientScriptModulePath = './xrc_cs_sales_order.js';

            var currentUser = runtime.getCurrentUser();

            // For testing only, uncomment code if testing
            if (runtime.getCurrentUser().id != 7) {
                // Hiding Historical Values field
                form.getField({
                    id: HISTORICAL_VALUES_FIELD_ID,
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN,
                });

            }

            if (parameters) {

                var renewal = parameters.renewal;

                if (renewal && renewal === 'T') {

                    // Hiding ISOA fuields on renewal
                    [INITIAL_SOA_FIELD_ID, INITIAL_SOA_TOTAL_AMOUNT_FIELD_ID, INITIAL_SOA_TOTAL_PAYMENT_FIELD_ID, INITIAL_SOA_UNPAID_BALANCE_FIELD_ID]
                        .forEach(field =>
                            form.getField({
                                id: field,
                            }).updateDisplayType({
                                displayType: serverWidget.FieldDisplayType.HIDDEN,
                            })
                        );

                }

            }

            hideSublistFields(form);

            var permitted = newRecord.getValue(PERMITTED_FIELD_ID);

            var pto = newRecord.getValue(PTO_FIELD_ID);

            var order_status = newRecord.getValue(ORDER_STATUS_FIELD_ID);

            var source = newRecord.getValue(SOURCE_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                var approval_1 = newRecord.getValue(APPROVAL_ONE_FIELD_ID);

                var approval_2 = newRecord.getValue(APPROVAL_TWO_FIELD_ID);

                var approval_3 = newRecord.getValue(APPROVAL_THREE_FIELD_ID);

                var rejected = newRecord.getValue(REJECT_FIELD_ID);

                if (order_status !== CLOSED_STATUS_ID && currentUser.role === 1469) { // 1469 => XRC - Leasing Manager

                    form.removeButton({
                        id: 'cancelorder',
                    });

                    form.addButton({
                        id: 'custpage_close_order',
                        label: 'Cancel',
                        functionName: 'onCloseOrderBtnClick()',
                    });

                }

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {


                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: rejected ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick("1469")',
                    });

                    showNativeApprovalButtons(form, false);

                }

                var opening_balance = newRecord.getValue(OPENING_BALANCE_FIELD_ID);

                // && source !== SOURCE_CSV
                if (order_status === PENDING_BILLING_STATUS_ID && !opening_balance && !pto && currentUser.role === 1470) { // 1470 =? XRC - Leasing Officer

                    var lease_commencement_date = newRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID);

                    // If approved, show PTO button 
                    form.addButton({
                        id: 'custpage_pto',
                        label: 'PTO',
                        functionName: 'onPTOBtnClick("' + lease_commencement_date.toLocaleDateString() + '")',
                    });

                } else if ((!approval_1 || !approval_2 || !approval_3) && !rejected && order_status !== CLOSED_STATUS_ID) {

                    if (!approval_1 && currentUser.role === 1469) { // 1469 => XRC - Leasing Manager

                        showApprovalButtons(form, 'custbody_xrc_approval1', "1421");

                        showNativeApprovalButtons(form, false);

                    } else if ((approval_1 && !approval_2) && currentUser.role === 1421) { // 1421 => XRC - Leasing Head

                        if (opening_balance) {

                            showNativeApprovalButtons(form, true);

                        } else {

                            showApprovalButtons(form, 'custbody_xrc_approval2', "1475");

                            showNativeApprovalButtons(form, false);

                        }

                    } else if (opening_balance === false && (approval_2 && !approval_3 && order_status !== CANCELLED_STATUS_ID) && currentUser.role === 1475) { // 1475 => XRC - President

                        showNativeApprovalButtons(form, true);


                    } else {

                        showNativeApprovalButtons(form, false);

                    }

                }

                // Getting the current form using field lookup
                var fieldLookUp = search.lookupFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    columns: [CUSTOM_FORM_FIELD_ID],
                });

                var custom_form = fieldLookUp[CUSTOM_FORM_FIELD_ID][0].value;

                // if (custom_form === SALES_ORDER_FORM_ID) {

                //     var si_num = newRecord.getValue(SI_NUMBER_FIELD_ID); // Linked Sales Invoice number

                //     if (si_num) {

                //         // Changing header title if form is Sales Order Form (223)
                //         // And if there is a linked Sales Invoice
                //         var hideFld = form.addField({
                //             id: 'custpage_hidden_element',
                //             label: 'not shown - hidden',
                //             type: serverWidget.FieldType.INLINEHTML
                //         });

                //         var scr = "";

                //         scr += 'document.getElementsByTagName("h1")[0].innerHTML = "Interest Charge";';// Changing the title

                //         hideFld.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>";

                //     }

                // }

                if (custom_form === LEASE_MEMORANDUM_FORM_ID) {

                    // Changing header title if form is Lease memorandunm Form (233)
                    // And if there is a linked Sales Invoice
                    var hideFld = form.addField({
                        id: 'custpage_hidden_element',
                        label: 'not shown - hidden',
                        type: serverWidget.FieldType.INLINEHTML
                    });

                    var scr = "";

                    scr += 'document.getElementsByTagName("h1")[0].innerHTML = "Lease Memorandum";';// Changing the title

                    hideFld.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>";

                }

                ['amount', 'grossamt', 'department', 'units', 'taxcode', 'taxrate1', 'tax1amt', 'quantityavailable', 'quantityonhand']
                    .forEach(field => hideColumnField(context.form, 'item', field));

            }
            // (order_status === PENDING_APPROVAL_STATUS_ID) || (source !== SOURCE_CSV && order_status === PENDING_BILLING_STATUS_ID &&

            var renewal = context.request?.parameters?.renewal;
            log.debug('renewal', renewal);
            if (!pto || renewal === 'T') {
                buildEscalationScheduleSublist(newRecord, form);
            }

            if (order_status !== PENDING_APPROVAL_STATUS_ID && order_status !== CANCELLED_STATUS_ID) {

                form.addButton({
                    id: 'custpage_renew',
                    label: 'Renew',
                    functionName: 'onRenewBtnClick()',
                });

            }

            var final_soa_no = newRecord.getValue(FINAL_SOA_NO_FIELD_ID);

            if (order_status === CLOSED_STATUS_ID && !final_soa_no) {

                var tenant = newRecord.getValue(COMPANY_FIELD_ID);

                var subsidiary = newRecord.getValue(SUBSIDIARY_FIELD_ID);

                form.addButton({
                    id: 'custpage_final_soa',
                    label: 'Final SOA',
                    functionName: 'onFinalSOABtnClick("' + tenant + '","' + subsidiary + '")',
                });

            }

            // Removing native close order button for custom process purposes
            form.removeButton({
                id: 'closeremaining',
            });

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var currentUser = runtime.getCurrentUser();

            if (context.type === context.UserEventType.APPROVE) {

                var space_no = newRecord.getValue(SPACE_NO_FIELD_ID);

                var source = newRecord.getValue(SOURCE_FIELD_ID);

                // On Lease Memorandum approval, update tagged FAM record
                record.submitFields({
                    type: LEASABLE_SPACE_RECORD_TYPE,
                    id: space_no,
                    values: {
                        [LS_ACTUAL_RATE_PER_SQM_FIELD_ID]: newRecord.getValue(ACTUAL_RATE_PER_SQM_FIELD_ID),
                        [LS_ACTUAL_BASIC_RENT_FIELD_ID]: newRecord.getValue(BASIC_RENT_FIELD_ID),
                        [LS_LEASE_MEMORANDUM_FIELD_ID]: newRecord.id,
                        [LS_TENANT_FIELD_ID]: newRecord.getValue(COMPANY_FIELD_ID),
                        [LS_LEASE_EXPIRY_FIELD_ID]: newRecord.getValue(LEASE_EXPIERY_FIELD_ID),
                        [LS_LEASE_PERIOD_TYPE_FIELD_ID]: newRecord.getValue(LEASE_PERIOD_TYPE_FIELD_ID),
                        [LS_LEASE_TYPE_FIELD_ID]: newRecord.getValue(LEASE_TYPE_FIELD_ID),
                        [LS_LEASE_STATUS_FIELD_ID]: LS_OCCUPIED_STATUS_ID,
                        [LS_PROPERTY_CLASS_FIELD_ID]: newRecord.getValue(PROPERTY_CLASS_FIELD_ID),
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                var opening_balance = newRecord.getValue(OPENING_BALANCE_FIELD_ID);

                if (opening_balance) {

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [APPROVAL_TWO_FIELD_ID]: true,
                            [APPROVER_TWO_FIELD_ID]: currentUser.id,
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });

                } else {

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [APPROVAL_THREE_FIELD_ID]: true,
                            [APPROVER_THREE_FIELD_ID]: currentUser.id,
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });

                }


                // sendEmail(newRecord.id, newRecord.getValue(TRANID_FIELD_ID), newRecord.getValue(SUBSIDIARY_FIELD_ID), [newRecord.getValue(PREPARED_BY_FIELD_ID)], NOTIF_TYPE_APPROVED);

                var opening_balance = newRecord.getValue(OPENING_BALANCE_FIELD_ID);

                if (source === SOURCE_CSV && opening_balance) {

                    generateBillingSchedule(newRecord);

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [PTO_FIELD_ID]: true,
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });

                }


            } else if (context.type === context.UserEventType.EDIT) {

                var order_status = newRecord.getValue(ORDER_STATUS_FIELD_ID);

                if (order_status === CLOSED_STATUS_ID) {

                    // Removing all billing scheules on Sales Order closed
                    removeBillingSchedules(newRecord);

                }

                var pto = newRecord.getValue(PTO_FIELD_ID);

                if (!pto) {

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [HISTORICAL_VALUES_FIELD_ID]: updateHistoricalValues(newRecord),
                        },
                    });

                }

            } else if (context.type === context.UserEventType.CREATE) {

                // log.debug('flag aftersubmit', true);

                var paired_intercompany_transaction = newRecord.getValue(PAIRED_INTERCO_PO_FIELD_ID);

                // log.debug('paired_intercompany_transaction', paired_intercompany_transaction);

                if (paired_intercompany_transaction) {

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [CUSTOM_FORM_FIELD_ID]: INTERCO_SO_FORM_ID,
                            [ORDER_STATUS_FIELD_ID]: PENDING_FULFILLMENT_STATUS_ID,
                        }
                    });


                    return;

                }

                var initialized = newRecord.getValue(INITIALIZED_FIELD_ID);

                if (!initialized) {

                    record.submitFields({
                        type: newRecord.type,
                        id: newRecord.id,
                        values: {
                            [INITIALIZED_FIELD_ID]: true,
                        },
                    });

                }

            }
        }

        function buildEscalationScheduleSublist(newRecord, form) {

            log.debug('remarks', 'building sublist');

            try {

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
                    label: 'Billing/Escalation Schedule',
                    tab: 'items',
                });

                // Defining sublist fields
                fields.forEach(field => {

                    esc_sched_sublist.addField({
                        id: field.id,
                        label: field.label,
                        type: field.type,
                    }).updateDisplayType({
                        displayType: (field.type === serverWidget.FieldType.FLOAT || (field.id === 'custpage_fixed_sec_dep' || field.id === 'custpage_adj_sec_dep' || field.id === 'custpage_sec_dep_adj')) ? serverWidget.FieldDisplayType.ENTRY : serverWidget.FieldDisplayType.DISABLED,
                    });

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

                var initialized = newRecord.getValue(INITIALIZED_FIELD_ID);

                var existing_historical_values = newRecord.getValue(HISTORICAL_VALUES_FIELD_ID);

                // log.debug('existing_historical_values', existing_historical_values);

                var source = newRecord.getValue(SOURCE_FIELD_ID);

                // log.debug('source', source);

                var historical_values = source === SOURCE_CSV && !existing_historical_values ? generateHistoricalValues(newRecord) : newRecord.getValue(HISTORICAL_VALUES_FIELD_ID);

                // log.debug('historical_values', historical_values);

                // var historical_values = initialized ? existing_historical_values : generateHistoricalValues(newRecord);

                if (historical_values) {

                    newRecord.setValue(HISTORICAL_VALUES_FIELD_ID, historical_values);

                    var parsed_historical_values = JSON.parse(historical_values);

                    var line = 0;

                    parsed_historical_values.forEach(historical_value => {

                        for (var key in historical_value) {

                            var year = parseInt(historical_value['custpage_year']);

                            var period = parseInt(historical_value['custpage_lease_period']);

                            try {

                                // if ((key === 'custpage_fixed_sec_dep' || key === 'custpage_adj_sec_dep' || key === 'custpage_sec_dep_adj') && !isNewYear(period)) {
                                //     continue;
                                // }

                                if (((key === 'custpage_rental_escalation' || key === 'custpage_cusa_escalation') && year === 1) && !initialized) {
                                    continue;
                                }

                                esc_sched_sublist.setSublistValue({
                                    id: key,
                                    value: historical_value[key],
                                    line: line,
                                });

                            } catch (error) {

                                esc_sched_sublist.setSublistValue({
                                    id: key,
                                    value: parseInt(historical_value[key]) || null,
                                    line: line,
                                });

                            }
                        }

                        line += 1;

                        isNotFirstDay = false;

                    });

                }

            } catch (error) {

                log.debug('error', error);

            }

        }

        function showApprovalButtons(form, field) {

            // Show the Checked button
            form.addButton({
                id: 'custpage_isoa_note',
                label: 'Approve',
                functionName: 'onApproveBtnClick("' + field + '")',
            });

            // Adding the button Reject
            form.addButton({
                id: 'custpage_reject',
                label: 'Reject',
                functionName: 'onRejectBtnClick()',
            });

        }

        function showNativeApprovalButtons(form, show) {

            if (!show) {

                form.removeButton({
                    id: 'approve'
                });

                form.removeButton({
                    id: 'cancelorder'
                });

            } else {

                // Adding the button Reject
                form.addButton({
                    id: 'custpage_reject',
                    label: 'Reject',
                    functionName: 'onRejectBtnClick()',
                });

            }
        }

        function removeBillingSchedules(newRecord) {

            var so_rec = record.load({
                type: record.Type.SALES_ORDER,
                id: newRecord.id,
                isDynamic: true,
            });

            var lineCount = so_rec.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            // Loop backward to avoid index issues when removing lines
            for (var line = lineCount - 1; line >= 0; line--) {
                so_rec.removeLine({
                    sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    line: line,
                    ignoreRecalc: true
                });
            }

            so_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function getFifthOfTheMonth(date) {

            var year = date.split('/')[2];

            var month = date.split('/')[0];

            return month + "/05/" + year;

        }

        function getLastDateOfMonth(year, month) {

            return new Date(year, month + 1, 0);

        }

        function isNewYear(period) { // 🎇🎇🎇

            return period === 1 || ((period - 1) % 12 === 0);

        }

        function generateHistoricalValues(newRecord) {

            var historical_values = [];

            var lease_period_type = newRecord.getValue(LEASE_PERIOD_TYPE_FIELD_ID);

            var lease_period = newRecord.getValue(LEASE_PERIOD_FIELD_ID);

            var current_lease_period = newRecord.getValue(CURRENT_LEASE_PERIOD_FIELD_ID) || 1;

            var lease_commencement = newRecord.getValue(LEASE_COMMENCEMENT_FIELD_ID);

            var pro_rated_lease_expiry = newRecord.getValue(PRO_RATED_LEASE_EXPIRTY_FIELD_ID);

            var basic_rent = newRecord.getValue(BASIC_RENT_FIELD_ID);

            var rental_escalation = newRecord.getValue(RENTAL_ESCALATION_PERCENTAGE_FIELD_ID) || 0;

            var cusa_rent = newRecord.getValue(CUSA_FIELD_ID) || 0;

            var cusa_escalation = newRecord.getValue(CUSA_ESCALATION_PERCENTAGE_FIELD_ID) || 0;

            var year = 1;

            var last_date = getLastDateOfMonth(lease_commencement.getFullYear(), lease_commencement.getMonth());

            // Get the date on the Lease Commencement date
            var isNotFirstDay = lease_commencement.getDate() > 1 ? true : false;

            var period_for_security_deposit = newRecord.getValue(PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID);

            if (lease_period_type === ONE_TIME_PAYMENT_TYPE_ID) {

                historical_values.push({
                    "custpage_year": 1,
                    "custpage_lease_period": 1,
                    "custpage_true_billing_date": getFifthOfTheMonth(last_date.toLocaleDateString()),
                    "custpage_billing_date": newRecord.getValue(LEASE_EXPIERY_FIELD_ID).toLocaleDateString(),
                    "custpage_rental_escalation": "",
                    "custpage_fixed_basic_rent": basic_rent,
                    "custpage_escalated_basic_rent": basic_rent,
                    "custpage_fixed_cusa": cusa_rent,
                    "custpage_cusa_escalation": "",
                    "custpage_escalated_cusa": cusa_rent,
                    "custpage_fixed_sec_dep": "",
                    "custpage_adj_sec_dep": "",
                    "custpage_sec_dep_adj": "",
                });

                return JSON.stringify(historical_values);

            }

            if (isNotFirstDay) {

                var day = ((last_date.getDate() - lease_commencement.getDate()) + 1);

                var pro_rated_rent = getProRatedRent(basic_rent, last_date, day);

                historical_values.push({
                    "custpage_year": 1,
                    "custpage_lease_period": 0,
                    "custpage_true_billing_date": getFifthOfTheMonth(last_date.toLocaleDateString()),
                    "custpage_billing_date": last_date.toLocaleDateString(),
                    "custpage_rental_escalation": "",
                    "custpage_fixed_basic_rent": pro_rated_rent,
                    "custpage_escalated_basic_rent": pro_rated_rent,
                    "custpage_fixed_cusa": cusa_rent,
                    "custpage_cusa_escalation": "",
                    "custpage_escalated_cusa": cusa_rent,
                    "custpage_fixed_sec_dep": "",
                    "custpage_adj_sec_dep": "",
                    "custpage_sec_dep_adj": "",
                });

                last_date = getLastDateOfMonth(last_date.getFullYear(), last_date.getMonth() + 1);

            }

            for (var i = 1; i <= lease_period; i++) {

                // var fbr = basic_rent; // Fixed basic rent

                var fixed_basic_rent = basic_rent;

                var rental_escalation_percentage = rental_escalation;

                var cusa_escalation_percentage = cusa_escalation;

                var fixed_cusa = cusa_rent;

                // Escalated basic rent
                var ebr = i > 12 ? (((rental_escalation_percentage + 100) / 100) * fixed_basic_rent) : fixed_basic_rent;

                // Escalated CUSA
                var ec = i > 12 ? (((cusa_escalation_percentage + 100) / 100) * fixed_cusa) : fixed_cusa;

                // Check if the period is the start of year
                if (isNewYear(i)) {

                    var escalated_basic_rent = ebr;

                    var fixed_security_deposit = (fixed_basic_rent * period_for_security_deposit);

                    var adjusted_security_deposit = (escalated_basic_rent * period_for_security_deposit);

                    // Security Deposit Adjustment
                    var sda = adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit;

                    if (i > 12) {

                        year += 1;

                    }

                } else {

                    var fixed_security_deposit = '';

                    var adjusted_security_deposit = '';

                    // Security Deposit Adjustment
                    var sda = '';

                }

                if (i === lease_period) {

                    var day = i === 0 ? ((last_date.getDate() - lease_commencement.getDate()) + 1) : i === lease_period ? newRecord.getValue(LEASE_EXPIRY_FIELD_ID).getDate() : null;

                    var pro_rated_rent = getProRatedRent(basic_rent, last_date, day);

                    historical_values.push({
                        "custpage_year": year,
                        "custpage_lease_period": i,
                        "custpage_true_billing_date": getFifthOfTheMonth(last_date.toLocaleDateString()),
                        "custpage_billing_date": newRecord.getValue(LEASE_EXPIRY_FIELD_ID).toLocaleDateString(),
                        "custpage_rental_escalation": i > 12 ? rental_escalation : null,
                        "custpage_fixed_basic_rent": pro_rated_rent,
                        "custpage_escalated_basic_rent": (pro_rated_rent + (pro_rated_rent * (rental_escalation / 100))),
                        "custpage_fixed_cusa": fixed_cusa,
                        "custpage_cusa_escalation": i > 12 ? cusa_escalation : null,
                        "custpage_escalated_cusa": ec || fixed_cusa,
                        "custpage_fixed_sec_dep": fixed_security_deposit,
                        "custpage_adj_sec_dep": adjusted_security_deposit,
                        "custpage_sec_dep_adj": sda,
                    });

                } else if (i >= current_lease_period) {

                    // Gettting the last date of every succeeding month
                    last_date = getLastDateOfMonth(last_date.getFullYear(), last_date.getMonth());

                    historical_values.push({
                        "custpage_year": year,
                        "custpage_lease_period": i,
                        "custpage_true_billing_date": getFifthOfTheMonth(last_date.toLocaleDateString()),
                        "custpage_billing_date": last_date.toLocaleDateString(),
                        "custpage_rental_escalation": i > 12 ? rental_escalation : null,
                        "custpage_fixed_basic_rent": fixed_basic_rent,
                        "custpage_escalated_basic_rent": ebr || fixed_basic_rent,
                        "custpage_fixed_cusa": fixed_cusa,
                        "custpage_cusa_escalation": i > 12 ? cusa_escalation : null,
                        "custpage_escalated_cusa": ec || fixed_cusa,
                        "custpage_fixed_sec_dep": fixed_security_deposit,
                        "custpage_adj_sec_dep": adjusted_security_deposit,
                        "custpage_sec_dep_adj": sda,
                    });

                    last_date = getLastDateOfMonth(last_date.getFullYear(), last_date.getMonth() + 1);

                }

                if (isNewYear(i + 1)) {

                    // Make the escalated basic rent as the new basic rent
                    // every year end
                    basic_rent = escalated_basic_rent;

                    cusa_rent = ec;

                }

            }

            return JSON.stringify(historical_values);

        }

        function generateBillingSchedule(newRecord) {

            var so_rec = record.load({
                type: newRecord.type,
                id: newRecord.id,
            });

            var historical_values = JSON.parse(newRecord.getValue(HISTORICAL_VALUES_FIELD_ID));

            try {

                historical_values.forEach((historical_value, line) => {

                    var year = 1;

                    for (var key in historical_value) {

                        year = parseInt(historical_value['custpage_year']);

                        var period = parseInt(historical_value['custpage_lease_period']);

                        var field = escalationFieldMapfield(key);

                        var value = historical_value[key];

                        if ((key === 'custpage_fixed_sec_dep' || key === 'custpage_adj_sec_dep' || key === 'custpage_sec_dep_adj') && !isNewYear(period)) {
                            continue;
                        }

                        if ((key === 'custpage_rental_escalation' || key === 'custpage_cusa_escalation') && year === 1) {
                            continue;
                        }

                        log.debug('key:field:flag', key + ' : ' + field + ' : ' + (field === 'custpage_billing_start_date' || field === 'custrecord_xrc_esc_sched_billing_date' || field === 'custrecord_xrc_bes_billing_date'));

                        if (field === 'custrecord_xrc_billing_start_date' || field === 'custrecord_xrc_esc_sched_billing_date' || field === 'custrecord_xrc_bes_billing_date') {

                            value = format.parse({
                                value: formatDateToMMDDYYYY(value),
                                type: format.Type.DATE
                            });

                        }

                        so_rec.setSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: field,
                            value: value,
                            line: line,
                        });

                    }

                    var initial_values = getInitialValues(so_rec, year);

                    for (var key in initial_values) {

                        so_rec.setSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: key,
                            value: initial_values[key],
                            line: line
                        });

                    }

                });

            } catch (error) {

                log.debug('error', error);

            }

            so_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function getInitialValues(so_rec, year) {

            var next_escalation_date = getNextEscalationDate(so_rec.id, year);

            var initial_values = {
                [BSCHED_TENANT_FIELD_ID]: so_rec.getValue(TENANT_FIELD_ID),
                [BSCHED_SUBSIDIARY_FIELD_ID]: so_rec.getValue(SUBSIDIARY_FIELD_ID),
                [BSCHED_LOCATION_FIELD_ID]: so_rec.getValue(LOCATION_FIELD_ID),
                [BSCHED_DEPARTMENT_FIELD_ID]: so_rec.getValue(DEPARTMENT_FIELD_ID),
                [BSCHED_CLASS_FIELD_ID]: so_rec.getValue(CLASS_FIELD_ID),
                [BSCHED_LEASE_TYPE_FIELD_ID]: so_rec.getValue(LEASE_TYPE_FIELD_ID),
                [BSCHED_INTEREST_RATE_FIELD_ID]: so_rec.getValue(INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID),
                [BSCHED_NEXT_ESCALATION_DATE_FIELD_ID]: next_escalation_date,
            };

            return initial_values;

        }

        function getNextEscalationDate(lm_id, year) {

            // Create search to retrieve next escalation schedule
            var bill_schedule_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_estimate", "anyof", lm_id],
                        "AND",
                        ["formulanumeric: MOD(({custrecord_xrc_esc_sched_lease_period} - 1), 12)", "equalto", "0"],
                        "AND",
                        ["custrecord_xrc_esc_sched_year", "equalto", year]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_esc_sched_year", label: "Year" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Date" })
                    ]
            });

            var bill_schedule_search_results = bill_schedule_search.run().getRange({
                start: 0,
                end: 1000,
            });

            return bill_schedule_search_results[0]?.getValue('custrecord_xrc_esc_sched_billing_date');
        }

        function updateHistoricalValues(newRecord) {

            // Defining a list of ids from Escalation Schedule sublist
            var ids = ['custpage_year', 'custpage_lease_period', 'custpage_true_billing_date', 'custpage_billing_start_date', 'custpage_billing_date', 'custpage_rental_escalation', 'custpage_fixed_basic_rent', 'custpage_escalated_basic_rent', 'custpage_cusa_escalation', 'custpage_escalated_cusa', 'custpage_fixed_cusa', 'custpage_fixed_sec_dep', 'custpage_adj_sec_dep', 'custpage_sec_dep_adj'];

            var esc_lines = newRecord.getLineCount({
                sublistId: 'custpage_escalation_schedule',
            });

            var values = [];

            for (var line = 0; line < esc_lines; line++) {

                // Each line of escalation schedule is 1 data object
                var data = {};

                ids.forEach(id => {

                    var value = newRecord.getSublistValue({
                        sublistId: 'custpage_escalation_schedule',
                        fieldId: id,
                        line: line,
                    });

                    data[id] = value;

                });

                values.push(data);

            }

            return JSON.stringify(values);

        }

        function escalationFieldMapfield(key) {

            var fields = {
                "custpage_year": "custrecord_xrc_esc_sched_year",
                "custpage_lease_period": "custrecord_xrc_esc_sched_lease_period",
                "custpage_true_billing_date": "custrecord_xrc_bes_billing_date",
                "custpage_billing_start_date": "custrecord_xrc_billing_start_date",
                "custpage_billing_date": "custrecord_xrc_esc_sched_billing_date",
                "custpage_rental_escalation": "custrecord_xrc_esc_sched_rental_esc",
                "custpage_fixed_basic_rent": "custrecord_xrc_esc_sched_fixd_basic_rent",
                "custpage_escalated_basic_rent": "custrecord_xrc_esc_sched_esc_basic_rent",
                "custpage_fixed_cusa": "custrecord_xrc_esc_sched_fixed_cusa",
                "custpage_cusa_escalation": "custrecord_xrc_esc_sched_cusa_esc_prcnt",
                "custpage_escalated_cusa": "custrecord_xrc_esc_sched_esc_cusa",
                "custpage_fixed_sec_dep": "custrecord_xrc_esc_sched_fxd_sec_dep",
                "custpage_adj_sec_dep": "custrecord_xrc_esc_sched_adj_sec_dep",
                "custpage_sec_dep_adj": "custrecord_xrc_esc_sched_sec_dep_adj",
            };

            return fields[key];
        }

        function getProRatedRent(basic_rent, last_date, day) {

            var month_last_date = last_date.getDate();

            return basic_rent * (day / month_last_date);

        }

        function hideSublistFields(form) {

            [
                'custrecord_xrc_tenant7', 'custrecord_xrc_subsidiary7', 'custrecord_xrc_loc7',
                'custrecord_xrc_dept7', 'custrecord_xrc_class7', 'custrecord_xrc_lease_type7',
                'custrecord_xrc_bes_interestrate', 'custrecord_xrc_next_esc_sched', 'custrecord_xrc_rent_item_code',
                'custrecord_xrc_variable_rent_item_code', 'custrecord_xrc_admin_fee_item_code', 'custrecord_xrc_aircon_charge_item_code',
                'custrecord_xrc_bioaugmentation_item_code', 'custrecord_xrc_cusa_item_code', 'custrecord_xrc_elec_charge_item_code',
                'custrecord_xrc_water_charge_item_code', 'custrecord_xrc_bottled_water', 'custrecord_xrc_lpg_charge_item_code',
                'custrecord_xrc_genset_charge_item_code', 'custrecord_xrc_msf_item_code', 'custrecord_xrc_service_req_item_code',
                'custrecord_xrc_lateop_earlyclose_item', 'custrecord_xrc_pest_control_item_code', 'custrecord_xrc_pest_control_item_code',
                'custrecord_xrc_lateop_earlyclose_item', 'custrecord_xrc_pest_control_item_code', 'custrecord_xrc_tenant_violation_item',
                'custrecord_xrc_cgl_ins_item_code', 'custrecord_xrc_id_charge_item_code', 'custrecord_xrc_penalty_late_close_item',
                'custrecord_xrc_bes_pen_unpaid_itemcode', 'custrecord_xrc_prepared_by7',
            ].forEach(field => {

                // Hiding asset and expense account columns
                // form.getSublist({
                //     id: 'recmachcustrecord_xrc_esc_sched_estimate'
                // }).getField({
                //     id: field
                // }).updateDisplayType({
                //     displayType: serverWidget.FieldDisplayType.HIDDEN
                // });

            });
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

            log.debug('params', [id, tran_id, subsidiary, recipients, type]);

            var fromEmail = getEmailSender(subsidiary);

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

            // log.debug('body', body);

            // email.send({
            //     author: fromEmail,
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

        function formatDateToMMDDYYYY(input) {
            const parts = input.split('/');
            if (parts.length !== 3) return 'Invalid date format';

            let [month, day, year] = parts;
            month = month.padStart(2, '0');
            day = day.padStart(2, '0');

            return `${month}/${day}/${year}`;
        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);