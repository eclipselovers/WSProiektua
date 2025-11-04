.teams[] as $t
| ($t.squad // [])[]
| . + { teamId: $t.id, leagueId: $leagueId }
| (if has("dateOfBirth")
then.birthDate = .dateOfBirth | del(.dateOfBirth)
else.
end)
| .position = (
if .position == "Goalkeeper" then "GK"
elif (.position | test("Back$|Centre-Back|Defence|Defender")) then "DF"
elif (.position | test("Midfield|Midfielder")) then "MF"
elif (.position | test("Wing|Striker|Forward|Attacker|Offence")) then "FW"
else.position
end
)