async function fetchJSON(what) {

    // YOUR CODE HERE
    return fetch(what)
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.error(`Errorea JSON fitxategia kargatzean (${what}):`, error);
        });

}

module.exports = { fetchJSON };
