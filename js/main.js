const { folder, leftArrow, stringToHTML } = require("./fragments.js");
const { fetchJSON } = require("./loaders.js");
const { setupRows } = require("./rows.js");
const { autocomplete } = require("./autocomplete.js");



function differenceInDays(date1) {
    // YOUR CODE HERE
    const today = new Date();
    date1.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const timeDifferenceMs = today.getTime() - date1.getTime();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.round(timeDifferenceMs / msPerDay)+1;

    return daysDifference;
}

let difference_In_Days = differenceInDays(new Date("2025-10-01"));

window.onload = function () {
  document.getElementById("gamenumber").innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;

};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {
 
    // YOUR CODE HERE 
    const index = (difference_In_Days - 1) % solutionArray.length;

    console.log("--- Jokalariaren Hautaketa Datuak ---");
    console.log(`Base eta gaur arteko egunak (difference_In_Days): ${difference_In_Days}`);
    console.log(`Solution Array-aren luzera: ${solutionArray.length}`);
    console.log(`Kalkulatutako Indizea: ${index}`);

    const playerIdentifier = solutionArray[index];
    console.log(`Solution Array-ko balioa [${index}]: ${playerIdentifier}`);
    
    const foundPlayer = players.find(player => {
        return player.id == playerIdentifier;
    });

    if (foundPlayer) {
        return foundPlayer;
    } else {
        console.warn(`EZIN IZAN DA JOKALARIA AURKITU ID/Izena honekin: ${playerIdentifier}`);
        return null;
    }
}

Promise.all([fetchJSON("../json/fullplayers25.json"), fetchJSON("../json/solution25.json")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);
    
    console.log(game.solution);

    document.getElementById("mistery").src = `https://playfootball.games/media/players/${game.solution.id % 32}/${game.solution.id}.png`;

      // YOUR CODE HERE
      let state = JSON.parse(localStorage.getItem('WAYgameState'));
      if(state){
          const todayStr  = new Date().toISOString().slice(0,10);
          const endedStr  = state.endedDate ? new Date(state.endedDate).toISOString().slice(0,10) : null;
          const rows = setupRows(game);
          if(state.ended && state.success && endedStr === todayStr){
              state.guesses.forEach(e =>{  let guess = rows.getPlayer(e); let content = rows.setContent(guess); rows.showContent(content, guess)})
              rows.success();
          } else if(state.ended && !state.success && endedStr === todayStr ){
              state.guesses.forEach(e =>{ let guess = rows.getPlayer(e);let content = rows.setContent(guess); rows.showContent(content, guess)})
              rows.gameOver();
          }else if (!state.ended){
              state.guesses.forEach(e =>{  let guess = rows.getPlayer(e); let content = rows.setContent(guess); rows.showContent(content, guess)})
          }
          game.guesses = state.guesses
      }
      autocomplete(document.getElementById("myInput"), game)




      //
  }
);

