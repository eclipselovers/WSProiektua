// js/rows.js
const { stringToHTML, higher, lower, stats } = require('./fragments.js');
const { updateStats, getStats, initState } = require('./stats.js');
// YOUR CODE HERE :
// .... stringToHTML ....
// .... setupRows .....

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate', 'number']


let setupRows = function (game) {

    const [, updateState] = initState('WAYgameState', game.solution.id)

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
            const guessedAge = getAge(theValue);
            const solutionAge = getAge(game.solution[theKey]);
            if (guessedAge === solutionAge) {
                return "correct";
            } else if (guessedAge < solutionAge) {
                return "higher";
            } else {
                return "lower";
            }
        } else if (theKey === 'shirtNumber' || theKey === 'number') {
            // Aceptar ambos nombres: 'shirtNumber' (internal) o 'number' (in player data)
            // Obtener valor de solución (priorizar 'number' si existe)
            const solRaw = (game.solution && (game.solution.number !== undefined ? game.solution.number : game.solution.shirtNumber)) ?? null;
            if (solRaw === null) return 'incorrect';

            // Intentar comparar numéricamente si ambos son numéricos
            const guessedNum = Number(theValue);
            const solNum = Number(solRaw);
            if (Number.isFinite(guessedNum) && Number.isFinite(solNum)) {
                if (guessedNum === solNum) return 'correct';
                return guessedNum > solNum ? 'lower' : 'higher';
            }

            // Fallback a comparación estricta de strings (no consideramos null/undefined iguales)
            if (theValue === undefined || theValue === null || solRaw === undefined) return 'incorrect';
            return String(theValue) === String(solRaw) ? 'correct' : 'incorrect';
        } else {
            // Comparaciones robustas para ids y strings: si ambos son numéricos comparar como números
            const solVal = game.solution[theKey];
            const guessVal = theValue;

            if (solVal == null) return "incorrect";

            const solNum = Number(solVal);
            const guessNum = Number(guessVal);

            if (Number.isFinite(solNum) && Number.isFinite(guessNum)) {
                return solNum === guessNum ? "correct" : "incorrect";
            }

            return String(solVal) === String(guessVal) ? "correct" : "incorrect";
        }
    }
    function unblur(outcome) {
        return new Promise( (resolve) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome==='success'){
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

        const numberz = check('shirtNumber', guess.number);
        let gezia2 = '';

        if (numberz === 'higher') {
            gezia2 = higher;
        } else if (numberz === 'lower') {
            gezia2 = lower;
        }
        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)}${gezia}`,
            `#${guess.number}${gezia2}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            // map attribute key for checking: if attrib is 'number' we compare with 'shirtNumber' in solution
            const attrName = attribs[j];
            const checkKey = attrName === 'number' ? 'shirtNumber' : attrName;
            const valueForCheck = attrName === 'number' ? guess.number : guess[attrName];

            fragments += `<div class="flex justify-center items-center shrink-0">
                            <div class="mx-1 flex justify-center items-center rounded-full bg-slate-400 text-white ${check(checkKey, valueForCheck) === 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown overflow-hidden font-bold text-[12px] leading-none shadowed"
                                 style="width: 50px; height: 50px; min-width: 50px; max-width: 50px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex flex-col w-full py-2">

                        <div class="w-full text-center pb-2">
                            <div class="inline-block opacity-0 fadeInDown uppercase font-bold text-lg" style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>

                        <div class="flex justify-center items-center gap-2 w-full flex-wrap px-2">
                            ${fragments}
                        </div>

                    </div>`

        let playersNode = document.getElementById('players')
        if (playersNode) {
            // Forzar apilado vertical: añadir clases flex y flex-col si no existen
            playersNode.classList.add('flex', 'flex-col');
            playersNode.prepend(stringToHTML(child))
        }
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
        return game.players.find(player => player.id === playerId);
    }
    function gameEnded(lastGuess){
        // Game ends if guessed correctly or after 8 attempts
        if(lastGuess === game.solution.id || (game.guesses && game.guesses.length >= 8) ){
            let state2 = JSON.parse(localStorage.getItem('WAYgameState'));
            state2.ended = true;
            state2.endedDate = new Date().toISOString();
            localStorage.setItem('WAYgameState', JSON.stringify(state2));
            return true;
        } else {
            return false;
        }

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

    addRow = function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {
            updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                let state2 = JSON.parse(localStorage.getItem('WAYgameState'));
                state2.succes = true;
                localStorage.setItem('WAYgameState', JSON.stringify(state2));
                success();
            }

            if (game.guesses.length === 8) {
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

        document.getElementById('showDistribution').onclick = () => {
            showGuessDistribution();
        };


        document.getElementById('closeStats').onclick = () => {
            document.getElementById('statsWindow').remove();
        }

        const countdownEl = document.getElementById('countdown');
        function updateCountdown() {
            let now = new Date();
            let next = new Date();
            next.setHours(24,0,0,0);
            let diff = Math.max(0, next - now);
            let h = Math.floor(diff/3600000);
            let m = Math.floor((diff%3600000)/60000);
            let s = Math.floor((diff%60000)/1000);
            countdownEl.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    function showGuessDistribution() {
        const statsData = getStats('gameStats');
        const dist = statsData.winDistribution;

        if (document.getElementById('distributionWindow')) return;

        const html = `
        <div id="distributionWindow" class="stats-container">
        <div class="stats-header">
            <h2>Guess Distribution</h2>
            <button id="closeDistribution">&times;</button>
        </div>

        <div class="dist-bars">
            ${dist.slice(0, 7).map((count, i) => `
                <div class="dist-row">
                <span class="dist-label">${i + 1}</span>
                <div class="dist-bar" style="width:${10 + count * 20}px"></div>
                <span class="dist-count">${count}</span>
                </div>
            `).join('')}
        </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        document.getElementById('closeDistribution').onclick = () => {
            document.getElementById('distributionWindow').remove();
        };
    }
    
    return { addRow, success, gameOver, setContent, showContent, getPlayer };
}
module.exports = { setupRows };
