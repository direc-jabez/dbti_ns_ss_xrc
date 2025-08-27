/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 08, 2024
 * 
 */
define(['N/record', 'N/search', 'N/email'],

    function (record, search, email) {

        function getInputData(context) {

            return createBillingScheduleSearch();

        }

        function reduce(context) {

            try {

                var value = JSON.parse(context.values);

                // log.debug('value', value);

                var bsched_rec = record.load({
                    type: 'customrecord_xrc_escalation_schedule',
                    id: value.bsched_id,
                });

                bsched_rec.setValue('custrecord_xrc_tenant7', value.so_tenant);

                bsched_rec.setValue('custrecord_xrc_class7', value.so_class);

                bsched_rec.setValue('custrecord_xrc_dept7', value.so_department);

                bsched_rec.setValue('custrecord_xrc_loc7', value.so_location);

                bsched_rec.setValue('custrecord_xrc_subsidiary7', value.so_subsidiary);

                bsched_rec.setValue('custrecord_xrc_lease_type7', value.so_lease_type);

                bsched_rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createBillingScheduleSearch() {

            var bscheds = [];

            var escalation_sched_search = search.create({
                type: "customrecord_xrc_escalation_schedule",
                filters:
                    [
                        ["custrecord_xrc_esc_sched_estimate", "noneof", "@NONE@"],
                        "AND",
                        ["custrecord_xrc_tenant7", "anyof", "@NONE@"],
                        "AND",
                        ["custrecord_xrc_esc_sched_estimate.mainline", "is", "T"],
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "entity",
                            join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "class",
                            join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                            label: "Class"
                        }),
                        search.createColumn({
                            name: "department",
                            join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                            label: "Department"
                        }),
                        search.createColumn({
                            name: "location",
                            join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                            label: "Location"
                        }),
                        search.createColumn({
                            name: "subsidiary",
                            join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                            label: "Subsidiary"
                        }),
                        search.createColumn({
                            name: "custbody_xrc_lease_type",
                            join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE",
                            label: "Lease Type"
                        })
                    ]
            });

            var escalation_sched_search_values = escalation_sched_search.run().getRange({
                start: 0,
                end: 999,
            });

            for (var i = 0; i < escalation_sched_search_values.length; i++) {

                var result = escalation_sched_search_values[i];

                bscheds.push({
                    bsched_id: result.id,
                    so_tenant: result.getValue({ name: "entity", join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE", }),
                    so_class: result.getValue({ name: "class", join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE", }),
                    so_department: result.getValue({ name: "department", join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE", }),
                    so_location: result.getValue({ name: "location", join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE", }),
                    so_subsidiary: result.getValue({ name: "subsidiary", join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE", }),
                    so_lease_type: result.getValue({ name: "custbody_xrc_lease_type", join: "CUSTRECORD_XRC_ESC_SCHED_ESTIMATE", }),
                });
            }

            return bscheds;

        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);