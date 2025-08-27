/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search', 'N/format'],

    function (record, search, format) {

        const ESCALATION_SCHEDULE_SUBLIST_ID = 'recmachcustrecord_xrc_esc_sched_estimate';
        const YEAR_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_year';
        const LEASE_PERIOD_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_lease_period';
        const TRUE_BILLING_DATE_SUBLIST_FIELD_ID = 'custrecord_xrc_bes_billing_date';
        const BILLING_START_DATE_SUBLIST_FIELD_ID = 'custrecord_xrc_billing_start_date';
        const BILLING_DATE_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_billing_date';
        const RENTAL_ESCALATION_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_rental_esc';
        const FIXED_BASIC_RENT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_fixd_basic_rent';
        const ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_esc_basic_rent';
        const CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_cusa_esc_prcnt';
        const ESCALATED_CUSA_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_esc_cusa';
        const FIXED_CUSA_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_fixed_cusa';
        const FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_fxd_sec_dep';
        const ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_adj_sec_dep';
        const SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID = 'custrecord_xrc_esc_sched_sec_dep_adj';
        const LEASE_PERIOD_FIELD_ID = 'custbody_xrc_lease_period';
        const CURRENT_LEASE_PERIOD_FIELD_ID = 'custbody_xrc_current_lease_period';
        const CURRENT_LEASE_YEAR_FIELD_ID = 'custbody_xrc_current_lease_year';
        const LEASE_COMMENCEMENT_FIELD_ID = 'custbody_xrc_lease_commencement';
        const LEASE_EXPIRY_FIELD_ID = 'custbody_xrc_lease_expiry';
        const BASIC_RENT_FIELD_ID = 'custbody_xrc_basic_rent';
        const CUSA_FIELD_ID = 'custbody_xrc_cusa';
        const RENTAL_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_rental_escalation_percent';
        const CUSA_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_cusa_escalation_percent';
        const PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID = 'custbody_xrc_period_sec_dep';
        const PERMITTED_FIELD_ID = 'custbody_xrc_lm_permitted';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const TENANT_FIELD_ID = 'entity';
        const LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
        const INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_interest_rate_unpaid';
        const PRO_RATED_LEASE_EXPIRTY_FIELD_ID = 'custbody_xrc_pro_rated_lease_expiry';
        const LEASE_PERIOD_TYPE_FIELD_ID = 'custbody_xrc_lease_period_type';
        const ONE_TIME_PAYMENT_TYPE_ID = '3';

        const BSCHED_TENANT_FIELD_ID = 'custrecord_xrc_tenant7';
        const BSCHED_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary7';
        const BSCHED_LOCATION_FIELD_ID = 'custrecord_xrc_loc7';
        const BSCHED_DEPARTMENT_FIELD_ID = 'custrecord_xrc_dept7';
        const BSCHED_CLASS_FIELD_ID = 'custrecord_xrc_class7';
        const BSCHED_LEASE_TYPE_FIELD_ID = 'custrecord_xrc_lease_type7';
        const BSCHED_INTEREST_RATE_FIELD_ID = 'custrecord_xrc_bes_interestrate';
        const BSCHED_VARIABLE_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_variable_rent_item_code';
        const BSCHED_FIXED_RENT_ITEM_CODE_FIELD_ID = 'custrecord_xrc_rent_item_code';
        const BSCHED_ADMIN_FEE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_admin_fee_item_code';
        const BSCHED_AIRCON_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_aircon_charge_item_code';
        const BSCHED_BIOAUGMENTATION_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bioaugmentation_item_code';
        const BSCHED_CUSA_ITEM_CODE_FIELD_ID = 'custrecord_xrc_cusa_item_code';
        const BSCHED_ELECTRICITY_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_elec_charge_item_code';
        const BSCHED_WATER_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_water_charge_item_code';
        const BSCHED_BOTTLED_WATER_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bottled_water';
        const BSCHED_LPG_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_lpg_charge_item_code';
        const BSCHED_GEN_SET_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_genset_charge_item_code';
        const BSCHED_MSF_ITEM_CODE_FIELD_ID = 'custrecord_xrc_msf_item_code';
        const BSCHED_SERVICE_REQUEST_ITEM_CODE_FIELD_ID = 'custrecord_xrc_service_req_item_code';
        const BSCHED_LATE_OPENING_EARLY_CLOSING_ITEM_CODE_FIELD_ID = 'custrecord_xrc_lateop_earlyclose_item';
        const BSCHED_PEST_CONTROL_ITEM_CODE_FIELD_ID = 'custrecord_xrc_pest_control_item_code';
        const BSCHED_TENANT_VIOLATION_ITEM_CODE_FIELD_ID = 'custrecord_xrc_tenant_violation_item';
        const BSCHED_CGL_INSURANCE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_cgl_ins_item_code';
        const BSCHED_ID_CHARGE_ITEM_CODE_FIELD_ID = 'custrecord_xrc_id_charge_item_code';
        const BSCHED_PENALTY_FOR_LATE_CLOSING_ITEM_CODE_FIELD_ID = 'custrecord_xrc_penalty_late_close_item';
        const BSCHED_PENALTY_FOR_UNPAID_BAL_ITEM_CODE_FIELD_ID = 'custrecord_xrc_bes_pen_unpaid_itemcode';
        const BSCHED_PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by7';
        const BSCHED_NEXT_ESCALATION_DATE_FIELD_ID = 'custrecord_xrc_next_esc_sched';
        const BSCHED_VIEWED_FIELD_ID = 'custrecord_xrc_esc_sched_viewed';


        function getInputData(context) {


            return createSalesOrderSearch();

        }

        function reduce(context) {

            try {

                var value = JSON.parse(context.values);

                var so_rec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: value.id,
                    isDynamic: true,
                });

                // var historical_values_length = JSON.parse(so_rec.getValue('custbody_xrc_historical_values')).length;

                // log.debug('length', value.id + ' => ' + so_rec.getLineCount({ sublistId: ESCALATION_SCHEDULE_SUBLIST_ID }));

                var bsched_sublist_length = so_rec.getLineCount({ sublistId: ESCALATION_SCHEDULE_SUBLIST_ID });

                if (bsched_sublist_length == 0) {

                    so_rec.setValue('custbody_xrc_pto_checkbox', true);

                    generateBillingSchedules(so_rec);

                    so_rec.save({
                        ignoreMandatoryFields: true,
                    });

                }


            } catch (error) {

                log.debug('error', error);

            }
        }

        function createSalesOrderSearch() {

            var sales_order_search = search.create({
                type: "salesorder",
                settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }, { "name": "includeperiodendtransactions", "value": "F" }],
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["custbody_xrc_open_bal", "is", "T"],
                        "AND",
                        ["status", "anyof", "SalesOrd:F"],
                        "AND",
                        ["custbody_xrc_approval1", "is", "T"],
                        "AND",
                        ["custbody_xrc_approval2", "is", "T"],
                        "AND",
                        ["custbody_xrc_pto_checkbox", "is", "F"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custbody_xrc_approval2", label: "Approval 2" })
                    ]
            });

            return sales_order_search;
        }

        function generateBillingSchedules(so_rec) {

            var string_historical_values = so_rec.getValue('custbody_xrc_historical_values');

            if (string_historical_values) {

                var parsed_historical_values = JSON.parse(string_historical_values);

                parsed_historical_values.forEach((historical_value, index) => {

                    so_rec.selectNewLine({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    });

                    var year = 1;

                    for (var key in historical_value) {

                        try {

                            var value = historical_value[key];

                            if (key === 'custpage_year') {

                                year = parseInt(value);

                            }

                            var key = getFieldIdByKey(key);

                            if (key === BILLING_DATE_SUBLIST_FIELD_ID || key === TRUE_BILLING_DATE_SUBLIST_FIELD_ID || key === BILLING_START_DATE_SUBLIST_FIELD_ID) {

                                value = format.parse({
                                    value: value,
                                    type: format.Type.DATE
                                });

                            }

                            so_rec.setCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: key,
                                value: value,
                            });

                        } catch (error) {

                            so_rec.setCurrentSublistValue({
                                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                                fieldId: key,
                                value: parseInt(value) || null,
                            });

                        }
                    }

                    var initial_values = getInitialValues(so_rec, year);

                    for (var key in initial_values) {

                        so_rec.setCurrentSublistValue({
                            sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                            fieldId: key,
                            value: initial_values[key],
                        });

                    }

                    so_rec.commitLine({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                    });

                });

            }

            so_rec.setValue(PERMITTED_FIELD_ID, true);

        }

        function getFieldIdByKey(key) {

            var fields = {
                "custpage_year": YEAR_SUBLIST_FIELD_ID,
                "custpage_lease_period": LEASE_PERIOD_SUBLIST_FIELD_ID,
                "custpage_true_billing_date": TRUE_BILLING_DATE_SUBLIST_FIELD_ID,
                "custpage_billing_start_date": BILLING_START_DATE_SUBLIST_FIELD_ID,
                "custpage_billing_date": BILLING_DATE_SUBLIST_FIELD_ID,
                "custpage_rental_escalation": RENTAL_ESCALATION_SUBLIST_FIELD_ID,
                "custpage_fixed_basic_rent": FIXED_BASIC_RENT_SUBLIST_FIELD_ID,
                "custpage_escalated_basic_rent": ESCALATED_BASIC_RENT_SUBLIST_FIELD_ID,
                "custpage_cusa_escalation": CUSA_ESCALATION_PERCENTAGE_SUBLIST_FIELD_ID,
                "custpage_escalated_cusa": ESCALATED_CUSA_SUBLIST_FIELD_ID,
                "custpage_fixed_cusa": FIXED_CUSA_SUBLIST_FIELD_ID,
                "custpage_fixed_sec_dep": FIXED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                "custpage_adj_sec_dep": ADJUSTED_SECURITY_DEPOSIT_SUBLIST_FIELD_ID,
                "custpage_sec_dep_adj": SECURITY_DEPOSIT_ADJUSTMENT_SUBLIST_FIELD_ID,
            };

            return fields[key];

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
                [BSCHED_FIXED_RENT_ITEM_CODE_FIELD_ID]: 5233, // This and succeeding numbers represents the internal id of the items 
                [BSCHED_VARIABLE_RENT_ITEM_CODE_FIELD_ID]: 5255,
                [BSCHED_ADMIN_FEE_ITEM_CODE_FIELD_ID]: 5251,
                [BSCHED_AIRCON_CHARGE_ITEM_CODE_FIELD_ID]: 5235,
                [BSCHED_BIOAUGMENTATION_ITEM_CODE_FIELD_ID]: 5245,
                [BSCHED_CUSA_ITEM_CODE_FIELD_ID]: 5234,
                [BSCHED_ELECTRICITY_CHARGE_ITEM_CODE_FIELD_ID]: 5236,
                [BSCHED_WATER_CHARGE_ITEM_CODE_FIELD_ID]: 5237,
                [BSCHED_BOTTLED_WATER_ITEM_CODE_FIELD_ID]: 11250,
                [BSCHED_LPG_CHARGE_ITEM_CODE_FIELD_ID]: 5238,
                [BSCHED_GEN_SET_CHARGE_ITEM_CODE_FIELD_ID]: 5239,
                [BSCHED_MSF_ITEM_CODE_FIELD_ID]: 5240,
                [BSCHED_SERVICE_REQUEST_ITEM_CODE_FIELD_ID]: 5241,
                [BSCHED_LATE_OPENING_EARLY_CLOSING_ITEM_CODE_FIELD_ID]: 5242,
                [BSCHED_PEST_CONTROL_ITEM_CODE_FIELD_ID]: 5243,
                [BSCHED_TENANT_VIOLATION_ITEM_CODE_FIELD_ID]: 5244,
                [BSCHED_CGL_INSURANCE_ITEM_CODE_FIELD_ID]: 5252,
                [BSCHED_ID_CHARGE_ITEM_CODE_FIELD_ID]: 5253,
                [BSCHED_PENALTY_FOR_LATE_CLOSING_ITEM_CODE_FIELD_ID]: 5246,
                [BSCHED_PENALTY_FOR_UNPAID_BAL_ITEM_CODE_FIELD_ID]: 5249,
                [BSCHED_VIEWED_FIELD_ID]: true,
                [BSCHED_PREPARED_BY_FIELD_ID]: 1417,
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

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);