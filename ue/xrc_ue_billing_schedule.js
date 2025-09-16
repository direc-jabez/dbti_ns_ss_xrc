/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 21, 2024
 * 
 */
define(['N/search', 'N/record', 'N/redirect', 'N/runtime', 'N/format'],

    function (search, record, redirect, runtime, format) {

        const BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID = 'customrecord_xrc_escalation_schedule';
        const LEASE_MEMORANDUM_FIELD_ID = 'custrecord_xrc_esc_sched_estimate';
        const TENANT_FIELD_ID = 'custrecord_xrc_tenant7';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary7';
        const LOCATION_FIELD_ID = 'custrecord_xrc_loc7';
        const DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept7';
        const CLASS_FIELD_ID = 'custrecord_xrc_class7';
        const LEASE_TYPE_FIELD_ID = 'custrecord_xrc_lease_type7';
        const INTEREST_RATE_FIELD_ID = 'custrecord_xrc_bes_interestrate';
        const FIXED_LEASE_TYPE = '1';
        const VARIABLE_LEASE_TYPE = '2';
        const ESCALATED_BASIC_RENT_FIELD_ID = 'custrecord_xrc_esc_sched_esc_basic_rent';
        const VARIABLE_RENT_FIELD_ID = 'custrecord_xrc_variable_rent';
        const LM_TENANT_FIELD_ID = 'entity';
        const LM_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LM_LOCATION_FIELD_ID = 'location';
        const LM_DEPARTMENT_FIELD_ID = 'department';
        const LM_CLASS_FIELD_ID = 'class';
        const LM_LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
        const LM_INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_interest_rate_unpaid';
        const LM_AIRCON_CHARGES_FIELD_ID = 'custbody_xrc_aircon_charge';
        const LM_MARKETING_SUPPORT_FUND_FIELD_ID = 'custbody_xrc_mktg_supp_fund';
        const LM_ELECTRICAL_CHARGES_FIELD_ID = 'custbody_xrc_electrical_charges';
        const LM_MIN_ELECTRICAL_CHARGES_FIELD_ID = 'custbody_xrc_min_elect_charges';
        const LM_WATER_CHARGES_FIELD_ID = 'custbody_xrc_water_charges';
        const LM_MIN_WATER_CHARGES_FIELD_ID = 'custbody_xrc_min_water_charges';
        const VIEWED_FIELD_ID = 'custrecord_xrc_esc_sched_viewed';
        const YEAR_FIELD_ID = 'custrecord_xrc_esc_sched_year';
        const NEXT_ESCALATION_DATE_FIELD_ID = 'custrecord_xrc_next_esc_sched';
        const STATUS_FIELD_ID = 'custrecord_xrc_status7';
        const STATUS_PENDING_APPROVAL_ID = '1';
        const STATUS_APPROVED_ID = '2';
        const STATUS_REJECTED_ID = '3';
        const BSCHED_SOA_FIELD_ID = 'custrecord_xrc_soa_num';
        const AIRCON_CHARGES_FIELD_ID = 'custrecord_xrc_aircon_charges';
        const MARKETING_SUPPORT_FUND_FIELD_ID = 'custrecord_xrc_msf7';
        const ELECTRICAL_CHARGES_FIELD_ID = 'custrecord_xrc_lm_bes_elec_charge';
        const ELECTRICT_MIN_CHARGES_FIELD_ID = 'custrecord_xrc_elec_min_charge';
        const WATER_CHARGES_FIELD_ID = 'custrecord_xrc_bes_water_charges';
        const WATER_MIN_CHARGES_FIELD_ID = 'custrecord_xrc_bes_water_min';
        const VARIABLE_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_variable_rent_item_code';
        const FIXED_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_rent_item_code';
        const ADMIN_FEE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_admin_fee_item_code';
        const AIRCON_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_aircon_charge_item_code';
        const BIOAUGMENTATION_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bioaugmentation_item_code';
        const CUSA_ITEM_CODE_FIELD_ID = 'custrecord_xrc_cusa_item_code';
        const ELECTRICITY_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_elec_charge_item_code';
        const WATER_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_water_charge_item_code';
        const BOTTLED_WATER_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bottled_water';
        const LPG_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_lpg_charge_item_code';
        const GEN_SET_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_genset_charge_item_code';
        const MSF_ITEM_CODE_FIELD_ID = 'custrecord_xrc_msf_item_code';
        const SERVICE_REQUEST_ITEM_CODE_FIELD_ID = 'custrecord_xrc_service_req_item_code';
        const LATE_OPENING_EARLY_CLOSING_ITEM_CODE_FIELD_ID = 'custrecord_xrc_lateop_earlyclose_item';
        const PEST_CONTROL_ITEM_CODE_FIELD_ID = 'custrecord_xrc_pest_control_item_code';
        const TENANT_VIOLATION_ITEM_CODE_FIELD_ID = 'custrecord_xrc_tenant_violation_item';
        const CGL_INSURANCE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_cgl_ins_item_code';
        const ID_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_id_charge_item_code';
        const PENALTY_FOR_LATE_CLOSING_ITEM_CODE_FIELD_ID = 'custrecord_xrc_penalty_late_close_item';
        const SECURITY_DEPOSIT_ADJUSTMENT_FIELD_ID = 'custrecord_xrc_esc_sched_sec_dep_adj';
        const ITEMS_SUBLIST_ID = 'item';
        const BILL_SCHED_FIELD_ID = 'custbody_xrc_bill_sched_link';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const INV_BILLING_PERIOD_START_DATE_FIELD_ID = 'custbody_xrc_bill_period_start_date';
        const INV_BILLING_PERIOD_END_DATE_FIELD_ID = 'custbody_xrc_billing_end_date';
        const INV_TOTAL_FIELD_ID = 'total';
        const INV_DATE_FIELD_ID = 'trandate';
        const BILLING_DATE_FIELD_ID = 'custrecord_xrc_esc_sched_billing_date';
        const BILLING_PERIOD_START_DATE_FIELD_ID = 'custrecord_xrc_billing_start_date';
        const PENALTY_FOR_UNPAID_BAL_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bes_pen_unpaid_itemcode';
        const SOA_AMOUNT_FIELD_ID = 'custrecord_xrc_bes_soa_amount';
        const SOA_UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_bes_unpaid_bal';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_bes_for_approval';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by7';
        const APPROVAL_ONE_FIELD_ID = 'custrecord_xrc_bes_approval1';
        const APPROVAL_TWO_FIELD_ID = 'custrecord_xrc_bes_approval2';
        const BSCHED_UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_bes_unpaidbal';
        const BSCHED_UNPAID_BALANCE_AS_OF_FIELD_ID = 'custrecord_xrc_bes_unpaidbal_asof';
        const BSCHED_PENALTY_FOR_UNPAID_BALANCE_FIELD_ID = 'custrecord_xrc_bes_penalty_unpaidbal';
        const UTILITIES_UPLOADED_FIELD_ID = 'custrecord_xrc_bes_utilities_uploaded';
        const OTHER_CHARGES_UPLOADED_FIELD_ID = 'custrecord_xrc_bes_othr_charges_uploaded';
        const CHECKED_FIELD_ID = 'custrecord_xrc_esc_sched_checked';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            form.clientScriptModulePath = './xrc_cs_billing_schedule.js';

            try {

                var currentUser = runtime.getCurrentUser();

                var approval_status = newRecord.getValue(STATUS_FIELD_ID);

                var lm_id = newRecord.getValue(LEASE_MEMORANDUM_FIELD_ID); // Lease memorandum ID

                if (context.type === context.UserEventType.VIEW) {

                    var checked = newRecord.getValue(CHECKED_FIELD_ID);

                    var utilities_uploaded = newRecord.getValue(UTILITIES_UPLOADED_FIELD_ID);

                    var other_charges_uploaded = newRecord.getValue(OTHER_CHARGES_UPLOADED_FIELD_ID);

                    if (!checked) {

                        // Adding button Submit for Aprpoval
                        form.addButton({
                            id: 'custpage_bsched_checked',
                            label: 'Checked',
                            functionName: 'onCheckedBtnClick()',
                        });

                    } else if (utilities_uploaded && other_charges_uploaded) {

                        var sec_dep_adj = newRecord.getValue(SECURITY_DEPOSIT_ADJUSTMENT_FIELD_ID);

                        if (sec_dep_adj) {

                            // If Security Deposit Adjustment has value
                            form.addButton({
                                id: 'custpage_bsched_deposit',
                                label: 'Deposit',
                                functionName: 'onDepositBtnClick()',
                            });

                        }

                        var soa = newRecord.getValue(BSCHED_SOA_FIELD_ID);

                        // if (!soa) {

                        form.addButton({
                            id: 'custpage_bsched_invoice',
                            label: 'Invoice',
                            functionName: 'onInvoiceBtnClick("' + lm_id + '")',
                        });

                        // }

                    }
                }

                if (!lm_id) return;

                var fieldLookUp = search.lookupFields({
                    type: record.Type.SALES_ORDER,
                    id: lm_id,
                    columns: [
                        LM_TENANT_FIELD_ID,
                        LM_SUBSIDIARY_FIELD_ID,
                        LM_LOCATION_FIELD_ID,
                        LM_DEPARTMENT_FIELD_ID,
                        LM_CLASS_FIELD_ID,
                        LM_LEASE_TYPE_FIELD_ID,
                        LM_INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID,
                        LM_AIRCON_CHARGES_FIELD_ID,
                        LM_MARKETING_SUPPORT_FUND_FIELD_ID,
                        LM_ELECTRICAL_CHARGES_FIELD_ID,
                        LM_MIN_ELECTRICAL_CHARGES_FIELD_ID,
                        LM_WATER_CHARGES_FIELD_ID,
                        LM_MIN_WATER_CHARGES_FIELD_ID
                    ],
                });

                var billing_date = newRecord.getValue(BILLING_DATE_FIELD_ID);

                var next_escalation_date = getNextEscalationDate(newRecord);

                if (newRecord.getValue(VIEWED_FIELD_ID)) return;

                var tenant_id = fieldLookUp[LM_TENANT_FIELD_ID][0]?.value;

                var interest_rate = fieldLookUp[LM_INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID];

                var values = {
                    [VIEWED_FIELD_ID]: true,
                    [NEXT_ESCALATION_DATE_FIELD_ID]: next_escalation_date,
                    [AIRCON_CHARGES_FIELD_ID]: fieldLookUp[LM_AIRCON_CHARGES_FIELD_ID],
                };

                var billing_date = newRecord.getValue(BILLING_DATE_FIELD_ID);

                if (isJanuary(billing_date)) {
                    values = {
                        ...values,
                        [MARKETING_SUPPORT_FUND_FIELD_ID]: fieldLookUp[LM_MARKETING_SUPPORT_FUND_FIELD_ID]
                    };
                }

                values = {
                    ...values,
                    [ELECTRICAL_CHARGES_FIELD_ID]: fieldLookUp[LM_ELECTRICAL_CHARGES_FIELD_ID][0]?.value,
                    [ELECTRICT_MIN_CHARGES_FIELD_ID]: fieldLookUp[LM_MIN_ELECTRICAL_CHARGES_FIELD_ID],
                    [WATER_CHARGES_FIELD_ID]: fieldLookUp[LM_MIN_WATER_CHARGES_FIELD_ID][0]?.value,
                    [WATER_MIN_CHARGES_FIELD_ID]: fieldLookUp[LM_MIN_WATER_CHARGES_FIELD_ID],
                };

                values = updateUnpaidBalanceAsOfThisMonth(values, lm_id, billing_date.toLocaleDateString(), interest_rate);

                record.submitFields({
                    type: BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID,
                    id: newRecord.id, // Billing schedule id
                    values: values,
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                // Redirect to the current record (reloading the page)
                redirect.toRecord({
                    type: BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID,
                    id: newRecord.id,
                });

            } catch (error) {

                log.debug('error', error);

            }

        }

        function afterSubmit(context) {

            var currentUser = runtime.getCurrentUser();

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.EDIT) {

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!prepared_by) {

                    // record.submitFields({
                    //     type: newRecord.type,
                    //     id: newRecord.id,
                    //     values: {
                    //         [PREPARED_BY_FIELD_ID]: currentUser.id,
                    //     },
                    // });

                }

            }

        }

        function getNextEscalationDate(newRecord) {

            var lm_id = newRecord.getValue(LEASE_MEMORANDUM_FIELD_ID);

            var year = newRecord.getValue(YEAR_FIELD_ID) + 1;

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

        function createInvoice(newRecord) {

            // Transform Lease Memorandum to an Invoice
            var invoice_rec = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: newRecord.getValue(LEASE_MEMORANDUM_FIELD_ID), // Id of Lease Memo
                toType: record.Type.INVOICE,
                isDynamic: true,
            });

            invoice_rec.setValue(INV_DATE_FIELD_ID, newRecord.getValue(BILLING_DATE_FIELD_ID));

            invoice_rec.setValue(INV_BILLING_PERIOD_START_DATE_FIELD_ID, newRecord.getValue(BILLING_PERIOD_START_DATE_FIELD_ID));

            invoice_rec.setValue(INV_BILLING_PERIOD_END_DATE_FIELD_ID, newRecord.getValue(BILLING_DATE_FIELD_ID));

            invoice_rec.selectLine({
                sublistId: ITEMS_SUBLIST_ID,
                line: 0,
            });

            invoice_rec.setValue(BILL_SCHED_FIELD_ID, newRecord.id);

            invoice_rec.setValue(APPROVAL_STATUS_FIELD_ID, STATUS_APPROVED_ID);

            const items_fields = ['item', 'quantity', 'rate', 'taxcode'];

            var bsched_fields = [];

            var lease_type = newRecord.getValue(LEASE_TYPE_FIELD_ID);

            // Depending on the lease type, add fields to the array (bsched_fields)
            if (lease_type === FIXED_LEASE_TYPE || lease_type === VARIABLE_LEASE_TYPE) {

                lease_type === FIXED_LEASE_TYPE ? bsched_fields.push(['custrecord_xrc_rent_item_code', 'null', 'custrecord_xrc_esc_sched_esc_basic_rent', 'custrecord_xrc_basicrent_vat']) : bsched_fields.push(['custrecord_xrc_variable_rent_item_code', 'null', 'custrecord_xrc_variable_rent', 'custrecord_xrc_basicrent_vat']);

            } else {

                var escalated_basic_rent = newRecord.getValue(ESCALATED_BASIC_RENT_FIELD_ID);

                var variable_rent = newRecord.getValue(VARIABLE_RENT_FIELD_ID);

                escalated_basic_rent > variable_rent ? bsched_fields.push(['custrecord_xrc_rent_item_code', 'null', 'custrecord_xrc_esc_sched_esc_basic_rent', 'custrecord_xrc_basicrent_vat']) : bsched_fields.push(['custrecord_xrc_variable_rent_item_code', 'null', 'custrecord_xrc_variable_rent', 'custrecord_xrc_basicrent_vat']);
            }

            // Pushing all the fields in the array
            bsched_fields.push(
                ['custrecord_xrc_cusa_item_code', 'null', 'custrecord_xrc_esc_sched_esc_cusa'],
                ['custrecord_xrc_elec_charge_item_code', 'custrecord_xrc_electricity_kwh', 'custrecord_xrc_elec_rate'],
                ['custrecord_xrc_water_charge_item_code', 'custrecord_xrc_water_m3', 'custrecord_xrc_water_rate'],
                ['custrecord_xrc_bottled_water', 'custrecord_xrc_bottled_water_qty', 'custrecord_xrc_bottled_water_salesprice'],
                ['custrecord_xrc_lpg_charge_item_code', 'custrecord_xrc_lpg_consumption_kg', 'custrecord_xrc_consumption_rate'],
                ['custrecord_xrc_genset_charge_item_code', 'custrecord_xrc_genset_consumpt_kwh', 'custrecord_xrc_genset_consumpt_rate'],
                ['custrecord_xrc_aircon_charge_item_code', 'null', 'custrecord_xrc_aircon_charges'],
                ['custrecord_xrc_admin_fee_item_code', 'null', 'custrecord_xrc_admin_fee'],
                ['custrecord_xrc_cgl_ins_item_code', 'null', 'custrecord_xrc_cgl_insurance'],
                ['custrecord_xrc_id_charge_item_code', 'null', 'custrecord_xrc_id_charges'],
                ['custrecord_xrc_lateop_earlyclose_item', 'null', 'custrecord_xrc_late_op_early_close'],
                ['custrecord_xrc_msf_item_code', 'null', 'custrecord_xrc_msf7'],
                ['custrecord_xrc_pest_control_item_code', 'null', 'custrecord_xrc_pest_control'],
                ['custrecord_xrc_service_req_item_code', 'null', 'custrecord_xrc_service_req'],
                ['custrecord_xrc_tenant_violation_item', 'null', 'custrecord_xrc_tenant_violation'],
                ['custrecord_xrc_bioaugmentation_item_code', 'null', 'custrecord_xrc_bioaugmentation'],
                ['custrecord_xrc_penalty_late_close_item', 'null', 'custrecord_xrc_penalty_for_late_closing'],
                ['custrecord_xrc_add_charge1_item_code', 'custrecord_xrc_add_charge1_qty', 'custrecord_xrc_add_charge1_rate'],
                ['custrecord_xrc_add_charge2_item_code', 'custrecord_xrc_add_charge2_qty', 'custrecord_xrc_add_charge2_rate'],
                ['custrecord_xrc_add_charge3_item_code', 'custrecord_xrc_add_charge3_qty', 'custrecord_xrc_add_charge3_rate'],
                ['custrecord_xrc_bes_pen_unpaid_itemcode', 'null', 'custrecord_xrc_bes_penalty_unpaidbal'],
            );

            bsched_fields.forEach((fields, index) => {

                try {

                    var amount = newRecord.getValue(fields[2]);

                    if (amount) {

                        fields.forEach((field, index) => {

                            var value = newRecord.getValue(field);

                            invoice_rec.setCurrentSublistValue({
                                sublistId: ITEMS_SUBLIST_ID,
                                fieldId: items_fields[index],
                                value: value || 1, // 1 indicates a default quantity
                                forceSyncSourcing: true,
                            });

                        });

                        invoice_rec.commitLine({
                            sublistId: ITEMS_SUBLIST_ID,
                        });

                    }

                } catch (error) {

                    log.debug('error', error + '\n' + 'at index ' + index);

                }

            });

            var inv_id = invoice_rec.save({
                ignoreMandatoryFields: true,
            });

            record.submitFields({
                type: BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID,
                id: newRecord.id,
                values: {
                    [BSCHED_SOA_FIELD_ID]: inv_id,
                    [SOA_AMOUNT_FIELD_ID]: invoice_rec.getValue(INV_TOTAL_FIELD_ID),
                    [SOA_UNPAID_BALANCE_FIELD_ID]: invoice_rec.getValue(INV_TOTAL_FIELD_ID),
                },
                options: {
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                }
            });
        }


        function updateUnpaidBalanceAsOfThisMonth(values, so_id, date, interest_rate) {

            try {
                var bsched_search = createBillingScheduleSearch(so_id, date);

                var lease_period = 0;

                bsched_search.run().each(function (result) {

                    bsched_id = result.id; // Internal ID of Billing Schedule for the current month

                    lease_period = result.getValue('custrecord_xrc_esc_sched_lease_period'); // Lease period of Billing Schedule for the current month

                    interest_rate = parseFloat((result.getValue('custrecord_xrc_bes_interestrate'))); // Interest Rate of Billing Schedule for the current month

                    return true;
                });

                var bsched_search_with_unpaid_balance = createBillingScheduleWithUnpaidBalance(so_id, lease_period);

                var unpaid_balance = 0;

                var unpaid_balance_as_of = '';

                var counter = 0;

                bsched_search_with_unpaid_balance.run().each(function (result) {

                    // if (counter === 0) {

                    unpaid_balance_as_of = result.getValue("custrecord_xrc_esc_sched_billing_date");

                    // }

                    unpaid_balance += parseFloat(result.getValue("custrecord_xrc_bes_unpaid_bal"));

                    counter += 1;

                    return true;
                });

                var penalty = unpaid_balance * (parseFloat(interest_rate) / 100);

                var parsed_date = format.parse({
                    value: unpaid_balance_as_of,
                    type: format.Type.DATE
                });

                values[BSCHED_UNPAID_BALANCE_AS_OF_FIELD_ID] = parsed_date;
                values[BSCHED_UNPAID_BALANCE_FIELD_ID] = unpaid_balance;
                values[BSCHED_PENALTY_FOR_UNPAID_BALANCE_FIELD_ID] = penalty;

            } catch (error) {

            }

            return values;

        }

        // Search for Billing Schedule for the current month
        function createBillingScheduleSearch(so_id, date) {

            log.debug('params', [so_id, date]);

            // Creating Billing Schedule search that Billing Date 
            // is within the current month
            var bsched_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_estimate", "anyof", so_id],
                        "AND",
                        ["custrecord_xrc_esc_sched_billing_date", "on", date]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Date" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_lease_period", label: "Lease Period" }),
                        search.createColumn({ name: "custrecord_xrc_bes_interestrate", label: "Interest Rate" }),
                    ]
            });

            return bsched_search;

        }

        function createBillingScheduleWithUnpaidBalance(so_id, lease_period) {

            // Creating Billing Schedule search that returns
            // Unpaid Balance of previous periods
            var bsched_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_estimate", "anyof", so_id],
                        "AND",
                        ["formulanumeric: " + lease_period + "-{custrecord_xrc_esc_sched_lease_period}", "greaterthan", "1"],
                        "AND",
                        ["custrecord_xrc_bes_unpaid_bal", "greaterthan", "0.00"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_esc_sched_lease_period", label: "Lease Period" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Period End Date" }),
                        search.createColumn({ name: "custrecord_xrc_bes_unpaid_bal", label: "SOA Unpaid Balance" }),
                    ]
            });

            return bsched_search;

        }

        function isJanuary(date) {
            // getMonth() returns 0 for January, 1 for February, etc.
            return date.getMonth() === 0;
        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);