/**
 * Finds an expression that evaluates to a value, using exactly four operands
 * and up to four arithmetic operators.
 * @param {Array} nums - array of operands
 * @param {Array} ops - array of operators
 * @param {number} value - the value of the expression result
 * @returns {?string} stringExp - the expression that evaluates to value
 */
function findExpression(nums, ops, value) {
  // error handling
  if(!Array.isArray(nums) || nums.length !== 4 || !Array.isArray(ops) || ops.length > 4 || typeof value !== "number") {
    throw new Error('invalid inputs');
  }

  // generate all permutations of nums for nonnegative values
  let perms = generatePermutations(nums.filter((num) => Number.isFinite(num) && num >= 0).map((num) => num + ""));

  // turn the permutations into formatted expression arrays, filled with operands at indices 1, 4, 8, and 11
  let expsWithOperands = perms.filter((perm) => typeof perm === "string").map((perm) => makeExpWithOperands(perm)),
      stringExp = '';

  // '(' and ')' go at index pairs (0,5), (3,9), and (7,12)
  const parPairs = [[0,5],[3,9],[7,12]];

  // test all combinations of three operators
  for(let exp of expsWithOperands) {
    for(let i = 0; i < ops.length; i++) {
      for(let j = i; j < ops.length; j++) {
        for(let k = j; k < ops.length; k++) {
          // place operators at indices 2, 6, and 10 of expression array
          exp[2] = ops[i];
          exp[6] = ops[j];
          exp[10] = ops[k];

          // insert '(' and ')' at each index pair to determine order of operations
          for(let i = 0; i < parPairs.length; i++) {
            exp[parPairs[i][0]] = '(';
            exp[parPairs[i][1]] = ')';

            // join formatted expression array into string
            stringExp = exp.join('');

            // evaluate the string expression and compare the result to value
            if(eval(stringExp) === value) {
              return stringExp;
            }

            // clear current '(' and ')' from the expression
            exp[parPairs[i][0]] = '';
            exp[parPairs[i][1]] = '';
          }
        }
      }
    }
  }

  return null;
}

/**
 * Finds all permutations of characters in an array.
 * @param {Array} arr - an array of four characters
 * @returns {String[]} output - an array of all permutations of the characters in arr
 */
function generatePermutations(arr) {
  if(arr.length <= 1) {
    return arr;
  }

  let perms = generatePermutations(arr.slice(0, arr.length-1));
  let output = [];

  for(let perm of perms) {
    for(let i = 0; i <= perm.length; i++) {
      output.push(perm.slice(0,i) + arr[arr.length-1] + perm.slice(i));
    }
  }

  return output;
}

/**
 * Makes a formatted expression array from a string of four numbers.
 * @param {string} perm - a four-character string of numbers, representing a permutation
 * @returns {Array} exp - an array containing numeric characters at indices 1, 4, 8, and 11
 */
function makeExpWithOperands(perm) {
  let exp = [],
      operandIdxs = [1,4,8,11];

  for(let i = 0; i < perm.length; i++) {
     exp[operandIdxs.shift()] = perm[i];
  }

  return exp;
}

findExpression([1,3,4,6],['+','-','*','/'],24); // null
