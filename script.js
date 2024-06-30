const inputSlider = document.querySelector("[data-lengthSlider]");  //syntax for custom attribute

const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set strength circle color to grey

setIndicator("#ccc");


//set passwordLength
function handleSlider() {                                 //ye fn sirf pwd length ko UI pe reflect karwata hai
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //or kuch bhi karna chahiye ? - HW
  const min = parseInt(inputSlider.min);
  const max = parseInt(inputSlider.max);
  const value = ((passwordLength - min) / (max - min)) * 100;
  inputSlider.style.background = `linear-gradient(to right, #ccc ${value}%, #eee ${value}%)`;


  /* const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%" */
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

  //shadow indicator was in hw
}


function getRndInteger(min, max) {                    // Math.random() isse value 0 and 1 ke beech me aayega
   return  Math.floor(Math.random() * (max-min)) + min;    //check once
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}


function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97,123));              //char from integer
}


function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,90));              //char from integer
  }


  function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);              //char from integer
    return symbols.charAt(randNum);
  }


  function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
      
}


//1:45:18

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if(checkbox.checked)
    checkCount++;
  });

  //Special case
if(passwordLength < checkCount)
{
  passwordLength = checkCount;
  handleSlider();
}
}


allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
})


copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value)
  copyContent();
})



generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected 
    if(checkCount <=0) return;

    if(passwordLength < checkCount){
      passwordLength = checkCount;
      handleSlider();
    }

    //lets start the journey to find new pwd
    console.log("starting the journey");

    //remove old pwd

    password = "";

    //lets put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //   password += generateUppercase();
    // }

    // if(LowercaseCheck.checked){
    //   password += generateLowercase();
    // }

    // if(Number.checked){
    //   password += generateNumber();
    // }

    // if(Symbol.checked){
    //   password += generateSymbol();
    // }


    let funcArr = [];

    if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

      //compulsory addition

      for(let i=0; i<funcArr.length; i++)
      {
        password += funcArr[i]();
      }

      console.log("compulsory addition done");


      //remaining

      for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");




      //shuffle the pwd

      password = shufflePassword(Array.from(password));
      console.log("shuffling done");



      //Show pwd in UI
      passwordDisplay.value = password;

      console.log("UI addidtion done");

      
      //calculate strength

      calcStrength();

});