// ─── EQUIPOS Y BANDERAS ───────────────────────────────────────────────────────

export const FLAGS = {
  // Grupo A
  "México":"🇲🇽","Sudáfrica":"🇿🇦","Corea del Sur":"🇰🇷","Chequia":"🇨🇿",
  // Grupo B
  "Canadá":"🇨🇦","Bosnia y Herz.":"🇧🇦","Qatar":"🇶🇦","Suiza":"🇨🇭",
  // Grupo C
  "Brasil":"🇧🇷","Marruecos":"🇲🇦","Haití":"🇭🇹","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  // Grupo D
  "USA":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Turquía":"🇹🇷",
  // Grupo E
  "Alemania":"🇩🇪","Curazao":"🇨🇼","Costa de Marfil":"🇨🇮","Ecuador":"🇪🇨",
  // Grupo F
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Túnez":"🇹🇳","Suecia":"🇸🇪",
  // Grupo G
  "Bélgica":"🇧🇪","Egipto":"🇪🇬","Irán":"🇮🇷","Nueva Zelanda":"🇳🇿",
  // Grupo H
  "España":"🇪🇸","Cabo Verde":"🇨🇻","Arabia Saudita":"🇸🇦","Uruguay":"🇺🇾",
  // Grupo I
  "Francia":"🇫🇷","Senegal":"🇸🇳","Noruega":"🇳🇴","Iraq":"🇮🇶",
  // Grupo J
  "Argentina":"🇦🇷","Algeria":"🇩🇿","Austria":"🇦🇹","Jordania":"🇯🇴",
  // Grupo K
  "Portugal":"🇵🇹","Uzbekistán":"🇺🇿","Colombia":"🇨🇴","DR Congo":"🇨🇩",
  // Grupo L
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷","Ghana":"🇬🇭","Panamá":"🇵🇦",
}

export const ALL_TEAMS = Object.keys(FLAGS).filter(t => !t.startsWith("Play"))

// ─── PUNTOS ───────────────────────────────────────────────────────────────────

export const POINT_RULES = {
  exact: 3,
  winner: 1,
  elimExact: 4,
  elimWinner: 2,
  campeon: 5,
  goleador: 4,
}

// ─── PARTIDOS DE GRUPOS (hora UTC) ───────────────────────────────────────────
// Costa Rica = UTC-6

