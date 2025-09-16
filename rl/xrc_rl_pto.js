/**
*@NApiVersion 2.1
*@NScriptType Restlet
*/
define(['N/record', 'N/redirect', 'N/search', 'N/runtime', 'N/email', 'N/format'],

    function (record, redirect, search, runtime, email, format) {

        const SUBMIT_FOR_APPROVAL_ACTION_ID = 'submitforapproval';
        const APPROVE_ACTION_ID = 'approve';
        const REJECT_ACTION_ID = 'reject';
        const PTO_ACTION_ID = 'pto';
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
        const SECURITY_DEPOSIT_BALANCE_SUBLIST_FIELD_ID = 'custrecord_xrc_sec_dep_bal';
        const LEASE_PERIOD_FIELD_ID = 'custbody_xrc_lease_period';
        const CURRENT_LEASE_PERIOD_FIELD_ID = 'custbody_xrc_current_lease_period';
        const LEASE_COMMENCEMENT_FIELD_ID = 'custbody_xrc_lease_commencement';
        const LEASE_EXPIRY_FIELD_ID = 'custbody_xrc_lease_expiry';
        const BASIC_RENT_FIELD_ID = 'custbody_xrc_basic_rent';
        const CUSA_FIELD_ID = 'custbody_xrc_cusa';
        const RENTAL_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_rental_escalation_percent';
        const CUSA_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_cusa_escalation_percent';
        const PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID = 'custbody_xrc_period_sec_dep';
        const PERMITTED_FIELD_ID = 'custbody_xrc_lm_permitted';
        const CREATED_FROM_FIELD_ID = 'createdfrom';
        const INITIAL_SOA_NUMBER_FIELD_ID = 'custbody_xrc_initial_soa';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEM_SUBLIST_FIELD_ID = 'item';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const FIXED_RENT_ITEM_CODE = '5233';
        const VARIABLE_RENT_ITEM_CODE = '5255';
        const LEASABLE_SPACE_RECORD_TYPE = 'customrecord_xrc_leasable_spaces';
        const LS_LEASE_COMMENCEMENT_FIELD_ID = 'custrecord_xrc_ls_lease_commence';
        const SPACE_NO_FIELD_ID = 'custbody_xrc_space_num';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const REJECTED_FIELD_ID = 'custbody1';
        const TRANID_FIELD_ID = 'tranid';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const NOTIF_TYPE_REMINDER = 1;
        const NOTIF_TYPE_APPROVED = 2;
        const NOTIF_TYPE_REJECTED = 3;
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const HISTORICAL_VALUES_FIELD_ID = 'custbody_xrc_historical_values';
        const TENANT_FIELD_ID = 'entity';
        const LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
        const INTEREST_RATE_FOR_UNPAID_BALANCE_FIELD_ID = 'custbody_xrc_interest_rate_unpaid';
        const PTO_FIELD_ID = 'custbody_xrc_pto_checkbox';
        const PRO_RATED_LEASE_EXPIRTY_FIELD_ID = 'custbody_xrc_pro_rated_lease_expiry';
        const LEASE_PERIOD_TYPE_FIELD_ID = 'custbody_xrc_lease_period_type';
        const LEASE_EXPIERY_FIELD_ID = 'custbody_xrc_lease_expiry';
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
        const APPROVAL_TWO_FIELD_ID = 'custbody_xrc_approval2';
        const OPENING_BALANCE_FIELD_ID = 'custbody_xrc_open_bal';


        function _get(context) {

            var action = context.action;

            var field = context.field;

            // var role_to_email = context.role_to_email;

            try {

                // Loading Initial SOA record
                var so_rec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: context.so_id,
                    isDynamic: true,
                });

                // var tran_id = so_rec.getValue(TRANID_FIELD_ID);

                // var subsidiary = so_rec.getValue(SUBSIDIARY_FIELD_ID);

                // if (role_to_email) {

                //     var employee_ids = getEmployeeIdsWithRole(role_to_email);

                // }

                // var prepared_by = so_rec.getValue(PREPARED_BY_FIELD_ID);

                if (action === SUBMIT_FOR_APPROVAL_ACTION_ID) {

                    so_rec.setValue(FOR_APPROVAL_FIELD_ID, true);

                    var rejected = so_rec.getValue(REJECTED_FIELD_ID);

                    if (rejected) {

                        so_rec.setValue(REJECTED_FIELD_ID, false);

                    }

                    // sendEmail(context.so_id, tran_id, subsidiary, employee_ids);

                } else if (action === APPROVE_ACTION_ID) {

                    so_rec.setValue(field, true);

                    so_rec.setValue(getApproverFieldId(field), runtime.getCurrentUser().id);

                    var approval_2 = so_rec.getValue(APPROVAL_TWO_FIELD_ID);

                    var opening_balance = so_rec.getValue(OPENING_BALANCE_FIELD_ID);

                    if (approval_2 && opening_balance) {

                        so_rec.setValue(PTO_FIELD_ID, true);

                        generateBillingSchedules(so_rec, runtime.getCurrentUser());

                    }


                    // sendEmail(context.so_id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_APPROVED);

                    // sendEmail(context.so_id, tran_id, subsidiary, employee_ids);

                } else if (action === REJECT_ACTION_ID) {

                    so_rec.setValue(FOR_APPROVAL_FIELD_ID, false);

                    so_rec.setValue(REJECTED_FIELD_ID, true);

                    var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2'];

                    for (var i = 0; i < fields.length; i++) {

                        var isChecked = so_rec.getValue(fields[i]);

                        if (!isChecked) {

                            break;

                        }

                        so_rec.setValue(fields[i], false);

                    }

                    // sendEmail(context.so_id, tran_id, subsidiary, [prepared_by], NOTIF_TYPE_REJECTED);

                } else if (action === PTO_ACTION_ID) {

                    var date_elements = context.date.split('/');

                    var year = parseInt(date_elements[2]);

                    var month = parseInt(date_elements[0]) - 1;

                    var day = parseInt(date_elements[1]);

                    var lease_commencement = new Date(year, month, day);

                    log.debug('lease_commencement', lease_commencement);

                    var space_no = so_rec.getValue(SPACE_NO_FIELD_ID);

                    so_rec.setValue(LEASE_COMMENCEMENT_FIELD_ID, lease_commencement);

                    so_rec.setValue(PTO_FIELD_ID, true);

                    generateBillingSchedules(so_rec, runtime.getCurrentUser());

                    updateLeaseMemoQuantity(so_rec);

                    record.submitFields({
                        type: LEASABLE_SPACE_RECORD_TYPE,
                        id: space_no,
                        values: {
                            [LS_LEASE_COMMENCEMENT_FIELD_ID]: lease_commencement,
                        },
                        options: {
                            ignoreMandatoryFields: true
                        }
                    });
                }

                so_rec.save({
                    ignoreMandatoryFields: true,
                })

            } catch (error) {

                log.debug('error', error);

            }

            redirect.toRecord({
                type: record.Type.SALES_ORDER,
                id: context.so_id,
            });

        }

        function generateBillingSchedules(so_rec, currentUser) {

            var historical_values = generateHistoricalValues(so_rec);

            if (historical_values) {

                var parsed_historical_values = JSON.parse(historical_values);

                parsed_historical_values.forEach((historical_value, index) => {

                    so_rec.selectLine({
                        sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
                        line: index,
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

                    var initial_values = getInitialValues(so_rec, year, currentUser);

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

                    log.debug('historical_value', historical_value);

                });

            }

            so_rec.setValue(PERMITTED_FIELD_ID, true);

        }

        function generateHistoricalValues(so_rec) {

            var historical_values = [];

            var lease_period_type = so_rec.getValue(LEASE_PERIOD_TYPE_FIELD_ID);

            var lease_period = so_rec.getValue(LEASE_PERIOD_FIELD_ID);

            var current_lease_period = so_rec.getValue(CURRENT_LEASE_PERIOD_FIELD_ID);

            var lease_commencement = so_rec.getValue(LEASE_COMMENCEMENT_FIELD_ID);

            var pro_rated_lease_expiry = so_rec.getValue(PRO_RATED_LEASE_EXPIRTY_FIELD_ID);

            var basic_rent = so_rec.getValue(BASIC_RENT_FIELD_ID);

            var rental_escalation = so_rec.getValue(RENTAL_ESCALATION_PERCENTAGE_FIELD_ID) || 0;

            var cusa_rent = so_rec.getValue(CUSA_FIELD_ID) || 0;

            var cusa_escalation = so_rec.getValue(CUSA_ESCALATION_PERCENTAGE_FIELD_ID) || 0;

            var year = 1;

            var last_date = getLastDateOfMonth(lease_commencement.getFullYear(), lease_commencement.getMonth());

            // Get the date on the Lease Commencement date
            var isNotFirstDay = lease_commencement.getDate() > 1 ? true : false;

            var period_for_security_deposit = so_rec.getValue(PERIODS_FOR_SECURITY_DEPOSIT_FIELD_ID);

            if (lease_period_type === ONE_TIME_PAYMENT_TYPE_ID) {

                historical_values.push({
                    "custpage_year": 1,
                    "custpage_lease_period": 1,
                    "custpage_true_billing_date": getFifthOfTheMonth(last_date.toLocaleDateString()),
                    "custpage_billing_start_date": so_rec.getValue(LEASE_COMMENCEMENT_FIELD_ID).toLocaleDateString(),
                    "custpage_billing_date": so_rec.getValue(LEASE_EXPIRY_FIELD_ID).toLocaleDateString(),
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
                    "custpage_billing_start_date": so_rec.getValue(LEASE_COMMENCEMENT_FIELD_ID).toLocaleDateString(),
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
                // if (isNewYear(i)) {

                var escalated_basic_rent = ebr;

                var fixed_security_deposit = (fixed_basic_rent * period_for_security_deposit);

                var adjusted_security_deposit = (escalated_basic_rent * period_for_security_deposit);

                // Security Deposit Adjustment
                var sda = adjusted_security_deposit ? (adjusted_security_deposit - fixed_security_deposit) : fixed_security_deposit;

                if (i > 12) {

                    year += 1;

                }

                // } else {

                // var fixed_security_deposit = '';

                // var adjusted_security_deposit = '';

                // Security Deposit Adjustment
                // var sda = '';

                // }

                if (i === lease_period) {

                    var day = i === 0 ? ((last_date.getDate() - lease_commencement.getDate()) + 1) : i === lease_period ? so_rec.getValue(LEASE_EXPIRY_FIELD_ID).getDate() : null;

                    var pro_rated_rent = getProRatedRent(basic_rent, last_date, day);

                    historical_values.push({
                        "custpage_year": year,
                        "custpage_lease_period": i,
                        "custpage_true_billing_date": getFifthOfTheMonth(last_date.toLocaleDateString()),
                        "custpage_billing_start_date": getFirstDateOfMonth(last_date.getFullYear(), last_date.getMonth()).toLocaleDateString(),
                        "custpage_billing_date": so_rec.getValue(LEASE_EXPIRY_FIELD_ID).toLocaleDateString(),
                        "custpage_rental_escalation": i > 12 ? rental_escalation : null,
                        "custpage_fixed_basic_rent": pro_rated_rent,
                        "custpage_escalated_basic_rent": year > 1 ? (pro_rated_rent + (pro_rated_rent * (rental_escalation / 100))) : pro_rated_rent,
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
                        "custpage_billing_start_date": getFirstDateOfMonth(last_date.getFullYear(), last_date.getMonth()).toLocaleDateString(),
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

        function updateLeaseMemoQuantity(so_rec) {

            var esc_lines = so_rec.getLineCount({
                sublistId: ESCALATION_SCHEDULE_SUBLIST_ID,
            });

            var items_lines = so_rec.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                so_rec.selectLine({
                    sublistId: ITEMS_SUBLIST_ID,
                    line: line,
                });

                var quantity = so_rec.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: QUANTITY_SUBLIST_FIELD_ID
                });

                if (quantity !== esc_lines) {

                    var item = so_rec.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ITEM_SUBLIST_FIELD_ID
                    });

                    // Check if item matches with fixed or variable rent item code 
                    if (item === FIXED_RENT_ITEM_CODE || item === VARIABLE_RENT_ITEM_CODE) {

                        so_rec.setCurrentSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: QUANTITY_SUBLIST_FIELD_ID,
                            value: esc_lines,
                        });

                        so_rec.commitLine({
                            sublistId: ITEMS_SUBLIST_ID,
                        });

                    }

                }

            }

        }

        function getLastDateOfMonth(year, month) {

            return new Date(year, month + 1, 0);

        }

        function getFifthOfTheMonth(date) {

            var year = date.split('/')[2];

            var month = date.split('/')[0];

            return month + "/05/" + year;

        }

        function getFirstDateOfMonth(year, month) {

            return new Date(year, month, 1);

        }

        function getProRatedRent(basic_rent, last_date, day) {

            var month_last_date = last_date.getDate();

            return basic_rent * (day / month_last_date);

        }

        function isNewYear(period) { // 🎇🎇🎇

            return period === 1 || ((period - 1) % 12 === 0);

        }

        function getSecurityDeposit(lease_proposal) {

            var fieldLookUp = search.lookupFields({
                type: record.Type.ESTIMATE,
                id: lease_proposal,
                columns: [INITIAL_SOA_NUMBER_FIELD_ID],
            });

            var isoa_id = fieldLookUp[INITIAL_SOA_NUMBER_FIELD_ID][0].value;

            log.debug('isoa_id', isoa_id);

            var ids = getISOADepositIds(isoa_id);

            log.debug('ids', ids);

            var security_deposit = getTotalDeposit(ids);

            return security_deposit;

        }

        function getISOADepositIds(isoa_id) {

            var ids = [];

            // Creating to retrieve ISOA Deposit ids
            var isoa_deposit_search = search.create({
                type: "customrecord_xrc_initial_soa_dep",
                filters: [["custrecord_xrc_initial_soa6", "anyof", isoa_id]],
                columns: [search.createColumn({ name: "name", label: "ID" })],
            });

            isoa_deposit_search.run().each(function (result) {

                ids.push(result.id);

                return true;
            });

            return ids;

        }

        function getTotalDeposit(ids) {

            var total_deposit = 0;

            // Creating Customer Deposit search that is associated
            // with the iso deposit ids (param)
            var customer_deposit_search = search.create({
                type: "transaction",
                filters:
                    [
                        ["custbody_xrc_isoa_dep_link", "anyof", ids],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["custbody_xrc_deposit_category", "anyof", "7"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custbody_xrc_deposit_category",
                            summary: "GROUP",
                            label: "Deposit Category"
                        }),
                        search.createColumn({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        })
                    ]
            });

            try {

                customer_deposit_search.run().each(function (result) {

                    total_deposit = parseFloat(result.getValue(result.columns[1]));

                    return true;
                });

            } catch (error) {

            }


            return total_deposit;

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

        function getInitialValues(so_rec, year, currentUser) {

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
                [BSCHED_PREPARED_BY_FIELD_ID]: currentUser.id,
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

        function getApproverFieldId(field) {

            var approvers = {
                'custbody_xrc_approval1': 'custbody_xrc_approver1',
                'custbody_xrc_approval2': 'custbody_xrc_approver2',
            };

            return approvers[field];

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

        function hasPeriodZero(historical_values) {

            for (var i = 0; i < historical_values.length; i++) {

                if (historical_values[i].custpage_lease_period == 0) {
                    return true;
                }

            }

            return false;

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

            log.debug('body', body);

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

        return {
            get: _get,
        };
    }
);
