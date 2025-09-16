/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 *
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 25, 2024
 *
 * Updated by: Charles Maverick Herrera
 * Date: Oct 25, 2024
 * 
 * Updated by: John Jabez serrano
 * Date: Aug 11, 2025
 *
 */
define(["N/currentRecord", "N/record", "N/search", "N/runtime", '/SuiteScripts/utils/NSI_CM_InputDialog', 'N/format'], function (
    currRec,
    record,
    search,
    runtime,
    dialog,
    format
) {
    const PARAM_PR_ID = "origin_id";
    const PARAM_ACTION_ID = "action";
    const PARAM_ENTITY_ID = "entity";
    const PARAM_CONVERSION_ID = "conversion";
    const ACTION_REPROCESS_ID = "reprocess";
    const CUSTOM_FORM_FIELD_ID = "customform";
    const IC_FORM_ID = "229";
    const PO_FORM_ID = "228";
    const PR_FORM_ID = "225";
    const INVENTORY_ITEM_TYPE = 'InvtPart';
    const DUMMY_INVENTORY_ITEM_ID = '5277';
    const VENDOR_FIELD_ID = "entity";
    const ITEMS_SUBLIST_ID = "item";
    const ITEMS_SUBLIST_FIELD_ID = "item";
    const OLD_ITEM_ID_SUBLIST_FIELD_ID = "olditemid";
    const ITEM_TYPE_SUBLIST_FIELD_ID = 'itemtype';
    const LINE_UNIQUE_KEY_SUBLIST_FIELD_ID = 'lineuniquekey';
    const NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID = 'custcol_non_dummy_req_item_ref_no';
    const REQUEST_REF_NO_SUBLIST_FIELD_ID = 'custcol_xrc_po_req_ref_no';
    const QTY_SUBLIST_FIELD_ID = "quantity";
    const RATE_SUBLIST_FIELD_ID = "rate";
    const AMOUNT_SUBLIST_FIELD_ID = "amount";
    const TAX_CODE_SUBLIST_FIELD_ID = "taxcode";
    const DEFAULT_TAX_CODE_ID = "6";
    const TAX_RATE_SUBLIST_FIELD_ID = "taxrate1";
    const DEFAULT_TAX_RATE = "12%";
    const GROSS_AMOUNT_SUBLIST_FIELD_ID = "grossamt";
    const NET_AMOUNT_SUBLIST_FIELD_ID = "custcol_xrc_net_amount";
    const PR_NUM_FIELD_ID = "custbody_xrc_pr_num";
    const PREPAYMENT_PERCENTAGE_FIELD_ID = "custbody_xrc_prepayment_percentage";
    const RETENTION_PERCENTAGE_FIELD_ID = "custbody_xrc_retention_percentage";
    const TERMS_FIELD_ID = "terms";
    const PROGRESS_BILLING_TERMS_ID = "8";
    const PROGRESS_BILLING_20_TERMS_ID = "11";
    const PROGRESS_BILLING_30_TERMS_ID = "10";
    const PROGRESS_BILLING_50_TERMS_ID = "9";
    const BOM_FIELD_ID = "custbody_xrc_bom";
    const BOM_RECORD_TYPE_ID = "custompurchase_xrc_bom";
    const BOM_ITEMS_SUBLIST_ID = "item";
    const BOM_RATE_SUBLIST_FIELD_ID = "rate";
    const BOM_ITEM_SUBIST_FIELD_ID = "item";
    const BOM_QTY_TO_BE_REQUESTED_SUBLIST_FIELD_ID = "custcol_xrc_billmat_qty_to_be_req";
    const LAST_PURCHASE_PRICE_FIELD_ID = "lastpurchaseprice";
    const TRANSFERRED_SUBLIST_FIELD_ID = "custcol_xrc_transferred";
    const ORDERED_SUBLIST_FIELD_ID = "custcol_xrc_ordered";
    const CATEGORY_FIELD_ID = "category";
    const CATEGORY_SUBISIDIARIES = "8";
    const SUBSIDIARY_FIELD_ID = 'subsidiary';
    const LOCATION_FIELD_ID = 'location';
    const DEPARTMENT_FIELD_ID = 'department';
    const APPROVAL_STATUS_FIELD_ID = 'approvalstatus';
    const APPROVED_STATUS_ID = '2';
    const HAS_INVENTORY_ITEM_FIELD_ID = 'custbody_xrc_has_inventory_item';
    const VOIDED_FIELD_ID = 'custbody_xrc_voided';
    const VOIDED_REASON_FIELD_ID = 'custbody_xrc_void_reason';
    const CANCELLED_FIELD_ID = 'custbody_xrc_cancelled';
    const CANCEL_REASON_FIELD_ID = 'custbody_xrc_cancel_reason';
    const SUPERSEDED_PR_FIELD_ID = 'custbody_xrc_superseded_pr';
    const REPROCESSED_FIELD_ID = 'custbody_xrc_reprocessed';
    const REPROCESSED_PR_FIELD_ID = 'custbody_xrc_reprocessed_pr';
    const FUND_REQUEST_FIELD_ID = 'custbody_xrc_fund_request_num';
    const DUE_DATE_FIELD_ID = 'duedate';
    const PURCHASE_REQUESTOR_FIELD_ID = 'custbody_xrc_purchase_requestor';

    const MODE_COPY = "copy";
    const MODE_EDIT = "edit";
    const MODE_CREATE = "create";
    const PREPARED_BY_FLD_ID = "custbody_xrc_prepared_by";
    const APPROVER_ONE_FIELD_ID = 'custbody_xrc_approver1';
    const APPROVER_TWO_FIELD_ID = 'custbody_xrc_approver2';
    const APPROVER_THREE_FIELD_ID = 'custbody_xrc_approver3';
    const APPROVAL_1_FLD_ID = "custbody_xrc_approval1";
    const APPROVAL_2_FLD_ID = "custbody_xrc_approval2";
    const APPROVAL_3_FLD_ID = "custbody_xrc_approval3";
    const APPROVAL_4_FLD_ID = "custbody_xrc_approval4";
    const APPROVAL_5_FLD_ID = "custbody_xrc_approval5";
    const APPROVAL_6_FLD_ID = "custbody_xrc_approval6";
    const APPROVAL_7_FLD_ID = "custbody_xrc_approval7";
    const FOR_APPROVAL_FLD_ID = "custbody_xrc_for_approval";
    const REJECTED_FLD_ID = "custbody1";

    const FORM_FLD_ID = "customform";
    const DUMMY_VENDOR_ID = "23";
    const PURCHASE_CATEGORY_FLD_ID = "custbody_xrc_purchase_category";
    const PURCHASE_CATEGORY_ENGINEERING_ID = "1";
    const PURCHASE_CATEGORY_MARKETING_ID = "2";
    const PURCHASE_CATEGORY_OTHERS_ID = "8";
    const PURCHASE_CATEGORY_BANK_ID = "26";
    const TREASURY_HEAD_ROLE_ID = 1483;
    const REQUESTOR_ROLE_ID = 1431;

    // WHT Fields
    const APPLY_WHT_SUBLIST_FIELD_ID = 'custcol_4601_witaxapplies';
    const WHT_CODE_SUBLIST_FIELD_ID = 'custpage_4601_witaxcode';
    const WHT_AMOUNT_SUBLIST_FIELD_ID = 'custpage_4601_witaxamount';

    // Global variables
    var g_isSubmitBtnClick = false;
    var g_isApproveBtnClick = false;
    var g_isRejectBtnClick = false;
    var g_isResubmitBtnClick = false;
    var g_isVoidBtnClick = false;
    var g_isReprocessBtnClick = false;
    var g_sourced = false;
    var for_post_source_location = '';
    var for_post_source_department = '';

    var TERMS_KEYWORDS_FOR_RETENTION = [
        'retention',
        'progress'
    ]

    function pageInit(context) {

        g_mode = context.mode;

        var currentRecord = context.currentRecord;

        var pr_id = getParameterWithId(PARAM_PR_ID);

        var terms = currentRecord.getValue(TERMS_FIELD_ID);

        var entity_param = getParameterWithId(PARAM_ENTITY_ID);

        var action = getParameterWithId(PARAM_ACTION_ID);

        var conversion = getParameterWithId(PARAM_CONVERSION_ID);

        disablePurchaseRequestorField(currentRecord);

        if (pr_id) {
            setItemRequestReferenceNumber(currentRecord, pr_id);
        }

        if (action === ACTION_REPROCESS_ID) {

            setupReprocessPR(pr_id, currentRecord);

        }

        if (entity_param) {
            onSubsidiaryVendorCategoryForm(currentRecord, entity_param, conversion);
        }

        showProgressBillingFields(
            currentRecord,
            terms === PROGRESS_BILLING_TERMS_ID ||
            terms === PROGRESS_BILLING_20_TERMS_ID ||
            terms === PROGRESS_BILLING_30_TERMS_ID ||
            terms === PROGRESS_BILLING_50_TERMS_ID
        );

        if (pr_id && action !== ACTION_REPROCESS_ID) {

            currentRecord.setValue(PR_NUM_FIELD_ID, pr_id);

            // initiatePurchaseOrder(pr_id, currentRecord);
        }

        if (g_mode === MODE_COPY) {
            var currentUser = runtime.getCurrentUser();
            currentRecord.setValue(PREPARED_BY_FLD_ID, currentUser.id);
            currentRecord.setValue(APPROVAL_1_FLD_ID, false);
            currentRecord.setValue(APPROVAL_2_FLD_ID, false);
            currentRecord.setValue(APPROVAL_3_FLD_ID, false);
            currentRecord.setValue(APPROVAL_4_FLD_ID, false);
            currentRecord.setValue(APPROVAL_5_FLD_ID, false);
            currentRecord.setValue(APPROVAL_6_FLD_ID, false);
            currentRecord.setValue(APPROVAL_7_FLD_ID, false);
            currentRecord.setValue(APPROVER_ONE_FIELD_ID, null);
            currentRecord.setValue(APPROVER_TWO_FIELD_ID, null);
            currentRecord.setValue(APPROVER_THREE_FIELD_ID, null);
            currentRecord.setValue(FOR_APPROVAL_FLD_ID, false);
            currentRecord.setValue(REJECTED_FLD_ID, false);
            currentRecord.setValue(VOIDED_FIELD_ID, false);
            currentRecord.setValue(VOIDED_REASON_FIELD_ID, '');
            currentRecord.setValue(CANCELLED_FIELD_ID, false);
            currentRecord.setValue(CANCEL_REASON_FIELD_ID, '');
            currentRecord.setValue(HAS_INVENTORY_ITEM_FIELD_ID, false);
            currentRecord.setValue(REPROCESSED_FIELD_ID, false);
            currentRecord.setValue(FUND_REQUEST_FIELD_ID, null);
        } else if (g_mode === MODE_EDIT) {

            var terms = currentRecord.getText(TERMS_FIELD_ID);

            if (terms) {

                let hasKeywords = TERMS_KEYWORDS_FOR_RETENTION.some(keyword =>
                    terms.toLowerCase().includes(keyword)
                )

                showProgressBillingFields(currentRecord, hasKeywords);

            }

        }
    }

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;

        var fieldId = context.fieldId;

        var sublistId = context.sublistId;

        if (sublistId === ITEMS_SUBLIST_ID) {

            if (fieldId === WHT_CODE_SUBLIST_FIELD_ID || fieldId === GROSS_AMOUNT_SUBLIST_FIELD_ID || fieldId === APPLY_WHT_SUBLIST_FIELD_ID) {

                var gross_amount = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                });

                var wht_amount = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: WHT_AMOUNT_SUBLIST_FIELD_ID,
                }) || 0;

                currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: NET_AMOUNT_SUBLIST_FIELD_ID,
                    value: gross_amount - wht_amount,
                });

            }

        } else if (fieldId === TERMS_FIELD_ID) { // Check if the field Terms was changed
            var terms = currentRecord.getValue(fieldId);
            var termsTxt = currentRecord.getText(fieldId);


            // Show progress billing fields

            if (termsTxt) {
                log.debug({ title: 'test', details: termsTxt.toLowerCase() })

                let hasKeywords = TERMS_KEYWORDS_FOR_RETENTION.some(keyword =>
                    termsTxt.toLowerCase().includes(keyword)
                )

                showProgressBillingFields(currentRecord, hasKeywords);

            }


        } else if (fieldId === BOM_FIELD_ID) {
            var bom_id = currentRecord.getValue(fieldId);

            putItemsFromBOM(bom_id, currentRecord);
        }
    }

    function postSourcing(context) {

        var currentRecord = context.currentRecord;

        var fieldId = context.fieldId;

        var sublistId = context.sublistId;

        var currentIndex = currentRecord.getCurrentSublistIndex({ sublistId: ITEMS_SUBLIST_ID });

        if (sublistId === ITEMS_SUBLIST_ID) {

            if (fieldId === ITEMS_SUBLIST_FIELD_ID) {

                var gross_amount = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                });

                var wht_amount = currentRecord.getCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: WHT_AMOUNT_SUBLIST_FIELD_ID,
                }) || 0;

                currentRecord.setCurrentSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: NET_AMOUNT_SUBLIST_FIELD_ID,
                    value: gross_amount - wht_amount,
                });

            }

        } else {

            if (fieldId === VENDOR_FIELD_ID) {

                var vendor = currentRecord.getValue(fieldId);

                var conversion = getParameterWithId(PARAM_CONVERSION_ID);

                if (conversion) {

                    onSubsidiaryVendorCategoryForm(currentRecord, vendor, conversion);
                }

                disablePurchaseRequestorField(currentRecord);

            } else if (fieldId === SUBSIDIARY_FIELD_ID) {

                currentRecord.setValue(LOCATION_FIELD_ID, for_post_source_location);

                currentRecord.setValue(DEPARTMENT_FIELD_ID, for_post_source_department);

            }

        }


    }

    function validateField(context) {

        var currentRecord = context.currentRecord;

        var fieldId = context.fieldId;

        if (fieldId === PURCHASE_CATEGORY_FLD_ID) {

            var currentUser = runtime.getCurrentUser();

            console.log(currentUser.role);

            var category = currentRecord.getValue(fieldId);

            if (category === PURCHASE_CATEGORY_BANK_ID && currentUser.role !== TREASURY_HEAD_ROLE_ID) {

                alert('Only Treasury Head can select Bank category.');

                currentRecord.setValue(fieldId, null);

                return false;

            }
        }

        return true;

    }

    function validateLine(context) {

        var currentRecord = context.currentRecord;

        var sublistId = context.sublistId;

        var pr_id = currentRecord.getValue(PR_NUM_FIELD_ID);

        // Check if PR is present
        if (pr_id) {

            var pr_rec = record.load({
                type: record.Type.PURCHASE_ORDER,
                id: pr_id,
            });

            if (sublistId === ITEMS_SUBLIST_ID) {

                try {

                    var line = currentRecord.getCurrentSublistIndex({
                        sublistId: ITEMS_SUBLIST_ID,
                    });

                    var old_item_id = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: OLD_ITEM_ID_SUBLIST_FIELD_ID,
                    });

                    var current_record_ref_no = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: REQUEST_REF_NO_SUBLIST_FIELD_ID,
                    });

                    var location = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: LOCATION_FIELD_ID,
                    });

                    if (!location) {

                        alert("Location is mandatory.");

                        return false;

                    }

                    var department = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: DEPARTMENT_FIELD_ID,
                    });

                    if (!department) {

                        alert("Department is mandatory.");

                        return false;

                    }


                    if (old_item_id === DUMMY_INVENTORY_ITEM_ID && !current_record_ref_no) {

                        alert("Request reference number is required on previously Dummy Inventory items.");

                        return false;

                    }

                    if (old_item_id === DUMMY_INVENTORY_ITEM_ID) {

                        var is_ref_no_exist = isReferenceNumberValid(pr_rec, current_record_ref_no);

                        if (!is_ref_no_exist) {

                            alert("Reference number does not exist.");

                            return false;

                        }

                        var is_reference_no_already_entered = isReferenceNumberAlreadyEntered(currentRecord, line, current_record_ref_no);

                        if (is_reference_no_already_entered) {

                            alert("Reference number can only be entered once.");

                            return false;

                        }

                    }

                    var qty = currentRecord.getCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_SUBLIST_FIELD_ID,
                    });

                    var pr_qty = pr_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: QTY_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var pr_transferred = pr_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: TRANSFERRED_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    var pr_ordered = pr_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: ORDERED_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    if (g_mode === 'create') {

                        // Get the amount from PR's quantity plus the sum of transferred and ordered
                        var allowed_qty = pr_qty - (pr_transferred + pr_ordered);

                    } else if (g_mode === 'edit') {

                        // Get the amount from PR's quantity plus the sum of transferred and ordered
                        var allowed_qty = pr_qty - (pr_transferred + Math.abs(pr_ordered - qty));

                    }

                    // IF qty is greater than the allowed qty, block it :)
                    // if (qty > allowed_qty) {
                    //     alert("Quantity cannot be greater than the PR's available quantity.");

                    //     return false;
                    // }

                } catch (error) { }

            }
        }


        return true;
    }

    function saveRecord(context) {

        try {
            var currentRecord = context.currentRecord;

            var currentUser = runtime.getCurrentUser();

            var custom_form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

            var vendor_id = currentRecord.getValue(VENDOR_FIELD_ID);

            var form_value = currentRecord.getValue(FORM_FLD_ID);

            var purchase_category = currentRecord.getValue(PURCHASE_CATEGORY_FLD_ID);

            var has_inventory_item = checkForInventoryItem(currentRecord);

            var has_dummy_inventory_item = checkForDummyInventoryItem(currentRecord);

            console.log('has_dummy_inventory_item', has_dummy_inventory_item);

            console.log('has_inventory_item', has_inventory_item);

            if (custom_form === PR_FORM_ID) {

                var is_business_direc_pr = ['5', '24', '26', '25', '23', '22', '4', '6', '27', '7'].includes(purchase_category);

                console.log(is_business_direc_pr);

                if (is_business_direc_pr) {

                    if (has_inventory_item || vendor_id === DUMMY_VENDOR_ID) {
                        alert("Cannot select inventory item or dummy vendor on Direct PR or Business PR.");
                        return false;
                    }

                }

            }


            if (form_value === PO_FORM_ID && (vendor_id === DUMMY_VENDOR_ID || has_dummy_inventory_item)) {

                alert("Cannot select Dummy Vendor or Dummy Items on Purchase Order.");

                return false;

            }

            if (custom_form === PO_FORM_ID) {

                var dummy_items_has_reference_no = dummyItemsHasReferenceNumber(currentRecord);

                if (!dummy_items_has_reference_no) {

                    alert("Please input request reference number for previously Dummy Inventory items.");

                    return false;

                }

                var pr_id = currentRecord.getValue(PR_NUM_FIELD_ID);

                if (pr_id) {

                    var pr_rec = record.load({
                        type: record.Type.PURCHASE_ORDER,
                        id: pr_id,
                    });

                    var item_lines = pr_rec.getLineCount({
                        sublistId: ITEMS_SUBLIST_ID
                    });

                    for (var line = 0; line < item_lines; line++) {

                        var line_unique_key = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: LINE_UNIQUE_KEY_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var pr_qty = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: QTY_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var pr_transferred = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: TRANSFERRED_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var pr_ordered = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: ORDERED_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        // Get the amount from PR's quantity plus the sum of transferred and ordered
                        var allowed_qty = pr_qty - (pr_transferred + pr_ordered);

                        var qty = currentRecord.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: QTY_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        // IF qty is greater than the allowed qty, block it :)
                        // if (qty > allowed_qty) {
                        //     alert("Quantity cannot be greater than the PR's available quantity. Please adjust the quantities.");

                        //     return false;
                        // }

                        currentRecord.selectLine({
                            sublistId: ITEMS_SUBLIST_ID,
                            line: line,
                        });

                        currentRecord.setCurrentSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID,
                            value: line_unique_key,
                        });

                        currentRecord.commitLine({
                            sublistId: ITEMS_SUBLIST_ID
                        });

                    }

                }

            }

            if (g_mode === MODE_CREATE) {

                var category = currentRecord.getValue(PURCHASE_CATEGORY_FLD_ID);

                var currentUser = runtime.getCurrentUser();

                if (category === PURCHASE_CATEGORY_BANK_ID && currentUser.role === TREASURY_HEAD_ROLE_ID) {

                    currentRecord.setValue(APPROVAL_STATUS_FIELD_ID, APPROVED_STATUS_ID);

                }

            }

        } catch (error) {

        }

        return true;
    }

    function onSubmitBtnClick() {
        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isSubmitBtnClick) {
            g_isSubmitBtnClick = true;

            // Redirect to the approval link
            window.location.href =
                "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" +
                currentRecord.type +
                "&resubmit=F&id=" +
                currentRecord.id;
        } else {
            alert("You have already submitted the form.");
        }
    }

    function onApproveBtnClick(field, role_to_email = null, department = null, with_task = false, vendor_id = null) {
        var currentRecord = currRec.get();
        console.log(field);

        var is_dept_head_approval = department !== null;

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isApproveBtnClick) {
            g_isApproveBtnClick = true;

            if (with_task) {
                // Open Note creation window    
                var newWindow = window.open(
                    "https://9794098.app.netsuite.com/app/crm/calendar/task.nl?l=T&isApproval=T&transaction=" +
                    currentRecord.id +
                    "&invitee=" +
                    vendor_id +
                    "&company=" +
                    vendor_id +
                    "&refresh=activities",
                    "Task",
                    "width=700,height=700"
                );

                // Continously check if window is closed
                var interval = setInterval(function () {
                    if (newWindow.closed) {
                        clearInterval(interval);
                        location.reload();
                    }
                }, 1000);
            } else {

                var is_check = role_to_email == '1419' || role_to_email == '1415';

                // Redirect to the approval link
                window.location.href =
                    "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" +
                    currentRecord.type +
                    "&approve=T&id=" +
                    currentRecord.id +
                    "&field=" +
                    field +
                    "&role_to_email=" +
                    role_to_email +
                    "&department=" +
                    department +
                    "&is_dept_head_approval=" +
                    is_dept_head_approval +
                    "&is_check=" +
                    is_check;
            }
        } else {
            alert("You have already submitted the form.");
        }
    }

    function onRejectBtnClick(type) {
        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isRejectBtnClick) {
            g_isRejectBtnClick = true;

            if (type === "pr") {
                // Redirect to the approval link
                window.location.href =
                    "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" +
                    currentRecord.type +
                    "&approve=F&id=" +
                    currentRecord.id;
            } else {
                // Open Note creation window
                var newWindow = window.open(
                    "https://9794098.app.netsuite.com/app/crm/common/note.nl?l=T&isApproval=T&type=po&refresh=usernotes&perm=TRAN_PURCHORD&transaction=" +
                    currentRecord.id,
                    "Note",
                    "width=700,height=700"
                );

                // Continously check if window is closed
                var interval = setInterval(function () {
                    if (newWindow.closed) {
                        clearInterval(interval);
                        location.reload();
                    }
                }, 1000); // Interval of 1 second
            }
        } else {
            alert("You have already submitted the form.");
        }
    }

    function onResubmitBtnClick() {
        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isResubmitBtnClick) {
            g_isResubmitBtnClick = true;

            // Redirect to the approval link
            window.location.href =
                "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" +
                currentRecord.type +
                "&resubmit=T&id=" +
                currentRecord.id;
        } else {
            alert("You have already submitted the form.");
        }
    }

    function onRecommendBtnClick() {
        var currentRecord = currRec.get();

        // Open Note creation window
        var newWindow = window.open(
            "https://9794098.app.netsuite.com/app/crm/common/note.nl?l=T&isApproval=T&type=pr&refresh=usernotes&perm=TRAN_PURCHORD&transaction=" +
            currentRecord.id,
            "Note",
            "width=700,height=700"
        );

        // Continously check if window is closed
        var interval = setInterval(function () {
            if (newWindow.closed) {
                clearInterval(interval);
                location.reload();
            }
        }, 1000); // Interval of 1 second
    }

    function onGeneratePOClick(vendor_id) {
        var currentRecord = currRec.get();

        location.href = "https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=" + currentRecord.id + "&compid=9794098&whence=&e=T&memdoc=0&cf=228&origin_id=" + currentRecord.id;
    }

    function getParameterWithId(param_id) {
        var url = new URL(window.location.href);

        var value = url.searchParams.get(param_id);

        return value;
    }

    function initiatePurchaseOrder(pr_id, currentRecord) {
        var pr_rec = record.load({
            type: record.Type.PURCHASE_ORDER,
            id: pr_id,
        });

        currentRecord.setValue(PR_NUM_FIELD_ID, pr_rec.id);

        // IDs array
        var body_field_ids = [
            "custbody_xrc_purchase_category",
            "custbody_xrc_project",
            "custbody_xrc_bom",
            "trandate",
            "duedate",
            "location",
            "department",
            "class",
            "employee",
            "fob",
            "incoterm",
            "shipto",
            "shipaddresslist",
        ];

        var item_fields_id = [
            "item",
            "description",
            "department",
            "class",
            "quantity",
            "rate",
            "taxcode",
            "taxrate1",
            "expectedreceiptdate",
            "custcol_atlas_promise_date",
            "custcol_4601_witaxapplies",
            "custcol_4601_witaxcode",
        ];

        // Populating the body fields of the Purchase Order
        for (var id of body_field_ids) {
            var value = pr_rec.getValue(id);

            if (value) {
                currentRecord.setValue({
                    fieldId: id,
                    value: value,
                    ignoreFieldChange: true,
                });
            }
        }

        // Populating the items tab
        var items_lines = pr_rec.getLineCount({
            sublistId: ITEMS_SUBLIST_ID,
        });

        for (var line = 0; line < items_lines; line++) {
            try {

                currentRecord.selectNewLine({
                    sublistId: ITEMS_SUBLIST_ID,
                });

                for (var id of item_fields_id) {
                    if (id === QTY_SUBLIST_FIELD_ID) {
                        var transferred = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: TRANSFERRED_SUBLIST_FIELD_ID,
                            line: line,
                        });

                        var qty = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: id,
                            line: line,
                        });

                        currentRecord.setCurrentSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: id,
                            value: qty - transferred,
                            ignoreFieldChange: true,
                            forceSyncSourcing: true,
                        });
                    } else {
                        var value = pr_rec.getSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: id,
                            line: line,
                        });

                        currentRecord.setCurrentSublistValue({
                            sublistId: ITEMS_SUBLIST_ID,
                            fieldId: id,
                            value: value,
                            forceSyncSourcing: true,
                        });
                    }
                }

                currentRecord.commitLine({
                    sublistId: ITEMS_SUBLIST_ID,
                });

            } catch (error) {

            }
        }
    }

    function setupReprocessPR(origin_id, currentRecord) {

        var po_fieldLookUp = search.lookupFields({
            type: search.Type.PURCHASE_ORDER,
            id: origin_id,
            columns: ['duedate']
        });

        currentRecord.setValue(SUPERSEDED_PR_FIELD_ID, origin_id);

        var parsedDate = format.parse({
            type: format.Type.DATE,
            value: po_fieldLookUp['duedate'],
        });

        currentRecord.setValue(DUE_DATE_FIELD_ID, parsedDate);

    }

    function putItemsFromBOM(bom_id, currentRecord) {
        var bom_rec = record.load({
            type: BOM_RECORD_TYPE_ID,
            id: bom_id,
        });

        currentRecord.setValue(SUBSIDIARY_FIELD_ID, bom_rec.getValue(SUBSIDIARY_FIELD_ID));

        for_post_source_location = bom_rec.getValue(LOCATION_FIELD_ID);

        for_post_source_department = bom_rec.getValue(DEPARTMENT_FIELD_ID);

        var bom_items_lines = bom_rec.getLineCount({
            sublistId: BOM_ITEMS_SUBLIST_ID,
        });

        for (var line = 0; line < bom_items_lines; line++) {
            currentRecord.selectNewLine({
                sublistId: ITEMS_SUBLIST_ID,
            });

            var item = bom_rec.getSublistValue({
                sublistId: BOM_ITEMS_SUBLIST_ID,
                fieldId: BOM_ITEM_SUBIST_FIELD_ID,
                line: line,
            });

            var qty = bom_rec.getSublistValue({
                sublistId: BOM_ITEMS_SUBLIST_ID,
                fieldId: BOM_QTY_TO_BE_REQUESTED_SUBLIST_FIELD_ID,
                line: line,
            });

            var rate = bom_rec.getSublistValue({
                sublistId: BOM_ITEMS_SUBLIST_ID,
                fieldId: BOM_RATE_SUBLIST_FIELD_ID,
                line: line,
            });

            currentRecord.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: ITEMS_SUBLIST_FIELD_ID,
                value: item,
                forceSyncSourcing: true,
            });

            currentRecord.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: QTY_SUBLIST_FIELD_ID,
                value: qty,
                ignoreFieldChange: true,
                forceSyncSourcing: true,
            });

            currentRecord.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: RATE_SUBLIST_FIELD_ID,
                value: rate,
                ignoreFieldChange: true,
                forceSyncSourcing: true,
            });

            var amount = qty * rate;

            currentRecord.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: AMOUNT_SUBLIST_FIELD_ID,
                value: qty * rate,
                ignoreFieldChange: true,
                forceSyncSourcing: true,
            });

            currentRecord.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: TAX_CODE_SUBLIST_FIELD_ID,
                value: DEFAULT_TAX_CODE_ID,
                forceSyncSourcing: true,
            });

            currentRecord.setCurrentSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: GROSS_AMOUNT_SUBLIST_FIELD_ID,
                value: amount + amount * DEFAULT_TAX_CODE_ID,
                ignoreFieldChange: true,
                forceSyncSourcing: true,
            });

            g_sourced = false;

            currentRecord.commitLine({
                sublistId: ITEMS_SUBLIST_ID,
            });
        }
    }

    function showProgressBillingFields(currentRecord, show) {
        try {
            // var prepayment_percentage_field = currentRecord.getField({
            //     fieldId: PREPAYMENT_PERCENTAGE_FIELD_ID,
            // });

            var retention_percentage_field = currentRecord.getField({
                fieldId: RETENTION_PERCENTAGE_FIELD_ID,
            });

            // prepayment_percentage_field.isDisplay = show;

            retention_percentage_field.isDisplay = show;
        } catch (error) { }
    }

    function onTransferOrderBtnClick(type) {
        var currentRecord = currRec.get();

        location.href =
            "https://9794098.app.netsuite.com/app/accounting/transactions/trnfrord.nl?whence=&origin_id=" +
            currentRecord.id +
            "&type=" +
            type;
    }

    function onVoidBtnClick() {

        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isVoidBtnClick) {

            g_isVoidBtnClick = true;

            var options = {
                title: 'Void purchase request',
                message: 'Please enter void reason:',
                buttons: [{
                    label: 'Submit',
                    value: 1
                }, {
                    label: 'Cancel',
                    value: 2
                }],
                textarea: {
                    rows: 3,
                    cols: 45,
                    isMandatory: true,
                    caption: 'Void Reason',
                    fieldId: 'custbody_xrc_void_reason',
                    actionButtons: [1]
                }
            };

            var success = function (result, value) {

                if (result === 1) {

                    // Redirect to the approval link
                    location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&action=void&id=" + currentRecord.id + "&void_reason=" + value + "&recType=" + currentRecord.type;

                } else if (result === 2) {

                    g_isVoidBtnClick = false;

                }

            }

            var failure = function (result, value) {
                alert('Input dialog closed by clicking button ' + result + ' | value: ' + value);
            }

            dialog.create(options, success, failure);

        } else {

            alert('You have already submitted the form.');

        }

    }

    function onCancelBtnClick() {

        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isVoidBtnClick) {

            g_isVoidBtnClick = true;

            var options = {
                title: 'Cancel purchase request',
                message: 'Please enter cancel reason:',
                buttons: [{
                    label: 'Okay',
                    value: 1
                }, {
                    label: 'Cancel',
                    value: 2
                }],
                textarea: {
                    rows: 3,
                    cols: 45,
                    isMandatory: true,
                    caption: 'Cancel Reason',
                    fieldId: 'custbody_xrc_cancel_reason',
                    actionButtons: [1]
                }
            };

            var success = function (result, value) {

                if (result === 1) {

                    // Redirect to the approval link
                    location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&action=cancel&id=" + currentRecord.id + "&cancel_reason=" + value + "&recType=" + currentRecord.type;

                } else if (result === 2) {

                    g_isVoidBtnClick = false;

                }

            }

            var failure = function (result, value) {
                alert('Input dialog closed by clicking button ' + result + ' | value: ' + value);
            }

            dialog.create(options, success, failure);

        } else {

            alert('You have already submitted the form.');

        }

    }

    function onReprocessBtnClick() {

        var currentRecord = currRec.get();

        // Check if the button is already clicked
        // This is to prevent calling the link multiple times
        if (!g_isReprocessBtnClick) {

            g_isReprocessBtnClick = true;

            location.href = 'https://9794098.app.netsuite.com/app/accounting/transactions/purchord.nl?id=' + currentRecord.id + '&action=reprocess&whence=&e=T&memdoc=0&origin_id=' + currentRecord.id;

        } else {

            alert('You have already submitted the form.');

        }


    }

    function onSubsidiaryVendorCategoryForm(currentRecord, vendor, conversion) {

        if (runtime.getCurrentUser().role !== REQUESTOR_ROLE_ID) {

            // Get the category of the vendor
            search.lookupFields
                .promise({
                    type: search.Type.VENDOR,
                    id: vendor,
                    columns: [CATEGORY_FIELD_ID],
                })
                .then(function (result) {
                    // Set the form depending on the category
                    var form = currentRecord.getValue(CUSTOM_FORM_FIELD_ID);

                    if (result[CATEGORY_FIELD_ID][0].value === CATEGORY_SUBISIDIARIES) {
                        if (form !== IC_FORM_ID) {
                            currentRecord.setValue(CUSTOM_FORM_FIELD_ID, IC_FORM_ID);
                        }
                    } else {
                        // Skip form change if conversion contains a non-falsy value
                        if (conversion) return;

                        if (form !== PR_FORM_ID) {
                            currentRecord.setValue(CUSTOM_FORM_FIELD_ID, PR_FORM_ID);
                        }
                    }
                });

        }


    }

    function checkForDummyInventoryItem(currentRecord) {

        var items_lines = currentRecord.getLineCount({
            sublistId: ITEMS_SUBLIST_ID,
        });

        var is_dummy_item_present = false;

        for (var line = 0; line < items_lines; line++) {

            var item_id = currentRecord.getSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: ITEMS_SUBLIST_FIELD_ID,
                line: line,
            });

            if (item_id === DUMMY_INVENTORY_ITEM_ID) {

                is_dummy_item_present = true;

                break;
            }

        }

        return is_dummy_item_present;

    }

    function checkForInventoryItem(currentRecord) {

        var items_lines = currentRecord.getLineCount({
            sublistId: ITEMS_SUBLIST_ID,
        });

        var isInventoryItemPresent = false;

        for (var line = 0; line < items_lines; line++) {

            var item_type = currentRecord.getSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: ITEM_TYPE_SUBLIST_FIELD_ID,
                line: line,
            });

            if (item_type === INVENTORY_ITEM_TYPE) {

                isInventoryItemPresent = true;

                break;
            }

        }

        return isInventoryItemPresent;

    }

    function isReferenceNumberValid(pr_rec, ref_no) {

        var item_lines = pr_rec.getLineCount({
            sublistId: ITEMS_SUBLIST_ID
        });

        for (var line = 0; line < item_lines; line++) {

            var line_unique_key = pr_rec.getSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: LINE_UNIQUE_KEY_SUBLIST_FIELD_ID,
                line: line,
            });

            if (line_unique_key === ref_no) {
                return true;
            }

        }

        return false;

    }

    function isReferenceNumberAlreadyEntered(currentRecord, current_line, entered_ref_no) {

        var item_lines = currentRecord.getLineCount({
            sublistId: ITEMS_SUBLIST_ID
        });

        for (var line = 0; line < item_lines; line++) {

            if (current_line !== line) {

                var current_request_ref_no = currentRecord.getSublistValue({
                    sublistId: ITEMS_SUBLIST_ID,
                    fieldId: REQUEST_REF_NO_SUBLIST_FIELD_ID,
                    line: line,
                });

                if (current_request_ref_no === entered_ref_no) {
                    return true;
                }

            }

        }

        return false;

    }

    function dummyItemsHasReferenceNumber(currentRecord) {

        var item_lines = currentRecord.getLineCount({
            sublistId: ITEMS_SUBLIST_ID
        });

        for (var line = 0; line < item_lines; line++) {

            var old_item_id = currentRecord.getSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: OLD_ITEM_ID_SUBLIST_FIELD_ID,
                line: line
            });

            var req_ref_no = currentRecord.getSublistValue({
                sublistId: ITEMS_SUBLIST_ID,
                fieldId: REQUEST_REF_NO_SUBLIST_FIELD_ID,
                line: line
            });

            if (old_item_id === DUMMY_INVENTORY_ITEM_ID && !req_ref_no) {

                return false;

            }

        }

        return true;

    }

    function canTagDummy(currentRecord) {

        //Verbosed to increase code readability

        var purchase_category = currentRecord.getValue(PURCHASE_CATEGORY_FLD_ID);

        var allowed_categories = ['1', '3', '2'];

        return allowed_categories.includes(purchase_category) ? true : false;

    }

    function setItemRequestReferenceNumber(currentRecord, pr_id) {

        if (pr_id) {

            try {

                var pr_rec = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: pr_id,
                });

                var item_lines = pr_rec.getLineCount({
                    sublistId: ITEMS_SUBLIST_ID
                });

                for (var line = 0; line < item_lines; line++) {

                    var line_unique_key = pr_rec.getSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: LINE_UNIQUE_KEY_SUBLIST_FIELD_ID,
                        line: line,
                    });

                    console.log(line_unique_key);

                    currentRecord.selectLine({
                        sublistId: ITEMS_SUBLIST_ID,
                        line: line,
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: ITEMS_SUBLIST_ID,
                        fieldId: NON_DUMMY_REQ_ITEM_REF_NO_SUBLIST_FIELD_ID,
                        value: line_unique_key,
                        forceSyncSourcing: true,
                    });

                    currentRecord.commitLine({
                        sublistId: ITEMS_SUBLIST_ID
                    });

                }

            } catch (error) {
                console.log(error);
            }


        }

    }

    function disablePurchaseRequestorField(currentRecord) {

        var currentUser = runtime.getCurrentUser();

        if (currentUser.role === REQUESTOR_ROLE_ID) {

            var purchase_requestor_field = currentRecord.getField({
                fieldId: PURCHASE_REQUESTOR_FIELD_ID,
            });

            // Disable the field
            purchase_requestor_field.isDisabled = true;

            purchase_requestor_field.isMandatory = false;

        }

    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        validateField: validateField,
        validateLine: validateLine,
        saveRecord: saveRecord,
        onSubmitBtnClick: onSubmitBtnClick,
        onApproveBtnClick: onApproveBtnClick,
        onRejectBtnClick: onRejectBtnClick,
        onResubmitBtnClick: onResubmitBtnClick,
        onRecommendBtnClick: onRecommendBtnClick,
        onGeneratePOClick: onGeneratePOClick,
        onTransferOrderBtnClick: onTransferOrderBtnClick,
        onVoidBtnClick: onVoidBtnClick,
        onCancelBtnClick: onCancelBtnClick,
        onReprocessBtnClick: onReprocessBtnClick,
    };
});
