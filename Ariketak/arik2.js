fetch('http://api.football-data.org/v4/competitions')
.then(r => r.json())
.then(data => {
    let id2024 = data.competitions.filter(e => e.area.code == "ESP" && e.type == "LEAGUE")
    console.log(id2024)
    }
)
