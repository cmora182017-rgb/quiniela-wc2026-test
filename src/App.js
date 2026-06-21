import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import { SQUADS } from './squads'
import {
  FLAGS, ALL_TEAMS, POINT_RULES,
  GROUP_MATCHES, KNOCKOUT_STAGES, KNOCKOUT_ROUNDS,
  isLocked, isSpecialsLocked, calcPoints
} from './data'

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily:"Georgia,'Times New Roman',serif", background:"linear-gradient(135deg,#0a0f1e 0%,#1a2744 50%,#0d1b2a 100%)", minHeight:"100vh", color:"#fff" },
  card: { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:"16px 18px", marginBottom:10 },
  btn: { padding:"11px 20px", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:14, transition:"opacity 0.15s" },
  btnGold: { background:"linear-gradient(135deg,#f5c842,#e8a020)", color:"#000" },
  btnGreen: { background:"linear-gradient(135deg,#4cdc6a,#27a348)", color:"#000" },
  input: { width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:14, boxSizing:"border-box", outline:"none" },
  label: { fontSize:12, color:"#aac4e0", marginBottom:6, display:"block" },
  back: { background:"none", border:"none", color:"#6a8caa", cursor:"pointer", fontSize:14, marginBottom:18, padding:0 },
  tag: { fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700 },
  scoreInput: (green, locked) => ({
    width:38, textAlign:"center", padding:"4px 0", fontSize:16, fontWeight:700, borderRadius:6,
    border:`1px solid ${green?"rgba(76,220,106,0.4)":locked?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.2)"}`,
    background: locked?"rgba(255,255,255,0.04)":green?"rgba(76,220,106,0.12)":"rgba(255,255,255,0.08)",
    color: locked?"#555":green?"#4cdc6a":"#fff",
  }),
}

function ScoreInput({ value, onChange, green, locked }) {
  return (
    <input type="number" min="0" max="20" value={value ?? ""} onChange={e=>onChange(e.target.value)}
      disabled={locked} style={S.scoreInput(green, locked)} />
  )
}

