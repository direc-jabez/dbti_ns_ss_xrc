/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/
define(['N/record'], (record) => {

    const onRequest = (context) => {

        var params = context.request.parameters;

        var emp_id = params.emp_id;

        if (emp_id) {

            var emp_rec = record.load({
                type: record.Type.EMPLOYEE,
                id: emp_id,
            });

            context.response.writeLine('<#assign emp_initials="' + emp_rec.getValue('custentityemp_initials') + '"/>');
            
        } else {
            
            context.response.writeLine('<#assign emp_initials=""/>');

        }


    }

    return { onRequest }
});

