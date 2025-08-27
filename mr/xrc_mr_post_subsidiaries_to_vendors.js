/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jan. 24, 2024
 * 
 */
define(['N/record', 'N/search'],

    function (record, search) {


        function getInputData(context) {

            return createSearch();

        }

        function reduce(context) {

            try {

                var result = JSON.parse(context.values);

                var entity_id = result.id;

                var entity_rec = record.load({
                    type: record.Type.VENDOR,
                    id: entity_id,
                    isDynamic: true,
                });

                var lead_id = entity_rec.getValue('otherrelationships');

                var lead_rec = record.load({
                    type: record.Type.LEAD,
                    id: lead_id,
                    isDynamic: true,
                });

                var lead_category = lead_rec.getValue('category');

                if (lead_category === '2') { // 2 => Associates

                    createSubsidiarySearch().run().each(function (result) {

                        try {

                            lead_rec.selectNewLine({
                                sublistId: 'submachine',
                            });

                            lead_rec.setCurrentSublistValue({
                                sublistId: 'submachine',
                                fieldId: 'subsidiary',
                                value: result.id,
                            });

                            lead_rec.commitLine({
                                sublistId: 'submachine',
                            });

                        } catch (error) {

                        }

                        return true;

                    });

                    log.debug('result', 'updated lead with id: ' + lead_rec.id);
                }


                lead_rec.save({
                    ignoreMandatoryFields: true,
                });

            } catch (error) {

                log.debug('error', error);

            }
        }

        function createSearch() {

            var vendor_search = search.create({
                type: "vendor",
                filters:
                    [
                        ["otherrelationships", "anyof", "CustJob"],
                    ],
                columns:
                    [
                        search.createColumn({ name: "entityid", label: "ID" })
                    ]
            });

            return vendor_search;
        }

        function createSubsidiarySearch() {

            var subsidiary_search = search.create({
                type: "subsidiary",
                filters: [["isinactive", "is", "F"]],
                columns: []
            });

            return subsidiary_search;

        }

        return {
            getInputData: getInputData,
            reduce: reduce,
        };
    }
);