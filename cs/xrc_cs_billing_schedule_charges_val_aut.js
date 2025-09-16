/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 05, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {

        // Ommitted creating constant variables for ID
        // to prevent numerous variables since this record
        // has a considerable number of fields.

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            if (fieldId === 'custrecord_xrc_water_m3' || fieldId === 'custrecord_xrc_water_rate') {

                currentRecord.setValue('custrecord_xrc_water_amount', (currentRecord.getValue('custrecord_xrc_water_m3') || 0) * (currentRecord.getValue('custrecord_xrc_water_rate') || 0));

            } else if (fieldId === 'custrecord_xrc_water_amount') {

                var water_consumption_amt = currentRecord.getValue('custrecord_xrc_water_amount');

                if (water_consumption_amt) {

                    currentRecord.setValue('custrecord_xrc_water_vatamt', water_consumption_amt * (1 + (currentRecord.getValue('custrecord_xrc_water_vatrate') / 100)));

                    currentRecord.setValue('custrecord_xrc_water_whtamt', water_consumption_amt * (1 + (currentRecord.getValue('custrecord_xrc_water_whtrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_late_op_early_close') {

                currentRecord.setValue('custrecord_xrc_lateop_vatamt', currentRecord.getValue('custrecord_xrc_late_op_early_close') * (1 + (currentRecord.getValue('custrecord_xrc_late_op_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_lateop_whtamt', currentRecord.getValue('custrecord_xrc_late_op_early_close') * (1 + (currentRecord.getValue('custrecord_xrc_lateop_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_penalty_for_late_closing') {

                currentRecord.setValue('custrecord_xrc_lateclose_vatamt', currentRecord.getValue('custrecord_xrc_penalty_for_late_closing') * (1 + (currentRecord.getValue('custrecord_xrc_lateclose_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_lateclose_whtamt', currentRecord.getValue('custrecord_xrc_penalty_for_late_closing') * (1 + (currentRecord.getValue('custrecord_xrc_lateclose_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_lpg_consumption_kg') {

                currentRecord.setValue('custrecord_xrc_lpg_consumption_amt', (currentRecord.getValue('custrecord_xrc_lpg_consumption_kg') || 0) * (currentRecord.getValue('custrecord_xrc_consumption_rate') || 0));

            } else if (fieldId === 'custrecord_xrc_lpg_consumption_amt') {

                var lpg_consumption_amt = currentRecord.getValue('custrecord_xrc_lpg_consumption_amt');

                if (lpg_consumption_amt) {

                    currentRecord.setValue('custrecord_xrc_lpg_vatamt', lpg_consumption_amt * (1 + (currentRecord.getValue('custrecord_xrc_lpg_vatrate') / 100)));

                    currentRecord.setValue('custrecord_xrc_lpg_whtamt', lpg_consumption_amt * (1 + (currentRecord.getValue('custrecord_xrc_lpg_whtrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_pest_control') {

                currentRecord.setValue('custrecord_xrc_pescon_vatamt', currentRecord.getValue('custrecord_xrc_pest_control') * (1 + (currentRecord.getValue('custrecord_xrc_pescon_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_pescon_whtamt', currentRecord.getValue('custrecord_xrc_pest_control') * (1 + (currentRecord.getValue('custrecord_xrc_pescon_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_cgl_insurance') {

                currentRecord.setValue('custrecord_xrc_cgl_vatamt', currentRecord.getValue('custrecord_xrc_cgl_insurance') * (1 + (currentRecord.getValue('custrecord_xrc_cgl_vatrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_genset_consumpt_kwh' || fieldId === 'custrecord_xrc_genset_consumpt_rate') {

                currentRecord.setValue('custrecord_xrc_genset_consumpt_amt', (currentRecord.getValue('custrecord_xrc_genset_consumpt_kwh') || 0) * (currentRecord.getValue('custrecord_xrc_genset_consumpt_rate') || 0));

            } else if (fieldId === 'custrecord_xrc_genset_consumpt_amt') {

                var genset_consumption_amt = currentRecord.getValue('custrecord_xrc_genset_consumpt_amt');

                if (genset_consumption_amt) {

                    currentRecord.setValue('custrecord_xrc_genset_vatamt', genset_consumption_amt * (1 + (currentRecord.getValue('custrecord_xrc_genset_vatrate') / 100)));

                    currentRecord.setValue('custrecord_xrc_genset_whtamt', genset_consumption_amt * (1 + (currentRecord.getValue('custrecord_xrc_genset_whtrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_bottled_water_qty' || fieldId === 'custrecord_xrc_bottled_water_salesprice') {

                currentRecord.setValue('custrecord_xrc_bottled_water_amount', (currentRecord.getValue('custrecord_xrc_bottled_water_qty') || 0) * (currentRecord.getValue('custrecord_xrc_bottled_water_salesprice') || 0));

            } else if (fieldId === 'custrecord_xrc_bottled_water_amount') {

                var bottled_water_amt = currentRecord.getValue('custrecord_xrc_bottled_water_amount');

                if (bottled_water_amt) {

                    currentRecord.setValue('custrecord_xrc_bottled_water_vatamt', bottled_water_amt * (1 + (currentRecord.getValue('custrecord_xrc_bottle_water_vatrate') / 100)));

                    currentRecord.setValue('custrecord_xrc_bottled_whtamt', bottled_water_amt * (1 + (currentRecord.getValue('custrecord_xrc_bottled_whtrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_add_charge1_qty' || fieldId === 'custrecord_xrc_add_charge1_rate') {

                currentRecord.setValue('custrecord_xrc_add_charge1_amount', (currentRecord.getValue('custrecord_xrc_add_charge1_qty') || 0) * (currentRecord.getValue('custrecord_xrc_add_charge1_rate') || 0));

            } else if (fieldId === 'custrecord_xrc_add_charge1_amount') {

                var addtn_charge_amt = currentRecord.getValue('custrecord_xrc_add_charge1_amount');

                if (addtn_charge_amt) {

                    currentRecord.setValue('custrecord_xrc_charge1_vatamt', addtn_charge_amt * (1 + (currentRecord.getValue('custrecord_xrc_charge1_vatrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_aircon_charges') {

                currentRecord.setValue('custrecord_xrc_aircon_vatamt', currentRecord.getValue('custrecord_xrc_aircon_charges') * (1 + (currentRecord.getValue('custrecord_xrc_aircon_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_aircon_whtamt', currentRecord.getValue('custrecord_xrc_aircon_charges') * (1 + (currentRecord.getValue('custrecord_xrc_aircon_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_msf7') {

                currentRecord.setValue('custrecord_xrc_msf_vatamt', currentRecord.getValue('custrecord_xrc_msf7') * (1 + (currentRecord.getValue('custrecord_xrc_msf_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_msf_whtamt', currentRecord.getValue('custrecord_xrc_msf7') * (1 + (currentRecord.getValue('custrecord_xrc_msf_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_tenant_violation') {

                currentRecord.setValue('custrecord_xrc_tenvio_vatamt', currentRecord.getValue('custrecord_xrc_tenant_violation') * (1 + (currentRecord.getValue('custrecord_xrc_tenant_violation_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_tenvio_whtamt', currentRecord.getValue('custrecord_xrc_tenant_violation') * (1 + (currentRecord.getValue('custrecord_xrc_tenvio_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_add_charge2_qty' || fieldId === 'custrecord_xrc_add_charge2_rate') {

                currentRecord.setValue('custrecord_xrc_add_charge2_amount', (currentRecord.getValue('custrecord_xrc_add_charge2_qty') || 0) * (currentRecord.getValue('custrecord_xrc_add_charge2_rate') || 0));

            } else if (fieldId === 'custrecord_xrc_add_charge2_amount') {

                var addtn_charge_amt = currentRecord.getValue('custrecord_xrc_add_charge2_amount');

                if (addtn_charge_amt) {

                    currentRecord.setValue('custrecord_xrc_charge2_vatamt', addtn_charge_amt * (1 + (currentRecord.getValue('custrecord_xrc_charge2_vatrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_electricity_kwh' || fieldId === 'custrecord_xrc_elec_rate') {

                currentRecord.setValue('custrecord_xrc_add_charge1_amount', (currentRecord.getValue('custrecord_xrc_electricity_kwh') || 0) * (currentRecord.getValue('custrecord_xrc_elec_rate') || 0));

            } else if (fieldId === 'custrecord_xrc_elec_amount') {

                var electricity_charge_amt = currentRecord.getValue('custrecord_xrc_elec_amount');

                if (electricity_charge_amt) {

                    currentRecord.setValue('custrecord_xrc_elec_vatamt', electricity_charge_amt * (1 + (currentRecord.getValue('custrecord_xrc_elec_vatrate') / 100)));

                    currentRecord.setValue('custrecord_xrc_elec_whtamt', electricity_charge_amt * (1 + (currentRecord.getValue('custrecord_xrc_elec_whtrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_service_req') {

                currentRecord.setValue('custrecord_xrc_servreq_vatamt', currentRecord.getValue('custrecord_xrc_service_req') * (1 + (currentRecord.getValue('custrecord_xrc_service_req_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_servreq_whtamt', currentRecord.getValue('custrecord_xrc_service_req') * (1 + (currentRecord.getValue('custrecord_xrc_servreq_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_bioaugmentation') {

                currentRecord.setValue('custrecord_xrc_bioaug_vatamt', currentRecord.getValue('custrecord_xrc_bioaugmentation') * (1 + (currentRecord.getValue('custrecord_xrc_bioaug_vatrate') / 100)));

                currentRecord.setValue('custrecord_xrc_bioaug_whtamt', currentRecord.getValue('custrecord_xrc_bioaugmentation') * (1 + (currentRecord.getValue('custrecord_xrc_bioaug_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_add_charge3_qty' || fieldId === 'custrecord_xrc_add_charge3_rate') {

                currentRecord.setValue('custrecord_xrc_add_charge3_amount', (currentRecord.getValue('custrecord_xrc_add_charge3_qty') || 0) * (currentRecord.getValue('custrecord_xrc_add_charge3_rate') || 0));

            } else if (fieldId === 'custrecord_xrc_add_charge3_amount') {

                var addtn_charge_amt = currentRecord.getValue('custrecord_xrc_add_charge3_amount');

                if (addtn_charge_amt) {

                    currentRecord.setValue('custrecord_xrc_charge3_vatamt', addtn_charge_amt * (1 + (currentRecord.getValue('custrecord_xrc_charge3_vatrate') / 100)));

                }

            } else if (fieldId === 'custrecord_xrc_id_charges') {

                currentRecord.setValue('custrecord_xrc_id_vatamt', currentRecord.getValue('custrecord_xrc_id_charges') * (1 + (currentRecord.getValue('custrecord_xrc_id_vatrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_cgl_whtrate') {

                currentRecord.setValue('custrecord_xrc_cgl_whtamt', currentRecord.getValue('custrecord_xrc_cgl_insurance') * (1 + (currentRecord.getValue('custrecord_xrc_cgl_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_charge1_whtrate') {

                currentRecord.setValue('custrecord_xrc_charge1_whtamt', currentRecord.getValue('custrecord_xrc_add_charge1_amount') * (1 + (currentRecord.getValue('custrecord_xrc_charge1_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_charge2_whtrate') {

                currentRecord.setValue('custrecord_xrc_charge2_whtamt', currentRecord.getValue('custrecord_xrc_add_charge2_amount') * (1 + (currentRecord.getValue('custrecord_xrc_charge2_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_charge3_whtrate') {

                currentRecord.setValue('custrecord_xrc_charge3_whtamt', currentRecord.getValue('custrecord_xrc_add_charge3_amount') * (1 + (currentRecord.getValue('custrecord_xrc_charge3_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_id_whtrate') {

                currentRecord.setValue('custrecord_xrc_id_whtamt', currentRecord.getValue('custrecord_xrc_id_charges') * (1 + (currentRecord.getValue('custrecord_xrc_id_whtrate') / 100)));

            } else if (fieldId === 'custrecord_xrc_variable_rent') {

                currentRecord.setValue('custrecord_xrc_variable_vat_amt', currentRecord.getValue('custrecord_xrc_variable_rent') * (currentRecord.getValue('custrecord_xrc_variable_vat_rate') / 100));

                currentRecord.setValue('custrecord_xrc_variable_gross_amt', currentRecord.getValue('custrecord_xrc_variable_rent') * (1 + (currentRecord.getValue('custrecord_xrc_variable_vat_rate') / 100)));

                currentRecord.setValue('custrecord_xrc_variable_wht_amt', currentRecord.getValue('custrecord_xrc_variable_rent') * (currentRecord.getValue('custrecord_xrc_variable_wht_rate') / 100));

            }

            setSummaryValues(currentRecord);

        }

        function setSummaryValues(currentRecord) {

            var total_charges = 0, total_vat = 0, total_wht = 0;

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

            var vat_amounts = [
                'custrecord_xrc_basicrent_vat_amt',
                'custrecord_xrc_variable_vat_amt',
                'custrecord_xrc_cusa_vatamt',
                'custrecord_xrc_aircon_vatamt',
                'custrecord_xrc_elec_vatamt',
                'custrecord_xrc_water_vatamt',
                'custrecord_xrc_lpg_vatamt',
                'custrecord_xrc_genset_vatamt',
                'custrecord_xrc_msf_vatamt',
                'custrecord_xrc_servreq_vatamt',
                'custrecord_xrc_lateop_vatamt',
                'custrecord_xrc_pescon_vatamt',
                'custrecord_xrc_bottled_water_vatamt',
                'custrecord_xrc_tenvio_vatamt',
                'custrecord_xrc_bioaug_vatamt',
                'custrecord_xrc_id_vatamt',
                'custrecord_xrc_lateclose_vatamt',
                'custrecord_xrc_cgl_vatamt',
                'custrecord_xrc_charge1_vatamt',
                'custrecord_xrc_charge2_vatamt',
                'custrecord_xrc_charge3_vatamt',
            ];

            var wht_amounts = [
                'custrecord_xrc_basicrent_wht_amt',
                'custrecord_xrc_variable_wht_amt',
                'custrecord_xrc_cusa_whtamt',
                'custrecord_xrc_aircon_whtamt',
                'custrecord_xrc_elec_whtamt',
                'custrecord_xrc_water_whtamt',
                'custrecord_xrc_lpg_whtamt',
                'custrecord_xrc_genset_whtamt',
                'custrecord_xrc_msf_whtamt',
                'custrecord_xrc_servreq_whtamt',
                'custrecord_xrc_lateop_whtamt',
                'custrecord_xrc_pescon_whtamt',
                'custrecord_xrc_bottled_whtamt',
                'custrecord_xrc_tenvio_whtamt',
                'custrecord_xrc_bioaug_whtamt',
                'custrecord_xrc_id_whtamt',
                'custrecord_xrc_lateclose_whtamt',
                'custrecord_xrc_cgl_whtamt',
                'custrecord_xrc_charge1_whtamt',
                'custrecord_xrc_charge2_whtamt',
                'custrecord_xrc_charge3_whtamt',
            ];

            initial_charges.forEach(field => total_charges += parseFloat(currentRecord.getValue(field) || 0));

            vat_amounts.forEach(field => total_vat += parseFloat(currentRecord.getValue(field) || 0));

            wht_amounts.forEach(field => total_wht += parseFloat(currentRecord.getValue(field) || 0));

            currentRecord.setValue({ fieldId: 'custrecord_xrc_bsched_initial_charges', value: total_charges, ignoreFieldChange: true });

            currentRecord.setValue({ fieldId: 'custrecord_xrc_bsched_total_vat_amt', value: total_vat, ignoreFieldChange: true });

            currentRecord.setValue({ fieldId: 'custrecord_xrc_bsched_total_wht', value: total_wht, ignoreFieldChange: true });

            currentRecord.setValue({ fieldId: 'custrecord_xrc_current_billing', value: ((total_charges + total_vat) - total_wht), ignoreFieldChange: true });

        }

        return {
            fieldChanged: fieldChanged,
        };
    }
);