/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 25, 2024
 * 
 */
define([],

    function () {

        const ASSET_TYPE_FIELD_ID = 'custrecord_assettype';
        const IT_EQUIPMENT_TYPE_ID = '1';
        const LEASE_SPACE_TYPE_ID = '3';
        const VEHICLE_TYPE_ID = '2';
        const BUILDING_TYPE_ID = '4';
        const CUSTOM_FORM_FIELD_ID = 'customform';
        const IT_EQUIPMENT_FORM_ID = '384';
        const LEASE_SPACE_FORM_ID = '385';
        const VEHICLE_FORM_ID = '386';
        const ASSET_FORM_ID = '395';
        const CREATE_MODE = 'create';

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            // If form is equal to IT Equipment Form, set
            // default value for Asset Type to IT Equipment

            if (context.mode !== CREATE_MODE) return;

            var asset_type = currentRecord.getValue(ASSET_TYPE_FIELD_ID);

            if (asset_type) return;

            var custom_form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

            // Set asset type that corresponds the form
            if (custom_form === IT_EQUIPMENT_FORM_ID) {

                currentRecord.setValue({ fieldId: ASSET_TYPE_FIELD_ID, value: IT_EQUIPMENT_TYPE_ID, ignoreFieldChange: true });

            } else if (custom_form === LEASE_SPACE_FORM_ID) {

                currentRecord.setValue({ fieldId: ASSET_TYPE_FIELD_ID, value: LEASE_SPACE_TYPE_ID, ignoreFieldChange: true });

            } else if (custom_form === VEHICLE_FORM_ID) {

                currentRecord.setValue({ fieldId: ASSET_TYPE_FIELD_ID, value: VEHICLE_TYPE_ID, ignoreFieldChange: true });

            } else {

                currentRecord.setValue({ fieldId: ASSET_TYPE_FIELD_ID, value: BUILDING_TYPE_ID, ignoreFieldChange: true });

            }

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            var fieldId = context.fieldId;

            // Checking if ASSET TYPE field is changed
            if (fieldId === ASSET_TYPE_FIELD_ID) {

                var asset_type = currentRecord.getValue(fieldId);

                // var custom_form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

                // Change the form that corresponds the selected asset type
                if (asset_type === LEASE_SPACE_TYPE_ID) {

                    currentRecord.setValue(CUSTOM_FORM_FIELD_ID, LEASE_SPACE_FORM_ID);

                } else if (asset_type === VEHICLE_TYPE_ID) {

                    currentRecord.setValue(CUSTOM_FORM_FIELD_ID, VEHICLE_FORM_ID);

                } else if (asset_type === IT_EQUIPMENT_TYPE_ID) {

                    currentRecord.setValue(CUSTOM_FORM_FIELD_ID, IT_EQUIPMENT_FORM_ID);

                } else {

                    currentRecord.setValue(CUSTOM_FORM_FIELD_ID, ASSET_FORM_ID);
                }

            }

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
        };
    }
);