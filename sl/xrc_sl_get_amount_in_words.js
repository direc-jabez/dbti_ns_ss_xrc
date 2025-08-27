/**
 * @NApiVersion 2.1
 * @NScripttype Suitelet
 *
 * Created by: DBTI - Ricky Eredillas Jr.
 * Date: March 30, 2025
 *
 */

define([],

    function () {

        function onRequest(context) {

            var params = context.request.parameters;

            log.debug('params', params);

            var amount = parseFloat(params.amount.split(",").join(""));

            var amount_in_words = numberToWords(amount);

            var response = '<#assign amount_in_words="' + amount_in_words + '"/>';

            context.response.writeLine(response);

        }

        function numberToWords(num) {

            if (num === 0) return "Zero";

            const belowTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
            const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            const thousands = ["", "Thousand", "Million"];

            function helper(n) {
                if (n === 0) return "";
                else if (n < 20) return belowTwenty[n] + " ";
                else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
                else return belowTwenty[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
            }

            function convertWholeNumber(n) {
                if (n === 0) return "Zero";

                let result = "";
                let i = 0;

                while (n > 0) {
                    if (n % 1000 !== 0) {
                        result = helper(n % 1000) + thousands[i] + " " + result;
                    }
                    n = Math.floor(n / 1000);
                    i++;
                }

                return result.trim();
            }

            function convertDecimalPart(decimalStr) {
                if (!decimalStr || decimalStr === "00") return "Only";
                return `and ${decimalStr}/100 Cents Only`;
            }

            function formatAmount(amount) {
                let [whole, decimal] = amount.toString().split(".");
                let words = convertWholeNumber(parseInt(whole));
                let centsPart = convertDecimalPart(decimal);
                return words + " " + centsPart;
            }

            return formatAmount(num);

        }

        return { onRequest };
    }
);
