import { stringToHTML } from './fragments.js';
// YOUR CODE HERE :
// .... stringToHTML ....
// .... setupRows .....

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


export let setupRows = function (game) {


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

    function setContent(guess) {
        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)}`
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

    let getPlayer = function (playerId) {
        const foundPlayer = game.players.find(player => {
            return player.id === playerId;
        });
        console.log(foundPlayer);
        return foundPlayer;
    }

    return /* addRow */ function (playerId) {
        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)
        showContent(content, guess)
    }
}
