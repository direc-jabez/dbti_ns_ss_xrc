/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 *
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 21, 2024
 *
 * Updated by: DBTI - Charles Maverick Herrera
 * Date: Oct 24, 2024
 * 
 * Updated by DBTI - John Jabez Serrano
 * Date: July 25, 2025
 *
 */
define(["N/record", "N/currentRecord", "N/runtime", "N/search"], function (record, currRec, runtime, search) {

    const PARAM_ORIGIN_ID = "origin_id";
    const PARAM_TRANSFORM_ID = "transform";
    const PARAM_TYPE = "type";
    const BILLING_SCHEDULE_RECORD_TYPE_ID = "customrecord_xrc_escalation_schedule";
    const BSCHED_BILL_DATE_FIELD_ID = 'custrecord_xrc_bes_billing_date';
    const BSCHED_LOCATION_FIELD_ID = "custrecord_xrc_loc7";
    const BSCHED_DEPARTMENT_FIELD_ID = "custrecord_xrc_dept7";
    const BSCHED_CLASS_FIELD_ID = "custrecord_xrc_class7";
    const BSCHED_BILLING_DATE_FIELD_ID = "custrecord_xrc_esc_sched_billing_date";
    const BSCHED_LEASE_TYPE_FIELD_ID = "custrecord_xrc_lease_type7";
    // ADDED FIELD ID
    const BSCHED_CURRENT_SEC_DEPOSIT_FIELD_ID = "custrecord_xrc_esc_sched_fxd_sec_dep";
    const BSCHED_ADJUSTED_SEC_DEPOSIT_FIELD_ID = "custrecord_xrc_esc_sched_adj_sec_dep";
    const BSCHED_ADDITIONAL_SEC_DEPOSIT_FIELD_ID = "custrecord_xrc_esc_sched_sec_dep_adj";
    const BSCHED_ESCALATED_BASIC_RENT_FIELD_ID = "custrecord_xrc_esc_sched_esc_basic_rent";
    const BSCHED_VARIABLE_RENT_FIELD_ID = "custrecord_xrc_variable_rent";
    const FIXED_LEASE_TYPE = "1";
    const VARIABLE_LEASE_TYPE = "2";
    const DATE_FIELD_ID = "trandate";
    const DUE_DATE_FIELD_ID = "duedate";
    const TERMS_FIELD_ID = "terms";
    const TERMS_10TH_NM_ID = "12";
    const LOCATION_FIELD_ID = "location";
    const DEPARTMENT_FIELD_ID = "department";
    const CLASS_FIELD_ID = "class";
    // ADDED FIELD ID
    const CURRENT_SEC_DEP_FIELD_ID = 'custbody_xrc_current_secdep'
    const ADJUSTED_SEC_DEP_FIELD_ID = 'custbody_xrc_esc_secdep'
    const ADDITIONAL_SEC_DEP_FIELD_ID = 'custbody_xrc_add_secdep'
    const PAID_SEC_DEP_FIELD_ID = 'custbody_xmdi_paid_secdep'
    const ITEMS_SUBLIST_ID = "item";
    const BILL_SCHED_FIELD_ID = "custbody_xrc_bill_sched_link";
    const CUSTOMER_FIELD_ID = 'entity';

    // Lease memo fields
    const TYPE_OF_OPERATION_FIELD_ID = 'custbody_xrc_operation_type';
    const SPACE_NO_FIELD_ID = 'custbody_xrc_space_num';
    const ACTUAL_RATE_PER_SQM_FIELD_ID = 'custbody_xrc_actual_rate_per_sqm';
    const PROPERTY_TYPE_FIELD_ID = 'custbody_xrc_property_type';
    const PROPERTY_CLASS_FIELD_ID = 'custbody_xrc_property_class';
    const LEASE_PERIOD_TYPE_FIELD_ID = 'custbody_xrc_lease_period_type';
    const LEASE_PERIOD_FIELD_ID = 'custbody_xrc_lease_period';
    const LEASE_COMMENCEMENT_FIELD_ID = 'custbody_xrc_lease_commencement';
    const LEASE_EXPIRY_FIELD_ID = 'custbody_xrc_lease_expiry';
    const LEASE_TYPE_FIELD_ID = 'custbody_xrc_lease_type';
    const ACTUAL_BASIC_RENT_FIELD_ID = 'custbody_xrc_basic_rent';
    const PERCENTAGE_RENT_FIELD_ID = 'custbody_xrc_percentage_rate';
    const RENTAL_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_rental_escalation_percent';
    const CUSA_ESCALATION_PERCENTAGE_FIELD_ID = 'custbody_xrc_cusa_escalation_percent';
    const SECURITY_DEPOSIT_PER_PERIOD_FIELD_ID = 'custbody_xrc_sec_dep_per_period';
    const FINAL_SOA__FIELD_ID = 'custbody_xrc_final_soa';
    const LEASE_MEMORANDUM_FIELD_ID = 'custbody_xrc_lease_memorandum';

    const MODE_COPY = "copy";
    const PREPARED_BY_FLD_ID = "custbody_xrc_prepared_by";
    const APPROVER_1_FLD_ID = "custbody_xrc_approver1";
    const APPROVER_2_FLD_ID = "custbody_xrc_approver2";
    const APPROVER_3_FLD_ID = "custbody_xrc_approver3";
    const APPROVAL_1_FLD_ID = "custbody_xrc_approval1";
    const APPROVAL_2_FLD_ID = "custbody_xrc_approval2";
    const APPROVAL_3_FLD_ID = "custbody_xrc_approval3";
    const APPROVAL_4_FLD_ID = "custbody_xrc_approval4";
    const APPROVAL_5_FLD_ID = "custbody_xrc_approval5";
    const APPROVAL_6_FLD_ID = "custbody_xrc_approval6";
    const APPROVAL_7_FLD_ID = "custbody_xrc_approval7";
    const FOR_APPROVAL_FLD_ID = "custbody_xrc_for_approval";
    const REJECTED_FLD_ID = "custbody1";

    const INTEREST_CHARGE_ITEM_ID = '5249';

    var g_duedate = null;
    var g_isSubmitForApprovalBtnClick = null;
    var g_isApproveBtnClick = null;
    var g_isRejectBtnClick = null;
    var g_isDepositBtnClick = null;

    function pageInit(context) {

        var currentRecord = context.currentRecord;

        var transform = getParameterWithId(PARAM_TRANSFORM_ID);

        var origin_id = getParameterWithId(PARAM_ORIGIN_ID);

        if (transform && origin_id) {

            initiateInvoice(origin_id, currentRecord);

        }

        // initiateInvoiceOnSalesOrderClose(currentRecord, origin_id);

        if (context.mode === MODE_COPY) {

            var currentUser = runtime.getCurrentUser();

            currentRecord.setValue(PREPARED_BY_FLD_ID, currentUser.id);

            currentRecord.setValue(APPROVAL_1_FLD_ID, false);
            currentRecord.setValue(APPROVAL_2_FLD_ID, false);
            currentRecord.setValue(APPROVAL_3_FLD_ID, false);
            currentRecord.setValue(APPROVAL_4_FLD_ID, false);
            currentRecord.setValue(APPROVAL_5_FLD_ID, false);
            currentRecord.setValue(APPROVAL_6_FLD_ID, false);
            currentRecord.setValue(APPROVAL_7_FLD_ID, false);
            currentRecord.setValue(APPROVER_1_FLD_ID, null);
            currentRecord.setValue(APPROVER_2_FLD_ID, null);
            currentRecord.setValue(APPROVER_3_FLD_ID, null);
            currentRecord.setValue(FOR_APPROVAL_FLD_ID, false);
            currentRecord.setValue(REJECTED_FLD_ID, false);

        }
    }

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;

        var sublistId = context.sublistId;

        var fieldId = context.fieldId;

        if (fieldId === "location") {
            console.log(currentRecord.getValue(fieldId));
        } else if (sublistId === "item" && fieldId === 'quantity') {

            var item = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
            });

            if (item === INTEREST_CHARGE_ITEM_ID) {

                var qty = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                });

                var rate = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    value: rate * (qty / 100),
                });

            }

        }
    }

    async function initiateInvoice(origin_id, currentRecord) {

        var bsched_rec = record.load({
            type: BILLING_SCHEDULE_RECORD_TYPE_ID,
            id: origin_id,
            isDynamic: true,
        });

        var tenant_default_vat_code = getTenantDefaultVATCode(currentRecord.getValue(CUSTOMER_FIELD_ID));

        console.log(tenant_default_vat_code);

        var lineCount = currentRecord.getLineCount({
            sublistId: ITEMS_SUBLIST_ID,
        });

        // Loop backward to avoid index issues when removing lines
        for (var line = lineCount - 1; line >= 0; line--) {
            currentRecord.removeLine({
                sublistId: ITEMS_SUBLIST_ID,
                line: line,
                ignoreRecalc: true,
            });
        }

        currentRecord.setValue({
            fieldId: DATE_FIELD_ID,
            value: bsched_rec.getValue(BSCHED_BILL_DATE_FIELD_ID),
            ignoreFieldChange: true,
        });

        currentRecord.setValue({
            fieldId: TERMS_FIELD_ID,
            value: TERMS_10TH_NM_ID,
        });

        currentRecord.setValue(BILL_SCHED_FIELD_ID, origin_id);

        currentRecord.setValue(
            LOCATION_FIELD_ID,
            bsched_rec.getValue(BSCHED_LOCATION_FIELD_ID)
        );

        currentRecord.setValue(
            DEPARTMENT_FIELD_ID,
            bsched_rec.getValue(BSCHED_DEPARTMENT_FIELD_ID)
        );

        currentRecord.setValue(
            CLASS_FIELD_ID,
            bsched_rec.getValue(BSCHED_CLASS_FIELD_ID)
        );

        currentRecord.setValue(
            CURRENT_SEC_DEP_FIELD_ID,
            bsched_rec.getValue(BSCHED_CURRENT_SEC_DEPOSIT_FIELD_ID)
        );

        currentRecord.setValue(
            ADJUSTED_SEC_DEP_FIELD_ID,
            bsched_rec.getValue(BSCHED_ADJUSTED_SEC_DEPOSIT_FIELD_ID)
        );

        currentRecord.setValue(
            ADDITIONAL_SEC_DEP_FIELD_ID,
            bsched_rec.getValue(BSCHED_ADDITIONAL_SEC_DEPOSIT_FIELD_ID)
        );

        const items_fields = ['item', 'description', 'quantity', 'rate', 'taxcode'];

        var bsched_fields = [];

        var lease_type = bsched_rec.getValue(BSCHED_LEASE_TYPE_FIELD_ID);

        if (lease_type === FIXED_LEASE_TYPE || lease_type === VARIABLE_LEASE_TYPE) {

            lease_type === FIXED_LEASE_TYPE ? bsched_fields.push(['custrecord_xrc_rent_item_code', 'custrecord_xrc_bes_basicrent_desc', 'null', 'custrecord_xrc_esc_sched_esc_basic_rent', 'custrecord_xrc_basicrent_vat']) : bsched_fields.push(['custrecord_xrc_variable_rent_item_code', 'custrecord_xrc_bes_varrent_descr', 'custrecord_xrc_variable_rent', 'custrecord_xrc_basicrent_vat']);

        } else {

            var escalated_basic_rent = bsched_rec.getValue(
                BSCHED_ESCALATED_BASIC_RENT_FIELD_ID
            );

            var variable_rent = bsched_rec.getValue(BSCHED_VARIABLE_RENT_FIELD_ID);

            console.log('escalated_basic_rent: ' + escalated_basic_rent);
            console.log('variable_rent: ' + variable_rent);

            escalated_basic_rent > variable_rent ? bsched_fields.push(['custrecord_xrc_rent_item_code', 'custrecord_xrc_bes_varrent_descr', 'null', 'custrecord_xrc_esc_sched_esc_basic_rent', 'custrecord_xrc_basicrent_vat']) : bsched_fields.push(['custrecord_xrc_variable_rent_item_code', 'custrecord_xrc_bes_varrent_descr', 'custrecord_xrc_variable_rent', 'custrecord_xrc_basicrent_vat']);

        }

        bsched_fields.push(
            [
                "custrecord_xrc_cusa_item_code",
                "custrecord_xrc_bes_cusa_descr",
                "null",
                "custrecord_xrc_esc_sched_esc_cusa",
            ],
            [
                "custrecord_xrc_elec_charge_item_code",
                "custrecord_xrc_bes_elec_consumpt_descr",
                "custrecord_xrc_electricity_kwh",
                "custrecord_xrc_elec_rate",
            ],
            [
                "custrecord_xrc_water_charge_item_code",
                "custrecord_xrc_bes_water_consumpt_descr",
                "custrecord_xrc_water_m3",
                "custrecord_xrc_water_rate",
            ],
            [
                "custrecord_xrc_bottled_water",
                "custrecord_xrc_bes_bottledwater_descr",
                "custrecord_xrc_bottled_water_qty",
                "custrecord_xrc_bottled_water_salesprice",
            ],
            [
                "custrecord_xrc_lpg_charge_item_code",
                "custrecord_xrc_bes_lpg_descr",
                "custrecord_xrc_lpg_consumption_kg",
                "custrecord_xrc_consumption_rate",
            ],
            [
                "custrecord_xrc_genset_charge_item_code",
                "custrecord_xrc_bes_genset_descr",
                "custrecord_xrc_genset_consumpt_kwh",
                "custrecord_xrc_genset_consumpt_rate",
            ],
            [
                "custrecord_xrc_aircon_charge_item_code",
                "custrecord_xrc_bes_aircon_descr",
                "null",
                "custrecord_xrc_aircon_charges",
            ],
            [
                "custrecord_xrc_admin_fee_item_code",
                "custrecord_xrc_bes_adminfee_descr",
                "null",
                "custrecord_xrc_admin_fee",
            ],
            [
                "custrecord_xrc_cgl_ins_item_code",
                "custrecord_xrc_bes_cgl_descr",
                "null",
                "custrecord_xrc_cgl_insurance",
            ],
            [
                "custrecord_xrc_id_charge_item_code",
                "custrecord_xrc_bes_id_charges_descr",
                "null",
                "custrecord_xrc_id_charges",
            ],
            [
                "custrecord_xrc_lateop_earlyclose_item",
                "custrecord_xrc_bes_lateop_descr",
                "null",
                "custrecord_xrc_late_op_early_close",
            ],
            [
                "custrecord_xrc_msf_item_code",
                "custrecord_xrc_bes_msf_descr",
                "null",
                "custrecord_xrc_msf7"
            ],
            [
                "custrecord_xrc_pest_control_item_code",
                "custrecord_xrc_bes_pestcon_descr",
                "null",
                "custrecord_xrc_pest_control",
            ],
            [
                "custrecord_xrc_service_req_item_code",
                "custrecord_xrc_bes_servreq_descr",
                "null",
                "custrecord_xrc_service_req",
            ],
            [
                "custrecord_xrc_tenant_violation_item",
                "custrecord_xrc_tenvio_descr",
                "null",
                "custrecord_xrc_tenant_violation",
            ],
            [
                "custrecord_xrc_bioaugmentation_item_code",
                "custrecord_xrc_bes_bioaug_descr",
                "null",
                "custrecord_xrc_bioaugmentation",
            ],
            [
                "custrecord_xrc_bes_pen_unpaid_itemcode",
                "custrecord_xrc_bes_unpaid_bal_descr",
                "null",
                "custrecord_xrc_bes_unpaidbal_asof",
            ],
            [
                "custrecord_xrc_add_charge1_item_code",
                "custrecord_xrc_add_charge1_descr",
                "custrecord_xrc_add_charge1_qty",
                "custrecord_xrc_add_charge1_rate",
            ],
            [
                "custrecord_xrc_add_charge2_item_code",
                "custrecord_xrc_add_charge2_descr",
                "custrecord_xrc_add_charge2_qty",
                "custrecord_xrc_add_charge2_rate",
            ],
            [
                "custrecord_xrc_add_charge3_item_code",
                "custrecord_xrc_add_charge3_descr",
                "custrecord_xrc_add_charge3_qty",
                "custrecord_xrc_add_charge3_rate",
            ]
        );

        // Show loading popup
        // const messageBox = Ext.MessageBox.show({
        //     title: 'Generating...',
        //     msg: 'Generating invoice lines',
        //     wait: true,
        //     width: 250
        // });

        // for (var i = 0; i < bsched_fields.length; i++) {
        //     var fields = bsched_fields[i];

        //     if (fields.length === 3) {

        //         var rate = bsched_rec.getValue(fields[2]);

        //         if (!rate) return;

        //     }

        //     for (var j = 0; j < fields.length; j++) {

        //         var field = fields[j];

        //         var value = bsched_rec.getValue(field);

        //         if (fields.length === 4) {

        //             currentRecord.setCurrentSublistValue({
        //                 sublistId: ITEMS_SUBLIST_ID,
        //                 fieldId: items_fields[j],
        //                 value: value || 1,
        //                 forceSyncSourcing: true,
        //             });

        //         } else {

        //             currentRecord.setCurrentSublistValue({
        //                 sublistId: ITEMS_SUBLIST_ID,
        //                 fieldId: items_fields[j],
        //                 value: value || 1,
        //                 forceSyncSourcing: true,
        //             });

        //         }

        //     }

        //     currentRecord.setCurrentSublistValue({
        //         sublistId: ITEMS_SUBLIST_ID,
        //         fieldId: 'taxcode',
        //         value: tenant_default_vat_code,
        //         forceSyncSourcing: true,
        //     });

        //     currentRecord.commitLine({
        //         sublistId: ITEMS_SUBLIST_ID,
        //     });

        //     await new Promise(resolve => setTimeout(resolve, 0));
        // }

        bsched_fields.forEach(async (fields) => {

            if (fields[0] !== 'custrecord_xrc_rent_item_code' && fields[0] !== 'custrecord_xrc_variable_rent_item_code') {

                var rate = parseInt(bsched_rec.getValue(fields[3]));

                var qty = parseInt(bsched_rec.getValue(fields[2]));

                if (!rate) return;

                if ((rate * qty) == 0) return;


            }

            fields.forEach((field, index) => {

                try {

                    var value = bsched_rec.getValue(field);

                    if (fields.length === 4) {

                        if (items_fields[index] === "description" && !value) {
                            return;
                        }

                        currentRecord.setCurrentSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: items_fields[index],
                            value: value || 1,
                            forceSyncSourcing: true,
                        });

                    } else {

                        if (items_fields[index] === "description" && !value) {
                            return;
                        }

                        currentRecord.setCurrentSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: items_fields[index],
                            value: value || 1,
                            forceSyncSourcing: true,
                        });

                    }

                } catch (error) {

                    console.log({ field: field, error: error });

                }


            });

            try {

                console.log('tenant_default_vat_code', tenant_default_vat_code);

                currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: 'taxcode',
                    value: tenant_default_vat_code,
                    forceSyncSourcing: true,
                });

                currentRecord.commitLine({
                    sublistId: ITEMS_SUBLIST_ID,
                });

            } catch (error) {

                console.log({ field: 'taxcode', error: error });

            }


            await new Promise(resolve => setTimeout(resolve, 0));

        });

        // Hide loading popup
        // messageBox.hide();

    }

    function initiateInvoiceOnSalesOrderClose(currentRecord, origin_id) {

        var so_rec = record.load({
            type: record.Type.SALES_ORDER,
            id: origin_id,
            isDynamic: true,
        });

        currentRecord.setValue(LOCATION_FIELD_ID, so_rec.getValue(LOCATION_FIELD_ID));

        currentRecord.setValue(DEPARTMENT_FIELD_ID, so_rec.getValue(DEPARTMENT_FIELD_ID));

        currentRecord.setValue(TYPE_OF_OPERATION_FIELD_ID, so_rec.getValue(TYPE_OF_OPERATION_FIELD_ID));

        currentRecord.setValue(SPACE_NO_FIELD_ID, so_rec.getValue(SPACE_NO_FIELD_ID));

        currentRecord.setValue(ACTUAL_RATE_PER_SQM_FIELD_ID, so_rec.getValue(ACTUAL_RATE_PER_SQM_FIELD_ID));

        currentRecord.setValue(PROPERTY_TYPE_FIELD_ID, so_rec.getValue(PROPERTY_TYPE_FIELD_ID));

        currentRecord.setValue(PROPERTY_CLASS_FIELD_ID, so_rec.getValue(PROPERTY_CLASS_FIELD_ID));

        currentRecord.setValue(LEASE_PERIOD_TYPE_FIELD_ID, so_rec.getValue(LEASE_PERIOD_TYPE_FIELD_ID));

        currentRecord.setValue(LEASE_PERIOD_FIELD_ID, so_rec.getValue(LEASE_PERIOD_FIELD_ID));

        currentRecord.setValue(LEASE_COMMENCEMENT_FIELD_ID, so_rec.getValue(LEASE_COMMENCEMENT_FIELD_ID));

        currentRecord.setValue(LEASE_EXPIRY_FIELD_ID, so_rec.getValue(LEASE_EXPIRY_FIELD_ID));

        currentRecord.setValue(LEASE_TYPE_FIELD_ID, so_rec.getValue(LEASE_TYPE_FIELD_ID));

        currentRecord.setValue(ACTUAL_BASIC_RENT_FIELD_ID, so_rec.getValue(ACTUAL_BASIC_RENT_FIELD_ID));

        currentRecord.setValue(PERCENTAGE_RENT_FIELD_ID, so_rec.getValue(PERCENTAGE_RENT_FIELD_ID));

        currentRecord.setValue(RENTAL_ESCALATION_PERCENTAGE_FIELD_ID, so_rec.getValue(RENTAL_ESCALATION_PERCENTAGE_FIELD_ID));

        currentRecord.setValue(CUSA_ESCALATION_PERCENTAGE_FIELD_ID, so_rec.getValue(CUSA_ESCALATION_PERCENTAGE_FIELD_ID));

        currentRecord.setValue(SECURITY_DEPOSIT_PER_PERIOD_FIELD_ID, so_rec.getValue(SECURITY_DEPOSIT_PER_PERIOD_FIELD_ID));

        currentRecord.setValue(FINAL_SOA__FIELD_ID, true);

        currentRecord.setValue(LEASE_MEMORANDUM_FIELD_ID, origin_id);

    }

    function getTenantDefaultVATCode(tenant_id) {

        var tenant_fieldLookup = search.lookupFields({
            type: search.Type.CUSTOMER,
            id: tenant_id,
            columns: ['taxitem']
        });

        return tenant_fieldLookup['taxitem']?.[0]?.value;

    }

    function onSubmitForApprovalBtnClick() {

        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isSubmitForApprovalBtnClick) {

            g_isSubmitForApprovalBtnClick = true;

            // Redirect to the approval link
            window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1768&deploy=1&action=submitforapproval&id=" + currentRecord.id;

        } else {

            alert('You have already submitted the form.');

        }

    }

    function onApproveBtnClick(approve_field) {

        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isApproveBtnClick) {

            g_isApproveBtnClick = true;

            // Redirect to the approval link
            window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1768&deploy=1&action=approve&id=" + currentRecord.id + "&field=" + approve_field;


        } else {

            alert('You have already submitted the form.');

        }

    }

    function onRejectBtnClick() {

        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isRejectBtnClick) {

            g_isRejectBtnClick = true;

            // Redirect to the approval link
            window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1768&deploy=1&action=reject&id=" + currentRecord.id;

        } else {

            alert('You have already submitted the form.');

        }

    }

    function onDepositBtnClick() {

        var currentRecord = currRec.get();

        if (!g_isDepositBtnClick) {

            g_isDepositBtnClick = true;
            window.location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/custdep.nl?invoice_id=' + currentRecord.id;

        } else {
            alert('You have already submitted the form.');
        }

    }

    function getParameterWithId(param_id) {
        var url = new URL(window.location.href);

        var value = url.searchParams.get(param_id);

        return value;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
        onApproveBtnClick: onApproveBtnClick,
        onRejectBtnClick: onRejectBtnClick,
        onDepositBtnClick: onDepositBtnClick,
    };
});
