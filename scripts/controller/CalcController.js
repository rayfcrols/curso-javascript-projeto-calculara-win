class CalcController {

    constructor() {
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this.initialize();
        this.initButtonEvents();
        this.initKeyboard();
        this.pasteFromClipboard();
    }

    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    pasteFromClipboard(){
        document.addEventListener('paste',e =>{
              let text = e.clipboardData.getData('Text');
              this.displayCalc = parseFloat(text);
        });
    }

    initialize() {
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
        
        document.querySelectorAll('#btn-c').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });
    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if (this._audioOnOff){
            this._audio.currentTime = 0;
           this._audio.play(); 
        }
    }


    initKeyboard(){
        this.playAudio();
       

        document.addEventListener('keyup', e=>{
            //console.log(e.key);
            switch (e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case ',':
                case '.':
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
    
        });

    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
    return (['+','-','*','/','%','square','elevation'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);  
        if(this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        try{
           console.log(this._lastOperator);
            if  (this._lastOperator == 'square'){
                    return Math.sqrt(this._operation[0]);
                } else if (this._lastOperator == 'pow'){
                    return Math.pow(this._operation[0],3);
                } else {
                    return eval(this._operation.join(""));
                }        
        } catch(e){
            setTimeout(()=>{
                this.setError();
            },1);
        }
     
    }

    calc(){
        let last = '';
       
        //let result = '';
        this._lastOperator = this.getLastItem(true);
        //console.log(this._lastOperator);

        if (this._operation.length < 3){ 
            //console.log(last);
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator,this._lastNumber];
            }

        if (this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        } 
       
        
        let result = this.getResult();
    
        
        if (last == '%'){
            result /= 100;
            this._operation = [result];

        }  else {
  
            this._operation = [result];         
            if (last) this._operation.push(last);
        }
        console.log(result);   
        this.setLastNumberToDisplay();    

    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--){
                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                    }
            }
            if (!lastItem){
                lastItem = (isOperator)?this._lastOperator : this._lastNumber;
            }
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
                
        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
        //this.displayCalc = 2.5;
        //console.log(this._operation);  
    }

    addOperation(value){

        if (isNaN(this.getLastOperation())){
            //Não é um Número
            if (this.isOperator(value)){
                //Trocar o Operador
                this.setLastOperation(value);
            }  else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
                
        } else {
            if (this.isOperator(value)){
                this.pushOperation(value);
            } else {
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(newValue);

            this.setLastNumberToDisplay();
            }

        }
 
    }

    addDot(){
        
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1 ) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString()+ '.');
        }
        this.setLastNumberToDisplay();

    }

    setError(){
        this.displayCalc = "Error";
        //return false;
    }

    execBtn(value){
        this.playAudio();
        switch (value){
            case 'c':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'sum':
                this.addOperation('+');
                break;
            case 'subtraction':
                this.addOperation('-');
                break;
            case 'division':
                this.addOperation('/');
                break;
            case 'multiplication':
                this.addOperation('*');
                break;
            case 'percent':
                this.addOperation('%');
                break;
            case 'equal':
                this.calc();
                break;
            case 'square':
                this.addOperation('square');
                this.calc();
                break;
            case 'pow':
                this.addOperation('pow');
                this.calc();
                break;
            case 'derivate':
                this.calc();
                break;
            case 'reverse':
                this.calc();
                break;
            case 'back':
                this.calc();
                break;
            case 'dot':
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }

    }

    initButtonEvents() {
        let buttons = document.querySelectorAll("[id^='btn']");
        //document.getElementById("[id^='btn']");

        buttons.forEach(btn => {
            //console.log(btn);
            this.addEventListenerAll(btn, "drag click", e => {
                //console.log(btn.id.replace("btn-", ""));
               let textBtn = btn.id.replace("btn-", "");
             this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });


    }   

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }
    

    set displayCalc(value) {
        
        if (value.toString().length > 10){
            try {
                value = value.toFixed(2);
            } catch (error) {
                this.setError();
                return false;  
            }
            
        } 
        
        if (value.toString().length < 0.01){
                this.setError();
                return false;  
            
        } 
        

        //var that = $(this),
       // textLength = that.val().length;
       
        /*
        let fontSize = parseInt(this._displayCalcEl.style.fontSize);
        for (let i = fontSize; i >= 0; i--) {
            let overflow = isOverflown(this._displayCalcEl);
            if (overflow) {
            fontSize--;
            this._displayCalcEl.style.fontSize = fontSize + "px";
            }
        }*/
       // this.adjustDisplay();
        //this._displayCalcEl.innerHTML = parseFloat(value);
        this._displayCalcEl.innerHTML = value;
    }

}