export const GROUP_MATCHES = [
  // ── JORNADA 1 ──────────────────────────────────────────────────────────────
  // Jueves 11 jun
  { id:"GM001", group:"A", home:"México",          away:"Sudáfrica",      kickoff:"2026-06-11T19:00:00Z", round:"GR1" },
  { id:"GM002", group:"A", home:"Corea del Sur",   away:"Chequia",        kickoff:"2026-06-12T02:00:00Z", round:"GR1" },
  // Viernes 12 jun
  { id:"GM003", group:"B", home:"Canadá",          away:"Bosnia y Herz.", kickoff:"2026-06-12T19:00:00Z", round:"GR1" },
  { id:"GM004", group:"D", home:"USA",              away:"Paraguay",       kickoff:"2026-06-13T01:00:00Z", round:"GR1" },
  // Sábado 13 jun
  { id:"GM005", group:"B", home:"Qatar",           away:"Suiza",          kickoff:"2026-06-13T19:00:00Z", round:"GR1" },
  { id:"GM006", group:"C", home:"Brasil",          away:"Marruecos",      kickoff:"2026-06-13T22:00:00Z", round:"GR1" },
  { id:"GM007", group:"C", home:"Haití",           away:"Escocia",        kickoff:"2026-06-14T01:00:00Z", round:"GR1" },
  { id:"GM008", group:"D", home:"Australia",       away:"Turquía",        kickoff:"2026-06-14T04:00:00Z", round:"GR1" },
  // Domingo 14 jun
  { id:"GM009", group:"E", home:"Alemania",        away:"Curazao",        kickoff:"2026-06-14T19:00:00Z", round:"GR1" },
  { id:"GM010", group:"F", home:"Países Bajos",    away:"Japón",          kickoff:"2026-06-14T22:00:00Z", round:"GR1" },
  { id:"GM011", group:"E", home:"Costa de Marfil", away:"Ecuador",        kickoff:"2026-06-15T01:00:00Z", round:"GR1" },
  { id:"GM012", group:"F", home:"Túnez",           away:"Suecia",    kickoff:"2026-06-15T04:00:00Z", round:"GR1" },
  // Lunes 15 jun
  { id:"GM013", group:"H", home:"España",          away:"Cabo Verde",     kickoff:"2026-06-15T19:00:00Z", round:"GR1" },
  { id:"GM014", group:"G", home:"Bélgica",         away:"Egipto",         kickoff:"2026-06-15T22:00:00Z", round:"GR1" },
  { id:"GM015", group:"H", home:"Arabia Saudita",  away:"Uruguay",        kickoff:"2026-06-16T00:00:00Z", round:"GR1" },
  { id:"GM016", group:"G", home:"Irán",            away:"Nueva Zelanda",  kickoff:"2026-06-16T04:00:00Z", round:"GR1" },
  // Martes 16 jun
  { id:"GM017", group:"I", home:"Francia",         away:"Senegal",        kickoff:"2026-06-16T19:00:00Z", round:"GR1" },
  { id:"GM018", group:"I", home:"Iraq",     away:"Noruega",        kickoff:"2026-06-16T22:00:00Z", round:"GR1" },
  { id:"GM019", group:"J", home:"Argentina",       away:"Algeria",        kickoff:"2026-06-17T01:00:00Z", round:"GR1" },
  { id:"GM020", group:"J", home:"Austria",         away:"Jordania",       kickoff:"2026-06-17T04:00:00Z", round:"GR1" },
  // Miércoles 17 jun
  { id:"GM021", group:"K", home:"Portugal",        away:"DR Congo",    kickoff:"2026-06-17T19:00:00Z", round:"GR1" },
  { id:"GM022", group:"L", home:"Inglaterra",      away:"Croacia",        kickoff:"2026-06-17T22:00:00Z", round:"GR1" },
  { id:"GM023", group:"L", home:"Ghana",           away:"Panamá",         kickoff:"2026-06-18T01:00:00Z", round:"GR1" },
  { id:"GM024", group:"K", home:"Uzbekistán",      away:"Colombia",       kickoff:"2026-06-18T04:00:00Z", round:"GR1" },

  // ── JORNADA 2 ──────────────────────────────────────────────────────────────
  // Jueves 18 jun
  { id:"GM025", group:"A", home:"Chequia",         away:"Sudáfrica",      kickoff:"2026-06-18T18:00:00Z", round:"GR2" },
  { id:"GM026", group:"B", home:"Suiza",           away:"Bosnia y Herz.", kickoff:"2026-06-18T19:00:00Z", round:"GR2" },
  { id:"GM027", group:"B", home:"Canadá",          away:"Qatar",          kickoff:"2026-06-18T22:00:00Z", round:"GR2" },
  { id:"GM028", group:"A", home:"México",          away:"Corea del Sur",  kickoff:"2026-06-19T03:00:00Z", round:"GR2" },
  // Viernes 19 jun
  { id:"GM029", group:"D", home:"USA",             away:"Australia",      kickoff:"2026-06-19T19:00:00Z", round:"GR2" },
  { id:"GM030", group:"C", home:"Escocia",         away:"Marruecos",      kickoff:"2026-06-19T22:00:00Z", round:"GR2" },
  { id:"GM031", group:"C", home:"Brasil",          away:"Haití",          kickoff:"2026-06-20T01:00:00Z", round:"GR2" },
  { id:"GM032", group:"D", home:"Turquía",         away:"Paraguay",       kickoff:"2026-06-20T04:00:00Z", round:"GR2" },
  // Sábado 20 jun
  { id:"GM033", group:"F", home:"Países Bajos",    away:"Suecia",    kickoff:"2026-06-20T19:00:00Z", round:"GR2" },
  { id:"GM034", group:"E", home:"Alemania",        away:"Costa de Marfil",kickoff:"2026-06-20T22:00:00Z", round:"GR2" },
  { id:"GM035", group:"E", home:"Ecuador",         away:"Curazao",        kickoff:"2026-06-21T00:00:00Z", round:"GR2" },
  { id:"GM036", group:"F", home:"Túnez",           away:"Japón",          kickoff:"2026-06-21T04:00:00Z", round:"GR2" },
  // Domingo 21 jun
  { id:"GM037", group:"H", home:"España",          away:"Arabia Saudita", kickoff:"2026-06-21T18:00:00Z", round:"GR2" },
  { id:"GM038", group:"G", home:"Bélgica",         away:"Irán",           kickoff:"2026-06-21T19:00:00Z", round:"GR2" },
  { id:"GM039", group:"H", home:"Uruguay",         away:"Cabo Verde",     kickoff:"2026-06-21T22:00:00Z", round:"GR2" },
  { id:"GM040", group:"G", home:"Nueva Zelanda",   away:"Egipto",         kickoff:"2026-06-22T01:00:00Z", round:"GR2" },
  // Lunes 22 jun
  { id:"GM041", group:"J", home:"Argentina",       away:"Austria",        kickoff:"2026-06-22T19:00:00Z", round:"GR2" },
  { id:"GM042", group:"I", home:"Francia",         away:"Iraq",    kickoff:"2026-06-22T23:00:00Z", round:"GR2" },
  { id:"GM043", group:"I", home:"Noruega",         away:"Senegal",        kickoff:"2026-06-23T00:00:00Z", round:"GR2" },
  { id:"GM044", group:"J", home:"Jordania",        away:"Algeria",        kickoff:"2026-06-23T03:00:00Z", round:"GR2" },
  // Martes 23 jun
  { id:"GM045", group:"K", home:"Portugal",        away:"Uzbekistán",     kickoff:"2026-06-23T19:00:00Z", round:"GR2" },
  { id:"GM046", group:"L", home:"Inglaterra",      away:"Ghana",          kickoff:"2026-06-23T22:00:00Z", round:"GR2" },
  { id:"GM047", group:"L", home:"Panamá",          away:"Croacia",        kickoff:"2026-06-24T01:00:00Z", round:"GR2" },
  { id:"GM048", group:"K", home:"Colombia",        away:"DR Congo",    kickoff:"2026-06-24T04:00:00Z", round:"GR2" },

  // ── JORNADA 3 ──────────────────────────────────────────────────────────────
  // Miércoles 24 jun
  { id:"GM049", group:"B", home:"Suiza",           away:"Canadá",         kickoff:"2026-06-24T19:00:00Z", round:"GR3" },
  { id:"GM050", group:"B", home:"Bosnia y Herz.",  away:"Qatar",          kickoff:"2026-06-24T19:00:00Z", round:"GR3" },
  { id:"GM051", group:"C", home:"Escocia",         away:"Brasil",         kickoff:"2026-06-24T22:00:00Z", round:"GR3" },
  { id:"GM052", group:"C", home:"Marruecos",       away:"Haití",          kickoff:"2026-06-24T22:00:00Z", round:"GR3" },
  { id:"GM053", group:"A", home:"Suecia",     away:"México",         kickoff:"2026-06-25T01:00:00Z", round:"GR3" },
  { id:"GM054", group:"A", home:"Sudáfrica",       away:"Corea del Sur",  kickoff:"2026-06-25T01:00:00Z", round:"GR3" },
  // Jueves 25 jun
  { id:"GM055", group:"E", home:"Ecuador",         away:"Alemania",       kickoff:"2026-06-25T20:00:00Z", round:"GR3" },
  { id:"GM056", group:"E", home:"Curazao",         away:"Costa de Marfil",kickoff:"2026-06-25T20:00:00Z", round:"GR3" },
  { id:"GM057", group:"F", home:"Japón",           away:"Suecia",    kickoff:"2026-06-25T23:00:00Z", round:"GR3" },
  { id:"GM058", group:"F", home:"Túnez",           away:"Países Bajos",   kickoff:"2026-06-25T23:00:00Z", round:"GR3" },
  { id:"GM059", group:"D", home:"Turquía",         away:"USA",            kickoff:"2026-06-26T02:00:00Z", round:"GR3" },
  { id:"GM060", group:"D", home:"Paraguay",        away:"Australia",      kickoff:"2026-06-26T02:00:00Z", round:"GR3" },
  // Viernes 26 jun
  { id:"GM061", group:"I", home:"Noruega",         away:"Francia",        kickoff:"2026-06-26T19:00:00Z", round:"GR3" },
  { id:"GM062", group:"I", home:"Senegal",         away:"Iraq",    kickoff:"2026-06-26T19:00:00Z", round:"GR3" },
  { id:"GM063", group:"H", home:"Cabo Verde",      away:"Arabia Saudita", kickoff:"2026-06-26T22:00:00Z", round:"GR3" },
  { id:"GM064", group:"H", home:"Uruguay",         away:"España",         kickoff:"2026-06-26T22:00:00Z", round:"GR3" },
  { id:"GM065", group:"G", home:"Egipto",          away:"Irán",           kickoff:"2026-06-27T01:00:00Z", round:"GR3" },
  { id:"GM066", group:"G", home:"Nueva Zelanda",   away:"Bélgica",        kickoff:"2026-06-27T01:00:00Z", round:"GR3" },
  // Sábado 27 jun
  { id:"GM067", group:"L", home:"Panamá",          away:"Inglaterra",     kickoff:"2026-06-27T21:00:00Z", round:"GR3" },
  { id:"GM068", group:"L", home:"Croacia",         away:"Ghana",          kickoff:"2026-06-27T21:00:00Z", round:"GR3" },
  { id:"GM069", group:"K", home:"Colombia",        away:"Portugal",       kickoff:"2026-06-28T01:30:00Z", round:"GR3" },
  { id:"GM070", group:"K", home:"DR Congo",     away:"Uzbekistán",     kickoff:"2026-06-28T01:30:00Z", round:"GR3" },
  { id:"GM071", group:"J", home:"Algeria",         away:"Austria",        kickoff:"2026-06-28T04:00:00Z", round:"GR3" },
  { id:"GM072", group:"J", home:"Jordania",        away:"Argentina",      kickoff:"2026-06-28T04:00:00Z", round:"GR3" },
]

