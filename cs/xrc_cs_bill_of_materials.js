/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 * 
 */
define(['N/search', 'N/currentRecord'],

    function (search, currRec) {


        const MODE_CREATE = 'create';
        const BOM_NUM_FIELD_ID = 'name';
        const LOCATION_FIELD_ID = 'custrecord_xrc_bom_location';
        const ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_bom_link';
        const ITEMS_SUBLIST_FIELD_ID = 'custrecord_xrc_bom_item';
        const QTY_AVAILABLE_SUBLIST_FIELD_ID = 'custrecord_xrc_bom_qty_available';
        const ORIGINAL_QTY_SUBLIST_FIELD_ID = 'custrecord_xrc_bom_original_qty';
        const QTY_TO_BE_PURCHASED_FIELD_ID = 'custrecord_xrc_bom_to_be_purchased';
        const ESTIMATED_RATE_FIELD_ID = 'custrecord_xrc_bom_est_rate';
        const ESTIMATED_TOTAL_AMOUNT_FIELD_ID = 'custrecord_xrc_bom_est_total_amt';
        const QTY_TO_BE_REQUESTED_FIELD_ID = 'custrecord_xrc_bom_qty_to_be_requested';

        // Global variables
        var g_isApproveBtnClick = false;
        var g_isRejectBtnClick = false;
        var g_isCloseBtnClick = false;

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            if (context.mode === MODE_CREATE) {

                // Setting default value for BOM #
                currentRecord.setValue(BOM_NUM_FIELD_ID, 'To be generated');

                // Get the BOM# field
                var bom_num_field = currentRecord.getField({
                    fieldId: BOM_NUM_FIELD_ID,
                });

                // Disable the field
                bom_num_field.isDisabled = true;

            }


        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var sublistId = context.sublistId;

            var fieldId = context.fieldId;

            // Check if the changes were made in ITEMS_SUBLIST_ID
            if (sublistId === ITEMS_SUBLIST_ID) {

                if (fieldId === ITEMS_SUBLIST_FIELD_ID) {

                    var item_id = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ITEMS_SUBLIST_FIELD_ID,
                    });

                    var location = currentRecord.getValue(LOCATION_FIELD_ID);

                    // Getting the qty available
                    var available = getQtyAvailable(item_id, location);

                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_AVAILABLE_SUBLIST_FIELD_ID,
                        value: available,
                    });

                } else if (fieldId === ORIGINAL_QTY_SUBLIST_FIELD_ID) {

                    var original_qty = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ORIGINAL_QTY_SUBLIST_FIELD_ID,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_TO_BE_REQUESTED_FIELD_ID,
                        value: original_qty,
                    });

                } else if (fieldId === ESTIMATED_RATE_FIELD_ID) {

                    var original_qty = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ORIGINAL_QTY_SUBLIST_FIELD_ID,
                    });

                    var estimated_rate = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ESTIMATED_RATE_FIELD_ID,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ESTIMATED_TOTAL_AMOUNT_FIELD_ID,
                        value: original_qty * estimated_rate,
                    });

                }

            }


        }


        function onApproveBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isApproveBtnClick) {

                g_isApproveBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" + currentRecord.type + "&approve=T&id=" + currentRecord.id;

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
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" + currentRecord.type + "&approve=F&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onCloseBtnClick() {

            var currentRecord = currRec.get();

            // Check if the button is already clicked
            // This is to prevent calling the link multiple times
            if (!g_isRejectBtnClick) {

                g_isRejectBtnClick = true;

                // Redirect to the approval link
                window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" + currentRecord.type + "&close=T&id=" + currentRecord.id;

            } else {

                alert('You have already submitted the form.');

            }

        }

        function onTransferOrderBtnClick() {

            var currentRecord = currRec.get();

            // Redirect to Transfer Order together with the ID of the BOM
            location.href = "https://9794098.app.netsuite.com/app/accounting/transactions/trnfrord.nl?whence=&origin_id=" + currentRecord.id;

        }


        /**
         * Getting the available quantity of the item on all locations except for the selected location
         * 
         * @param {*} item_id - the id of the selected item
         * @param {*} location_id - the id of the selected location
         * @returns avaiable
         */
        function getQtyAvailable(item_id, location_id) {

            var available = 0;

            var item_search = search.create({
                type: "item",
                filters:
                    [
                        ["internalid", "anyof", item_id],
                        "AND",
                        ["inventorylocation", "noneof", location_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "locationquantityavailable", label: "Location Available" })
                    ]
            });

            item_search.run().each(function (result) {

                available += parseInt(result.getValue('locationquantityavailable'));

                return true;
            });

            return available || 0;

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            onApproveBtnClick: onApproveBtnClick,
            onRejectBtnClick: onRejectBtnClick,
            onCloseBtnClick: onCloseBtnClick,
            onTransferOrderBtnClick: onTransferOrderBtnClick,
        };
    }
);