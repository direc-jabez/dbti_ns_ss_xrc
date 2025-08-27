/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/record', 'N/search', 'N/runtime'],

    function (record, search, runtime) {

        const ENTITY_EMPLOYEE = 'employee';
        const STATUS_FIELD_ID = 'custrecord_xrc_tenant_asst_iss_status';
        const STATUS_APPROVED = '2';
        const CUSTOMER_FIELD_ID = 'custrecord_xrc_customer10';
        const DATE_FIELD_ID = 'custrecord_xrc_date10';
        const SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary11';
        const LOCATION_FIELD_ID = 'custrecord_xrc_location11';
        const DEPARTMENT_FIELD_ID = 'custrecord_xrc_tai_department';
        const CLASS_FIELD_ID = 'custrecord_xrc_tai_class';
        const REMARKS_FIELD_ID = 'custrecord_xrc_remarks11';
        const TOTAL_AMOUNT_FIELD_ID = 'custrecord_xrc_total_amount';
        const ATD_NUMBER_FIELD_ID = 'custrecord_xrc_atd_num11';
        const DEPOSIT_NUMBER_FIELD_ID = 'custrecord_xrc_deposit_num11';
        const DEPOSIT_TO_ACCOUNT_FIELD_ID = 'custrecord_xrc_dep_to_acct';
        const LINKED_DEPOSIT_NUMBER_FIELD_ID = 'custrecord_xrc_linked_deposit';
        const ITEMS_SUBLIST_ID = 'recmachcustrecord_xrc_ta_issuance_num11';
        const TENANT_SUBLIST_FIELD_ID = 'custrecord_xrc_tenant11';
        const SUBSIDIARY_SUBLIST_FIELD_ID = 'custrecord_xrc_subsidiary12';
        const LOCATION_SUBLIST_FIELD_ID = 'custrecord_xrc_location12';
        const TENANT_ASSET_SUBLIST_FIELD_ID = 'custrecord_xrc_tenant_asset11';
        const QTY_SUBLIST_FIELD_ID = 'custrecord_xrc_qty11';
        const RATE_SUBLIST_FIELD_ID = 'custrecord_xrc_rate11';
        const AMOUNT_SUBLIST_FIELD_ID = 'custrecord_xrc_amount11';
        const TENANT_ASSET_RECORD_TYPE = 'customrecord_xrc_tenant_asset';
        const TA_QUANTITY_FIELD_ID = 'custrecord_xrc_ten_asset_qty';
        const TA_QUANTITY_SOLD_FIELD_ID = 'custrecord_xrc_qty_sold';
        const TA_QUANTITY_AVAILABLE_FIELD_ID = 'custrecord_xrc_qty_avail';
        const CM_CUSTOMER_FIELD_ID = 'entity';
        const CM_DATE_FIELD_ID = 'trandate';
        const CM_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const CM_LOCATION_FIELD_ID = 'location';
        const CM_MEMO_FIELD_ID = 'memo';
        const CM_TENANT_ASSET_FIELD_ID = 'custbody_xrc_tenant_asset_num';
        const CM_ITEMS_SUBLIST_ID = 'item';
        const CM_ITEM_FIELD_SUBLIST_ID = 'item';
        const LEASE_0020_ITEM_ID = '5254';
        const CM_QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const CM_RATE_SUBLIST_FIELD_ID = 'rate';
        const CM_TAX_CODE_SUBLIST_FIELD_ID = 'taxcode';
        const UNDEF_PH_TAX_ID = '5';
        const AUTHORITY_TO_DEDUCT_RECORD_TYPE = 'customrecord_xrc_auth_to_deduct';
        const ATD_CUSTOM_FIELD_ID = 'customform';
        const ATD_ITEMS_FORM_ID = '404';
        const ATD_DATE_FIELD_ID = 'custrecord_xrc_date3';
        const ATD_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category3';
        const CASH_ADVANCE_FUND_CATEGORY_ID = '8';
        const ATD_EMPLOYEE_FIELD_ID = 'custrecord_xrc_fund_custodian3';
        const ATD_REMARKS_FIELD_ID = 'custrecord_xrc_remarks3';
        const ATD_AMOUNT_FIELD_ID = 'custrecord_xrc_amount3';
        const ATD_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary3';
        const ATD_LOCATION_FIELD_ID = 'custrecord_xrc_location3';
        const ATD_STATUS_FIELD_ID = 'custrecord_xrc_atd_status';
        const ATD_CLEARING_ACCOUNT_FIELD_ID = 'custrecord_xrc_fund_account';
        const ATD_CLEARING_ACCOUNT_ID = '1046';
        const ATD_ADVANCES_ACCOUNT_FIELD_ID = 'custrecord_xrc_deposited_to_account';
        const ACCOUNTS_RECEIVABLE_SALARY_LOAN_ACCOUNT_ID = '1';
        const ATD_JE_NUMBER_FIELD_ID = 'custrecord_xrc_je_num3';
        const JE_DATE_FIELD_ID = 'trandate';
        const JE_MEMO_FIELD_ID = 'memo';
        const JE_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const JE_LOCATION_FIELD_ID = 'location';
        const JE_DEPARTMENT_FIELD_ID = 'department';
        const JE_CLASS_FIELD_ID = 'class';
        const JE_LINE_SUBLIST_ID = 'line';
        const JE_ACCOUNT_SUBLIST_FIELD_ID = 'account';
        const JE_DEBIT_SUBLIST_FIELD_ID = 'debit';
        const JE_CREDIT_SUBLIST_FIELD_ID = 'credit';
        const JE_ATD_NUMBER_FIELD_ID = 'custbody_xrc_atd_num';
        const JE_APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const DEP_DEPOSITED_BY_FIELD_ID = 'custbody_xrc_deposited_by';
        const DEP_DEPOSIT_NUMBER_FIELD_ID = 'tranid';
        const DEP_PAYMENT_AMOUNT_FIELD_ID = 'payment';
        const DEP_DATE_FIELD_ID = 'trandate';
        const DEP_MEMO_FIELD_ID = 'memo';
        const DEP_SUBSIDIARY_FIELD_ID = 'subsidiary';
        const DEP_ACCOUNT_FIELD_ID = 'account';
        const DEP_LOCATION_FIELD_ID = 'location';
        const DEP_DEPARTMENT_FIELD_ID = 'department';
        const DEP_CLASS_FIELD_ID = 'class';
        const DEP_OTHER_DEPOSITS_SUBLIST_ID = 'other';
        const DEP_NAME_SUBLIST_FIELD_ID = 'entity';
        const DEP_ACCOUNT_SUBLIST_FIELD_ID = 'account';
        const ACCOUNTS_RECEIVABLE_TRADE_ACCOUNT_ID = '119';
        const DEP_NUMBER_SUBLIST_FIELD_ID = 'refnum';
        const DEP_AMOUNT_SUBLIST_FIELD_ID = 'amount';
        const FOR_APPROVAL_FIELD_ID = 'custrecord_xrc_tai_for_approval';
        const PREPARED_BY_FIELD_ID = 'custrecord_xrc_prepared_by11';
        const PENDING_APPROVAL_STATUS = '1';
        const REJECTED_STATUS = '3';
        const COO_ID = 1460;
        const APPROVAL_THREE_FIELD_ID = 'custrecord_xrc_tai_approval3';
        const APPROVAL_FOUR_FIELD_ID = 'custrecord_xrc_tai_approval4';


        function beforeLoad(context) {

            var newRecord = context.newRecord;

            var form = context.form;

            // Include the path of the client script
            form.clientScriptModulePath = './xrc_cs_tenant_asset_issuance.js';

            var approval_status = newRecord.getValue(STATUS_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            var currentUser = runtime.getCurrentUser();

            if (context.type === context.UserEventType.VIEW) {

                var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

                if (!for_approval && parseInt(prepared_by) === currentUser.id) {

                    // Adding button Submit for Aprpoval
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === REJECTED_STATUS ? 'Resubmit for Approval' : 'Submit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                } else if (approval_status === PENDING_APPROVAL_STATUS) {

                    var entity_type = getEntityType(newRecord.getValue(CUSTOMER_FIELD_ID));

                    var is_employee = entity_type === ENTITY_EMPLOYEE;

                    var next_approver = getNextApproverRole(newRecord, is_employee);

                    if (next_approver) {

                        var is_coo = is_employee === ENTITY_EMPLOYEE ? (next_approver.field === APPROVAL_FOUR_FIELD_ID && currentUser.role === COO_ID) : (next_approver.field === APPROVAL_THREE_FIELD_ID && currentUser.role === COO_ID);

                        if (currentUser.role === next_approver.role || is_coo) {

                            // Adding the button Approve
                            form.addButton({
                                id: 'custpage_approve',
                                label: currentUser.role === 1467 ? 'Note' : 'Approve',
                                functionName: 'onApproveBtnClick("' + next_approver.field + '")',
                            });

                            // Adding the button Reject
                            form.addButton({
                                id: 'custpage_reject',
                                label: 'Reject',
                                functionName: 'onRejectBtnClick()',
                            });

                        }

                    }

                }

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                var total = getTotalAmount(newRecord);

                // Setting the total amount of the current record
                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        [TOTAL_AMOUNT_FIELD_ID]: total,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

            }

            if (context.type === context.UserEventType.EDIT) {

                var status = newRecord.getValue(STATUS_FIELD_ID);

                if (status === STATUS_APPROVED) {

                    // Updating the Tenant Asset record on approval
                    updateTenantAsset(newRecord, status);

                }

            }

        }

        // Getting the total amount
        function getTotalAmount(newRecord) {

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var total = 0;

            for (var line = 0; line < items_lines; line++) {

                var amount = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                total += amount;

            }

            return total;

        }

        function updateTenantAsset(newRecord, status) {

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var total = 0;

            var entity_type = getEntityType(newRecord.getValue(CUSTOMER_FIELD_ID));

            for (var line = 0; line < items_lines; line++) {

                var amount = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: AMOUNT_SUBLIST_FIELD_ID,
                    line: line,
                });

                total += amount;

                var id = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: TENANT_ASSET_SUBLIST_FIELD_ID,
                    line: line,
                });

                var tenant = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: TENANT_SUBLIST_FIELD_ID,
                    line: line,
                });

                var subsidiary = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: SUBSIDIARY_SUBLIST_FIELD_ID,
                    line: line,
                });

                var location = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: LOCATION_SUBLIST_FIELD_ID,
                    line: line,
                });

                var qty = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: QTY_SUBLIST_FIELD_ID,
                    line: line,
                });

                var rate = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: RATE_SUBLIST_FIELD_ID,
                    line: line,
                });

                // Getting the quantity fields for the linked Tenant Asset
                var ta_fieldLookUp = search.lookupFields({
                    type: TENANT_ASSET_RECORD_TYPE,
                    id: id,
                    columns: [TA_QUANTITY_FIELD_ID, TA_QUANTITY_SOLD_FIELD_ID, TA_QUANTITY_AVAILABLE_FIELD_ID]
                });

                var new_qty_sold = (parseInt(ta_fieldLookUp[TA_QUANTITY_SOLD_FIELD_ID]) || 0) + qty;

                var new_qty_available = (parseInt(ta_fieldLookUp[TA_QUANTITY_FIELD_ID]) || 0) - new_qty_sold;

                // Updating the values
                record.submitFields({
                    type: TENANT_ASSET_RECORD_TYPE,
                    id: id,
                    values: {
                        [TA_QUANTITY_SOLD_FIELD_ID]: new_qty_sold,
                        [TA_QUANTITY_AVAILABLE_FIELD_ID]: new_qty_available,
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                // Depending on the entity type, create credit memo or deposit transaction
                if (entity_type === ENTITY_EMPLOYEE) {

                    createCreditMemo(newRecord, id, tenant, subsidiary, location, qty, rate);

                } else {

                    var deposit_id = createDeposit(newRecord, tenant, subsidiary, location, amount);

                }

            }

            // Create Authority to Deduct on entity type Employee
            if (entity_type === ENTITY_EMPLOYEE) {

                var atd_id = createAuthorityToDeduct(newRecord, subsidiary, location, total);

            }

            // Setting the total amount of the current record amd
            // other fields
            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [ATD_NUMBER_FIELD_ID]: atd_id || null,
                    [LINKED_DEPOSIT_NUMBER_FIELD_ID]: deposit_id || null,
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

        }

        function createCreditMemo(newRecord, asset_id, tenant, subsidiary, location, qty, rate) {
            log.debug('params', [asset_id, tenant, subsidiary, location, qty, rate]);

            // Creating credit memo for every line of Tenant Asset Issuance
            var cm_rec = record.create({
                type: record.Type.CREDIT_MEMO,
                isDynamic: true,
            });

            // Setting body fields
            cm_rec.setValue(CM_CUSTOMER_FIELD_ID, tenant);

            cm_rec.setValue(CM_DATE_FIELD_ID, newRecord.getValue(DATE_FIELD_ID));

            cm_rec.setValue(CM_MEMO_FIELD_ID, newRecord.getValue(REMARKS_FIELD_ID));

            cm_rec.setValue(CM_SUBSIDIARY_FIELD_ID, subsidiary);

            cm_rec.setValue(CM_LOCATION_FIELD_ID, location);

            cm_rec.setValue(CM_TENANT_ASSET_FIELD_ID, asset_id);

            // Setting item line values
            cm_rec.selectNewLine({
                sublistId: CM_ITEMS_SUBLIST_ID,
            });

            cm_rec.setCurrentSublistValue({
                sublistId: CM_ITEMS_SUBLIST_ID,
                fieldId: CM_ITEM_FIELD_SUBLIST_ID,
                value: LEASE_0020_ITEM_ID,
                forceSyncSourcing: true,
            });

            cm_rec.setCurrentSublistValue({
                sublistId: CM_ITEMS_SUBLIST_ID,
                fieldId: CM_QUANTITY_SUBLIST_FIELD_ID,
                value: qty,
                forceSyncSourcing: true,
            });

            cm_rec.setCurrentSublistValue({
                sublistId: CM_ITEMS_SUBLIST_ID,
                fieldId: CM_RATE_SUBLIST_FIELD_ID,
                value: rate,
                forceSyncSourcing: true,
            });

            cm_rec.setCurrentSublistValue({
                sublistId: CM_ITEMS_SUBLIST_ID,
                fieldId: CM_TAX_CODE_SUBLIST_FIELD_ID,
                value: UNDEF_PH_TAX_ID,
                forceSyncSourcing: true,
            });

            cm_rec.commitLine({
                sublistId: CM_ITEMS_SUBLIST_ID,
            });

            // Applying the amount

            var apply_lines = cm_rec.getLineCount({
                sublistId: 'apply',
            });

            for (var line = 0; line < apply_lines; line++) {

                cm_rec.selectLine({
                    sublistId: 'apply',
                    line: line,
                });

                cm_rec.setCurrentSublistValue({
                    sublistId: 'apply',
                    fieldId: 'apply',
                    value: true,
                });

            }

            cm_rec.save({
                ignoreMandatoryFields: true,
            });

        }

        function createAuthorityToDeduct(newRecord, subsidiary, location, total) {

            // Creating Authority to Deduct for the tag Employee
            var atd_rec = record.create({
                type: AUTHORITY_TO_DEDUCT_RECORD_TYPE,
                isDynamic: true,
            });

            atd_rec.setValue(ATD_CUSTOM_FIELD_ID, ATD_ITEMS_FORM_ID);

            atd_rec.setValue(ATD_DATE_FIELD_ID, newRecord.getValue(DATE_FIELD_ID));

            atd_rec.setValue(ATD_FUND_CATEGORY_FIELD_ID, CASH_ADVANCE_FUND_CATEGORY_ID);

            atd_rec.setValue(ATD_EMPLOYEE_FIELD_ID, newRecord.getValue(CUSTOMER_FIELD_ID));

            atd_rec.setValue(ATD_REMARKS_FIELD_ID, newRecord.getValue(REMARKS_FIELD_ID));

            atd_rec.setValue(ATD_AMOUNT_FIELD_ID, total);

            atd_rec.setValue(ATD_SUBSIDIARY_FIELD_ID, subsidiary);

            atd_rec.setValue(ATD_LOCATION_FIELD_ID, location);

            atd_rec.setValue(ATD_STATUS_FIELD_ID, STATUS_APPROVED);

            atd_rec.setValue(ATD_CLEARING_ACCOUNT_FIELD_ID, ATD_CLEARING_ACCOUNT_ID);

            atd_rec.setValue(ATD_ADVANCES_ACCOUNT_FIELD_ID, ACCOUNTS_RECEIVABLE_SALARY_LOAN_ACCOUNT_ID);

            var atd_id = atd_rec.save({
                ignoreMandatoryFields: true,
            });

            // updateEmployeeRecord(newRecord.getValue(CUSTOMER_FIELD_ID), CASH_ADVANCE_FUND_CATEGORY_ID);

            var je_id = createJournalEntry(atd_id, atd_rec);

            // Link the created Journal Entry to created Authority to Deduct record 
            record.submitFields({
                type: AUTHORITY_TO_DEDUCT_RECORD_TYPE,
                id: atd_id,
                values: {
                    [ATD_JE_NUMBER_FIELD_ID]: je_id,
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            return atd_id;
        }

        function createDeposit(newRecord, tenant, subsidiary, location, amount) {

            // Creating customer deposit for every line of Tenant Asset Issuance
            var dep_rec = record.create({
                type: record.Type.DEPOSIT,
                isDynamic: true,
            });

            // Setting body fields
            dep_rec.setValue(DEP_DATE_FIELD_ID, newRecord.getValue(DATE_FIELD_ID));

            dep_rec.setValue(DEP_DEPOSIT_NUMBER_FIELD_ID, newRecord.getValue(DEPOSIT_NUMBER_FIELD_ID));

            dep_rec.setValue(DEP_MEMO_FIELD_ID, newRecord.getValue(REMARKS_FIELD_ID));

            dep_rec.setValue(DEP_ACCOUNT_FIELD_ID, newRecord.getValue(DEPOSIT_TO_ACCOUNT_FIELD_ID));

            dep_rec.setValue(DEP_SUBSIDIARY_FIELD_ID, subsidiary);

            dep_rec.setValue(DEP_DEPOSITED_BY_FIELD_ID, newRecord.getValue(CUSTOMER_FIELD_ID));

            dep_rec.setValue(DEP_LOCATION_FIELD_ID, location);

            dep_rec.setValue(DEP_DEPARTMENT_FIELD_ID, newRecord.getValue(DEPARTMENT_FIELD_ID));

            dep_rec.setValue(DEP_CLASS_FIELD_ID, newRecord.getValue(CLASS_FIELD_ID));

            // Setting item line values
            dep_rec.selectNewLine({
                sublistId: DEP_OTHER_DEPOSITS_SUBLIST_ID,
            });

            dep_rec.setCurrentSublistValue({
                sublistId: DEP_OTHER_DEPOSITS_SUBLIST_ID,
                fieldId: DEP_NAME_SUBLIST_FIELD_ID,
                value: tenant,
            });

            dep_rec.setCurrentSublistValue({
                sublistId: DEP_OTHER_DEPOSITS_SUBLIST_ID,
                fieldId: DEP_ACCOUNT_SUBLIST_FIELD_ID,
                value: ACCOUNTS_RECEIVABLE_TRADE_ACCOUNT_ID,
            });

            dep_rec.setCurrentSublistValue({
                sublistId: DEP_OTHER_DEPOSITS_SUBLIST_ID,
                fieldId: DEP_NUMBER_SUBLIST_FIELD_ID,
                value: newRecord.getValue(DEPOSIT_NUMBER_FIELD_ID),
            });

            dep_rec.setCurrentSublistValue({
                sublistId: DEP_OTHER_DEPOSITS_SUBLIST_ID,
                fieldId: DEP_AMOUNT_SUBLIST_FIELD_ID,
                value: amount,
            });

            dep_rec.commitLine({
                sublistId: DEP_OTHER_DEPOSITS_SUBLIST_ID,
            });

            // Save the customer deposit record
            var dep_id = dep_rec.save({
                ignoreMandatoryFields: true,
            });

            return dep_id;

        }

        function createJournalEntry(atd_id, atd_rec) {

            // Creating journal entry record
            var journal_entry = record.create({
                type: record.Type.JOURNAL_ENTRY,
                isDynamic: true,
            });

            // Setting body fields
            journal_entry.setValue(JE_DATE_FIELD_ID, atd_rec.getValue(ATD_DATE_FIELD_ID));

            journal_entry.setValue(JE_MEMO_FIELD_ID, atd_rec.getValue(ATD_REMARKS_FIELD_ID));

            journal_entry.setValue(JE_SUBSIDIARY_FIELD_ID, atd_rec.getValue(ATD_SUBSIDIARY_FIELD_ID));

            journal_entry.setValue(JE_LOCATION_FIELD_ID, atd_rec.getValue(ATD_LOCATION_FIELD_ID));

            // journal_entry.setValue(JE_DEPARTMENT_FIELD_ID, atd_rec.getValue(FR_DEPARTMENT_FIELD_ID) || null);

            // journal_entry.setValue(JE_CLASS_FIELD_ID, atd_rec.getValue(FR_CLASS_FIELD_ID) || null);

            journal_entry.setValue(JE_ATD_NUMBER_FIELD_ID, atd_id);

            journal_entry.setValue(JE_APPROVAL_STATUS_FIELD_ID, STATUS_APPROVED);

            // Setting line sublist fields

            // Debit line
            journal_entry.selectNewLine({
                sublistId: JE_LINE_SUBLIST_ID,
            });

            journal_entry.setCurrentSublistValue({
                sublistId: JE_LINE_SUBLIST_ID,
                fieldId: JE_ACCOUNT_SUBLIST_FIELD_ID,
                value: atd_rec.getValue(ATD_ADVANCES_ACCOUNT_FIELD_ID),
            });

            journal_entry.setCurrentSublistValue({
                sublistId: JE_LINE_SUBLIST_ID,
                fieldId: JE_DEBIT_SUBLIST_FIELD_ID,
                value: atd_rec.getValue(ATD_AMOUNT_FIELD_ID),
            });

            journal_entry.commitLine({
                sublistId: JE_LINE_SUBLIST_ID,
            });

            // Credit line
            journal_entry.selectNewLine({
                sublistId: JE_LINE_SUBLIST_ID,
            });

            journal_entry.setCurrentSublistValue({
                sublistId: JE_LINE_SUBLIST_ID,
                fieldId: JE_ACCOUNT_SUBLIST_FIELD_ID,
                value: atd_rec.getValue(ATD_CLEARING_ACCOUNT_FIELD_ID),
            });

            journal_entry.setCurrentSublistValue({
                sublistId: JE_LINE_SUBLIST_ID,
                fieldId: JE_CREDIT_SUBLIST_FIELD_ID,
                value: atd_rec.getValue(ATD_AMOUNT_FIELD_ID),
            });

            journal_entry.commitLine({
                sublistId: JE_LINE_SUBLIST_ID,
            });

            var je_id = journal_entry.save({
                ignoreMandatoryFields: true,
            });

            return je_id;

        }

        function getEntityType(entity_id) {

            // Getting the record type of the tagged customer
            // Initial solution on finding the recordType
            // Can be improved ? I guess ?
            try {

                record.load({
                    type: record.Type.CUSTOMER,
                    id: entity_id,
                });

                return 'customer';

            } catch (error) {

                return 'employee';

            }


        }

        function getNextApproverRole(newRecord, is_employee) {

            var fields = is_employee ? ['custrecord_xrc_tai_approval1', 'custrecord_xrc_tai_approval2', 'custrecord_xrc_tai_approval3', 'custrecord_xrc_tai_approval4'] : ['custrecord_xrc_tai_approval1', 'custrecord_xrc_tai_approval2', 'custrecord_xrc_tai_approval3'];
            // [Logistics Manager, Purchasing Head, HR Head, President] : [Logistics Manager, Purchasing Head, President]
            var roles = is_employee ? [1419, 1420, 1467, 1475] : [1419, 1420, 1475];

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked) {

                    return {
                        field: fields[i],
                        role: roles[i]
                    };
                }

            }

        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);