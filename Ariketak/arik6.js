import { readFile } from 'node:fs/promises';
const text = await readFile('./../json/premier.json', 'utf8');
const data = JSON.parse(text);


data.teams.forEach(t => {
    t.squad.forEach(o => {
        o.birthDate = o.dateOfBirth;
        delete o.dateOfBirth
        if(o.position == "Goalkeeper") {
            delete o.position;
            o.position = "GK"
        } else if(/Back$/.test(o.position) | /Defence$/.test(o.position) | /Defender$/.test(o.position)) {
            delete o.position;
            o.position = "DF"
        } else if(/Midfield$/.test(o.position) | /Midfielder$/.test(o.position)){
            delete o.position;
            o.position = "MF"
        } else if(/Wing$/.test(o.position) | /Winger$/.test(o.position) |/Striker$/.test(o.position)| /Forward$/.test(o.position) | /Attacker$/.test(o.position)| /Offence$/.test(o.position)){
            delete o.position;
            o.position = "FW"
        }
        o.teamid = t.id;
        o.compIds = data.competition.id;
    })
    }

)






