/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Charles Maverick Herrera
 * Date: Oct 29, 2024
 *
 */

define(["N/record"], function (record) {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const EMPLOYEE_JOB_TITLE_FLD_ID = "title";

    function onRequest(context) {
        var params = context.request.parameters;

        var emp_ids = params.emp_ids;

        log.debug('emp_ids', emp_ids);
        var response = '';

        if (emp_ids) {

            emp_ids = emp_ids.split('-');
            for (var i = 0; i < emp_ids.length; i++) {
                if (emp_ids[i]) {
                    var emp_rec = record.load({
                        type: record.Type.EMPLOYEE,
                        id: emp_ids[i],
                        isDynamic: true,
                    });

                    var roles_lines = emp_rec.getLineCount({ sublistId: 'roles' });

                    log.debug('roles_lines', roles_lines);

                    var is_requestor = false;

                    if (roles_lines === 1) {

                        var role = emp_rec.getSublistValue({ sublistId: 'roles', fieldId: 'selectedrole', line: 0 });

                        if (parseInt(role) === 1431) {
                            is_requestor = true;
                        }
                    }

                    response +=
                        "<#assign emp_" +
                        alphabet[i] +
                        '_job_title="' +
                        emp_rec.getValue(EMPLOYEE_JOB_TITLE_FLD_ID) +
                        '"/>' + '<#assign is_requestor = "' + is_requestor + '" />';

                }
            }
        }

        log.debug("emp_ids", emp_ids);
        log.debug('response', response)
        context.response.writeLine(response);
    }

    return { onRequest };
});