function MatchCard({ match, pred, onSave, result, isKnockout, isJoker, onToggleJoker, jokerUsed, stageLabel, onSaveScorer, onViewPreds, onSaveMvp }) {
  const [h, setH] = useState(pred?.home_score ?? "")
  const [a, setA] = useState(pred?.away_score ?? "")
  const [scorer, setScorer] = useState(pred?.scorer ?? "")
  const [mvp, setMvp] = useState(pred?.mvp ?? "")
  const [saving, setSaving] = useState(false)
  const locked = isLocked(match.kickoff)

  useEffect(() => {
    if (pred?.home_score != null && pred?.home_score !== "") setH(pred.home_score)
    if (pred?.away_score != null && pred?.away_score !== "") setA(pred.away_score)
    if (pred?.scorer) setScorer(pred.scorer)
    if (pred?.mvp) setMvp(pred.mvp)
  }, [pred?.home_score, pred?.away_score, pred?.scorer, pred?.mvp])

  async function save() {
    if (locked || saving) return
    setSaving(true)
    await onSave({ home_score: h === "" ? null : parseInt(h), away_score: a === "" ? null : parseInt(a) })
    setSaving(false)
  }

  async function saveScorer() {
    if (locked || !onSaveScorer) return
    await onSaveScorer(scorer)
  }

  const basePts = result ? calcPoints({ home_score: pred?.home_score, away_score: pred?.away_score }, result, isKnockout) : null
  const pts = isJoker && basePts !== null ? basePts * 2 : basePts
  const ptColor = pts === null ? null : pts > 0 ? "#4cdc6a" : "#e85555"

  return (
    <div style={{ ...S.card, background: isJoker?"rgba(255,150,0,0.07)":S.card.background, border: isJoker?"1.5px solid rgba(255,150,0,0.45)":S.card.border, position:"relative" }}>
      {isJoker && <div style={{ position:"absolute", top:-9, left:10, background:"linear-gradient(135deg,#ff9500,#ff6000)", borderRadius:20, padding:"1px 9px", fontSize:10, fontWeight:700, color:"#000" }}>🃏 COMODÍN ×2</div>}
      {locked && <div style={{ position:"absolute", top:-9, right:10, background:"rgba(100,100,120,0.9)", borderRadius:20, padding:"1px 9px", fontSize:10, fontWeight:600, color:"#aaa" }}>🔒 Cerrado</div>}
      {stageLabel && <div style={{ fontSize:10, color:"#6a8caa", marginBottom:6, letterSpacing:1 }}>{stageLabel}</div>}
      <div style={{ fontSize:10, color:"#6a8caa", marginBottom:6, textAlign:"center" }}>
        🕐 {new Date(match.kickoff).toLocaleString("es-CR", { timeZone:"America/Costa_Rica", day:"numeric", month:"short", hour:"numeric", minute:"2-digit", hour12:true })}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop: isJoker?6:0 }}>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:5, justifyContent:"flex-end" }}>
          <span style={{fontSize:12,fontWeight:600}}>{match.home}</span>
          <span>{FLAGS[match.home]||"🏳️"}</span>
        </div>
        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
          <ScoreInput value={h} onChange={setH} locked={locked} />
          <span style={{color:"#555",fontWeight:700}}>:</span>
          <ScoreInput value={a} onChange={setA} locked={locked} />
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:5 }}>
          <span>{FLAGS[match.away]||"🏳️"}</span>
          <span style={{fontSize:12,fontWeight:600}}>{match.away}</span>
        </div>
        {/* Points badge */}
        {pts !== null && <span style={{ ...S.tag, color:ptColor, background:`${ptColor}22` }}>{pts>0?`+${pts}`:0}{isJoker&&pts>0?" ×2":""}</span>}
        {/* Joker button */}
        {!locked && onToggleJoker && (
          <button onClick={onToggleJoker} disabled={jokerUsed && !isJoker} title={isJoker?"Quitar comodín":jokerUsed?"Ya usaste el comodín en esta jornada":"Activar comodín ×2"}
            style={{ background: isJoker?"linear-gradient(135deg,#ff9500,#ff6000)":"rgba(255,150,0,0.12)", border:"1px solid rgba(255,150,0,0.3)", borderRadius:8, padding:"4px 8px", cursor: jokerUsed&&!isJoker?"not-allowed":"pointer", fontSize:14, opacity:jokerUsed&&!isJoker?0.3:1 }}>
            🃏
          </button>
        )}
        {/* Save button */}
        {!locked && (
          <button onClick={save} disabled={saving} style={{ ...S.btn, ...S.btnGreen, padding:"4px 10px", fontSize:12, opacity:saving?0.6:1 }}>
            {saving?"...":"✓"}
          </button>
        )}
      </div>
      {result && result.home_score != null && (
        <div style={{textAlign:"center",fontSize:11,color:"#6a8caa",marginTop:5}}>
          Real: {result.home_score} – {result.away_score}
          {result.scorer && <span style={{marginLeft:8}}>⚽ {result.scorer}</span>}
          {pred?.home_score != null && pred?.away_score != null && (() => {
            const base = calcPoints({home_score:pred.home_score, away_score:pred.away_score}, result, isKnockout)
            const matchPts = isJoker ? base * 2 : base
            return matchPts > 0 ? <span style={{marginLeft:8,color:"#4cdc6a",fontWeight:700}}>✅+{matchPts}</span> : <span style={{marginLeft:8,color:"#e85555"}}>❌</span>
          })()}
        </div>
      )}
      {/* Scorer dropdown */}
      {!locked && onSaveScorer && (
        <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#ff9500",whiteSpace:"nowrap"}}>⚽ 1er gol:</span>
          <select
            value={scorer} onChange={e=>{setScorer(e.target.value); onSaveScorer(e.target.value)}}
            style={{flex:1,padding:"4px 8px",borderRadius:8,border:"1px solid rgba(255,150,0,0.3)",background:"#0d1b2a",color:"#ff9500",fontSize:11,outline:"none"}}>
            <option value="">— Seleccionar jugador (+5pts) —</option>
            {[...(SQUADS[match.home]||[]), ...(SQUADS[match.away]||[])].sort().map(p=>(
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {pred?.scorer && result?.scorer && (
            <span style={{fontSize:10,color: pred.scorer.toLowerCase().trim()===result.scorer.toLowerCase().trim()?"#4cdc6a":"#e85555",fontWeight:700}}>
              {pred.scorer.toLowerCase().trim()===result.scorer.toLowerCase().trim()
                ? `✅+${isJoker ? POINT_RULES.primerGol * 2 : POINT_RULES.primerGol}`
                : "❌"}
            </span>
          )}
        </div>
      )}
      {locked && pred?.scorer && (
        <div style={{fontSize:11,color:"#ff9500",marginTop:6,display:"flex",alignItems:"center",gap:6}}>
          ⚽ Tu 1er gol: <strong>{pred.scorer}</strong>
          {result?.scorer && (
            <span style={{fontSize:10,fontWeight:700,color: pred.scorer.toLowerCase().trim()===result.scorer.toLowerCase().trim()?"#4cdc6a":"#e85555"}}>
              {pred.scorer.toLowerCase().trim()===result.scorer.toLowerCase().trim()
                ? `✅+${isJoker ? POINT_RULES.primerGol * 2 : POINT_RULES.primerGol}`
                : "❌"}
            </span>
          )}
        </div>
      )}
      {/* MVP dropdown - solo eliminatorias */}
      {isKnockout && !locked && onSaveMvp && (
        <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#5ec8f5",whiteSpace:"nowrap"}}>⭐ MVP:</span>
          <select
            value={mvp} onChange={e=>{setMvp(e.target.value); onSaveMvp(e.target.value)}}
            style={{flex:1,padding:"4px 8px",borderRadius:8,border:"1px solid rgba(94,200,245,0.3)",background:"#0d1b2a",color:"#5ec8f5",fontSize:11,outline:"none"}}>
            <option value="">— Jugador del partido (+5pts) —</option>
            {[...(SQUADS[match.home]||[]), ...(SQUADS[match.away]||[])].sort().map(p=>(
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {pred?.mvp && result?.mvp && (
            <span style={{fontSize:10,color: pred.mvp.toLowerCase().trim()===result.mvp.toLowerCase().trim()?"#4cdc6a":"#e85555",fontWeight:700}}>
              {pred.mvp.toLowerCase().trim()===result.mvp.toLowerCase().trim()
                ? `✅+${isJoker ? POINT_RULES.mvp * 2 : POINT_RULES.mvp}`
                : "❌"}
            </span>
          )}
        </div>
      )}
      {isKnockout && locked && pred?.mvp && (
        <div style={{fontSize:11,color:"#5ec8f5",marginTop:6,display:"flex",alignItems:"center",gap:6}}>
          ⭐ Tu MVP: <strong>{pred.mvp}</strong>
          {result?.mvp && (
            <span style={{fontSize:10,fontWeight:700,color: pred.mvp.toLowerCase().trim()===result.mvp.toLowerCase().trim()?"#4cdc6a":"#e85555"}}>
              {pred.mvp.toLowerCase().trim()===result.mvp.toLowerCase().trim()
                ? `✅+${isJoker ? POINT_RULES.mvp * 2 : POINT_RULES.mvp}`
                : "❌"}
            </span>
          )}
        </div>
      )}
      {locked && onViewPreds && (
        <button onClick={onViewPreds}
          style={{marginTop:8,width:"100%",padding:"5px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#aac4e0",cursor:"pointer",fontSize:11}}>
          👁️ Ver pronósticos de todos
        </button>
      )}
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  // Auto-refresh every 5 minutes to ensure lock times are enforced
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload()
    }, 5 * 60 * 1000) // 5 minutes
    return () => clearInterval(interval)
  }, [])

  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState("home")
  const [tab, setTab] = useState("grupos")
  const [adminTab, setAdminTab] = useState("grupos")

  // Data
  const [predictions, setPredictions] = useState({})       // { matchId: {home_score,away_score,is_joker} }
  const [koPredictions, setKoPredictions] = useState({})
  const [specialPred, setSpecialPred] = useState({})
  const [results, setResults] = useState({})
  const [koTeams, setKoTeams] = useState({})
  const [specialResults, setSpecialResults] = useState({})
  const [leaderboard, setLeaderboard] = useState([])
  const [allMatchPreds, setAllMatchPreds] = useState({}) // { matchId: [{name, home_score, away_score, scorer, is_joker}] }
  const [comparingMatch, setComparingMatch] = useState(null)
  const [allProfiles, setAllProfiles] = useState([])

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  // Load all data
  const loadData = useCallback(async () => {
    if (!session) return
    const userId = session.user.id

    const [predRes, koPredRes, spPredRes, resRes, koTeamsRes, spResRes, profilesRes] = await Promise.all([
      supabase.from('predictions').select('*').eq('user_id', userId),
      supabase.from('knockout_predictions').select('*').eq('user_id', userId),
      supabase.from('special_predictions').select('*').eq('user_id', userId).single(),
      supabase.from('results').select('*'),
      supabase.from('knockout_teams').select('*'),
      supabase.from('special_results').select('*').single(),
      supabase.from('profiles').select('*'),
    ])

    const predMap = {}
    predRes.data?.forEach(p => { predMap[p.match_id] = p })
    setPredictions(predMap)

    const koPredMap = {}
    koPredRes.data?.forEach(p => { koPredMap[p.stage_id] = p })
    setKoPredictions(koPredMap)

    setSpecialPred(spPredRes.data || {})

    const resMap = {}
    resRes.data?.forEach(r => { resMap[r.match_id] = r })
    setResults(resMap)

    const koTeamsMap = {}
    koTeamsRes.data?.forEach(t => { koTeamsMap[t.stage_id] = t })
    setKoTeams(koTeamsMap)

    setSpecialResults(spResRes.data || {})
    setAllProfiles(profilesRes.data || [])
  }, [session])

  useEffect(() => { if (session) loadData() }, [session, loadData])

  // Leaderboard calculation
  useEffect(() => {
    if (!allProfiles.length) return
    const board = allProfiles.map(p => {
      // Need all predictions for this user — for leaderboard we'd need to fetch all
      // For now we show pts from current user's data; full leaderboard loaded separately
      return { name: p.name, id: p.id, points: 0 }
    })
    setLeaderboard(board)
  }, [allProfiles])

  // Load full leaderboard
  async function loadLeaderboard() {
    const [allPreds, allKoPreds, allSpPreds, resData, koTeamsData, spRes] = await Promise.all([
      supabase.from('predictions').select('*'),
      supabase.from('knockout_predictions').select('*'),
      supabase.from('special_predictions').select('*'),
      supabase.from('results').select('*'),
      supabase.from('knockout_teams').select('*'),
      supabase.from('special_results').select('*').single(),
    ])

    const resMap = {}
    resData.data?.forEach(r => { resMap[r.match_id] = r })
    const koTeamsMap = {}
    koTeamsData.data?.forEach(t => { koTeamsMap[t.stage_id] = t })
    const spR = spRes.data || {}

    const board = allProfiles.map(prof => {
      const userPreds = {}
      allPreds.data?.filter(p => p.user_id === prof.id).forEach(p => { userPreds[p.match_id] = p })
      const userKoPreds = {}
      allKoPreds.data?.filter(p => p.user_id === prof.id).forEach(p => { userKoPreds[p.stage_id] = p })
      const userSp = allSpPreds.data?.find(p => p.user_id === prof.id) || {}

      let pts = 0, jokerBonus = 0
      GROUP_MATCHES.forEach(m => {
        const pred = userPreds[m.id]
        const res = resMap[m.id]
        const base = calcPoints(pred, res, false)
        const earned = pred?.is_joker ? base * 2 : base
        pts += earned
        if (pred?.is_joker && base > 0) jokerBonus += base
      })
      KNOCKOUT_STAGES.forEach(s => {
        const pred = userKoPreds[s.id]
        const res = resMap[s.id]
        const base = calcPoints(pred, res, true)
        const earned = pred?.is_joker ? base * 2 : base
        pts += earned
        if (pred?.is_joker && base > 0) jokerBonus += base
      })
      // Primer Gol por partido (con comodín si aplica)
      GROUP_MATCHES.forEach(m => {
        const pred = userPreds[m.id]
        const res = resMap[m.id]
        if (pred?.scorer && res?.scorer && pred.scorer.toLowerCase().trim() === res.scorer.toLowerCase().trim()) {
          const scorerPts = pred?.is_joker ? POINT_RULES.primerGol * 2 : POINT_RULES.primerGol
          pts += scorerPts
        }
      })
      KNOCKOUT_STAGES.forEach(s => {
        const pred = userKoPreds[s.id]
        const res = resMap[s.id]
        if (pred?.scorer && res?.scorer && pred.scorer.toLowerCase().trim() === res.scorer.toLowerCase().trim()) {
          const scorerPts = pred?.is_joker ? POINT_RULES.primerGol * 2 : POINT_RULES.primerGol
          pts += scorerPts
        }
        // MVP del partido (solo eliminatorias)
        if (pred?.mvp && res?.mvp && pred.mvp.toLowerCase().trim() === res.mvp.toLowerCase().trim()) {
          const mvpPts = pred?.is_joker ? POINT_RULES.mvp * 2 : POINT_RULES.mvp
          pts += mvpPts
        }
      })
      if (userSp.champion && spR.champion && userSp.champion === spR.champion) pts += POINT_RULES.campeon
      if (userSp.top_scorer && spR.top_scorer && userSp.top_scorer.toLowerCase().trim() === spR.top_scorer.toLowerCase().trim()) pts += POINT_RULES.goleador

      return { name: prof.name, id: prof.id, points: pts, jokerBonus, champion: userSp.champion, topScorer: userSp.top_scorer }
    }).sort((a, b) => b.points - a.points)

    setLeaderboard(board)
    return board
  }

  // Save prediction
  async function savePrediction(matchId, scores) {
    const { error } = await supabase.from('predictions').upsert({
      user_id: session.user.id, match_id: matchId,
      home_score: scores.home_score, away_score: scores.away_score,
      is_joker: predictions[matchId]?.is_joker || false,
      scorer: predictions[matchId]?.scorer || null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,match_id' })
    if (!error) setPredictions(prev => ({ ...prev, [matchId]: { ...prev[matchId], ...scores } }))
  }

  async function toggleJoker(matchId, roundId, isKo) {
    const table = isKo ? 'knockout_predictions' : 'predictions'
    const idField = isKo ? 'stage_id' : 'match_id'
    const store = isKo ? koPredictions : predictions
    const setStore = isKo ? setKoPredictions : setPredictions

    // Check if another joker is active in this round
    const roundMatches = isKo
      ? KNOCKOUT_STAGES.filter(s => s.round === roundId).map(s => s.id)
      : GROUP_MATCHES.filter(m => m.round === roundId).map(m => m.id)

    const currentJoker = roundMatches.find(id => store[id]?.is_joker)
    const isActivating = currentJoker !== matchId

    // Deactivate current joker if any
    if (currentJoker && currentJoker !== matchId) {
      await supabase.from(table).upsert({
        user_id: session.user.id, [idField]: currentJoker,
        home_score: store[currentJoker]?.home_score, away_score: store[currentJoker]?.away_score,
        is_joker: false, updated_at: new Date().toISOString()
      }, { onConflict: `user_id,${idField}` })
      setStore(prev => ({ ...prev, [currentJoker]: { ...prev[currentJoker], is_joker: false } }))
    }

    // Toggle current
    const newVal = isActivating
    await supabase.from(table).upsert({
      user_id: session.user.id, [idField]: matchId,
      home_score: store[matchId]?.home_score, away_score: store[matchId]?.away_score,
      is_joker: newVal, updated_at: new Date().toISOString()
    }, { onConflict: `user_id,${idField}` })
    setStore(prev => ({ ...prev, [matchId]: { ...prev[matchId], is_joker: newVal } }))
  }

  async function savePredScorer(matchId, scorer, isKo) {
    const table = isKo ? 'knockout_predictions' : 'predictions'
    const idField = isKo ? 'stage_id' : 'match_id'
    const store = isKo ? koPredictions : predictions
    const setStore = isKo ? setKoPredictions : setPredictions
    const existing = store[matchId] || {}
    await supabase.from(table).upsert({
      user_id: session.user.id, [idField]: matchId,
      home_score: existing.home_score ?? null, away_score: existing.away_score ?? null,
      is_joker: existing.is_joker || false,
      scorer: scorer,
      mvp: existing.mvp || null,
      updated_at: new Date().toISOString()
    }, { onConflict: `user_id,${idField}` })
    setStore(prev => ({ ...prev, [matchId]: { ...prev[matchId], scorer } }))
  }

  async function savePredMvp(stageId, mvp) {
    const existing = koPredictions[stageId] || {}
    await supabase.from('knockout_predictions').upsert({
      user_id: session.user.id, stage_id: stageId,
      home_score: existing.home_score ?? null, away_score: existing.away_score ?? null,
      is_joker: existing.is_joker || false,
      scorer: existing.scorer || null,
      mvp: mvp,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,stage_id' })
    setKoPredictions(prev => ({ ...prev, [stageId]: { ...prev[stageId], mvp } }))
  }

  async function saveKoPrediction(stageId, scores) {
    const { error } = await supabase.from('knockout_predictions').upsert({
      user_id: session.user.id, stage_id: stageId,
      home_score: scores.home_score, away_score: scores.away_score,
      is_joker: koPredictions[stageId]?.is_joker || false,
      scorer: koPredictions[stageId]?.scorer || null,
      mvp: koPredictions[stageId]?.mvp || null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,stage_id' })
    if (!error) setKoPredictions(prev => ({ ...prev, [stageId]: { ...prev[stageId], ...scores } }))
  }

  async function saveSpecial(field, value) {
    await supabase.from('special_predictions').upsert({
      user_id: session.user.id, [field]: value, updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    setSpecialPred(prev => ({ ...prev, [field]: value }))
  }

  // Admin: save result
  async function saveResult(matchId, scores) {
    await supabase.from('results').upsert({ match_id: matchId, ...scores, updated_at: new Date().toISOString() }, { onConflict: 'match_id' })
    setResults(prev => ({ ...prev, [matchId]: { ...prev[matchId], ...scores } }))
  }

  async function saveKoTeams(stageId, teams) {
    await supabase.from('knockout_teams').upsert({ stage_id: stageId, ...teams }, { onConflict: 'stage_id' })
    setKoTeams(prev => ({ ...prev, [stageId]: { ...prev[stageId], ...teams } }))
  }

  async function saveSpecialResult(field, value) {
    await supabase.from('special_results').upsert({ id: 1, [field]: value, updated_at: new Date().toISOString() }, { onConflict: 'id' })
    setSpecialResults(prev => ({ ...prev, [field]: value }))
  }

  async function loadMatchPredictions(matchId, isKo) {
    const table = isKo ? 'knockout_predictions' : 'predictions'
    const idField = isKo ? 'stage_id' : 'match_id'
    const { data } = await supabase.from(table).select('*, profiles(name)').eq(idField, matchId)
    // Siempre recargar el leaderboard fresco para ordenar correctamente
    const currentBoard = await loadLeaderboard()
    if (data) {
      const rankMap = {}
      currentBoard.forEach((p, idx) => { rankMap[p.name] = idx })
      const preds = data.map(p => ({
        name: p.profiles?.name || 'Desconocido',
        home_score: p.home_score,
        away_score: p.away_score,
        scorer: p.scorer,
        mvp: p.mvp,
        is_joker: p.is_joker
      })).sort((a,b) => {
        const rA = rankMap[a.name] ?? 999
        const rB = rankMap[b.name] ?? 999
        return rA - rB
      })
      setAllMatchPreds(prev => ({ ...prev, [matchId]: preds }))
      setComparingMatch(matchId)
      setScreen('compare')
    }
  }

  const getMedal = i => ["🥇","🥈","🥉"][i] || `${i+1}°`

  // ─── AUTH SCREENS ──────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ ...S.app, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{textAlign:"center"}}><div style={{fontSize:48}}>⚽</div><p style={{color:"#6a8caa",marginTop:12}}>Cargando...</p></div>
    </div>
  )

  if (!session) return <AuthScreen />

  // ─── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={S.app}>
      <div style={{textAlign:"center",padding:"48px 20px 24px"}}>
        <div style={{fontSize:56}}>⚽</div>
        <h1 style={{fontSize:"clamp(1.8rem,7vw,3.5rem)",fontWeight:900,letterSpacing:"-2px",margin:"6px 0 0",background:"linear-gradient(135deg,#f5c842,#e8a020)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WORLD CUP</h1>
        <h2 style={{fontSize:"clamp(0.9rem,3vw,1.3rem)",fontWeight:400,letterSpacing:"6px",margin:"3px 0 0",color:"#aac4e0",textTransform:"uppercase"}}>2026</h2>
        <p style={{color:"#6a8caa",marginTop:8,fontSize:13}}>Quiniela Oficina · Hola, <strong style={{color:"#fff"}}>{profile?.name}</strong> 👋</p>
      </div>

      <div style={{display:"flex",flexWrap:"wrap",gap:11,justifyContent:"center",padding:"0 16px 20px",maxWidth:820,margin:"0 auto"}}>
        {[
          {icon:"📝",label:"Mis Predicciones",desc:"Llena tu quiniela",action:()=>setScreen("predictions"),bg:"#1a3a2a"},
          {icon:"🏆",label:"Tabla de Posiciones",desc:"¿Quién va ganando?",action:()=>{loadLeaderboard();setScreen("leaderboard")},bg:"#3a1a1a"},
          ...(profile?.is_admin ? [{icon:"⚙️",label:"Admin",desc:"Ingresar resultados reales",action:()=>setScreen("admin"),bg:"#2a1a3a"}] : []),
        ].map(c=>(
          <button key={c.label} onClick={c.action}
            style={{background:c.bg,border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,padding:"22px 24px",minWidth:160,flex:"1 1 160px",cursor:"pointer",color:"#fff",textAlign:"left",boxShadow:"0 4px 20px rgba(0,0,0,0.4)",transition:"transform 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
            onMouseLeave={e=>e.currentTarget.style.transform=""}>
            <div style={{fontSize:32}}>{c.icon}</div>
            <div style={{fontWeight:700,fontSize:14,marginTop:7}}>{c.label}</div>
            <div style={{color:"#8aabca",fontSize:12,marginTop:3}}>{c.desc}</div>
          </button>
        ))}
      </div>

      {/* Points legend */}
      <div style={{maxWidth:480,margin:"0 auto 16px",padding:"0 16px"}}>
        <div style={{...S.card}}>
          <p style={{margin:"0 0 10px",fontSize:11,letterSpacing:3,color:"#f5c842",textTransform:"uppercase"}}>Sistema de Puntos</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"4px 12px",fontSize:12,color:"#aac4e0"}}>
            <span>⚽ Exacto grupos</span><span style={{color:"#fff",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.exact}</span>
            <span>✅ Ganador grupos</span><span style={{color:"#fff",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.winner}</span>
            <span>🔥 Exacto eliminatorias</span><span style={{color:"#fff",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.elimExact}</span>
            <span>✅ Ganador eliminatorias</span><span style={{color:"#fff",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.elimWinner}</span>
            <span>🏆 Campeón</span><span style={{color:"#f5c842",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.campeon}</span>
            <span>👟 Goleador</span><span style={{color:"#f5c842",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.goleador}</span>
            <span style={{color:"#ff9500"}}>🃏 Comodín (1/jornada)</span><span style={{color:"#ff9500",fontWeight:700,textAlign:"right"}}>×2</span>
            <span style={{color:"#4cdc6a"}}>⚽ Primer gol del partido</span><span style={{color:"#4cdc6a",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.primerGol}</span>
            <span style={{color:"#5ec8f5"}}>⭐ MVP (solo eliminatorias)</span><span style={{color:"#5ec8f5",fontWeight:700,textAlign:"right"}}>+{POINT_RULES.mvp}</span>
          </div>
        </div>
      </div>

      <div style={{textAlign:"center",padding:"0 0 24px"}}>
        <button onClick={()=>supabase.auth.signOut()} style={{background:"none",border:"none",color:"#6a8caa",cursor:"pointer",fontSize:13}}>Cerrar sesión</button>
      </div>
    </div>
  )

  // ─── PREDICTIONS ──────────────────────────────────────────────────────────
  if (screen === "predictions") {
    const ptabs = [{id:"grupos",label:"⚽ Grupos"},{id:"eliminatorias",label:"🔥 Eliminatorias"},{id:"especiales",label:"🌟 Especiales"}]
    const groupRounds = ["GR1","GR2","GR3"]
    const roundLabels = {GR1:"Jornada 1 (11-18 jun)",GR2:"Jornada 2 (18-24 jun)",GR3:"Jornada 3 (24-28 jun)"}
    return (
      <div style={S.app}>
        <div style={{background:"rgba(0,0,0,0.4)",padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#6a8caa",cursor:"pointer",fontSize:18}}>←</button>
          <div><div style={{fontWeight:700,fontSize:15}}>📝 Mis Predicciones</div><div style={{fontSize:11,color:"#ff9500"}}>🃏 1 comodín ×2 por jornada · 🔒 Se cierra al inicio de cada partido</div></div>
        </div>
        <div style={{display:"flex",gap:4,padding:"9px 12px",background:"rgba(0,0,0,0.2)",overflowX:"auto"}}>
          {ptabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"5px 13px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:600,fontSize:12,background:tab===t.id?"linear-gradient(135deg,#f5c842,#e8a020)":"rgba(255,255,255,0.08)",color:tab===t.id?"#000":"#aaa",whiteSpace:"nowrap"}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 12px 60px"}}>
          {tab==="grupos" && groupRounds.map(roundId=>{
            const roundMatches = GROUP_MATCHES.filter(m=>m.round===roundId)
            const jokerMatch = roundMatches.find(m=>predictions[m.id]?.is_joker)?.id || null
            return (
              <div key={roundId} style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <p style={{margin:0,fontSize:11,letterSpacing:2,color:"#f5c842",textTransform:"uppercase"}}>{roundLabels[roundId]}</p>
                  {jokerMatch && <span style={{...S.tag,background:"rgba(255,150,0,0.2)",color:"#ff9500"}}>🃏 Comodín activo</span>}
                </div>
                {roundMatches.map(m=>(
                  <MatchCard key={m.id} match={m} pred={predictions[m.id]} result={results[m.id]}
                    isKnockout={false} isJoker={predictions[m.id]?.is_joker||false}
                    jokerUsed={jokerMatch!==null && jokerMatch!==m.id}
                    onToggleJoker={()=>toggleJoker(m.id,roundId,false)}
                    onSave={scores=>savePrediction(m.id,scores)}
                    onSaveScorer={scorer=>savePredScorer(m.id,scorer,false)}
                    onViewPreds={isLocked(m.kickoff)?()=>loadMatchPredictions(m.id,false):null} />
                ))}
              </div>
            )
          })}

          {tab==="eliminatorias" && KNOCKOUT_ROUNDS.map(round=>{
            const stages = KNOCKOUT_STAGES.filter(s=>s.round===round.id)
            const jokerStage = stages.find(s=>koPredictions[s.id]?.is_joker)?.id || null
            return (
              <div key={round.id} style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <p style={{margin:0,fontSize:11,letterSpacing:2,color:"#f5c842",textTransform:"uppercase"}}>{round.label}</p>
                  {jokerStage && <span style={{...S.tag,background:"rgba(255,150,0,0.2)",color:"#ff9500"}}>🃏 Activo</span>}
                </div>
                {stages.map(s=>{
                  const kt = koTeams[s.id]
                  if (!kt?.home_team || !kt?.away_team) return (
                    <div key={s.id} style={{...S.card,color:"#6a8caa",fontSize:12,border:"1px dashed rgba(255,255,255,0.1)"}}>
                      <strong style={{color:"#aac4e0"}}>{s.label}</strong> — Pendiente de definir
                    </div>
                  )
                  const matchObj = { id: s.id, home: kt.home_team, away: kt.away_team, kickoff: s.kickoff }
                  return (
                    <MatchCard key={s.id} match={matchObj} pred={koPredictions[s.id]} result={results[s.id]}
                      isKnockout={true} stageLabel={s.label}
                      isJoker={koPredictions[s.id]?.is_joker||false}
                      jokerUsed={jokerStage!==null && jokerStage!==s.id}
                      onToggleJoker={()=>toggleJoker(s.id,round.id,true)}
                      onSave={scores=>saveKoPrediction(s.id,scores)}
                      onSaveScorer={scorer=>savePredScorer(s.id,scorer,true)}
                      onSaveMvp={mvp=>savePredMvp(s.id,mvp)}
                      onViewPreds={isLocked(s.kickoff)?()=>loadMatchPredictions(s.id,true):null} />
                  )
                })}
              </div>
            )
          })}

          {tab==="especiales" && (
            <div>
              {isSpecialsLocked() && (
                <div style={{background:"rgba(232,85,85,0.1)",border:"1px solid rgba(232,85,85,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:16}}>
                  <p style={{margin:0,fontSize:13,color:"#e85555"}}>🔒 Las predicciones especiales están cerradas — el Mundial ya comenzó.</p>
                </div>
              )}
              {!isSpecialsLocked() && (
                <div style={{background:"rgba(245,200,66,0.08)",border:"1px solid rgba(245,200,66,0.2)",borderRadius:12,padding:"10px 14px",marginBottom:16}}>
                  <p style={{margin:0,fontSize:12,color:"#f5c842"}}>⏰ Se cierra el <strong>11 de junio a las 3:00 PM</strong> hora Costa Rica.</p>
                </div>
              )}
              <p style={{margin:"0 0 12px",fontSize:11,letterSpacing:3,color:"#f5c842",textTransform:"uppercase"}}>🏆 Campeón del Mundo (+{POINT_RULES.campeon} pts)</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:6,marginBottom:24}}>
                {ALL_TEAMS.map(t=>{
                  const sel=specialPred.champion===t
                  const locked=isSpecialsLocked()
                  return (
                    <button key={t} onClick={()=>!locked&&saveSpecial("champion",sel?null:t)}
                      style={{padding:"9px 5px",borderRadius:12,border:sel?"2px solid #f5c842":"1px solid rgba(255,255,255,0.08)",background:sel?"rgba(245,200,66,0.15)":"rgba(255,255,255,0.04)",color:"#fff",cursor:locked?"not-allowed":"pointer",textAlign:"center",opacity:locked&&!sel?0.5:1}}>
                      <div style={{fontSize:22}}>{FLAGS[t]||"🏳️"}</div>
                      <div style={{fontSize:10,marginTop:4,color:sel?"#f5c842":"#ccc",fontWeight:sel?700:400}}>{t}</div>
                    </button>
                  )
                })}
              </div>
              <p style={{margin:"0 0 10px",fontSize:11,letterSpacing:3,color:"#f5c842",textTransform:"uppercase"}}>👟 Goleador del Torneo (+{POINT_RULES.goleador} pts)</p>
              <div style={S.card}>
                <select value={specialPred.top_scorer||""} onChange={e=>!isSpecialsLocked()&&saveSpecial("top_scorer",e.target.value)}
                  disabled={isSpecialsLocked()}
                  style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"#0d1b2a",color:specialPred.top_scorer?"#fff":"#6a8caa",fontSize:13,opacity:isSpecialsLocked()?0.5:1,cursor:isSpecialsLocked()?"not-allowed":"pointer",outline:"none"}}>
                  <option value="">— Seleccionar goleador del torneo —</option>
                  {Object.values(SQUADS).flat().filter((v,i,a)=>a.indexOf(v)===i).sort().map(p=>(
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {specialPred.top_scorer&&<p style={{margin:"8px 0 0",fontSize:12,color:"#aac4e0"}}>Tu goleador: <strong style={{color:"#fff"}}>{specialPred.top_scorer}</strong></p>}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── LEADERBOARD ──────────────────────────────────────────────────────────
  if (screen === "leaderboard") return (
    <div style={{...S.app,padding:20}}>
      <button onClick={()=>setScreen("home")} style={S.back}>← Volver</button>
      <h2 style={{margin:"0 0 6px",fontSize:22,fontWeight:700}}>🏆 Tabla de Posiciones</h2>
      <p style={{color:"#6a8caa",fontSize:12,marginBottom:18}}>Se actualiza con cada resultado</p>
      {leaderboard.length===0
        ? <p style={{color:"#6a8caa",textAlign:"center",marginTop:60}}>Cargando...</p>
        : leaderboard.map((p,i)=>{
          const isFirst = i===0
          const isLast = i===leaderboard.length-1 && leaderboard.length>1
          return (
          <div key={p.id} style={{
            display:"flex",alignItems:"center",gap:13,...S.card,
            border:isFirst?"1px solid rgba(245,200,66,0.5)":isLast?"1px solid rgba(232,85,85,0.4)":S.card.border,
            background:isFirst?"linear-gradient(135deg, rgba(245,200,66,0.08), rgba(255,255,255,0.04))":isLast?"linear-gradient(135deg, rgba(232,85,85,0.06), rgba(255,255,255,0.04))":S.card.background,
            position:"relative"
          }}>
            {isFirst && (
              <div style={{position:"absolute",top:-10,right:14,background:"#f5c842",color:"#1a1100",fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:20,letterSpacing:1}}>
                🐔 GALLINA CIEGA
              </div>
            )}
            {isLast && (
              <div style={{position:"absolute",top:-10,right:14,background:"#e85555",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:20,letterSpacing:1}}>
                🦥 EL LEO-PARDO LENTO
              </div>
            )}
            <span style={{fontSize:24,width:28,textAlign:"center"}}>{getMedal(i)}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15}}>{p.name}{p.id===session.user.id&&<span style={{fontSize:11,color:"#f5c842",marginLeft:6}}>← vos</span>}</div>
              <div style={{fontSize:11,color:"#6a8caa",marginTop:2}}>
                {p.champion&&<span>{FLAGS[p.champion]} {p.champion}</span>}
                {p.topScorer&&<span style={{marginLeft:8}}>👟 {p.topScorer}</span>}
                {p.jokerBonus>0&&<span style={{marginLeft:8,color:"#ff9500"}}>🃏 +{p.jokerBonus}</span>}
              </div>
              {isFirst && <div style={{fontSize:10,color:"#f5c842",marginTop:3,fontStyle:"italic"}}>Picoteó al azar y le pegó a todo 🎯</div>}
              {isLast && <div style={{fontSize:10,color:"#e85555",marginTop:3,fontStyle:"italic"}}>Ni rugiendo se mueve de ahí 🦁</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:22,fontWeight:900,color:isFirst?"#f5c842":isLast?"#e85555":"#fff"}}>{p.points}</div>
              <div style={{fontSize:11,color:"#6a8caa"}}>pts</div>
            </div>
          </div>
        )})
      }
    </div>
  )

  // ─── ADMIN ────────────────────────────────────────────────────────────────
  if (screen === "admin" && profile?.is_admin) {
    const atabs = [{id:"grupos",label:"⚽ Grupos"},{id:"eliminatorias",label:"🔥 Eliminatorias"},{id:"especiales",label:"🌟 Especiales"}]
    return (
      <div style={S.app}>
        <div style={{background:"rgba(0,0,0,0.45)",padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#6a8caa",cursor:"pointer",fontSize:18}}>←</button>
          <div style={{fontWeight:700,fontSize:15}}>⚙️ Admin — Resultados Reales</div>
        </div>
        <div style={{display:"flex",gap:4,padding:"9px 12px",background:"rgba(0,0,0,0.2)",overflowX:"auto"}}>
          {atabs.map(t=>(
            <button key={t.id} onClick={()=>setAdminTab(t.id)}
              style={{padding:"5px 13px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:600,fontSize:12,background:adminTab===t.id?"linear-gradient(135deg,#4cdc6a,#27a348)":"rgba(255,255,255,0.08)",color:adminTab===t.id?"#000":"#aaa",whiteSpace:"nowrap"}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 12px 60px"}}>
          {adminTab==="grupos" && GROUP_MATCHES.map(m=>{
            const [h,setH] = [results[m.id]?.home_score??"",(v)=>saveResult(m.id,{home_score:v===''?null:parseInt(v),away_score:results[m.id]?.away_score??null,scorer:results[m.id]?.scorer??null})]
            const [a,setA] = [results[m.id]?.away_score??"",(v)=>saveResult(m.id,{home_score:results[m.id]?.home_score??null,away_score:v===''?null:parseInt(v),scorer:results[m.id]?.scorer??null})]
            return (
              <div key={m.id} style={{...S.card}}>
                <div style={{fontSize:10,color:"#6a8caa",marginBottom:5}}>Grupo {m.group} · {m.home} vs {m.away}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}>
                    <span style={{fontSize:11,fontWeight:600}}>{m.home}</span><span>{FLAGS[m.home]||"🏳️"}</span>
                  </div>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    <ScoreInput green value={h} onChange={setH} />
                    <span style={{color:"#555",fontWeight:700}}>:</span>
                    <ScoreInput green value={a} onChange={setA} />
                  </div>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:5}}>
                    <span>{FLAGS[m.away]||"🏳️"}</span><span style={{fontSize:11,fontWeight:600}}>{m.away}</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
                  <span style={{fontSize:11,color:"#4cdc6a",whiteSpace:"nowrap"}}>⚽ 1er gol:</span>
                  <select value={results[m.id]?.scorer||""} onChange={e=>saveResult(m.id,{home_score:results[m.id]?.home_score??null,away_score:results[m.id]?.away_score??null,scorer:e.target.value})}
                    style={{flex:1,padding:"4px 8px",borderRadius:8,border:"1px solid rgba(76,220,106,0.3)",background:"#0d1b2a",color:results[m.id]?.scorer?"#4cdc6a":"#6a8caa",fontSize:11,outline:"none"}}>
                    <option value="">— Seleccionar goleador —</option>
                    {[...(SQUADS[m.home]||[]), ...(SQUADS[m.away]||[])].sort().map(p=>(
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            )
          })}

          {adminTab==="eliminatorias" && KNOCKOUT_STAGES.map(s=>{
            const kt=koTeams[s.id]||{}
            return (
              <div key={s.id} style={{...S.card}}>
                <p style={{margin:"0 0 9px",fontSize:12,fontWeight:700,color:"#aac4e0"}}>{s.label}</p>
                <div style={{display:"flex",gap:7,marginBottom:9,alignItems:"center"}}>
                  <select value={kt.home_team||""} onChange={e=>saveKoTeams(s.id,{home_team:e.target.value,away_team:kt.away_team||""})}
                    style={{flex:1,padding:"6px 9px",borderRadius:8,border:"1px solid rgba(255,255,255,0.15)",background:"#1a2744",color:"#fff",fontSize:12}}>
                    <option value="">— Local —</option>
                    {ALL_TEAMS.map(t=><option key={t} value={t}>{FLAGS[t]} {t}</option>)}
                  </select>
                  <span style={{color:"#6a8caa"}}>vs</span>
                  <select value={kt.away_team||""} onChange={e=>saveKoTeams(s.id,{home_team:kt.home_team||"",away_team:e.target.value})}
                    style={{flex:1,padding:"6px 9px",borderRadius:8,border:"1px solid rgba(255,255,255,0.15)",background:"#1a2744",color:"#fff",fontSize:12}}>
                    <option value="">— Visitante —</option>
                    {ALL_TEAMS.map(t=><option key={t} value={t}>{FLAGS[t]} {t}</option>)}
                  </select>
                </div>
                {kt.home_team&&kt.away_team&&(
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{flex:1,display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}>
                      <span style={{fontSize:11,fontWeight:600}}>{kt.home_team}</span><span>{FLAGS[kt.home_team]||"🏳️"}</span>
                    </div>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      <ScoreInput green value={results[s.id]?.home_score??""} onChange={v=>saveResult(s.id,{home_score:v===''?null:parseInt(v),away_score:results[s.id]?.away_score??null,scorer:results[s.id]?.scorer??null,mvp:results[s.id]?.mvp??null})} />
                      <span style={{color:"#555",fontWeight:700}}>:</span>
                      <ScoreInput green value={results[s.id]?.away_score??""} onChange={v=>saveResult(s.id,{home_score:results[s.id]?.home_score??null,away_score:v===''?null:parseInt(v),scorer:results[s.id]?.scorer??null,mvp:results[s.id]?.mvp??null})} />
                    </div>
                    <div style={{flex:1,display:"flex",alignItems:"center",gap:5}}>
                      <span>{FLAGS[kt.away_team]||"🏳️"}</span><span style={{fontSize:11,fontWeight:600}}>{kt.away_team}</span>
                    </div>
                  </div>
                )}
                {kt.home_team&&kt.away_team&&(
                  <>
                    <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
                      <span style={{fontSize:11,color:"#4cdc6a",whiteSpace:"nowrap"}}>⚽ 1er gol:</span>
                      <select value={results[s.id]?.scorer||""} onChange={e=>saveResult(s.id,{home_score:results[s.id]?.home_score??null,away_score:results[s.id]?.away_score??null,scorer:e.target.value,mvp:results[s.id]?.mvp??null})}
                        style={{flex:1,padding:"4px 8px",borderRadius:8,border:"1px solid rgba(76,220,106,0.3)",background:"#0d1b2a",color:results[s.id]?.scorer?"#4cdc6a":"#6a8caa",fontSize:11,outline:"none"}}>
                        <option value="">— Seleccionar goleador —</option>
                        {[...(SQUADS[kt.home_team]||[]), ...(SQUADS[kt.away_team]||[])].sort().map(p=>(
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
                      <span style={{fontSize:11,color:"#5ec8f5",whiteSpace:"nowrap"}}>⭐ MVP:</span>
                      <select value={results[s.id]?.mvp||""} onChange={e=>saveResult(s.id,{home_score:results[s.id]?.home_score??null,away_score:results[s.id]?.away_score??null,scorer:results[s.id]?.scorer??null,mvp:e.target.value})}
                        style={{flex:1,padding:"4px 8px",borderRadius:8,border:"1px solid rgba(94,200,245,0.3)",background:"#0d1b2a",color:results[s.id]?.mvp?"#5ec8f5":"#6a8caa",fontSize:11,outline:"none"}}>
                        <option value="">— Seleccionar MVP —</option>
                        {[...(SQUADS[kt.home_team]||[]), ...(SQUADS[kt.away_team]||[])].sort().map(p=>(
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {adminTab==="especiales" && (
            <div>
              <p style={{margin:"0 0 11px",fontSize:11,letterSpacing:3,color:"#4cdc6a",textTransform:"uppercase"}}>🏆 Campeón Real</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:6,marginBottom:24}}>
                {ALL_TEAMS.map(t=>{
                  const sel=specialResults.champion===t
                  return (
                    <button key={t} onClick={()=>saveSpecialResult("champion",sel?null:t)}
                      style={{padding:"9px 5px",borderRadius:12,border:sel?"2px solid #4cdc6a":"1px solid rgba(255,255,255,0.08)",background:sel?"rgba(76,220,106,0.15)":"rgba(255,255,255,0.04)",color:"#fff",cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontSize:22}}>{FLAGS[t]}</div>
                      <div style={{fontSize:10,marginTop:4,color:sel?"#4cdc6a":"#ccc"}}>{t}</div>
                    </button>
                  )
                })}
              </div>
              <p style={{margin:"0 0 9px",fontSize:11,letterSpacing:3,color:"#4cdc6a",textTransform:"uppercase"}}>👟 Goleador Real</p>
              <select value={specialResults.top_scorer||""} onChange={e=>saveSpecialResult("top_scorer",e.target.value)}
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(76,220,106,0.3)",background:"#0d1b2a",color:specialResults.top_scorer?"#4cdc6a":"#6a8caa",fontSize:13,outline:"none"}}>
                <option value="">— Seleccionar goleador real —</option>
                {Object.values(SQUADS).flat().filter((v,i,a)=>a.indexOf(v)===i).sort().map(p=>(
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── COMPARE SCREEN ──────────────────────────────────────────────────────────
  if (screen === 'compare') {
    const preds = allMatchPreds[comparingMatch] || []
    // Find match info
    const matchInfo = GROUP_MATCHES.find(m=>m.id===comparingMatch) || 
                      KNOCKOUT_STAGES.find(s=>s.id===comparingMatch)
    const isKo = !!KNOCKOUT_STAGES.find(s=>s.id===comparingMatch)
    const koId = comparingMatch?.replace('ko_','')
    const homeTeam = isKo ? knockoutTeams[koId]?.home_team : matchInfo?.home
    const awayTeam = isKo ? knockoutTeams[koId]?.away_team : matchInfo?.away
    const result = results[comparingMatch]

    return (
      <div style={{fontFamily:"Georgia,serif",background:"#0a0f1e",minHeight:"100vh",color:"#fff",padding:20}}>
        <button onClick={()=>setScreen("predictions")} style={{background:"none",border:"none",color:"#6a8caa",cursor:"pointer",fontSize:14,marginBottom:16}}>← Volver</button>
        <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:700}}>👁️ Pronósticos del partido</h2>
        <div style={{fontSize:14,color:"#aac4e0",marginBottom:16}}>
          {FLAGS[homeTeam]||"🏳️"} {homeTeam} vs {awayTeam} {FLAGS[awayTeam]||"🏳️"}
        </div>
        {result?.home_score!=null && (
          <div style={{background:"rgba(76,220,106,0.1)",border:"1px solid rgba(76,220,106,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:12,color:"#4cdc6a",marginBottom:4}}>RESULTADO REAL</div>
            <div style={{fontSize:22,fontWeight:700,color:"#fff"}}>{result.home_score} – {result.away_score}</div>
            {result.scorer && <div style={{fontSize:12,color:"#ff9500",marginTop:4}}>⚽ 1er gol: {result.scorer}</div>}
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {preds.length === 0
            ? <p style={{color:"#6a8caa",textAlign:"center",marginTop:40}}>Nadie pronosticó este partido aún.</p>
            : preds.map((p,i) => {
                const base = calcPoints({home_score:p.home_score,away_score:p.away_score}, result, isKo)
                const pts = p.is_joker ? base*2 : base
                const scorerPts = p.scorer && result?.scorer && p.scorer.toLowerCase().trim()===result.scorer.toLowerCase().trim() ? (p.is_joker ? POINT_RULES.primerGol * 2 : POINT_RULES.primerGol) : 0
                const mvpPts = isKo && p.mvp && result?.mvp && p.mvp.toLowerCase().trim()===result.mvp.toLowerCase().trim() ? (p.is_joker ? POINT_RULES.mvp * 2 : POINT_RULES.mvp) : 0
                const totalExtra = scorerPts + mvpPts
                const ptColor = pts > 0 ? "#4cdc6a" : "#e85555"
                return (
                  <div key={i} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 14px",border:`1px solid ${p.name===session.user.email||allProfiles.find(pr=>pr.id===session.user.id)?.name===p.name?"rgba(245,200,66,0.4)":"rgba(255,255,255,0.08)"}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:13,color:"#6a8caa",width:24,textAlign:"center",fontWeight:700}}>{getMedal(i)}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:14}}>{p.name}</div>
                        {p.scorer && <div style={{fontSize:11,color:"#ff9500",marginTop:2}}>⚽ {p.scorer} {scorerPts>0?"✅":result?.scorer?"❌":""}</div>}
                        {isKo && p.mvp && <div style={{fontSize:11,color:"#5ec8f5",marginTop:2}}>⭐ {p.mvp} {mvpPts>0?"✅":result?.mvp?"❌":""}</div>}
                        {p.is_joker && <div style={{fontSize:10,color:"#ff9500"}}>🃏 Comodín ×2</div>}
                      </div>
                      <div style={{textAlign:"center",minWidth:70}}>
                        <div style={{fontSize:20,fontWeight:700}}>
                          {p.home_score!=null?p.home_score:"?"} – {p.away_score!=null?p.away_score:"?"}
                        </div>
                      </div>
                      {result?.home_score!=null && (
                        <div style={{textAlign:"right",minWidth:40}}>
                          <div style={{fontSize:16,fontWeight:700,color:ptColor}}>{pts>0?`+${pts+totalExtra}`:totalExtra>0?`+${totalExtra}`:"0"}</div>
                          <div style={{fontSize:10,color:"#6a8caa"}}>pts</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
          }
        </div>
      </div>
    )
  }

  return null
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen() {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  async function handleSubmit() {
    setLoading(true); setMsg("")
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg("❌ " + error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      if (error) setMsg("❌ " + error.message)
      else setMsg("✅ ¡Listo! Revisá tu correo para confirmar tu cuenta.")
    }
    setLoading(false)
  }

  return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:52}}>⚽</div>
          <h1 style={{fontSize:"2rem",fontWeight:900,margin:"8px 0 0",background:"linear-gradient(135deg,#f5c842,#e8a020)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WORLD CUP 2026</h1>
          <p style={{color:"#6a8caa",fontSize:13,marginTop:6}}>Quiniela Oficina</p>
        </div>
        <div style={{...S.card,padding:"24px 22px"}}>
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>setMode(m)}
                style={{flex:1,padding:"9px",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,background:mode===m?"linear-gradient(135deg,#f5c842,#e8a020)":"rgba(255,255,255,0.08)",color:mode===m?"#000":"#aaa"}}>
                {m==="login"?"Ingresar":"Registrarse"}
              </button>
            ))}
          </div>
          {mode==="register" && (
            <div style={{marginBottom:14}}>
              <label style={S.label}>Tu nombre</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Como apareceré en la tabla" style={S.input}/>
            </div>
          )}
          <div style={{marginBottom:14}}>
            <label style={S.label}>Correo electrónico</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" style={S.input}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={S.label}>Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="Mínimo 6 caracteres" style={S.input}/>
          </div>
          {msg && <p style={{fontSize:13,color:msg.startsWith("✅")?"#4cdc6a":"#e85555",marginBottom:14,margin:"0 0 14px"}}>{msg}</p>}
          <button onClick={handleSubmit} disabled={loading}
            style={{...S.btn,...S.btnGold,width:"100%",opacity:loading?0.7:1}}>
            {loading?"Cargando...":(mode==="login"?"Ingresar →":"Crear cuenta →")}
          </button>
        </div>
      </div>
    </div>
  )
}
