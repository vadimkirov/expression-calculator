function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    // write your solution here

    function tokenize(code) {
        let results = [];
        const tokenRegExp = /\s*([A-Za-z]+|[0-9]+|\S)\s*/g;
        let checkBrackets = [];
        let bracketPaired = 0;
        let temp;
        while ((temp = tokenRegExp.exec(code)) !== null) {
            let control = temp[1];
            results.push(control);
            if(control === '('  || control === ')' ){
                if(control === '('){
                    bracketPaired++;
                }else {
                    bracketPaired--;
                }
                checkBrackets.push(control);
            }
        }
        if(bracketPaired !== 0 ){
            throw("ExpressionError: Brackets must be paired");
        }
        for (let i = 0; i < checkBrackets.length; i++) {

            if((checkBrackets[i] === '('  && i === checkBrackets.length-1) || (checkBrackets[i] === ')' && i=== 0)){
                throw("ExpressionError: Brackets must be paired");
            }

        }
        return results;
    }


    function isNumber(token) {
        return token !== undefined && token.match(/^[0-9]+$/) !== null;
    }

    function isName(token) {
        return token !== undefined && token.match(/^[A-Za-z]+$/) !== null;
    }


    function parse(code) {

        let tokens = tokenize(code);

        let position = 0;

        function peek() {
            return tokens[position];
        }


        function parsePrimaryExpr() {
            let t = peek();

            if (isNumber(t)) {
                position++;
                return {type: "number", value: t};

            } else if (isName(t)) {

                position++;
                return {type: "name", id: t};
            } else if (t === "(") {

                position++;
                let expression = parseExpr();
                if (peek() !== ")")
                    throw new SyntaxError("expected )");

                position++;
                return expression;
            } else {
                throw new SyntaxError("expected a number, a variable, or parentheses");
            }
        }

        function parseMulExpr() {
            let expression = parsePrimaryExpr();
            let t = peek();
            while (t === "*" || t === "/") {

                position++;
                let rhs = parsePrimaryExpr();
                expression = {type: t, left: expression, right: rhs};
                t = peek();
            }
            return expression;
        }


        function parseExpr() {
            let expression = parseMulExpr();
            let t = peek();
            while (t === "+" || t === "-") {

                position++;
                let rhs = parseMulExpr();
                expression = {type: t, left: expression, right: rhs};
                t = peek();
            }
            return expression;
        }


        let result = parseExpr();

        if (position !== tokens.length)
            throw new SyntaxError("unexpected '" + peek() + "'");


        return result;
    }


    function evaluate(obj) {
        switch (obj.type) {
            case "number":  return parseInt(obj.value);
            // case "name":  return variables[obj.id] || 0;
            case "+":  return evaluate(obj.left) + evaluate(obj.right);
            case "-":  return evaluate(obj.left) - evaluate(obj.right);
            case "*":  return evaluate(obj.left) * evaluate(obj.right);
            case "/":  let rightPart = evaluate(obj.right);
                if (rightPart === 0) {
                    throw ("TypeError: Division by zero.");
                    break;
                }
                return evaluate(obj.left) / rightPart;
                break;
        }
    }



    return evaluate(parse(expr));

}



module.exports = {
    expressionCalculator
}