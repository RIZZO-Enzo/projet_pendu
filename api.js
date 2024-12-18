let containWords = []
let listText = [[],[],[],[],[],[],[],[],[],[],[]]
var wordDiscover =[]
var nbErrors = 0
const fs = require('fs')
var finishGame = false
var word =""
var min=1
var max=10

fs.readFile("./book.txt", function (error,data){
    if (error){
    }
    else{
        let listWords = data.toString().split(/[(\r?\n),. ]/)
        for(let i=0; i<listWords.length; i++){
            let etat=true;
            for(let j=0; j<listWords[i].length; j++){
                if(listWords[i].length>10){etat=false}
                if (!(listWords[i].charCodeAt(j)>=97 && listWords[i].charCodeAt(j)<=122)){                        
                    etat=false;
                }
            }
            if (etat){listText[listWords[i].length].push(listWords[i]);}
            
        }
    }
})

function manageRequest(request, response) {
    let tableau = request.url.split('?')
    let url = tableau[0]
    let urlSplit = url.split('/')
    let etoile = urlSplit[2]
   /* if (etoile=="getWord"){ 
        response.writeHead(200,{"Content-type":"text/plain"});
        let word = containWords[Math.floor(Math.random()*containWords.length)];
        response.end(word);
        console.log(word);
    
    } 
    */
    if  (etoile =="newGame"){  
        containWords=[]
        var tab = tableau[1].split('=')
        var level = tab[1]

        if (level == "easy"){
            min=4
            max=5
        }
        if (level == "medium"){
            min=6
            max=8
        }
        if (level == "difficult"){
            min=9
            max=10
        }

        for(let l=min;l<max;l++){
            for(let p=0;p<listText[l].length;p++){
                containWords.push(listText[l][p])
            }
        }

        finishGame = false
        nbErrors= 0
        wordDiscover =[]
        for(let i=0 ; i < word.length; i++) {
            wordDiscover.push("_")
        }
        response.writeHead(200,{"Content-type":"text/plain"})
        word = containWords[Math.floor(Math.random()*containWords.length)]
        response.end(word.length.toString())
       
    }
    else if(etoile == "testLetter"){
        var position = []
        params = new URL("http://localhost:8000"+request.url).searchParams
        var letter = params.get('letter')
        if (word.includes(letter)){
            for (var i=0;i,i<word.length;i++){
                if (word[i]==letter){
                    position.push(i)
                    wordDiscover[i] = letter
                }
            }
        }
        else {
            nbErrors+=1
        }
        if((wordDiscover.join("")==word) || (nbErrors>5)){ finishGame=true}
         
        let dictionnary = {"position":position, "finishGame":finishGame, "nbErrors":nbErrors}
       
        if (nbErrors>=5) {
            dictionnary["word"]=word
        }
        response.end(JSON.stringify(dictionnary))
    }   
    else{
        response.writeHead(404,{"Content-type":"text/plain"});
    }


    
}

exports.manage = manageRequest