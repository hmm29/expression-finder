/**
 * Finds an expression that evaluates to a value, using exactly four operands
 * and up to four arithmetic operators.
 * @param {Array} nums - array of operands
 * @param {Array} ops - array of operators
 * @param {Number} value - the value of the expression result
 * @returns {String} stringExp - the expression that evaluates to value
 *
 * Time: O(n^2 * n!)
 * Space: O(n^2 * n!)
 */

function findExpression(nums, ops, value) {
  if(!Array.isArray(nums) || nums.length !== 4 || !Array.isArray(ops) || ops.length > 4 || typeof value !== "number") {
    throw new Error('invalid inputs');
  }

  // generate all permutations of nums
  let perms = generatePermutations(nums.map((num) => num + ""));

  // Expression string format:
  // operands at indices 1, 4, 8, and 11
  // operators at indices 2, 6, and 10
  // parentheses pairs at indices (0,5), (3,9), and (7,12)

  let expsWithOperands = perms.map((perm) => makeExpWithOperands(perm)),
      stringExp = '',
      parPairs = [[0,5],[3,9],[7,12]];

  for(let exp of expsWithOperands) {
    for(let i = 0; i < ops.length; i++) {
      for(let j = i; j < ops.length; j++) {
        for(let k = j; k < ops.length; k++) {
          exp[2] = ops[i];
          exp[6] = ops[j];
          exp[10] = ops[k];

          for(let i = 0; i < parPairs.length; i++) {
            exp[parPairs[i][0]] = '(';
            exp[parPairs[i][1]] = ')';

            stringExp = exp.join('');
            if(eval(stringExp) === value) {
              return stringExp;
            }

            // clear the parentheses pair
            exp[parPairs[i][0]] = '';
            exp[parPairs[i][1]] = '';
          }
        }
      }
    }
  }

  return null;
}

function makeExpWithOperands(perm) {
  if(typeof perm !== 'string') {
    return null;
  }

  let exp = [];
  let operandIdxs = [1,4,8,11];

  for(let i = 0; i < perm.length; i++) {
     exp[operandIdxs.shift()] = perm[i];
  }

  return exp;
}

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

findExpression([1,3,4,6],['+','-','*','/'],24); // null
