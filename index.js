// let expr= ''
// const output = document.getElementById("output")
// const history = document.getElementById("history")

// function uppdateDisplay(){
//     output.textContent = expr === ''? 0 : expr;
// }

// function evaluation(s){
//     s = s.replace(/X/g, '*').replace(/÷/g, '/')
//     if(!/^[0-9+\-*/().%\s]+$/.test(s)) throw new Error("Invalid Characters")
  
//     return Function('return('+ s +')')()
// }


// function handleButtonClick(btn){
//     const val = btn.getAttribute("data-value")
//     const action = btn.getAttribute("data-action")
    
//     switch(action){
//         case 'clear':
//             expr = ''
//             history.textContent = ''
//             break;
//         case 'back':
//             expr = expr.slice(0, -1)
//             break;
//         case 'eval':
//             try{
//                 const result = evaluation(expr || '0')
//                 history.textContent = expr + "="
//                 expr = String(result)
//             } catch{
//                 expr = "Error"
//             }
//             break;
//         case 'dot':
//             const tokens = expr.split(/[^0-9.]/)  
//             const last = tokens[tokens.length -1]   
//             if(!last.includes(".")) expr +='.'
//             break;
//         case 'op':
//             if(expr === '' && val === '-'){
//                 expr = '-'
//             } else if(/[+\-*/.%]$/.test(expr)){
//                 expr = expr.slice(0, -1) + val
//             } else {
//                 expr += val
//             }
//             break;
//         default:
//             if(val) expr += val
//     }
//     uppdateDisplay()
// }

// document.querySelectorAll("button.btn").forEach(btn => {
//     btn.addEventListener("click", () => handleButtonClick(btn))
// })

// window.addEventListener("keydown", (e) => {
//     if(/[0-9]/.test(e.key)){
//         expr += e.key
//     } else if(e.key === 'Enter' || e.key=== '='){
//         try{
//             const result = evaluation(expr || '0')
//             history.textContent = expr + '='
//             expr = String(result)
//         } catch {
//             expr = 'Error'
//         }
//     } else if(e.key === 'Backspace'){
//         expr = expr.slice(0,-1)        
//     } else if(e.key.toLowerCase() === 'c'){
//         expr = ''
//         history.textContent = ''
//     }
//     uppdateDisplay()
// })

// uppdateDisplay()

let expr = '';
const output = document.getElementById('output');
const history = document.getElementById('history');

function uppdateDisplay() {
  output.textContent = expr === '' ? 0 : expr;
}

function evaluation(s) {
  // normalize symbols
  s = s.replace(/X/g, '*').replace(/÷/g, '/');

  // --- percent handling ---
  // 1) number % (parenthesized term)  -> (number/100) * (term)
  s = s.replace(
    /(\d+(?:\.\d+)?)\s*%\s*(\([^()]*\))/g,
    '($1/100*$2)'
  );

  // 2) number % number  -> (number * number / 100)
  s = s.replace(
    /(\d+(?:\.\d+)?)\s*%\s*(\d+(?:\.\d+)?)/g,
    '($1*$2/100)'
  );

  // 3) trailing percent on a number  -> (number/100)
  s = s.replace(
    /(\d+(?:\.\d+)?)\s*%/g,
    '($1/100)'
  );

  // validate after transforms (no % should remain)
  if (!/^[0-9+\-*/().\s]+$/.test(s)) throw new Error('Invalid Characters');

  return Function('return (' + s + ')')();
}

function handleButtonClick(btn) {
  const val = btn.getAttribute('data-value');
  const action = btn.getAttribute('data-action');

  switch (action) {
    case 'clear':
      expr = '';
      history.textContent = '';
      break;

    case 'back':
      expr = expr.slice(0, -1);
      break;

    case 'eval':
      try {
        const result = evaluation(expr || '0');
        history.textContent = expr + '=';
        expr = String(result);
      } catch {
        expr = 'Error';
      }
      break;

    case 'dot': {
      const tokens = expr.split(/[^0-9.]/);
      const last = tokens[tokens.length - 1];
      if (!last.includes('.')) expr += '.';
      break;
    }

    case 'op':
      if (expr === '' && val === '-') {
        expr = '-';
      } else if (/[+\-*/%]$/.test(expr)) {
        // replace trailing operator with new one
        expr = expr.slice(0, -1) + val;
      } else {
        expr += val;
      }
      break;

    default:
      if (val) expr += val;
  }
  uppdateDisplay();
}

document.querySelectorAll('button.btn').forEach((btn) => {
  btn.addEventListener('click', () => handleButtonClick(btn));
});

window.addEventListener('keydown', (e) => {
  if (/[0-9]/.test(e.key)) {
    expr += e.key;
  } else if (e.key === 'Enter' || e.key === '=') {
    try {
      const result = evaluation(expr || '0');
      history.textContent = expr + '=';
      expr = String(result);
    } catch {
      expr = 'Error';
    }
  } else if (e.key === 'Backspace') {
    expr = expr.slice(0, -1);
  } else if (e.key.toLowerCase() === 'c') {
    expr = '';
    history.textContent = '';
  } else if (e.key === '%') {
    if (/[+\-*/%]$/.test(expr)) expr = expr.slice(0, -1) + '%';
    else expr += '%';
  } else if (e.key === '+'
          || e.key === '-'
          || e.key === '*'
          || e.key === '/') {
    if (/[+\-*/%]$/.test(expr)) expr = expr.slice(0, -1) + e.key;
    else expr += e.key;
  } else if (e.key === '.') {
    const tokens = expr.split(/[^0-9.]/);
    const last = tokens[tokens.length - 1];
    if (!last.includes('.')) expr += '.';
  }
  uppdateDisplay();
});

uppdateDisplay();
