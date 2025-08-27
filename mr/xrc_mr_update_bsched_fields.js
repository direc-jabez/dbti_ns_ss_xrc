/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        const BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID = 'customrecord_xrc_escalation_schedule';
        const TENANT_FIELD_ID = 'custrecord_xrc_tenant7';
        const CURRENT_BILLING_FIELD_ID = 'custrecord_xrc_current_billing';
        const BALANCE_DUE_FIELD_ID = 'custrecord_xrc_bsched_balance_due';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary7';
        const LOCATION_FIELD_ID = 'custrecord_xrc_loc7';
        const DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept7';
        const CLASS_FIELD_ID = 'custrecord_xrc_class7';
        const LEASE_TYPE_FIELD_ID = 'custrecord_xrc_lease_type7';
        const INTEREST_RATE_FIELD_ID = 'custrecord_xrc_bes_interestrate';
        const LM_TENANT_FIELD_ID = 'entity';
        const LM_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LM_LOCATION_FIELD_ID = 'location';
        const LM_DEPARTMENT_FIELD_ID = 'department';
        const LM_CLASS_FIELD_ID = 'class';
        const LM_LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
        const LM_INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_interest_rate_unpaid';
        const VIEWED_FIELD_ID = 'custrecord_xrc_esc_sched_viewed';
        const NEXT_ESCALATION_DATE_FIELD_ID = 'custrecord_xrc_next_esc_sched';
        const FIXED_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_rent_item_code';
        const FIXED_RENT_VAT_AMOUNT_FIELD_ID = 'custrecord_xrc_basicrent_vat_amt';
        const FIXED_RENT_GROSS_AMOUNT_FIELD_ID = 'custrecord_xrc_basicrent_gross_amt';
        const FIXED_RENT_WHT_AMOUNT_FIELD_ID = 'custrecord_xrc_basicrent_wht_amt';
        const CUSA_VAT_AMOUNT_FIELD_ID = 'custrecord_xrc_cusa_vatamt';
        const CUSA_GROSS_AMOUNT_FIELD_ID = 'custrecord_xrc_cusa_grossamt';
        const CUSA_WHT_AMOUNT_FIELD_ID = 'custrecord_xrc_cusa_whtamt';
        const VARIABLE_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_variable_rent_item_code';
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
        const CUSTOMER_DEFAULT_TAX_CODE_FIELD_ID = 'taxitem';
        const CUSTOMER_TENANT_WHT_FIELD_ID = 'custentity_xrc_tenant_wht';
        const TAX_RATE_FIELD_ID = 'rate';
        const TENANT_WHT_RECORD_TYPE = 'customrecord_xrc_tenant_wht';
        const BILLING_PERIOD_START_DATE_FIELD_ID = 'custrecord_xrc_billing_start_date';
        const PENALTY_FOR_UNPAID_BAL_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bes_pen_unpaid_itemcode';
        const INITIAL_CHARGES_FIELD_ID = 'custrecord_xrc_bsched_initial_charges';
        const TOTAL_VAT_AMOUNT_FIELD_ID = 'custrecord_xrc_bsched_total_vat_amt';
        const TOTAL_WHT_FIELD_ID = 'custrecord_xrc_bsched_total_wht';


        function getInputData(context) {

            return createBillingScheduleSearch();

        }

        function reduce(context) {

            try {

                var result = JSON.parse(context.values);

                var lm_id = result.values['custrecord_xrc_esc_sched_estimate'].value; // Lease memorandum ID

                if (!lm_id) return;

                var fieldLookUp = search.lookupFields({
                    type: record.Type.SALES_ORDER,
                    id: lm_id,
                    columns: [
                        LM_TENANT_FIELD_ID, LM_SUBSIDIARY_FIELD_ID, LM_LOCATION_FIELD_ID,
                        LM_DEPARTMENT_FIELD_ID, LM_CLASS_FIELD_ID, LM_LEASE_TYPE_FIELD_ID,
                        LM_INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID
                    ],
                });

                var billing_date_year = parseInt(result.values['custrecord_xrc_esc_sched_billing_date'].split('/')[2]);

                var billing_date_month = parseInt(result.values['custrecord_xrc_esc_sched_billing_date'].split('/')[0]);

                var year = parseInt(result.values['custrecord_xrc_esc_sched_year']) + 1;

                var escalated_basic_rent = parseFloat(result.values['custrecord_xrc_esc_sched_esc_basic_rent']);

                var escalated_cusa = parseFloat(result.values['custrecord_xrc_esc_sched_esc_cusa']);

                var next_escalation_date = getNextEscalationDate(lm_id, year);

                var tenant_id = fieldLookUp[LM_TENANT_FIELD_ID][0]?.value;

                var interest_rate = fieldLookUp[LM_INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID];

                var values = {
                    [TENANT_FIELD_ID]: tenant_id,
                    [SUBSIDIARY_FIELD_ID]: fieldLookUp[LM_SUBSIDIARY_FIELD_ID][0]?.value || null,
                    [LOCATION_FIELD_ID]: fieldLookUp[LM_LOCATION_FIELD_ID][0]?.value || null,
                    [DEPARTMENT_FIELD_ID]: fieldLookUp[LM_DEPARTMENT_FIELD_ID][0]?.value || null,
                    [CLASS_FIELD_ID]: fieldLookUp[LM_CLASS_FIELD_ID][0]?.value || null,
                    [LEASE_TYPE_FIELD_ID]: fieldLookUp[LM_LEASE_TYPE_FIELD_ID][0]?.value || null,
                    [INTEREST_RATE_FIELD_ID]: interest_rate,
                    [NEXT_ESCALATION_DATE_FIELD_ID]: next_escalation_date,
                    [FIXED_RENT_ITEM_CODE_FIELD_ID]: 5233, // This and succeeding numbers represents the internal id of the items 
                    [VARIABLE_RENT_ITEM_CODE_FIELD_ID]: 5255,
                    [ADMIN_FEE_ITEM_CODE_FIELD_ID]: 5251,
                    [AIRCON_CHARGE_ITEM_CODE_FIELD_ID]: 5235,
                    [BIOAUGMENTATION_ITEM_CODE_FIELD_ID]: 5245,
                    [CUSA_ITEM_CODE_FIELD_ID]: 5234,
                    [ELECTRICITY_CHARGE_ITEM_CODE_FIELD_ID]: 5236,
                    [WATER_CHARGE_ITEM_CODE_FIELD_ID]: 5237,
                    [BOTTLED_WATER_ITEM_CODE_FIELD_ID]: 5345,
                    [LPG_CHARGE_ITEM_CODE_FIELD_ID]: 5238,
                    [GEN_SET_CHARGE_ITEM_CODE_FIELD_ID]: 5239,
                    [MSF_ITEM_CODE_FIELD_ID]: 5240,
                    [SERVICE_REQUEST_ITEM_CODE_FIELD_ID]: 5241,
                    [LATE_OPENING_EARLY_CLOSING_ITEM_CODE_FIELD_ID]: 5242,
                    [PEST_CONTROL_ITEM_CODE_FIELD_ID]: 5243,
                    [TENANT_VIOLATION_ITEM_CODE_FIELD_ID]: 5244,
                    [CGL_INSURANCE_ITEM_CODE_FIELD_ID]: 5252,
                    [ID_CHARGE_ITEM_CODE_FIELD_ID]: 5253,
                    [PENALTY_FOR_LATE_CLOSING_ITEM_CODE_FIELD_ID]: 5246,
                    [BILLING_PERIOD_START_DATE_FIELD_ID]: getFirstDay(billing_date_year, billing_date_month),
                    [PENALTY_FOR_UNPAID_BAL_ITEM_CODE_FIELD_ID]: 5249,
                    [VIEWED_FIELD_ID]: true,
                };

                // Updating values object
                values = setTaxCodes(escalated_basic_rent, escalated_cusa, result.id, tenant_id, values);

                record.submitFields({
                    type: BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID,
                    id: result.id, // Billing schedule id
                    values: values,
                    options: {
                        ignoreMandatoryFields: true
                    }
                });


            } catch (error) {

                log.debug('error', error);

            }
        }

        function createBillingScheduleSearch() {

            var billing_schedule_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_tenant7", "anyof", "@NONE@"],
                        "AND",
                        ["custrecord_xrc_esc_sched_estimate", "noneof", "@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_xrc_esc_sched_estimate", label: "Sales Order" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Period End Date" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_year", label: "Year" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_esc_basic_rent", label: "Escalated Basic Rent" }),
                        search.createColumn({ name: "custrecord_xrc_esc_sched_esc_cusa", label: "Escalated CUSA" }),
                    ]
            });

            return billing_schedule_search;

        }

        function getFirstDay(year, month) {

            var dateString = year + ((month) <= 9 ? ("-0" + (month)) : ("-" + (month))) + "-01";

            return new Date(dateString);

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
                        search.createColumn({ name: "custrecord_xrc_esc_sched_billing_date", label: "Billing Date" }),
                    ]
            });

            var bill_schedule_search_results = bill_schedule_search.run().getRange({
                start: 0,
                end: 1000,
            });

            return bill_schedule_search_results[0]?.getValue('custrecord_xrc_esc_sched_billing_date');
        }

        function setTaxCodes(escalated_basic_rent, escalated_cusa, bsched_id, tenant_id, values) {

            log.debug('fn setTaxCodes params', [escalated_basic_rent, escalated_cusa, bsched_id, tenant_id, values]);

            try {

                var fieldLookUp = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: tenant_id,
                    columns: [CUSTOMER_DEFAULT_TAX_CODE_FIELD_ID, CUSTOMER_TENANT_WHT_FIELD_ID],
                });

                var tenant_wht = fieldLookUp[CUSTOMER_TENANT_WHT_FIELD_ID][0]?.value || null;

                // Tax ID
                var tax_id = fieldLookUp[CUSTOMER_DEFAULT_TAX_CODE_FIELD_ID][0]?.value || null;

                fieldLookUp = search.lookupFields({
                    type: record.Type.SALES_TAX_ITEM,
                    id: tax_id,
                    columns: [TAX_RATE_FIELD_ID],
                });

                var tax_rate = fieldLookUp[TAX_RATE_FIELD_ID];

                // Vat related fields
                var vat_fields = [
                    'custrecord_xrc_basicrent_vat', 'custrecord_xrc_basicrent_vat_rate', 'custrecord_xrc_water_vatcode', 'custrecord_xrc_water_vatrate',
                    'custrecord_xrc_lateop_vatcode', 'custrecord_xrc_late_op_vatrate', 'custrecord_xrc_lateclosing_vatcode', 'custrecord_xrc_lateclose_vatrate',
                    'custrecord_xrc_variablerent_vat_code', 'custrecord_xrc_variable_vat_rate', 'custrecord_xrc_lpg_vatcode', 'custrecord_xrc_lpg_vatrate',
                    'custrecord_xrc_pescon_vatcode', 'custrecord_xrc_pescon_vatrate', 'custrecord_xrc_cgl_vatcode', 'custrecord_xrc_cgl_vatrate',
                    'custrecord_xrc_cusa_vatcode', 'custrecord_xrc_cusa_vatrate', 'custrecord_xrc_genset_vatcode', 'custrecord_xrc_genset_vatrate',
                    'custrecord_xrc_bottledwater_vatcode', 'custrecord_xrc_bottle_water_vatrate', 'custrecord_xrc_charge1_vatcode', 'custrecord_xrc_charge1_vatrate',
                    'custrecord_xrc_aircon_vatcode', 'custrecord_xrc_aircon_vatrate', 'custrecord_xrc_msf_vatcode', 'custrecord_xrc_msf_vatrate',
                    'custrecord_xrc_tenviolation_vatcode', 'custrecord_xrc_tenant_violation_vatrate', 'custrecord_xrc_charge2_vatcode', 'custrecord_xrc_charge2_vatrate',
                    'custrecord_xrc_elec_vatcode', 'custrecord_xrc_elec_vatrate', 'custrecord_xrc_servreq_vatcode', 'custrecord_xrc_service_req_vatrate',
                    'custrecord_xrc_bioaug_vatcode', 'custrecord_xrc_bioaug_vatrate', 'custrecord_xrc_charge3_vatcode', 'custrecord_xrc_charge3_vatrate',
                    'custrecord_xrc_id_vatcode', 'custrecord_xrc_id_vatrate',
                ];

                var total_vat = 0, total_wht = 0;

                // Setting tax id and tax rate on their respective fields
                for (var i = 0; i < vat_fields.length; i += 2) {

                    values[vat_fields[i]] = tax_id;

                    var tax_rate = parseFloat(tax_rate);

                    values[vat_fields[i + 1]] = tax_rate;

                    if (vat_fields[i] === 'custrecord_xrc_basicrent_vat') {

                        var fixed_rent_vat_amount = escalated_basic_rent * (tax_rate / 100);

                        total_vat += fixed_rent_vat_amount;

                        var fixed_rent_gross_amount = escalated_basic_rent + fixed_rent_vat_amount;

                        values[FIXED_RENT_VAT_AMOUNT_FIELD_ID] = fixed_rent_vat_amount;

                        values[FIXED_RENT_GROSS_AMOUNT_FIELD_ID] = fixed_rent_gross_amount;

                    } else if (vat_fields[i] === 'custrecord_xrc_cusa_vatcode') {

                        var cusa_vat_amount = escalated_cusa * (tax_rate / 100);

                        total_vat += cusa_vat_amount;

                        var cusa_gross_amount = escalated_cusa + cusa_vat_amount;

                        values[CUSA_VAT_AMOUNT_FIELD_ID] = cusa_vat_amount;

                        values[CUSA_GROSS_AMOUNT_FIELD_ID] = cusa_gross_amount;

                    }

                }

                // Vat related fields
                var wht_fields = [
                    'custrecord_xrc_basicrent_wht_code', 'custrecord_xrc_basicrent_wht_rate', 'custrecord_xrc_water_whtcode', 'custrecord_xrc_water_whtrate',
                    'custrecord_xrc_lateop_whtcode', 'custrecord_xrc_lateop_whtrate', 'custrecord_xrc_lateclose_whtcode', 'custrecord_xrc_lateclose_whtrate',
                    'custrecord_xrc_variable_wht_code', 'custrecord_xrc_variable_wht_rate', 'custrecord_xrc_lpg_whtcode', 'custrecord_xrc_lpg_whtrate',
                    'custrecord_xrc_pescon_whtcode', 'custrecord_xrc_pescon_whtrate', 'custrecord_xrc_cgl_whtcode', 'custrecord_xrc_cgl_whtrate',
                    'custrecord_xrc_cusa_whtcode', 'custrecord_xrc_cusa_whtrate', 'custrecord_xrc_genset_whtcode', 'custrecord_xrc_genset_whtrate',
                    'custrecord_xrc_bott_water_whtcode', 'custrecord_xrc_bottled_whtrate', 'custrecord_xrc_charge1_whtcode', 'custrecord_xrc_charge1_whtrate',
                    'custrecord_xrc_aircon_whtcode', 'custrecord_xrc_aircon_whtrate', 'custrecord_xrc_msf_whtcode', 'custrecord_xrc_msf_whtrate',
                    'custrecord_xrc_tenvio_whtcode', 'custrecord_xrc_tenvio_whtrate', 'custrecord_xrc_charge2_whtcode', 'custrecord_xrc_charge2_whtrate',
                    'custrecord_xrc_elec_whtcode', 'custrecord_xrc_elec_whtrate', 'custrecord_xrc_servreq_whtcode', 'custrecord_xrc_servreq_whtrate',
                    'custrecord_xrc_bioaug_whtcode', 'custrecord_xrc_bioaug_whtrate', 'custrecord_xrc_charge3_whtcode', 'custrecord_xrc_charge3_whtrate',
                    'custrecord_xrc_id_whtcode', 'custrecord_xrc_id_whtrate',
                ];

                // Refer to Tenant Withholding Tax custom record
                var tenant_wht_fields = [
                    'custrecord_xrc_tenwht_rent', 'custrecord_xrc_tenwht_rentwht',
                    'custrecord_xrc_tenwht_cusa', 'custrecord_xrc_tenwht_cusawht',
                    'custrecord_xrc_tenwht_aircon', 'custrecord_xrc_tenwht_airconwht',
                    'custrecord_xrc_tenwht_elec', 'custrecord_xrc_tenwht_elecwht',
                    'custrecord_xrc_tenwht_water', 'custrecord_xrc_tenwht_waterwht',
                    'custrecord_xrc_tenwht_lpg', 'custrecord_xrc_tenwht_lpgwht',
                    'custrecord_xrc_tenwht_genset', 'custrecord_xrc_tenwht_gensetwht',
                    'custrecord_xrc_tenwht_msf', 'custrecord_xrc_tenwht_msfwht',
                    'custrecord_xrc_tenwht_serv_req', 'custrecord_xrc_tenwht_servreqwht',
                    'custrecord_xrc_tenwht_late_op', 'custrecord_xrc_tenwht_lateopwht',
                    'custrecord_xrc_tenwht_pest_control', 'custrecord_xrc_tenwht_pestconwht',
                    'custrecord_xrc_tenwht_bottled_water', 'custrecord_xrc_tenwht_bottledwaterwht',
                    'custrecord_xrc_tenwht_tenant_violation', 'custrecord_xrctenwht_tenviowht',
                    'custrecord_xrc_tenwht_bioaug', 'custrecord_xrc_tenwht_bioaugwht',
                    'custrecord_xrc_tenwht_others_bottwater', 'custrecord_xrc_tenwht_othbottwht',
                    'custrecord_xrc_others_mallid', 'custrecord_xrc_tenwht_mallidwht',
                    'custrecord_xrc_tenwht_penalty_late_close', 'custrecord_xrc_tenwht_lateclosewht',
                    'custrecord_xrc_tenwht_cusa', 'custrecord_xrc_tenwht_cusawht',

                ];

                fieldLookUp = search.lookupFields({
                    type: TENANT_WHT_RECORD_TYPE,
                    id: tenant_wht,
                    columns: tenant_wht_fields,
                });

                // Setting whtax id and tax rate on their respective fields
                for (var i = 0; i < wht_fields.length; i += 2) {

                    if ((i + 1) % 2 !== 0) {

                        var wht_code_and_rate = getWHTCodeAndRate(wht_fields[i], fieldLookUp);

                        if (wht_code_and_rate) { // null check

                            values[wht_fields[i]] = wht_code_and_rate[0];
                            values[wht_fields[i + 1]] = parseFloat(wht_code_and_rate[1]);

                            if (wht_fields[i] === 'custrecord_xrc_basicrent_wht_code') {

                                var wht_amount = escalated_basic_rent * (parseFloat(wht_code_and_rate[1]) / 100);

                                values[FIXED_RENT_WHT_AMOUNT_FIELD_ID] = wht_amount;

                                total_wht += wht_amount;

                            } else if (wht_fields[i] === 'custrecord_xrc_cusa_whtcode') {

                                var wht_amount = escalated_cusa * (parseFloat(wht_code_and_rate[1]) / 100);

                                values[CUSA_WHT_AMOUNT_FIELD_ID] = wht_amount;

                                total_wht += wht_amount;

                            }

                        }

                    }

                }

                var initial_charges = getInitialChargesTotal(bsched_id);

                var current_billing = (initial_charges + total_vat); // - total_wht

                values[CURRENT_BILLING_FIELD_ID] = current_billing;

                values[BALANCE_DUE_FIELD_ID] = current_billing;

                values[INITIAL_CHARGES_FIELD_ID] = initial_charges;

                values[TOTAL_VAT_AMOUNT_FIELD_ID] = total_vat;

                values[TOTAL_WHT_FIELD_ID] = total_wht;

                return values;

            } catch (error) {

                log.debug('fn setTaxCodes error', error);

            }
        }
        function getWHTCodeAndRate(charge, fieldLookUp) {

            // Maps fields of Billing/Escalation Schedule against Tenant Withholding Tax
            var charges = {
                'custrecord_xrc_basicrent_wht_code': [fieldLookUp['custrecord_xrc_tenwht_rent'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_rentwht']],
                'custrecord_xrc_water_whtcode': [fieldLookUp['custrecord_xrc_tenwht_water'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_waterwht']],
                'custrecord_xrc_lateop_whtcode': [fieldLookUp['custrecord_xrc_tenwht_late_op'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_lateopwht']],
                'custrecord_xrc_lateclose_whtcode': [fieldLookUp['custrecord_xrc_tenwht_penalty_late_close'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_lateclosewht']],
                'custrecord_xrc_lpg_whtcode': [fieldLookUp['custrecord_xrc_tenwht_lpg'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_lpgwht']],
                'custrecord_xrc_pescon_whtcode': [fieldLookUp['custrecord_xrc_tenwht_pest_control'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_pestconwht']],
                'custrecord_xrc_cusa_whtcode': [fieldLookUp['custrecord_xrc_tenwht_cusa'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_cusawht']],
                'custrecord_xrc_genset_whtcode': [fieldLookUp['custrecord_xrc_tenwht_genset'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_gensetwht']],
                'custrecord_xrc_bott_water_whtcode': [fieldLookUp['custrecord_xrc_tenwht_bottled_water'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_bottledwaterwht']],
                'custrecord_xrc_aircon_whtcode': [fieldLookUp['custrecord_xrc_tenwht_aircon'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_airconwht']],
                'custrecord_xrc_msf_whtcode': [fieldLookUp['custrecord_xrc_tenwht_msf'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_msfwht']],
                'custrecord_xrc_tenvio_whtcode': [fieldLookUp['custrecord_xrc_tenwht_tenant_violation'][0]?.value || null, fieldLookUp['custrecord_xrctenwht_tenviowht']],
                'custrecord_xrc_elec_whtcode': [fieldLookUp['custrecord_xrc_tenwht_elec'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_elecwht']],
                'custrecord_xrc_servreq_whtcode': [fieldLookUp['custrecord_xrc_tenwht_serv_req'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_servreqwht']],
                'custrecord_xrc_bioaug_whtcode': [fieldLookUp['custrecord_xrc_tenwht_bioaug'][0]?.value || null, fieldLookUp['custrecord_xrc_tenwht_bioaugwht']],
            };

            return charges[charge];

        }

        function getInitialChargesTotal(bsched_id) {

            var bsched_record = record.load({
                type: BILLING_SCHEDULE_RECORD_TYPE_FIELD_ID,
                id: bsched_id,
            });

            var total_charges = 0;

            var initial_charges = [
                'custrecord_xrc_esc_sched_esc_basic_rent',
                'custrecord_xrc_variable_rent',
                'custrecord_xrc_esc_sched_esc_cusa',
                'custrecord_xrc_aircon_charges',
                'custrecord_xrc_elec_amount',
                'custrecord_xrc_water_amount',
                'custrecord_xrc_lpg_consumption_amt',
                'custrecord_xrc_genset_consumpt_amt',
                'custrecord_xrc_msf7',
                'custrecord_xrc_service_req',
                'custrecord_xrc_late_op_early_close',
                'custrecord_xrc_pest_control',
                'custrecord_xrc_bottled_water_amount',
                'custrecord_xrc_tenant_violation',
                'custrecord_xrc_bioaugmentation',
                'custrecord_xrc_id_charges',
                'custrecord_xrc_penalty_for_late_closing',
                'custrecord_xrc_cgl_insurance',
                'custrecord_xrc_admin_fee',
                'custrecord_xrc_add_charge1_amount',
                'custrecord_xrc_add_charge2_amount',
                'custrecord_xrc_add_charge3_amount',
            ];

            initial_charges.forEach(field => total_charges += parseFloat(bsched_record.getValue(field) || 0));

            return total_charges;

        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);