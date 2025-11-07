export {initState}

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
