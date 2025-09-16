/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * 
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Aug 06, 2024
 * 
 */
define(['N/search', 'N/record', 'N/runtime', 'N/url', 'N/https'],

    function (search, record, runtime, url, https) {

        const APV_NUM_FIELD_ID = 'custbody_xrc_apv_num';
        const APPLY_PREPAYMENT_RECOUPMENT_FIELD_ID = 'custbody_xrc_apply_prepay_recoup';
        const PRO_RATED_PREPAYMENT_ID = '1';
        const FULL_PREPAYMENT_ID = '2';
        const NO_PREPAYMENT_ID = '3';
        const PO_DOC_NUM_FIELD_ID = 'podocnum';
        const ITEMS_SUBLIST_ID = 'item';
        const ITEMS_SUBLIST_FIELD_ID = 'item';
        const DESCRIPTION_SUBLIST_FIELD_ID = 'description';
        const ADVANCES_FROM_TENANT_ITEM_ID = '5264';
        const QUANTITY_SUBLIST_FIELD_ID = 'quantity';
        const RATE_SUBLIST_FIELD_ID = 'rate';
        const AMOUNT_SUBLIST_FIELD_ID = 'amount';
        const TAXCODE_SUBLIST_FIELD_ID = 'taxcode';
        const CUSTOMER_SUBLIST_FIELD_ID = 'customer';
        const SPACE_NO_SUBLIST_FIELD_ID = 'custcol_xrc_space_num';
        const CM_NO_SUBLIST_FIELD_ID = 'custcol_xrc_cm_num';
        const EXP_WHT_ID = '14';
        const PURCHASE_ORDER_SUBLIST_ID = 'purchaseorders';
        const ID_SUBLIST_FIELD_ID = 'id';
        const BILL_SUBLIST_ID = 'bill';
        const DOC_SUBLIST_FIELD_ID = 'doc';
        const APPLY_SUBLIST_FIELD_ID = 'apply';
        const TOTAL_FIELD_ID = 'total';
        const SUBTOTAL_FIELD_ID = 'subtotal';
        const FOR_APPROVAL_FIELD_ID = 'custbody_xrc_for_approval';
        const OLD_APPROVAL_STATUS_FIELD_ID = 'oldapprovalstatus';
        const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
        const PENDING_APPROVAL_STATUS_ID = '1';
        const APPROVED_STATUS_ID = '2';
        const TERMS_FIELD_ID = 'terms';
        const CHARGE_TO_EMPLOYEE_FIELD_ID = 'custbody_xrc_charge_to_employee';
        const DATE_FIELD_ID = 'custbody_xrc_bill_date';
        const EMPLOYEE_NAME_FIELD_ID = 'custbody_xrc_charge_employee';
        const MEMO_FIELD_ID = 'memo';
        const CHARGE_AMOUNT_FIELD_ID = 'custbody_xrc_charge_amt';
        const SUBSIDIARY_FIELD_ID = 'subsidiary';
        const LOCATION_FIELD_ID = 'location';
        const DEPARTMENT_FIELD_ID = 'department';
        const CLASS_FIELD_ID = 'class';
        const ATD_FIELD_ID = 'custbody_xrc_atd_num';
        const ATD_RECORD_TYPE_ID = 'customrecord_xrc_auth_to_deduct';
        const ATD_CUSTOM_FORM_FIELD_ID = 'customform';
        const ATD_ID_FIELD_ID = 'name';
        const ATD_BILL_FORM_ID = '407';
        const ATD_DATE_FIELD_ID = 'custrecord_xrc_date3';
        const ATD_CREATED_FROM_FIELD_ID = 'custrecord_xrc_created_from';
        const ATD_FUND_CATEGORY_FIELD_ID = 'custrecord_xrc_fund_category3';
        const ATD_CASH_ADVANCE_FUND_CATEGORY_ID = '8';
        const ATD_EMPLOYEE_FIELD_ID = 'custrecord_xrc_fund_custodian3';
        const ATD_REMARKS_FIELD_ID = 'custrecord_xrc_remarks3';
        const ATD_AMOUNT_FIELD_ID = 'custrecord_xrc_amount3';
        const ATD_SUBSIDIARY_FIELD_ID = 'custrecord_xrc_subsidiary3';
        const ATD_LOCATION_FIELD_ID = 'custrecord_xrc_location3';
        const ATD_DEPARTMENT_FIELD_ID = 'custrecord_xrc_department3';
        const ATD_CLASS_FIELD_ID = 'custrecord_xrc_class3';
        const ATD_STATUS_FIELD_ID = 'custrecord_xrc_atd_status';
        const ATD_STATUS_APPROVED_ID = '2';
        const CM_CUSTOMER_FIELD_ID = 'entity';
        const CM_DATE_FIELD_ID = 'trandate';
        const CM_SPACE_NO_FIELD_ID = 'custbody_xrc_space_num';
        const CM_LINKED_VENDOR_BILL_FIELD_ID = 'custbody_xrc_linked_vend_bill';
        const PREPARED_BY_FIELD_ID = 'custbody_xrc_prepared_by';
        const VENDOR_BILL_LAST_NUM_FIELD_ID = 'custscript_vend_bill_last_num';
        const TREASURY_ASSISTANT_ROLE_ID = 1482;
        const TREASURY_HEAD_ROLE_ID = 1483;


        function beforeLoad(context) {

            var currentUser = runtime.getCurrentUser();

            var newRecord = context.newRecord;

            var form = context.form;

            form.clientScriptModulePath = './xrc_cs_bill.js';

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var prepared_by = newRecord.getValue(PREPARED_BY_FIELD_ID);

            var for_approval = newRecord.getValue(FOR_APPROVAL_FIELD_ID);

            if (context.type === context.UserEventType.VIEW) {

                var user_can_edit = canEdit(newRecord, currentUser);

                log.debug('can edit', user_can_edit);

                // Previous condition: (for_approval && currentUser.id === parseInt(prepared_by)) && !user_can_edit

                if (approval_status === APPROVED_STATUS_ID && currentUser.role !== 3) { // 3 => Admin role id

                    form.removeButton({
                        id: "edit",
                    });

                    form.removeButton({
                        id: "cancelbill",
                    });

                } else if (!for_approval && (currentUser.id === parseInt(prepared_by) || currentUser.id == 7)) {

                    // Show the Submit for Approval button
                    form.addButton({
                        id: 'custpage_submit_for_approval',
                        label: approval_status === PENDING_APPROVAL_STATUS_ID ? 'Submit for Approval' : 'Resubmit for Approval',
                        functionName: 'onSubmitForApprovalBtnClick()',
                    });

                    return;
                }

                if (approval_status === PENDING_APPROVAL_STATUS_ID) {

                    var next_approver = getNextApproverRole(newRecord);

                    log.debug('next_approver', next_approver);

                    if (next_approver) {

                        if (currentUser.role === next_approver.role) {

                            // Adding the button Approve
                            form.addButton({
                                id: 'custpage_approve',
                                label: 'Approve',
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

                if (currentUser.role !== TREASURY_ASSISTANT_ROLE_ID && currentUser.role !== TREASURY_HEAD_ROLE_ID) {

                    form.removeButton({
                        id: 'payment',
                    });

                }

            } else if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY || context.type === context.UserEventType.EDIT) {

                if (context.type === context.UserEventType.CREATE) {

                    var po_id = context.request.parameters.id;

                    if (po_id) {

                        var po_lookupFields = search.lookupFields({
                            type: search.Type.PURCHASE_ORDER,
                            id: po_id,
                            columns: ['custbody_xrc_fund_request_num', 'custbody_xrc_fund_request_num.custrecord_xrc_check_num', 'custbody_xrc_fund_request_num.custrecord_xrc_status'],
                        });

                        var fr_id = po_lookupFields['custbody_xrc_fund_request_num'][0]?.value;

                        if (fr_id) {

                            var fr_status = po_lookupFields['custbody_xrc_fund_request_num.custrecord_xrc_status'][0]?.value;

                            var check_id = po_lookupFields['custbody_xrc_fund_request_num.custrecord_xrc_check_num'][0]?.value;

                            if (fr_status !== '6' && !check_id) { // 6 => Fund Request Status: Cancelled

                                throw "The linked Fund Request has not yet been issued with a check.";
                            }

                        }


                    }

                }

                if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY) {

                    newRecord.setValue(APV_NUM_FIELD_ID, 'To Be Generated');

                    var parameters = context.request.parameters;

                    if (parameters?.itemrcpt) {

                        var recoupment_type = getRecoupmentType(parameters.itemrcpt);

                        newRecord.setValue(APPLY_PREPAYMENT_RECOUPMENT_FIELD_ID, recoupment_type);
                    }


                }

                var user_can_edit = canEdit(newRecord, currentUser);

                // if (user_can_edit) return;

                // if (for_approval && currentUser.id === parseInt(prepared_by)) {

                //     throw new Error("Cannot edit transaction currently on approval process");

                // }

                var po_id = newRecord.getValue(PO_DOC_NUM_FIELD_ID) || getPurchaseOrderId(newRecord);

                if (po_id) {

                    // Get the terms of purchase order
                    var po_fieldLookUp = search.lookupFields({
                        type: record.Type.PURCHASE_ORDER,
                        id: po_id,
                        columns: [TERMS_FIELD_ID]
                    });

                    var isPBWithDownPayment = ['9', '10', '11'].includes(po_fieldLookUp.terms[0].value); // The array indicates the id of the progress billing with downpayment

                    // Checking if there is a prepayment on the associated Purchase Order
                    if (isPBWithDownPayment && checkPrepayment(newRecord).isPrepaymentPresent) {

                        var apply_prepayment_recoupment_field = newRecord.getField({
                            fieldId: APPLY_PREPAYMENT_RECOUPMENT_FIELD_ID,
                        });

                        apply_prepayment_recoupment_field.isMandatory = true;

                    }

                }

            }

        }

        function afterSubmit(context) {

            var newRecord = context.newRecord;

            var currentUser = runtime.getCurrentUser();

            var old_approval_status = newRecord.getValue(OLD_APPROVAL_STATUS_FIELD_ID);

            var approval_status = newRecord.getValue(APPROVAL_STATUS_FIELD_ID);

            var charge_to_employee = newRecord.getValue(CHARGE_TO_EMPLOYEE_FIELD_ID);

            var atd = newRecord.getValue(ATD_FIELD_ID);

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                var date = newRecord.getValue(DATE_FIELD_ID);
                // currentUser.id == 7
                if (old_approval_status === PENDING_APPROVAL_STATUS_ID && approval_status === APPROVED_STATUS_ID) {

                    var prepayment_type = newRecord.getValue(APPLY_PREPAYMENT_RECOUPMENT_FIELD_ID);

                    if (prepayment_type !== NO_PREPAYMENT_ID) {

                        try {

                            // Getting the total of the created bill
                            var bill_total = getBillTotal(newRecord);

                            // Transform Vendor Prepayment to Vendor Prepayment Application
                            transformVendorPrepayment(newRecord, bill_total, prepayment_type);

                        } catch (error) {

                            log.debug('error', error);

                        }
                    }

                }



                // // On Bil approve, check if ATD has value.
                // // Sync approval of Bill and ATD
                // if (atd) {

                //     record.submitFields({
                //         type: ATD_RECORD_TYPE_ID,
                //         id: atd,
                //         values: {
                //             [ATD_STATUS_FIELD_ID]: ATD_STATUS_APPROVED_ID,
                //         },
                //         options: {
                //             ignoreMandatoryFields: true
                //         }
                //     });

                // }

                // Generating Credit Memo for all tenant advances
                var credit_memos = generateCreditMemos(newRecord);

                // Link created Credit Memos on Item lines
                linkCreditMemosToLines(newRecord, credit_memos);

                // }

                if (charge_to_employee && !atd) {

                    // If Charge to Employee checkbox is ticket, auto create ATD
                    var suitelet_url = url.resolveScript({
                        scriptId: 'customscript_xrc_sl_create_atd',
                        deploymentId: 'customdeploy_xrc_sl_create_atd',
                        returnExternalUrl: true,
                    });

                    var payload = {
                        date: newRecord.getValue(DATE_FIELD_ID),
                        bill_id: newRecord.id,
                        emp_name: newRecord.getValue(EMPLOYEE_NAME_FIELD_ID),
                        memo: newRecord.getValue(MEMO_FIELD_ID),
                        charge_amount: newRecord.getValue(CHARGE_AMOUNT_FIELD_ID),
                        subsidiary: newRecord.getValue(SUBSIDIARY_FIELD_ID),
                        location: newRecord.getValue(LOCATION_FIELD_ID),
                        department: newRecord.getValue(DEPARTMENT_FIELD_ID),
                        class: newRecord.getValue(CLASS_FIELD_ID)
                    };

                    https.post.promise({
                        url: suitelet_url,
                        body: JSON.stringify(payload),
                    }).then(function (response) {

                        var data = JSON.parse(response.body);

                        record.submitFields({
                            type: newRecord.type,
                            id: newRecord.id,
                            values: {
                                [ATD_FIELD_ID]: data.atd_id,
                            },
                            options: {
                                ignoreMandatoryFields: true
                            }
                        });

                    }).catch(function (error) {
                        console.log(error);
                    });

                }

                // Generate series on CREATE context type and on date after opening balance 
                (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY && isAfterOpeningBalance(date)) && handleSeriesGeneration(newRecord);

            }


        }

        function checkPrepayment(po_id) {

            // Creating a saved search of Vendor Prepayment
            // This is to check if there's a linked vendor prepayment
            // on the associated Purchase Order
            var vendorprepaymentSearchObj = search.create({
                type: "vendorprepayment",
                filters:
                    [
                        ["type", "anyof", "VPrep"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["appliedtotransaction", "anyof", po_id],
                    ],
                columns:
                    [
                        search.createColumn({ name: "amount", label: "Amount" })
                    ]
            });

            var vendprep_search_results = vendorprepaymentSearchObj.run().getRange({
                start: 0,
                end: 1000
            });

            var isPrepaymentPresent = vendprep_search_results.length > 0;

            var vendprep_id = vendprep_search_results[0].id;

            var v_prep_amount = Math.abs(parseFloat(vendprep_search_results[0].getValue('amount')));

            return { isPrepaymentPresent, vendprep_id, v_prep_amount }; // Returning true if  the searchResultCount is greater than 0, otherwise false

        }

        function getPrepaymentBalance(vp_id, v_prep_amount) {

            var applied = 0;

            var prepayment_amount = 0;

            var vpa_search = search.create({
                type: "vendorprepaymentapplication",
                filters:
                    [
                        ["type", "anyof", "VPrepApp"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["appliedtotransaction", "anyof", vp_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "amount", label: "Amount" }),
                        search.createColumn({
                            name: "amount",
                            join: "appliedToTransaction",
                            label: "Amount"
                        })
                    ]
            });

            vpa_search.run().each(function (result) {
                applied += parseFloat(result.getValue('amount'));
                return true;
            });

            return v_prep_amount - Math.abs(applied);
        }


        function getBillTotal(newRecord) {

            var subtotal = 0;

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                var item_id = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                    line: line,
                });

                // Exclude if item is Expanding Withholding Tax
                if (item_id !== EXP_WHT_ID) {

                    var amount = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: AMOUNT_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    subtotal += amount;

                }
            }

            return subtotal;

        }

        function transformVendorPrepayment(newRecord, bill_total, prepayment_type) {

            log.debug('bill_total', bill_total);

            var { po_id, po_subtotal } = getPOAmount(newRecord);

            log.debug('po_subtotal', po_subtotal);

            // Getting the Vendor Prepayment id
            var { vendprep_id, v_prep_amount } = checkPrepayment(po_id);

            log.debug('prep_id', vendprep_id);

            var balance = getPrepaymentBalance(vendprep_id, v_prep_amount);

            log.debug('balance', balance);

            // Transfrom the linked vendor prepayment in PO to Vendor Prepayment Application
            var vend_prep_app_rec = record.transform({
                fromType: record.Type.VENDOR_PREPAYMENT,
                fromId: vendprep_id,
                toType: record.Type.VENDOR_PREPAYMENT_APPLICATION,
                isDynamic: true,
            });

            var total = vend_prep_app_rec.getValue(TOTAL_FIELD_ID);

            var bill_lines = vend_prep_app_rec.getLineCount({
                sublistId: BILL_SUBLIST_ID,
            });

            for (var line = 0; line < bill_lines; line++) {

                vend_prep_app_rec.selectLine({
                    sublistId: BILL_SUBLIST_ID,
                    line: line,
                });

                var bill_id = vend_prep_app_rec.getSublistValue({
                    sublistId: BILL_SUBLIST_ID,
                    fieldId: DOC_SUBLIST_FIELD_ID,
                    line: line
                });

                // Check the list of  vendor prepayment applicatin bill list
                // if it matches the created bill
                if (parseInt(bill_id) === parseInt(newRecord.id)) {

                    // Check mark the apply field
                    vend_prep_app_rec.setCurrentSublistValue({
                        sublistId: BILL_SUBLIST_ID,
                        fieldId: APPLY_SUBLIST_FIELD_ID,
                        value: true,
                    });

                    if (prepayment_type === PRO_RATED_PREPAYMENT_ID) {

                        //Computing the recoupment if the prepayment type is Pro-rated
                        var percentage = Math.round((bill_total / po_subtotal) * 10000) / 10000;

                        log.debug('percentage', percentage);

                        var payment_amount = total * percentage;

                        log.debug('payment_amount', payment_amount);

                        if (payment_amount < balance) {

                            vend_prep_app_rec.setCurrentSublistValue({
                                sublistId: BILL_SUBLIST_ID,
                                fieldId: AMOUNT_SUBLIST_FIELD_ID,
                                value: payment_amount,
                            });

                        }


                    }

                    break;

                }

            }

            vend_prep_app_rec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

        }

        function getPurchaseOrderId(newRecord) {

            // Reference to the Purchase Order sublist
            // and return the id
            var po_id = newRecord.getSublistValue({
                sublistId: PURCHASE_ORDER_SUBLIST_ID,
                fieldId: ID_SUBLIST_FIELD_ID,
                line: 0,
            });

            return po_id || newRecord.getValue(PO_DOC_NUM_FIELD_ID);
        }

        function getPOAmount(newRecord) {

            var po_id = getPurchaseOrderId(newRecord);

            var fieldLookUp = search.lookupFields({
                type: record.Type.PURCHASE_ORDER,
                id: po_id,
                columns: ['netamountnotax']
            });

            var po_subtotal = fieldLookUp.netamountnotax;

            return { po_id, po_subtotal };
        }

        function createATD(date, bill_id, employee, remarks, charge_amount, subsidiary, location, department, bill_class) {

            var atd_rec = record.create({
                type: ATD_RECORD_TYPE_ID,
            });

            atd_rec.setValue(ATD_CUSTOM_FORM_FIELD_ID, ATD_BILL_FORM_ID);

            atd_rec.setValue(ATD_DATE_FIELD_ID, date);

            atd_rec.setValue(ATD_CREATED_FROM_FIELD_ID, bill_id);

            atd_rec.setValue(ATD_FUND_CATEGORY_FIELD_ID, ATD_CASH_ADVANCE_FUND_CATEGORY_ID);

            atd_rec.setValue(ATD_CREATED_FROM_FIELD_ID, bill_id);

            atd_rec.setValue(ATD_EMPLOYEE_FIELD_ID, employee);

            atd_rec.setValue(ATD_REMARKS_FIELD_ID, remarks);

            atd_rec.setValue(ATD_AMOUNT_FIELD_ID, charge_amount);

            atd_rec.setValue(ATD_SUBSIDIARY_FIELD_ID, subsidiary);

            atd_rec.setValue(ATD_LOCATION_FIELD_ID, location);

            atd_rec.setValue(ATD_DEPARTMENT_FIELD_ID, department);

            atd_rec.setValue(ATD_CLASS_FIELD_ID, bill_class);

            var atd_id = atd_rec.save({
                ignoreMandatoryFields: true,
            });

            return atd_id;
        }

        function generateCreditMemos(newRecord) {

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            const credit_memos = [];

            for (var line = 0; line < items_lines; line++) {

                var item_id = newRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: ITEMS_SUBLIST_FIELD_ID,
                    line: line,
                });

                // Check if item is Advances From Tenant
                if (item_id === ADVANCES_FROM_TENANT_ITEM_ID) {

                    // Creating Credit Memo transaction
                    var credit_memo_rec = record.create({
                        type: record.Type.CREDIT_MEMO,
                        isDynamic: true,
                    });

                    var customer = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: CUSTOMER_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var date = newRecord.getValue(DATE_FIELD_ID);

                    var remarks = newRecord.getValue(MEMO_FIELD_ID);

                    var space_no = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: SPACE_NO_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var location = newRecord.getValue(LOCATION_FIELD_ID);

                    // Setting body fields
                    credit_memo_rec.setValue(CM_DATE_FIELD_ID, date);

                    credit_memo_rec.setValue(CM_CUSTOMER_FIELD_ID, customer);

                    credit_memo_rec.setValue(LOCATION_FIELD_ID, location);

                    credit_memo_rec.setValue(MEMO_FIELD_ID, remarks);

                    credit_memo_rec.setValue(CM_SPACE_NO_FIELD_ID, space_no);

                    credit_memo_rec.setValue(CM_LINKED_VENDOR_BILL_FIELD_ID, newRecord.id);

                    // Setting line field values
                    var description = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: DESCRIPTION_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var rate = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: RATE_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var tax_code = newRecord.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: TAXCODE_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    credit_memo_rec.selectNewLine({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    credit_memo_rec.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ITEMS_SUBLIST_FIELD_ID,
                        value: ADVANCES_FROM_TENANT_ITEM_ID,
                        forceSyncSourcing: true,
                    });

                    credit_memo_rec.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: DESCRIPTION_SUBLIST_FIELD_ID,
                        value: description,
                        forceSyncSourcing: true,
                    });

                    credit_memo_rec.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: RATE_SUBLIST_FIELD_ID,
                        value: rate,
                        forceSyncSourcing: true,
                    });

                    credit_memo_rec.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: TAXCODE_SUBLIST_FIELD_ID,
                        value: tax_code,
                        forceSyncSourcing: true,
                    });

                    credit_memo_rec.commitLine({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    var cm_id = credit_memo_rec.save({
                        ignoreMandatoryFields: true,
                    });

                    credit_memos.push(cm_id);
                }

            }

            return credit_memos;

        }

        function getNextApproverRole(newRecord) {

            var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2'];

            var roles = [1415, 1417]; // IDs of the roles [XRC - A/P Senior Accounting Officer, XRC - A/P Accounting Head]

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

        function canEdit(newRecord, currentUser) {

            var fields = ['custbody_xrc_approval1', 'custbody_xrc_approval2'];

            var roles = [1415, 1417, 3]; // IDs of the roles [XRC - A/P Senior Accounting Officer, XRC - Accounting Head]

            for (var i = 0; i < fields.length; i++) {

                var isFieldChecked = newRecord.getValue(fields[i]);

                if (!isFieldChecked && currentUser.role === roles[i]) {

                    return true;
                }

            }

            return false;

        }

        function linkCreditMemosToLines(newRecord, credit_memos) {

            var bill_rec = record.load({
                id: newRecord.id,
                type: newRecord.type,
            });

            var items_lines = newRecord.getLineCount({
                sublistId: ITEMS_SUBLIST_ID,
            });

            for (var line = 0; line < items_lines; line++) {

                bill_rec.setSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: CM_NO_SUBLIST_FIELD_ID,
                    line: line,
                    value: credit_memos[line],
                });

            }

            bill_rec.save({
                ignoreMandatoryFields: true,
            });
        }

        function handleSeriesGeneration(newRecord) {

            var current_script = runtime.getCurrentScript();

            var json_string = current_script.getParameter({ name: VENDOR_BILL_LAST_NUM_FIELD_ID });

            var vendor_bill_last_num_obj = JSON.parse(json_string);

            var location_code = getLocationCode(newRecord.getValue(LOCATION_FIELD_ID));

            var next_num = (parseInt(vendor_bill_last_num_obj[location_code]) || 0) + 1;

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    [APV_NUM_FIELD_ID]: location_code + '-' + appendLeadingZeros(next_num, 'VBAPV-'), // Attaching the generated new number on saving the record
                },
                options: {
                    ignoreMandatoryFields: true
                }
            });

            vendor_bill_last_num_obj[location_code] = next_num;

            updateVendorBillLastNumber(vendor_bill_last_num_obj);

        }

        function getLocationCode(location_id) {

            const fieldLookUp = search.lookupFields({
                type: search.Type.LOCATION,
                id: location_id,
                columns: ['tranprefix']
            });

            return fieldLookUp['tranprefix'];

        }

        function updateVendorBillLastNumber(new_obj) {

            record.submitFields({
                type: record.Type.SCRIPT_DEPLOYMENT,
                id: 1873, // Script Deployment ID
                values: {
                    [VENDOR_BILL_LAST_NUM_FIELD_ID]: JSON.stringify(new_obj),
                },
                options: {
                    ignoreMandatoryFields: true,
                }
            });

        }

        function appendLeadingZeros(newCode, prefix) {

            var leadingZeros = '0000';
            var zerosLength = 4;

            newCode = newCode.toString();

            if (newCode.length <= zerosLength) {
                leadingZeros = leadingZeros.slice(0, zerosLength - newCode.length);
                newCode = prefix + leadingZeros + newCode;
            } else {
                newCode = prefix + newCode;
            }

            return newCode;
        }

        function isAfterOpeningBalance(date) {

            return date >= new Date("2024-11-01");

        }

        function getRecoupmentType(ir_id) {

            var fieldlookup = search.lookupFields({
                type: search.Type.ITEM_RECEIPT,
                id: ir_id,
                columns: [APPLY_PREPAYMENT_RECOUPMENT_FIELD_ID],
            });

            var apply_prepayment_recoupment = fieldlookup[APPLY_PREPAYMENT_RECOUPMENT_FIELD_ID]?.[0]?.value;

            return apply_prepayment_recoupment;

        }


        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    }
);