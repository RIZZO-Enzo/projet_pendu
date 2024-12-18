var nbErrors = 0
word = ""
var wordDiscover=[]
var nbGames=0
var nbLetters=0
var level = ""

var imgRicard = document.getElementsByClassName("imgRicard") //tableau avec les images du verre de ricard
var i=1

var startButton = document.getElementById("startGame") 
startButton.addEventListener("click", newGame )

var tryButton = document.getElementById("tryButton");
tryButton.addEventListener("click", testLetters );

var newGameButton= document.getElementById("newGameBoutton")
newGameButton.addEventListener("click", newGame )

async function newGame(){
    let wordNow = document.getElementById("wating") 
    wordNow.classList.remove("notDisplayed")

    level = document.getElementById("level").value
    word = await wordServeur()

    i=1
    nbLetters=0
    wordDiscover=[] //remet le mot a vide

    //enleve le bouton rejouer et le GameOver
    document.getElementById("newGameBoutton").classList.add("lose")
    document.getElementById("gameOver").classList.add("lose")
    document.getElementById("win").classList.add("lose")
    //on fait apparaitre :
    var tab = document.getElementsByClassName("notDisplayed") //tableau avec tous les éléments de la class notDisplayed
    var size = tab.length
    for(let i=0 ; i < size; i++) {
        tab[0].classList.remove("notDisplayed") //  0 et non i car l'élément du tableau est supprimé à chaque fois
    }
    startButton.classList.add("notDisplayed")
    document.getElementById("level").classList.add("notDisplayed")
    document.getElementById("label").classList.add("notDisplayed")
    nbErrors = 0;
    nbGames=0;

    for(let i=1; i < imgRicard.length; i++) {
        imgRicard[i].classList.add("notDisplayed") //cache les images 
    }

    // on remet les lettres sur fond jaune
    var tab3 = document.getElementsByClassName("alphabet") 
    for(let i=0 ; i < tab3.length; i++) {
        tab3[i].style["color"]="#F8D548"
    }
   

    //on met les _

    for(let i=0 ; i < word; i++) {
        wordDiscover.push("_")
    }
    wordNow.classList.add("notDisplayed")

    document.getElementById("word").innerText = wordDiscover.join(" ");
    
}

function testLetters(){

/*
    let answer = document.getElementById("input").value.toLowerCase(); // met la lettre en minuscule
    console.log(word)
    if (answer.charCodeAt()>=97 && answer.charCodeAt()<=122){ //on verifie que ce qu'il a rentré est bien une lettre
        if(word.includes(answer)){//si la lettre est dans le mot
            for(let i=0; i<word.length;i++){
                if(word[i] == answer){
                    nbLetters += 1
                    wordDiscover[i] = answer; //on remplace _ par la lettre
                } 
            if (nbLetters == word.length) {
                // vide la coline du milieu
                var tab = document.getElementsByClassName("gameOver")
                for(let i=0 ; i < tab.length; i++) {
                tab[i].classList.add("notDisplayed")
                }
                document.getElementById("newGameBoutton").classList.remove("lose")
                document.getElementById("win").classList.remove("lose")
            }
                
            }
        
            document.getElementById("word").innerText = wordDiscover.join(" ")
            //on met la case de la lettre en vert
            document.getElementById(answer).style.color="green";
        }

        else{//la lettre n'est pas dans le mot
                    
            if(nbErrors == 5){ //cas où le nombre d'erreur max est atteint
                // met l'image du ricard noyé quand on perd
                imgRicard[5].classList.add("notDisplayed")
                imgRicard[6].classList.remove("notDisplayed")
                // vide la coline du milieu
                var tab = document.getElementsByClassName("gameOver")
                for(let i=0 ; i < tab.length; i++) {
                tab[i].classList.add("notDisplayed")
                }
                //ajoute le bouton rejouer et le game over
                document.getElementById("newGameBoutton").classList.remove("lose")
                document.getElementById("gameOver").classList.remove("lose")
            }
            
            else {
                console.log(nbErrors)
                console.log(nbGames)
                imgRicard[i-1].classList.add("notDisplayed")
                imgRicard[i].classList.remove("notDisplayed") 
                i+=1
                
            }
            
        nbErrors+=1;
        document.getElementById(answer).style.color="red";
            
        }
        document.getElementById("input").value=""
        document.getElementById("input").focus()

    }
    else{return}
    */
    let answer = document.getElementById("input").value.toLowerCase(); // met la lettre en minuscule
    fetch("http://localhost:8000/api/testLetter?letter="+answer).then(async function(reponse){
        if(reponse.ok){
            let rep = await reponse.text()
            let dico = JSON.parse(rep)
            if(dico.position.length==0){
                if(dico.nbErrors == 6){ //cas où le nombre d'erreur max est atteint
                    // met l'image du ricard noyé quand on perd
                    imgRicard[5].classList.add("notDisplayed")
                    imgRicard[6].classList.remove("notDisplayed")
                    // vide la coline du milieu
                    var tab = document.getElementsByClassName("gameOver")
                    for(let i=0 ; i < tab.length; i++) {
                    tab[i].classList.add("notDisplayed")
                    }
                    //ajoute le bouton rejouer et le GameOver
                    document.getElementById("newGameBoutton").classList.remove("lose")
                    document.getElementById("gameOver").classList.remove("lose")
                }
            
                else {
                    imgRicard[dico.nbErrors-1].classList.add("notDisplayed")
                    imgRicard[dico.nbErrors].classList.remove("notDisplayed") 
                
                }
                document.getElementById(answer).style.color="red";
            }
            else {
                for(let i=0;i<dico.position.length;i++){
                    //on remplace les _ 
                    wordDiscover[dico.position[i]] = answer
                }
                if (dico.nbErrors<6 && dico.finishGame) {
                    // vide la colone du milieu
                    var tab = document.getElementsByClassName("gameOver")
                    for(let i=0 ; i < tab.length; i++) {
                    tab[i].classList.add("notDisplayed")
                    }
                    document.getElementById("newGameBoutton").classList.remove("lose")
                    document.getElementById("win").classList.remove("lose")
                }
                document.getElementById("word").innerText = wordDiscover.join(" ")
                //on met la case de la lettre en vert
                document.getElementById(answer).style.color="green";
            }
            document.getElementById("input").value=""
            document.getElementById("input").focus()
        }
        else{
            return testLetters()
        }
        

    }
)}

async function wordServeur(){
    return fetch("http://localhost:8000/api/newGame?level="+level).then(async function(answer){ 
        if(answer.ok){
            let word1 = await answer.text()
            return word1
    }
    else{
        return wordServeur();
    }})
}


document.getElementById("input").addEventListener("keyup", function(event) {if (event.key == "Enter"){testLetters()}})