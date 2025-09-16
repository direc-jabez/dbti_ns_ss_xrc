/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 *
 * Created by: DBTI - Ricky Eredillas Jr
 * Date: Jul 23, 2024
 *
 * Updated by: DBTI - Charles Maverick Herrera
 * Date: Oct 24, 2024
 *
 */
define(["N/search", "N/currentRecord", "N/runtime"], function (search, currRec, runtime) {
	const MODE_CREATE = "create";
	const BOM_NUM_FIELD_ID = "tranid";
	const LOCATION_FIELD_ID = "location";
	const ITEMS_SUBLIST_ID = "item";
	const ITEMS_SUBLIST_FIELD_ID = "item";
	const QTY_AVAILABLE_SUBLIST_FIELD_ID = "custcol_xrc_billmat_qty_avail_others";
	const QTY_SUBLIST_FIELD_ID = "quantity";
	const ORIGINAL_QTY_SUBLIST_FIELD_ID = "custcol_xrc_billmat_orig_qty";
	const ESTIMATED_RATE_FIELD_ID = "rate";
	const ESTIMATED_TOTAL_AMOUNT_FIELD_ID = "amount";
	const QTY_TO_BE_REQUESTED_FIELD_ID = "custcol_xrc_billmat_qty_to_be_req";
	const STATUS_FIELD_ID = "transtatus";
	const STATUS_PENDING_APPROVAL = "F";

	const MODE_COPY = "copy";
	const PREPARED_BY_FLD_ID = "custbody_xrc_prepared_by";
	const APPROVAL_1_FLD_ID = "custbody_xrc_approval1";
	const APPROVAL_2_FLD_ID = "custbody_xrc_approval2";
	const APPROVAL_3_FLD_ID = "custbody_xrc_approval3";
	const APPROVAL_4_FLD_ID = "custbody_xrc_approval4";
	const APPROVAL_5_FLD_ID = "custbody_xrc_approval5";
	const APPROVAL_6_FLD_ID = "custbody_xrc_approval6";
	const APPROVER_1_FLD_ID = "custbody_xrc_approver1";
	const APPROVER_2_FLD_ID = "custbody_xrc_approver2";
	const APPROVER_3_FLD_ID = "custbody_xrc_approver3";
	const APPROVER_4_FLD_ID = "custbody_xrc_approver4";
	const APPROVER_5_FLD_ID = "custbody_xrc_approver5";
	const APPROVER_6_FLD_ID = "custbody_xrc_approver6";
	const FOR_APPROVAL_FLD_ID = "custbody_xrc_for_approval";
	const REJECTED_FLD_ID = "custbody1";

	// Global variables
	var g_isSubmitForApprovalBtnClick = false;
	var g_isApproveBtnClick = false;
	var g_isRejectBtnClick = false;

	function pageInit(context) {
		var currentRecord = context.currentRecord;
		if (context.mode === MODE_CREATE) {
			// Setting default value for BOM #
			currentRecord.setValue(BOM_NUM_FIELD_ID, "To Be Generated");

			// Get the BOM# field
			var bom_num_field = currentRecord.getField({
				fieldId: BOM_NUM_FIELD_ID,
			});

			// Disable the field
			// bom_num_field.isDisabled = true;
		} else if (context.mode === MODE_COPY) {
			var currentUser = runtime.getCurrentUser();
			currentRecord.setValue(BOM_NUM_FIELD_ID, "To Be Generated");
			currentRecord.setValue(PREPARED_BY_FLD_ID, currentUser.id);
			currentRecord.setValue(APPROVAL_1_FLD_ID, false);
			currentRecord.setValue(APPROVAL_2_FLD_ID, false);
			currentRecord.setValue(APPROVAL_3_FLD_ID, false);
			currentRecord.setValue(APPROVAL_4_FLD_ID, false);
			currentRecord.setValue(APPROVAL_5_FLD_ID, false);
			currentRecord.setValue(APPROVAL_6_FLD_ID, false);
			currentRecord.setValue(APPROVER_1_FLD_ID, null);
			currentRecord.setValue(APPROVER_2_FLD_ID, null);
			currentRecord.setValue(APPROVER_3_FLD_ID, null);
			currentRecord.setValue(APPROVER_4_FLD_ID, null);
			currentRecord.setValue(APPROVER_5_FLD_ID, null);
			currentRecord.setValue(APPROVER_6_FLD_ID, null);
			currentRecord.setValue(FOR_APPROVAL_FLD_ID, false);
			currentRecord.setValue(REJECTED_FLD_ID, false);
		}
	}

	function fieldChanged(context) {

		var currentRecord = context.currentRecord;

		var sublistId = context.sublistId;

		var fieldId = context.fieldId;

		// Check if the changes were made in ITEMS_SUBLIST_ID
		if (sublistId === ITEMS_SUBLIST_ID) {

			console.log(fieldId);

			if (fieldId === ITEMS_SUBLIST_FIELD_ID) {

				var item_id = currentRecord.getCurrentSublistValue({
					sublistId: ITEMS_SUBLIST_ID,
					fieldId: ITEMS_SUBLIST_FIELD_ID,
				});

				var location = currentRecord.getValue(LOCATION_FIELD_ID);

				if (location) {

					// Getting the qty available
					var available = getQtyAvailable(item_id, location);

				}

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
					fieldId: QTY_SUBLIST_FIELD_ID,
					value: original_qty,
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

	function validateLine(context) {

		var currentRecord = context.currentRecord;

		var location = currentRecord.getValue(LOCATION_FIELD_ID);

		if (!location) {
			alert("Please select Location first to get the available quantity of the selected item.");
			return false;
		}
		return true;
	}

	function validateDelete(context) {

		var currentRecord = context.currentRecord;

		var status = currentRecord.getValue(STATUS_FIELD_ID);

		if (status !== STATUS_PENDING_APPROVAL) {
			alert("Item lines may only be removed from transactions that are in the 'Pending Approval' status.");
			return false;
		}

		return true;

	}

	function onSubmitForApprovalBtnClick(role_to_email) {
		var currentRecord = currRec.get();

		// Check if the button is already clicked
		// This is to prevent calling the link multiple times
		if (!g_isSubmitForApprovalBtnClick) {
			g_isSubmitForApprovalBtnClick = true;

			// Redirect to the approval link
			window.location.href = "https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1530&deploy=1&action=submitforapproval&id=" + currentRecord.id + "&role_to_email=" + role_to_email;
		} else {
			alert("You have already submitted the form.");
		}
	}

	function onApproveBtnClick(approve_field, role_to_email) {

		console.log(role_to_email);

		var currentRecord = currRec.get();

		// Check if the button is already clicked
		// This is to prevent calling the link multiple times
		if (!g_isApproveBtnClick) {
			g_isApproveBtnClick = true;

			// Redirect to the approval link
			window.location.href =
				"https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1530&deploy=1&action=approve&id=" +
				currentRecord.id +
				"&field=" +
				approve_field +
				"&role_to_email=" +
				role_to_email;

		} else {
			alert("You have already submitted the form.");
		}
	}

	function onRejectBtnClick() {
		var currentRecord = currRec.get();

		// Check if the button is already clicked
		// This is to prevent calling the link multiple times
		if (!g_isRejectBtnClick) {
			g_isRejectBtnClick = true;

			// Redirect to the approval link
			window.location.href =
				"https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1530&deploy=1&action=reject&id=" +
				currentRecord.id;
		} else {
			alert("You have already submitted the form.");
		}
	}

	function onCloseBtnClick() {
		var currentRecord = currRec.get();

		// Check if the button is already clicked
		// This is to prevent calling the link multiple times
		if (!g_isRejectBtnClick) {
			g_isRejectBtnClick = true;

			// Redirect to the approval link
			window.location.href =
				"https://9794098.app.netsuite.com/app/site/hosting/restlet.nl?script=1445&deploy=1&recType=" +
				currentRecord.type +
				"&close=T&id=" +
				currentRecord.id;
		} else {
			alert("You have already submitted the form.");
		}
	}

	function onTransferOrderBtnClick() {
		var currentRecord = currRec.get();

		// Redirect to Transfer Order together with the ID of the BOM
		location.href =
			"https://9794098.app.netsuite.com/app/accounting/transactions/trnfrord.nl?whence=&origin_id=" +
			currentRecord.id;
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
			filters: [
				["internalid", "anyof", item_id],
				"AND",
				["inventorylocation", "noneof", location_id],
			],
			columns: [
				search.createColumn({
					name: "locationquantityavailable",
					label: "Location Available",
				}),
			],
		});

		item_search.run().each(function (result) {
			var loc_available = result.getValue("locationquantityavailable");

			if (loc_available) {
				available += parseInt(loc_available);
			}

			return true;
		});

		return available || 0;
	}

	return {
		pageInit: pageInit,
		fieldChanged: fieldChanged,
		validateLine: validateLine,
		validateDelete: validateDelete,
		onSubmitForApprovalBtnClick: onSubmitForApprovalBtnClick,
		onApproveBtnClick: onApproveBtnClick,
		onRejectBtnClick: onRejectBtnClick,
		onCloseBtnClick: onCloseBtnClick,
		onTransferOrderBtnClick: onTransferOrderBtnClick,
	};
});
