/**
 * This file should be placed at the node_modules sub-directory of the directory where you're
 * executing it.
 *
 * Written by Fernando Castor in November/2017.
 */
exports.solve = function(fileName) {
    let formula = readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    return result // two fields: isSat and satisfyingAssignment
  }
 

 
  // Receives the current assignment and produces the next one
  function nextAssignment(currentAssignment) {
   
    let assignBinario = currentAssignment.join("");
    
    assignBinario = parseInt(assignBinario,2);
    
    assignBinario = assignBinario + 1;
    assignBinario = assignBinario.toString(2);
    let binLen = assignBinario.length;

        for(let i = 0; i < (currentAssignment.length - binLen); i++){
            assignBinario = '0' + assignBinario;
          
        }

    let newAssignment =  assignBinario.split("")    
        for(let i = 0; i < newAssignment.length; i++){
            newAssignment[i] = parseInt(newAssignment[i]);
        }
    
    return newAssignment
  }
 
 
  
  function doSolve(clauses, assignment) {
    let isSat = false
    var index = 0;
    var maxIndex = (2 ** assignment.length) - 1

    while ((!isSat) && index <= maxIndex-1) {    
         
         if(checkAssignment(clauses, assignment) == true){
                isSat = true;
            
           } else {
                assignment = nextAssignment(assignment);
                //console.log(assignment);
           }
           index++;
       }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
      result.satisfyingAssignment = assignment
    }
    return result
  }
   
  function readFormula(fileName) {
    // To read the file, it is possible to use the 'fs' module.
    // Use function readFileSync and not readFile.
    // First read the lines of text of the file and only afterward use the auxiliary functions.
    const fs = require('fs')
    let arquivoLinha = fs.readFileSync(fileName, 'utf8')
    let text = arquivoLinha.split(/[\r\n]+/)
    let clauses = readClauses(text)
    let variables = readVariables(clauses)
   //console.log(variables);
 
   // In the following line, text is passed as an argument so that the function
    //is able to extract the problem specification.
    let specOk = checkProblemSpecification(text, clauses, variables)
    //console.log(specOk);
    let result = {
         'clauses': [], 'variables': []
         }
    if (specOk) {
     result.clauses = clauses
     result.variables = variables
    }
    return result
  }
   
  function readClauses(text){
      let arrayClauses = [];  
    for (let i = 0; i < text.length; i++) {
      if (text[i].charAt(0) != 'c' && text[i].charAt(0) != 'p'){
            let auxClau = text[i].split(' ');          
            for (let j = 0; j < auxClau.length; j++){
                if (auxClau[j] == '0' || auxClau[j] == '')
                    auxClau.splice(j, 1);
                else
                    auxClau[j] = parseInt(auxClau[j]);
            }      
            if (auxClau.length > 0)
            arrayClauses.push(auxClau);
      }
    }
    return arrayClauses;
    //console.log(arrayClauses);
}
 
function readVariables(clauses){
 
  let arrayVariables = [];
  let arrayVariablesFinal = [];
  //console.log(clauses);
    for (let i = 0; i < clauses.length; i++){
        for (let j = 0; j < clauses[i].length; j++) {
           let element = clauses[i][j];
            if(element < 0){
                element = element * -1;     //Math.abs
            }          
            if(!arrayVariables.includes(element)) {
                arrayVariables.push(element);
            }
        }
    }
 
    for (let i = 0; i <arrayVariables.length; i++){
        arrayVariablesFinal.push(0);
    }  
    return arrayVariablesFinal;
}
 
function checkProblemSpecification(text, clauses, variables) {

    let check = false;
 
    for(let i=0; i < text.length ; i++){
        if(text[i].charAt(0) == 'p'){
            let auxCPS = text[i].split(' ');
 
            if (auxCPS[2] == variables.length && auxCPS[3] == clauses.length) {
            return true;
            chack = true;
            } else{
                return false;
            }
        } else {
            if (check == false) {
                //console.log("This file doesn't have a 'p' signaling at the beginning of the specification line in the header.")
                  return true
              } else {
                console.log("The specification of the problem in the header doesn't match the specification extracted from the clauses.")
                return false
              }
        }   
    }
}
function checkAssignment (clauses, assignment){
    let expression = true;
   // console.log(assignment)

    for(let i = 0; i < clauses.length && expression; i++){
        let clausesBool = false;
            for(let j = 0; j < clauses[i].length && !clausesBool; j++){
                let originalElm = clauses[i][j];

                let elm = Math.abs(clauses[i][j]);
                elm = Boolean(assignment[elm - 1]);

                if(originalElm < 0){
                    elm = !elm;
                }
                
                
                if (elm == true){
                    clausesBool = true;
                }                
            }
            if(clausesBool == false){
                expression = false;
                return false;
            }
    }
    return true;
}