// ─── RONDAS ELIMINATORIAS ─────────────────────────────────────────────────────

export const KNOCKOUT_STAGES = [
  // Ronda de 32
  { id:"R32_1",  label:"R32 - 1",       round:"KO_R32", kickoff:"2026-06-28T19:00:00Z" },
  { id:"R32_2",  label:"R32 - 2",       round:"KO_R32", kickoff:"2026-06-29T19:00:00Z" },
  { id:"R32_3",  label:"R32 - 3",       round:"KO_R32", kickoff:"2026-06-29T22:30:00Z" },
  { id:"R32_4",  label:"R32 - 4",       round:"KO_R32", kickoff:"2026-06-30T01:00:00Z" },
  { id:"R32_5",  label:"R32 - 5",       round:"KO_R32", kickoff:"2026-06-30T19:00:00Z" },
  { id:"R32_6",  label:"R32 - 6",       round:"KO_R32", kickoff:"2026-06-30T21:00:00Z" },
  { id:"R32_7",  label:"R32 - 7",       round:"KO_R32", kickoff:"2026-07-01T01:00:00Z" },
  { id:"R32_8",  label:"R32 - 8",       round:"KO_R32", kickoff:"2026-07-01T18:00:00Z" },
  { id:"R32_9",  label:"R32 - 9",       round:"KO_R32", kickoff:"2026-07-01T20:00:00Z" },
  { id:"R32_10", label:"R32 - 10",      round:"KO_R32", kickoff:"2026-07-02T00:00:00Z" },
  { id:"R32_11", label:"R32 - 11",      round:"KO_R32", kickoff:"2026-07-02T19:00:00Z" },
  { id:"R32_12", label:"R32 - 12",      round:"KO_R32", kickoff:"2026-07-03T01:00:00Z" },
  { id:"R32_13", label:"R32 - 13",      round:"KO_R32", kickoff:"2026-07-03T18:00:00Z" },
  { id:"R32_14", label:"R32 - 14",      round:"KO_R32", kickoff:"2026-07-03T22:00:00Z" },
  { id:"R32_15", label:"R32 - 15",      round:"KO_R32", kickoff:"2026-07-04T01:00:00Z" },
  { id:"R32_16", label:"R32 - 16",      round:"KO_R32", kickoff:"2026-07-04T03:30:00Z" },
  // Octavos de Final (Ronda de 16)
  { id:"R16_1",  label:"Octavos 1",     round:"KO_R16", kickoff:"2026-07-04T19:00:00Z" },
  { id:"R16_2",  label:"Octavos 2",     round:"KO_R16", kickoff:"2026-07-05T01:00:00Z" },
  { id:"R16_3",  label:"Octavos 3",     round:"KO_R16", kickoff:"2026-07-05T20:00:00Z" },
  { id:"R16_4",  label:"Octavos 4",     round:"KO_R16", kickoff:"2026-07-06T00:00:00Z" },
  { id:"R16_5",  label:"Octavos 5",     round:"KO_R16", kickoff:"2026-07-06T21:00:00Z" },
  { id:"R16_6",  label:"Octavos 6",     round:"KO_R16", kickoff:"2026-07-07T01:00:00Z" },
  { id:"R16_7",  label:"Octavos 7",     round:"KO_R16", kickoff:"2026-07-07T18:00:00Z" },
  { id:"R16_8",  label:"Octavos 8",     round:"KO_R16", kickoff:"2026-07-07T22:00:00Z" },
  // Cuartos de Final
  { id:"QF_1",   label:"Cuartos 1",     round:"KO_QF",  kickoff:"2026-07-09T20:00:00Z" },
  { id:"QF_2",   label:"Cuartos 2",     round:"KO_QF",  kickoff:"2026-07-10T19:00:00Z" },
  { id:"QF_3",   label:"Cuartos 3",     round:"KO_QF",  kickoff:"2026-07-11T21:00:00Z" },
  { id:"QF_4",   label:"Cuartos 4",     round:"KO_QF",  kickoff:"2026-07-12T01:00:00Z" },
  // Semifinales
  { id:"SF_1",   label:"Semifinal 1",   round:"KO_SF",  kickoff:"2026-07-14T19:00:00Z" },
  { id:"SF_2",   label:"Semifinal 2",   round:"KO_SF",  kickoff:"2026-07-15T21:00:00Z" },
  // Tercer lugar y Final
  { id:"3RD",    label:"Tercer Lugar",  round:"KO_F",   kickoff:"2026-07-18T23:00:00Z" },
  { id:"FINAL",  label:"⭐ Final",       round:"KO_F",   kickoff:"2026-07-19T19:00:00Z" },
]

