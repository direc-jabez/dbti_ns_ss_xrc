function customizeGlImpact(transactionRecord, standardLines, customLines, book) {

    var tenant_sec_dep_acc = 234;

    var currLine = standardLines.getLine(0);

    //To get the entity from the standard line
    var entityId = currLine.getEntityId();

    //To get the record type of the transaction
    var recordType = transactionRecord.getRecordType();

    if (recordType == 'customerdeposit') {

        var payment = parseFloat(transactionRecord.getFieldValue('payment'));

        var item_id = parseFloat(transactionRecord.getFieldValue('custbody_xrc_item_ref'));

        if (payment > 0) {

            //To add new custom line in the GL impact
            var newLine = customLines.addNewLine();

            //To set debit amount
            newLine.setDebitAmount(payment);

            newLine.setAccountId(tenant_sec_dep_acc);

            newLine.setEntityId(entityId);

            //To add new custom line in the GL impact
            var newLine = customLines.addNewLine();

            //To set Credit amount
            newLine.setCreditAmount(payment);

            var credit_acc = nlapiLookupField('otherchargeitem', item_id, 'incomeaccount');

            newLine.setAccountId(parseInt(credit_acc));

            newLine.setEntityId(entityId);

        }

    } else if (recordType == 'vendorbill') {

        var charge_to_employee = transactionRecord.getFieldValue('custbody_xrc_charge_to_employee');

        // Check if Charge to Employee field is ticked
        if (charge_to_employee == 'T') {

            var charge_rate = parseFloat(transactionRecord.getFieldValue('custbody_xrc_charge_percentage'));

            var debit_amount = 0;

            var itemCount = transactionRecord.getLineItemCount('item'); // Get the number of lines in the 'item' sublist

            for (var i = 1; i <= itemCount; i++) {

                var item_id = transactionRecord.getLineItemValue('item', 'item', i);

                // Ignore if item is EXPANDED WITHHOLDING TAX (WE_PH)
                if (item_id != 14) {

                    var itemType = transactionRecord.getLineItemValue('item', 'itemtype', i);

                    var itemRecordType = getItemRecordType(itemType);

                    var account = nlapiLookupField(itemRecordType, item_id, 'assetaccount') || nlapiLookupField(itemRecordType, item_id, 'expenseaccount');

                    var amount = parseFloat(transactionRecord.getLineItemValue('item', 'amount', i)) * (1 + (charge_rate / 100));

                    var newLine = customLines.addNewLine();

                    newLine.setCreditAmount(amount);

                    newLine.setAccountId(parseInt(account));

                    debit_amount += amount;

                }

            }

            var newLine = customLines.addNewLine();

            newLine.setDebitAmount(debit_amount);

            newLine.setAccountId(535); // Account: 021-01-112-002 ACCOUNTS RECEIVABLE - EMPLOYEES

        }

    } else if (recordType === 'depositapplication') {

        var applied = parseFloat(transactionRecord.getFieldValue('applied'));

        var item_id = parseFloat(transactionRecord.getFieldValue('custbody_xrc_item_ref'));

        if (applied > 0) {

            //To add new custom line in the GL impact
            var newLine = customLines.addNewLine();

            //To set debit amount
            newLine.setDebitAmount(applied);

            var credit_acc = nlapiLookupField('otherchargeitem', item_id, 'incomeaccount');

            newLine.setAccountId(parseInt(credit_acc));

            newLine.setEntityId(entityId);

            //To add new custom line in the GL impact
            var newLine = customLines.addNewLine();

            //To set Credit amount
            newLine.setCreditAmount(applied);

            newLine.setAccountId(tenant_sec_dep_acc);

            newLine.setEntityId(entityId);

        }

    }
}


function getItemRecordType(itemType) {

    var recordTypes = {
        'InvtPart': 'inventoryitem',
    };

    return recordTypes[itemType];

}