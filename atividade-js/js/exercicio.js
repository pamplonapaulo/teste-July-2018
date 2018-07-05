(function(){
    'use strict';
    
    var $opt = document.querySelectorAll('[type="radio"]');
    var $alts = document.querySelectorAll('.alternativa');
    
    for(var i=0;i<$opt.length;i++){
        $opt[i].addEventListener('click', handleSelection, false);
    }
        
    function handleSelection(){
        
        if (hasArrayAnyChecked()) {
            
            if (isTheClikedAlreadyChecked(this)){
                uncheckThis(this);
                hideButton();
                
            } else if (!isTheClikedAlreadyChecked(this)){
                
                var userToggleConfirm = confirm("Uncheck the previous selection?");
                
                if (userToggleConfirm){
                    
                    resetSelections();
                    checkThis(this);
                    showButton();
                    
                } else if (!userToggleConfirm){
                    
                    return;       
                }                
            }
            
        } else if (!hasArrayAnyChecked()) {
            
            checkThis(this);
            showButton();
        }
    }
    
    function isTheClikedAlreadyChecked(userClick){
        return userClick.parentElement.parentElement.classList.contains("selecionada");    
    }

    function hasArrayAnyChecked() {
         return Array.prototype.some.apply( $alts, [function(item, index) {
             return $alts[index].classList.contains("selecionada");
         }]);
    }
    
    function resetSelections() {
         return Array.prototype.forEach.apply( $alts, [function(item, index) {
             return $alts[index].setAttribute("class", "alternativa");
         }]);
    }
    
    function checkThis(element){
        element.parentNode.parentNode.setAttribute("class", "alternativa selecionada");
    }
    
    function uncheckThis(element){
        element.parentNode.parentNode.setAttribute("class", "alternativa");
    }    
    
    function showButton(){
        var $btn = document.querySelector('.bt-confirmar');
        $btn.style.display = "block";
        $btn.addEventListener('click', submitAnswer, false);
    }
    
    function hideButton(){
        document.querySelector('.bt-confirmar').style.display = "none";
    }
    
    function submitAnswer(){
        
        var ajax = new XMLHttpRequest();
        
        ajax.open('GET', 'data/data-exercicio.js');
        ajax.send();
        
        var response = '';
        
        ajax.addEventListener('readystatechange', function(){
            if ( isRequestOk() ){

                try {
                    response = JSON.parse(ajax.responseText);    
                }
                catch(e) {
                    response = ajax.responseText;    
                }
                
                if(isUserCorrect(getGabarito(response))) {
                    
                    showPositiveFeedback();
                    hideButton();
                    freezeScreen();
                    
                } else {
                
                    showNegativeFeedback();
                    hideButton();
                    freezeScreen();
                    
                }
            } 
        }, false);  
        function isRequestOk(){
            return ajax.readyState === 4 && ajax.status === 200;
        }
    }    
    
    function getGabarito(parsedJSON){
        return parsedJSON[0].gabarito[0] - 1;
    }
        
    function isUserCorrect(index){
        return $alts[index].classList.contains("selecionada");
    }
    
    function showPositiveFeedback(){
        document.querySelector('.feedback-positivo').style.display = "block";
    }
    
    function showNegativeFeedback(){
        document.querySelector('.feedback-negativo').style.display = "block";
    }
    
    function freezeScreen(){
        for(var i=0;i<$opt.length;i++){
            $opt[i].removeEventListener('click', handleSelection, false);
        }        
    }
    
})();