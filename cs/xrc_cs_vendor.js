/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define(['N/search'],

    function (search) {

        // Global variables
        var g_mode = '';
        var g_entity_id = '';

        const MODE_CREATE = 'create';
        const ENTITY_ID_FIELD_ID = 'entityid';
        const COMPANY_NAME_FIELD_ID = 'companyname';
        const CATEGORY_FIELD_ID = 'category';
        const CATEGORY_TRADE = '5';
        const SUBSIDIARY_SUBLIST_ID = 'submachine';
        const SUBSIDIARY_SUBLIST_FIELD_ID = 'subsidiary';


        function pageInit(context) {

            // Get the current context
            g_mode = context.mode;

            var currentRecord = context.currentRecord;

            // Checking if current context is on CREATE
            if (g_mode === MODE_CREATE) {

                // Setting default value for Vendor ID field 
                currentRecord.setValue(ENTITY_ID_FIELD_ID, 'To be generated');

            } else {

                // Saving the original id of the vendor
                g_entity_id = currentRecord.getValue(ENTITY_ID_FIELD_ID);

            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            // Get the changed field
            var fieldId = context.fieldId;

            if (fieldId === COMPANY_NAME_FIELD_ID) {

                // Checking if current context is on CREATE
                if (g_mode === MODE_CREATE) {

                    currentRecord.setValue(ENTITY_ID_FIELD_ID, 'To be generated');

                } else {

                    // Get the id only, we will be using this for concantenation for the new company name
                    let entity_id = g_entity_id.split(" ")[0];

                    var company_name = currentRecord.getValue(COMPANY_NAME_FIELD_ID);

                    // Concatenate the id and the new company name
                    currentRecord.setValue(ENTITY_ID_FIELD_ID, entity_id + ' ' + company_name);

                }

            } else if (fieldId === CATEGORY_FIELD_ID) {

                var category = currentRecord.getValue(fieldId);

                if (category === CATEGORY_TRADE) {

                    var subsidiary_ids = getSubsidiaryIds();

                    subsidiary_ids.forEach(subsidiary_id => {

                        currentRecord.selectNewLine({
                            sublistId: SUBSIDIARY_SUBLIST_ID,
                        });

                        currentRecord.setCurrentSublistValue({
                            sublistId: SUBSIDIARY_SUBLIST_ID,
                            fieldId: SUBSIDIARY_SUBLIST_FIELD_ID,
                            value: subsidiary_id,
                        });

                        currentRecord.commitLine({
                            sublistId: SUBSIDIARY_SUBLIST_ID,
                        });
                    });

                } else {

                    var subsidiaries_lines = currentRecord.getLineCount({
                        sublistId: SUBSIDIARY_SUBLIST_ID,
                    });

                    if (subsidiaries_lines) {

                        // Loop backward to avoid index issues when removing lines
                        for (var line = subsidiaries_lines - 1; line >= 0; line--) {
                            currentRecord.removeLine({
                                sublistId: SUBSIDIARY_SUBLIST_ID,
                                line: line,
                                ignoreRecalc: true,
                            });
                        }

                    }

                }

            }

        }

        function getSubsidiaryIds() {

            var subsidiary_ids = [];

            var subsidiary_search = search.create({
                type: "subsidiary",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["iselimination", "is", "F"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            label: "Internal ID",
                            sort: search.Sort.ASC,
                        })
                    ]
            });

            subsidiary_search.run().each(function (result) {

                subsidiary_ids.push(result.id);

                return true;
            });

            return subsidiary_ids;

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
        };
    }
);