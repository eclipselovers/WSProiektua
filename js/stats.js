export {initState}
export {successRate}
export{getStats}
export{updateStats}

let initState = function(what, solutionId) {
    const key = String(what);
    let state = null;

    try {
        const raw = localStorage.getItem(key);
        if (raw) {
            state = JSON.parse(raw);
        }
    } catch (e) {
        state = null;
    }

    // Initialize if missing or invalid
    if (!state || typeof state !== 'object') {
        state = { guesses: [], solution: solutionId };
        localStorage.setItem(key, JSON.stringify(state));
    } else {
        if (!Array.isArray(state.guesses)) state.guesses = [];
        if (!('solution' in state)) state.solution = solutionId;
        localStorage.setItem(key, JSON.stringify(state));
    }

    const addGuess = function(guess) {
        state.guesses.push(guess);
        localStorage.setItem(key, JSON.stringify(state));
    };

    return [state, addGuess];
}

function successRate(e) {
    if (e.totalGames === 0) return 0;
    let rate = ((e.totalGames - e.gamesFailed) / e.totalGames) * 100;
    return Math.round(rate);
}

function getStats(what) {
    let stats = null;

    try {
        const raw = localStorage.getItem(what);
        if (raw) {
            stats = JSON.parse(raw);
        }
    } catch (err) {
        stats = null;
    }

    if (!stats || typeof stats !== 'object') {
        stats = {
            winDistribution: [0,0,0,0,0,0,0,0,0],
            gamesFailed: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalGames: 0,
            successRate: 0
        };
        localStorage.setItem(what, JSON.stringify(stats));
    }

    return stats;
}

function updateStats(t) {
    let stats = getStats('gameStats');

    stats.totalGames++;

    if (t < 8) {
        stats.winDistribution[t - 1]++;
        stats.currentStreak++;
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }
    } else {
        stats.gamesFailed++;
        stats.currentStreak = 0;
    }

    stats.successRate = successRate(stats);

    localStorage.setItem('gameStats', JSON.stringify(stats));

    return stats;
}