export const KNOCKOUT_ROUNDS = [
  { id:"KO_R32", label:"Ronda de 32" },
  { id:"KO_R16", label:"Octavos de Final" },
  { id:"KO_QF",  label:"Cuartos de Final" },
  { id:"KO_SF",  label:"Semifinales" },
  { id:"KO_F",   label:"Final + 3er Lugar" },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Primer partido del Mundial: 11 jun 2026 19:00 UTC (1pm Costa Rica)
export const SPECIALS_LOCK_DATE = "2026-06-11T19:00:00Z"

export function isSpecialsLocked() {
  return new Date() >= new Date(SPECIALS_LOCK_DATE)
}

export function isLocked(kickoffISO) {
  return new Date() >= new Date(kickoffISO)
}

export function calcPoints(pred, res, isKnockout = false) {
  if (!res || res.home_score == null || res.away_score == null) return 0
  const rH = parseInt(res.home_score), rA = parseInt(res.away_score)
  const pH = parseInt(pred?.home_score), pA = parseInt(pred?.away_score)
  if (isNaN(pH) || isNaN(pA)) return 0
  const exactPts = isKnockout ? POINT_RULES.elimExact : POINT_RULES.exact
  const winnerPts = isKnockout ? POINT_RULES.elimWinner : POINT_RULES.winner
  if (pH === rH && pA === rA) return exactPts
  const rWin = rH > rA ? "H" : rA > rH ? "A" : "D"
  const pWin = pH > pA ? "H" : pA > pH ? "A" : "D"
  if (rWin === pWin) return winnerPts
  return 0
}
