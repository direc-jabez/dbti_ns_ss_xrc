/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define(['N/search', 'N/ui/serverWidget'],

    function (search, serverWidget) {

        const SEARCH_ID = 'customsearch_xrc_fa_search';

        function beforeLoad(context) {

            var form = context.form;

            if (context.type === context.UserEventType.VIEW) {

                var emp_id = context.newRecord.id;

                // Building custom sublist for the list Fixed Asset Assignment
                buildCustomSublist(form, emp_id);
            }

        }

        function buildCustomSublist(form, emp_id) {

            // Creating the sublist and assigning it to the Fixed Asset Assignment subtab
            var fa_assignment_sublist = form.addSublist({
                id: 'custpage_fa_assignment',
                type: serverWidget.SublistType.LIST,
                label: 'Fixed Asset Assignment',
                tab: 'custom776',
            });

            // Creating the sublist fields, make sure the ids of each fields are unique to each other

            var fa_num_field = fa_assignment_sublist.addField({
                id: 'custpage_fa_num',
                label: 'Fixed Asset No.',
                type: serverWidget.FieldType.TEXT,
            });

            // Set the display type as INLINE so it won't be editable
            fa_num_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var fa_name_field = fa_assignment_sublist.addField({
                id: 'custpage_fa_name',
                label: 'Fixed Asset Name',
                type: serverWidget.FieldType.TEXT,
            });

            fa_name_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var fa_serial_num_field = fa_assignment_sublist.addField({
                id: 'custpage_fa_serial_num',
                label: 'Serial No.',
                type: serverWidget.FieldType.TEXT,
            });

            fa_serial_num_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var fa_date_issued_field = fa_assignment_sublist.addField({
                id: 'custpage_fa_date_issued',
                label: 'Date Issued',
                type: serverWidget.FieldType.TEXT,
            });

            fa_date_issued_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var fa_returned_field = fa_assignment_sublist.addField({
                id: 'custpage_fa_returned',
                label: 'Returned',
                type: serverWidget.FieldType.TEXT,
            });

            fa_returned_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var fa_date_returned_field = fa_assignment_sublist.addField({
                id: 'custpage_fa_date_returned',
                label: 'Date Returned',
                type: serverWidget.FieldType.TEXT,
            });

            fa_date_returned_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            // Calling the loadFixedAssetSearch function to get the fixed assets
            // assigned to the employee
            var emp_fa_search_values = loadFixedAssetSearch(emp_id).run().getRange({
                start: 0,
                end: 1000,
            });

            // Traversing the results
            for (var i = 0; i < emp_fa_search_values.length; i++) {

                var result = emp_fa_search_values[i];

                // Setting the retrieved values on each sublist fields
                fa_assignment_sublist.setSublistValue({
                    id: 'custpage_fa_num',
                    value: '<a class="dottedlink viewitem" href="/app/common/custom/custrecordentry.nl?rectype=1110&id=' + result.id + '">' + result.getValue('name') + '</a>',
                    line: i,
                });

                fa_assignment_sublist.setSublistValue({
                    id: 'custpage_fa_name',
                    value: result.getValue('altname'),
                    line: i,
                });

                fa_assignment_sublist.setSublistValue({
                    id: 'custpage_fa_serial_num',
                    value: result.getValue('custrecord_assetserialno'),
                    line: i,
                });

                fa_assignment_sublist.setSublistValue({
                    id: 'custpage_fa_date_issued',
                    value: result.getValue('custrecord_xrc_fam_date_issued') || null,
                    line: i,
                });

                fa_assignment_sublist.setSublistValue({
                    id: 'custpage_fa_returned',
                    value: result.getValue('custrecord_xrc_fam_returned') === true ? 'Yes' : 'No',
                    line: i,
                });

                fa_assignment_sublist.setSublistValue({
                    id: 'custpage_fa_date_returned',
                    value: result.getValue('custrecord_xrc_fam_date_returned') || null,
                    line: i,
                });

            }

        }

        function loadFixedAssetSearch(emp_id) {

            // Load the search
            var fa_search = search.load({
                id: SEARCH_ID,
            });

            // Get the filters of the search
            var filters = fa_search.filters;

            // Create and push the filter into the search filters
            filters.push(search.createFilter({
                name: 'internalid',
                join: 'custrecord_assetcaretaker',
                operator: search.Operator.IS,
                values: emp_id,
            }));

            fa_search.filters = filters;

            return fa_search;
        }

        return {
            beforeLoad: beforeLoad,
        };
    }
);