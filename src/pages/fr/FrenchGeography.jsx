import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';
import franceMapSvgRaw from '../../assets/france.svg?raw';

const cleanedSvg = franceMapSvgRaw.replace(/style="[^"]*"/g, '');

const depts = [
  {n:"01", t:"Ain", p:"Bourg-en-Bresse"}, {n:"02", t:"Aisne", p:"Laon"},
  {n:"03", t:"Allier", p:"Moulins"}, {n:"04", t:"Alpes-de-Haute-Provence", p:"Digne-les-Bains"},
  {n:"05", t:"Hautes-Alpes", p:"Gap"}, {n:"06", t:"Alpes-Maritimes", p:"Nice"},
  {n:"07", t:"Ardèche", p:"Privas"}, {n:"08", t:"Ardennes", p:"Charleville-Mézières"},
  {n:"09", t:"Ariège", p:"Foix"}, {n:"10", t:"Aube", p:"Troyes"},
  {n:"11", t:"Aude", p:"Carcassonne"}, {n:"12", t:"Aveyron", p:"Rodez"},
  {n:"13", t:"Bouches-du-Rhône", p:"Marseille"}, {n:"14", t:"Calvados", p:"Caen"},
  {n:"15", t:"Cantal", p:"Aurillac"}, {n:"16", t:"Charente", p:"Angoulême"},
  {n:"17", t:"Charente-Maritime", p:"La Rochelle"}, {n:"18", t:"Cher", p:"Bourges"},
  {n:"19", t:"Corrèze", p:"Tulle"}, {n:"2A", t:"Corse-du-Sud", p:"Ajaccio"},
  {n:"2B", t:"Haute-Corse", p:"Bastia"}, {n:"21", t:"Côte-d'Or", p:"Dijon"},
  {n:"22", t:"Côtes-d'Armor", p:"Saint-Brieuc"}, {n:"23", t:"Creuse", p:"Guéret"},
  {n:"24", t:"Dordogne", p:"Périgueux"}, {n:"25", t:"Doubs", p:"Besançon"},
  {n:"26", t:"Drôme", p:"Valence"}, {n:"27", t:"Eure", p:"Évreux"},
  {n:"28", t:"Eure-et-Loir", p:"Chartres"}, {n:"29", t:"Finistère", p:"Quimper"},
  {n:"30", t:"Gard", p:"Nîmes"}, {n:"31", t:"Haute-Garonne", p:"Toulouse"},
  {n:"32", t:"Gers", p:"Auch"}, {n:"33", t:"Gironde", p:"Bordeaux"},
  {n:"34", t:"Hérault", p:"Montpellier"}, {n:"35", t:"Ille-et-Vilaine", p:"Rennes"},
  {n:"36", t:"Indre", p:"Châteauroux"}, {n:"37", t:"Indre-et-Loire", p:"Tours"},
  {n:"38", t:"Isère", p:"Grenoble"}, {n:"39", t:"Jura", p:"Lons-le-Saunier"},
  {n:"40", t:"Landes", p:"Mont-de-Marsan"}, {n:"41", t:"Loir-et-Cher", p:"Blois"},
  {n:"42", t:"Loire", p:"Saint-Étienne"}, {n:"43", t:"Haute-Loire", p:"Le Puy-en-Velay"},
  {n:"44", t:"Loire-Atlantique", p:"Nantes"}, {n:"45", t:"Loiret", p:"Orléans"},
  {n:"46", t:"Lot", p:"Cahors"}, {n:"47", t:"Lot-et-Garonne", p:"Agen"},
  {n:"48", t:"Lozère", p:"Mende"}, {n:"49", t:"Maine-et-Loire", p:"Angers"},
  {n:"50", t:"Manche", p:"Saint-Lô"}, {n:"51", t:"Marne", p:"Châlons-en-Champagne"},
  {n:"52", t:"Haute-Marne", p:"Chaumont"}, {n:"53", t:"Mayenne", p:"Laval"},
  {n:"54", t:"Meurthe-et-Moselle", p:"Nancy"}, {n:"55", t:"Meuse", p:"Bar-le-Duc"},
  {n:"56", t:"Morbihan", p:"Vannes"}, {n:"57", t:"Moselle", p:"Metz"},
  {n:"58", t:"Nièvre", p:"Nevers"}, {n:"59", t:"Nord", p:"Lille"},
  {n:"60", t:"Oise", p:"Beauvais"}, {n:"61", t:"Orne", p:"Alençon"},
  {n:"62", t:"Pas-de-Calais", p:"Arras"}, {n:"63", t:"Puy-de-Dôme", p:"Clermont-Ferrand"},
  {n:"64", t:"Pyrénées-Atlantiques", p:"Pau"}, {n:"65", t:"Hautes-Pyrénées", p:"Tarbes"},
  {n:"66", t:"Pyrénées-Orientales", p:"Perpignan"}, {n:"67", t:"Bas-Rhin", p:"Strasbourg"},
  {n:"68", t:"Haut-Rhin", p:"Colmar"}, {n:"69", t:"Rhône", p:"Lyon"},
  {n:"70", t:"Haute-Saône", p:"Vesoul"}, {n:"71", t:"Saône-et-Loire", p:"Mâcon"},
  {n:"72", t:"Sarthe", p:"Le Mans"}, {n:"73", t:"Savoie", p:"Chambéry"},
  {n:"74", t:"Haute-Savoie", p:"Annecy"}, {n:"75", t:"Paris", p:"Paris"},
  {n:"76", t:"Seine-Maritime", p:"Rouen"}, {n:"77", t:"Seine-et-Marne", p:"Melun"},
  {n:"78", t:"Yvelines", p:"Versailles"}, {n:"79", t:"Deux-Sèvres", p:"Niort"},
  {n:"80", t:"Somme", p:"Amiens"}, {n:"81", t:"Tarn", p:"Albi"},
  {n:"82", t:"Tarn-et-Garonne", p:"Montauban"}, {n:"83", t:"Var", p:"Toulon"},
  {n:"84", t:"Vaucluse", p:"Avignon"}, {n:"85", t:"Vendée", p:"La Roche-sur-Yon"},
  {n:"86", t:"Vienne", p:"Poitiers"}, {n:"87", t:"Haute-Vienne", p:"Limoges"},
  {n:"88", t:"Vosges", p:"Épinal"}, {n:"89", t:"Yonne", p:"Auxerre"},
  {n:"90", t:"Territoire de Belfort", p:"Belfort"}, {n:"91", t:"Essonne", p:"Évry"},
  {n:"92", t:"Hauts-de-Seine", p:"Nanterre"}, {n:"93", t:"Seine-Saint-Denis", p:"Bobigny"},
  {n:"94", t:"Val-de-Marne", p:"Créteil"}, {n:"95", t:"Val-d'Oise", p:"Pontoise"}
];

