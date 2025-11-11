const { stringToHTML, higher, lower, stats } = require('./fragments.js');
const { updateStats, getStats } = require('./stats.js');
// YOUR CODE HERE :
// .... stringToHTML ....
// .... setupRows .....

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


let setupRows = function (game) {

    //let [state, updateState] = initState('WAYgameState', game.solution.id)

    function leagueToFlag(leagueId) {
        const leagueMap = {
            564: 'es1',
            8: 'en1',
            82: 'de1',
            384: 'it1',
            301: 'fr1'
        };
        return leagueMap[leagueId] || '';
    }


    function getAge(dateString) {
        const birthDate = new Date(dateString);
        const currentDate = new Date('2025-11-07');

        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    let check = function (theKey, theValue) {
        if (theKey === "birthdate"){
            if (getAge(theValue) === getAge(game.solution[theKey])){
                return "correct"
            } else if (getAge(theValue) < getAge(game.solution[theKey])){
                return "higher"
            } else {
                return "lower"
            }
        } else {
            if (game.solution[theKey] === theValue){
                return "correct"
            } else{
                return "incorrect"
            }

        }
    }
    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }
    function setContent(guess) {
        const birthCheck = check('birthdate', guess.birthdate);
        let gezia = '';

        if (birthCheck === 'higher') {
            gezia = higher;
        } else if (birthCheck === 'lower') {
            gezia = lower;
        }
        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)}${gezia}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }
    function resetInput(){
        // Clear input and update placeholder with current attempt number
        const input = document.getElementById('myInput');
        if (!input) return;
        input.value = '';
        const attempt = Math.min((game?.guesses?.length || 0) + 1, 8);
        input.placeholder = `Guess ${attempt} of 8`;
    }
    let getPlayer = function (playerId) {
        const foundPlayer = game.players.find(player => {
            return player.id === playerId;
        });
        return foundPlayer;
    }
    function gameEnded(lastGuess){
        // Game ends if guessed correctly or after 8 attempts
        return lastGuess === game.solution.id || (game.guesses && game.guesses.length >= 8);
    }
    resetInput();
    function success(){
        unblur('success');
        showStats();
        }
    function gameOver(){
        unblur('failure');
        showStats();
    }
    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        //updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {
            updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }
        }


        showContent(content, guess)
    }

    function showStats() {
        if (!document.getElementById('statsWindow')) {
            document.body.insertAdjacentHTML('beforeend', stats);
        }

        const statsData = getStats('gameStats');

        document.getElementById('totalTries').textContent = statsData.totalGames;
        document.getElementById('successRate').textContent = statsData.successRate + '%';
        document.getElementById('currentStreak').textContent = statsData.currentStreak;
        document.getElementById('bestStreak').textContent = statsData.bestStreak;

        document.getElementById('closeStats').onclick = () => {
            document.getElementById('statsWindow').remove();
        }

        const countdownEl = document.getElementById('countdown');
        function updateCountdown() {
            let now = new Date();
            let next = new Date();
            next.setHours(24,0,0,0); // siguiente día a medianoche
            let diff = Math.max(0, next - now);
            let h = Math.floor(diff/3600000);
            let m = Math.floor((diff%3600000)/60000);
            let s = Math.floor((diff%60000)/1000);
            countdownEl.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

}

module.exports = { setupRows };
