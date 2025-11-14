fetch('http://api.football-data.org/v4/competitions')
.then(r => r.json())
.then(data => {
    let id2024 = data.competitions.filter(e => (e.area.code == "ESP"||e.area.code == "ENG"||e.area.code == "ITA"||e.area.code == "FRA") && e.plan == "TIER_ONE")
    console.log(id2024)
    }
)