export default function FrenchGeography() {
  const [scores, setScores] = useState({});
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [currDept, setCurrDept] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState({ text: 'Trouve la réponse...', status: 'neutral' });
  const [mode, setMode] = useState('t-n'); // label, qField, rField
  const [showStats, setShowStats] = useState(false);
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const modeConfig = {
    "t-n": { label: "Numéro de", qField: "t", rField: "n", placeholder: "Ex: 01..." },
    "t-p": { label: "Préfecture de", qField: "t", rField: "p", placeholder: "Ex: Lyon..." },
    "n-t": { label: "Département n°", qField: "n", rField: "t", placeholder: "Ex: Isère..." },
    "n-p": { label: "Préfecture du n°", qField: "n", rField: "p", placeholder: "Ex: Lyon..." },
    "p-t": { label: "Département de", qField: "p", rField: "t", placeholder: "Ex: Isère..." },
    "p-n": { label: "Numéro de (Préf)", qField: "p", rField: "n", placeholder: "Ex: 33..." }
  };

  useEffect(() => {
    localforage.getItem('fra_geo_scores').then(s => { if (s) setScores(s); });
    localforage.getItem('fra_geo_best').then(b => { if (b) setBest(b); });
  }, []);

  // Mount vanilla DOM map ONCE to bypass React virtual DOM completely (Legacy behavior)
  useEffect(() => {
    if (mapRef.current && !mapRef.current.hasChildNodes()) {
      mapRef.current.innerHTML = franceMapSvgRaw;
      
      const departementElems = mapRef.current.querySelectorAll('path');
      for (let i = 0; i < departementElems.length; i++) {
        let path = departementElems[i];
        
        if (path.id && path.id.startsWith('departement')) {
          let num = path.id.substring(11).toUpperCase();
          if (num.length === 1 && !isNaN(num)) num = "0" + num;
          
          path.setAttribute('data-num', num);
          path.setAttribute('id', 'dept-' + num);
          path.classList.add('dept-path');
          
          let d = depts.find(x => x.n === num);
          if (d && !path.querySelector('title')) {
            let title = document.createElement('title');
            title.textContent = d.t + " (" + d.n + ")";
            path.appendChild(title);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    initGame();
  }, [mode]);

  useEffect(() => {
    if (!currDept || !mapRef.current) return;
    
    // Reset ALL shapes (Legacy logic)
    const allPaths = mapRef.current.querySelectorAll('.dept-path');
    for (let i = 0; i < allPaths.length; i++) {
      allPaths[i].classList.remove('dept-active');
    }

    // Highlight active (Legacy logic)
    const activePath = document.getElementById('dept-' + currDept.n);
    if (activePath) {
      activePath.classList.add('dept-active');
      
      try {
        activePath.parentNode.appendChild(activePath);
      } catch (e) {}
    }
  }, [currDept]);

  const initGame = () => {
    const nextDept = depts[Math.floor(Math.random() * depts.length)];
    setCurrDept(nextDept);
    setInputVal('');
    setFeedback({ text: 'Trouve la réponse...', status: 'neutral' });
    setTimeout(() => { if(inputRef.current) inputRef.current.focus(); }, 100);
  };

  const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, " ").trim();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currDept) {
      const config = modeConfig[mode];
      const rType = config.rField;
      const expected = currDept[rType].toString();
      
      const newScores = { ...scores };
      let newStreak = streak;

      if (normalize(inputVal) === normalize(expected)) {
        newScores[currDept.n] = (newScores[currDept.n] || 0) + 1;
        newStreak++;
        let newBest = best;
        if (newStreak > best) {
          newBest = newStreak;
          setBest(newBest);
          localforage.setItem('fra_geo_best', newBest);
        }
        setFeedback({ text: 'Correct ! 🎉', status: 'success' });
        setTimeout(initGame, 1000);
      } else {
        newScores[currDept.n] = (newScores[currDept.n] || 0) - 1;
        newStreak = 0;
        setFeedback({ text: `Faux : c'était ${expected}`, status: 'error' });
        setInputVal('');
      }

      setScores(newScores);
      setStreak(newStreak);
      localforage.setItem('fra_geo_scores', newScores);
    }
  };

  const sortedDepts = [...depts].sort((a, b) => (scores[a.n] || 0) - (scores[b.n] || 0));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in relative pt-14">
      <Link to="/fr" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-white/10 transition z-50">
        🔙 Retour
      </Link>

      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6">
            <div className="text-sm font-bold uppercase tracking-widest text-[var(--text)] opacity-80">
              Série: <span className="text-[var(--accent-color)]">{streak}</span> 🔥
            </div>
            <div className="text-sm font-bold uppercase tracking-widest text-[var(--text)] opacity-80">
              Record: <span className="text-emerald-400">{best}</span> 🏆
            </div>
          </div>
          <button onClick={() => setShowStats(!showStats)} className="px-4 py-2 glass rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition border border-white/10">
            📊 Stats
          </button>
        </div>

        <div className="glass rounded-3xl shadow-2xl overflow-hidden border border-white/5 flex flex-col lg:flex-row min-h-[600px]">
          
          <div className="w-full lg:w-3/5 p-6 relative flex items-center justify-center bg-black/20 border-b lg:border-b-0 lg:border-r border-white/5">
            <div ref={mapRef} className="w-full max-w-[500px] h-full drop-shadow-2xl"></div>
          </div>

          <div className="w-full lg:w-2/5 p-8 flex flex-col justify-center relative">
            {showStats ? (
              <div className="h-full flex flex-col">
                <h3 className="text-2xl font-black mb-4 theme-gradient-text font-serif">Statistiques</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 max-h-[400px]">
                  {sortedDepts.map(d => {
                    const s = scores[d.n] || 0;
                    return (
                      <div key={d.n} className={`flex items-center justify-between bg-black/20 p-3 rounded-xl border-l-4 ${s < 0 ? 'border-rose-500' : (s > 0 ? 'border-[#d4af37]' : 'border-slate-600')}`}>
                        <div className="flex gap-4 items-center">
                          <span className="text-white/50 font-mono font-bold w-6">{d.n}</span>
                          <div>
                            <div className="font-bold text-white text-sm leading-tight">{d.t}</div>
                            <div className="text-[10px] text-white/50 uppercase tracking-wider">{d.p}</div>
                          </div>
                        </div>
                        <div className={`font-black text-lg ${s < 0 ? 'text-rose-500' : (s > 0 ? 'text-[#d4af37]' : 'text-slate-400')}`}>{s}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              currDept && (
                <>
                  <div className="mb-8">
                    <label className="block text-xs uppercase tracking-[0.2em] opacity-60 mb-3 font-bold">Mode d'étude</label>
                    <select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#d4af37] text-sm font-bold">
                      <option value="t-n">Nom ➔ Numéro</option>
                      <option value="t-p">Nom ➔ Préfecture</option>
                      <option value="n-t">Numéro ➔ Nom</option>
                      <option value="n-p">Numéro ➔ Préfecture</option>
                      <option value="p-t">Préfecture ➔ Nom</option>
                      <option value="p-n">Préfecture ➔ Numéro</option>
                    </select>
                  </div>

                  <div className="text-center mb-8 flex-1 flex flex-col justify-center">
                    <p className="text-sm font-bold tracking-widest uppercase opacity-70 mb-2">{modeConfig[mode].label}</p>
                    <h2 className="text-4xl lg:text-5xl font-black font-serif text-[#d4af37] drop-shadow-md leading-tight">{currDept[modeConfig[mode].qField]}</h2>
                  </div>

                  <div className="relative mb-4">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={modeConfig[mode].placeholder}
                      autoComplete="off" spellCheck="false" autoCorrect="off" autoCapitalize="none"
                      className="w-full p-5 rounded-2xl bg-black/40 border-2 border-white/10 text-white text-center text-xl font-bold outline-none focus:border-[#d4af37] shadow-inner transition"
                    />
                  </div>

                  <div className="h-6 text-center">
                    <p className={`text-sm font-black uppercase tracking-widest ${feedback.status === 'success' ? 'text-emerald-400' : (feedback.status === 'error' ? 'text-rose-500' : 'text-white/40')}`}>
                      {feedback.text}
                    </p>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
