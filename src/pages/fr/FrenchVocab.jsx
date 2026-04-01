import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

const allVocab = [
  // --- Verbs ---
  { fr: "être", en: "to be", es: "ser/estar" }, { fr: "avoir", en: "to have", es: "tener" }, { fr: "faire", en: "to do/make", es: "hacer" }, { fr: "dire", en: "to say", es: "decir" }, { fr: "aller", en: "to go", es: "ir" }, { fr: "voir", en: "to see", es: "ver" }, { fr: "savoir", en: "to know", es: "saber" }, { fr: "pouvoir", en: "can/to be able to", es: "poder" }, { fr: "vouloir", en: "to want", es: "querer" }, { fr: "venir", en: "to come", es: "venir" }, { fr: "prendre", en: "to take", es: "tomar" }, { fr: "croire", en: "to believe", es: "creer" }, { fr: "mettre", en: "to put", es: "poner" }, { fr: "parler", en: "to speak", es: "hablar" }, { fr: "manger", en: "to eat", es: "comer" }, { fr: "donner", en: "to give", es: "dar" }, { fr: "penser", en: "to think", es: "pensar" }, { fr: "passer", en: "to pass", es: "pasar" }, { fr: "regarder", en: "to look at", es: "mirar" }, { fr: "aimer", en: "to love/like", es: "amar/querer" }, { fr: "quitter", en: "to leave (a place)", es: "dejar/abandonar" }, { fr: "trouver", en: "to find", es: "encontrar" }, { fr: "rendre", en: "to return/give back", es: "devolver" }, { fr: "comprendre", en: "to understand", es: "comprender" }, { fr: "attendre", en: "to wait", es: "esperar" }, { fr: "sortir", en: "to go out", es: "salir" }, { fr: "vivre", en: "to live", es: "vivir" }, { fr: "entendre", en: "to hear", es: "oír" }, { fr: "chercher", en: "to search", es: "buscar" }, { fr: "travailler", en: "to work", es: "trabajar" }, { fr: "appeler", en: "to call", es: "llamar" }, { fr: "tomber", en: "to fall", es: "caer" }, { fr: "arriver", en: "to arrive", es: "llegar" }, { fr: "partir", en: "to leave/depart", es: "irse/partir" }, { fr: "connaître", en: "to know (somebody)", es: "conocer" }, { fr: "devenir", en: "to become", es: "convertirse en" }, { fr: "demander", en: "to ask", es: "preguntar/pedir" }, { fr: "acheter", en: "to buy", es: "comprar" }, { fr: "rester", en: "to stay", es: "quedarse" }, { fr: "recevoir", en: "to receive", es: "recibir" }, { fr: "devoir", en: "must/to have to", es: "deber" }, { fr: "conduire", en: "to drive", es: "conducir" }, { fr: "sembler", en: "to seem", es: "parecer" }, { fr: "tenir", en: "to hold", es: "sostener/tener" }, { fr: "porter", en: "to carry/wear", es: "llevar" }, { fr: "montrer", en: "to show", es: "mostrar" }, { fr: "continuer", en: "to continue", es: "continuar" }, { fr: "suivre", en: "to follow", es: "seguir" }, { fr: "commencer", en: "to begin", es: "empezar" }, { fr: "compter", en: "to count", es: "contar" }, { fr: "remettre", en: "to put back", es: "volver a poner" }, { fr: "permettre", en: "to allow", es: "permitir" }, { fr: "occuper", en: "to occupy", es: "ocupar" }, { fr: "décider", en: "to decide", es: "decidir" }, { fr: "servir", en: "to serve", es: "servir" }, { fr: "revenir", en: "to come back", es: "volver/regresar" }, { fr: "laisser", en: "to leave/let", es: "dejar" }, { fr: "répondre", en: "to answer", es: "responder" }, { fr: "rappeler", en: "to remind/recall", es: "recordar/volver a llamar" }, { fr: "présenter", en: "to present", es: "presentar" }, { fr: "accepter", en: "to accept", es: "aceptar" }, { fr: "agir", en: "to act", es: "actuar" }, { fr: "poser", en: "to pose/put down", es: "poner/plantear" }, { fr: "jouer", en: "to play", es: "jugar" }, { fr: "reconnaître", en: "to recognize", es: "reconocer" }, { fr: "choisir", en: "to choose", es: "elegir" }, { fr: "toucher", en: "to touch", es: "tocar" }, { fr: "retrouver", en: "to find again", es: "recuperar/encontrar" }, { fr: "perdre", en: "to lose", es: "perder" }, { fr: "expliquer", en: "to explain", es: "explicar" }, { fr: "considérer", en: "to consider", es: "considerar" }, { fr: "ouvrir", en: "to open", es: "abrir" }, { fr: "gagner", en: "to win", es: "ganar" }, { fr: "exister", en: "to exist", es: "existir" }, { fr: "refuser", en: "to refuse", es: "rechazar" }, { fr: "lire", en: "to read", es: "leer" }, { fr: "réussir", en: "to succeed", es: "tener éxito" }, { fr: "changer", en: "to change", es: "cambiar" }, { fr: "représenter", en: "to represent", es: "representar" }, { fr: "assurer", en: "to assure", es: "asegurar" }, { fr: "essayer", en: "to try", es: "intentar" }, { fr: "empêcher", en: "to prevent", es: "impedir" }, { fr: "reprendre", en: "to retake", es: "retomar" }, { fr: "mener", en: "to lead", es: "dirigir/llevar" }, { fr: "appartenir", en: "to belong", es: "pertenecer" },
  { fr: "aider", en: "to help", es: "ayudar" }, { fr: "dormir", en: "to sleep", es: "dormir" }, { fr: "chanter", en: "to sing", es: "cantar" }, { fr: "danser", en: "to dance", es: "bailar" }, { fr: "étudier", en: "to study", es: "estudiar" }, { fr: "apprendre", en: "to learn", es: "aprender" }, { fr: "boire", en: "to drink", es: "beber" }, { fr: "marcher", en: "to walk", es: "caminar" }, { fr: "courir", en: "to run", es: "correr" }, { fr: "écrire", en: "to write", es: "escribir" }, { fr: "écouteur", en: "to listen", es: "escuchar" }, { fr: "préparer", en: "to prepare", es: "preparar" }, { fr: "utiliser", en: "to use", es: "usar" }, { fr: "visiter", en: "to visit", es: "visitar" }, { fr: "voyager", en: "to travel", es: "viajar" }, { fr: "payer", en: "to pay", es: "pagar" }, { fr: "vendre", en: "to sell", es: "vender" }, { fr: "offrir", en: "to offer", es: "ofrecer" }, { fr: "oublier", en: "to forget", es: "olvidar" }, { fr: "rencontrer", en: "to meet", es: "conocer/encontrar" }, { fr: "partager", en: "to share", es: "compartir" }, { fr: "espérer", en: "to hope", es: "esperar" }, { fr: "fermer", en: "to close", es: "cerrar" }, { fr: "monter", en: "to go up", es: "subir" }, { fr: "descendre", en: "to go down", es: "bajar" },

  // --- Nouns ---
  { fr: "la maison", en: "the house", es: "la casa" }, { fr: "la chambre", en: "the bedroom", es: "la habitación" }, { fr: "la cuisine", en: "the kitchen", es: "la cocina" }, { fr: "le salon", en: "the living room", es: "el salón" }, { fr: "la salle de bain", en: "the bathroom", es: "el baño" }, { fr: "la porte", en: "the door", es: "la puerta" }, { fr: "la fenêtre", en: "the window", es: "la ventana" }, { fr: "le lit", en: "the bed", es: "la cama" }, { fr: "la table", en: "the table", es: "la mesa" }, { fr: "la chaise", en: "the chair", es: "la silla" }, { fr: "le jardin", en: "the garden", es: "el jardín" },
  { fr: "le pain", en: "the bread", es: "el pan" }, { fr: "l'eau", en: "the water", es: "el agua" }, { fr: "le fromage", en: "the cheese", es: "el queso" }, { fr: "le vin", en: "the wine", es: "el vino" }, { fr: "le café", en: "the coffee", es: "el café" }, { fr: "le thé", en: "the tea", es: "el té" }, { fr: "le petit-déjeuner", en: "the breakfast", es: "el desayuno" }, { fr: "le déjeuner", en: "the lunch", es: "el almuerzo" }, { fr: "le dîner", en: "the dinner", es: "la cena" }, { fr: "les fruits", en: "the fruits", es: "las frutas" }, { fr: "les légumes", en: "the vegetables", es: "las verduras" }, { fr: "la viande", en: "the meat", es: "la carne" }, { fr: "le poisson", en: "the fish", es: "el pescado" }, { fr: "le sucre", en: "the sugar", es: "el azúcar" }, { fr: "le sel", en: "the salt", es: "la sal" },
  { fr: "la ville", en: "the city", es: "la ciudad" }, { fr: "la rue", en: "the street", es: "la calle" }, { fr: "la voiture", en: "the car", es: "el coche" }, { fr: "le vélo", en: "the bicycle", es: "la bicicleta" }, { fr: "le train", en: "the train", es: "el tren" }, { fr: "l'avion", en: "the airplane", es: "el avión" }, { fr: "le bateau", en: "the boat", es: "el barco" }, { fr: "le sac", en: "the bag", es: "el bolso/saco" }, { fr: "le billet", en: "the ticket", es: "el boleto" }, { fr: "l'hôtel", en: "the hotel", es: "el hotel" }, { fr: "le restaurant", en: "the restaurant", es: "el restaurante" }, { fr: "le magasin", en: "the shop", es: "la tienda" }, { fr: "la plage", en: "the beach", es: "la playa" }, { fr: "la montagne", en: "the mountain", es: "la montaña" },
  { fr: "le temps", en: "the time/weather", es: "el tiempo" }, { fr: "la main", en: "the hand", es: "la mano" }, { fr: "le pied", en: "the foot", es: "el pie" }, { fr: "la tête", en: "the head", es: "la cabeza" }, { fr: "l'œil", en: "the eye", es: "el ojo" }, { fr: "la bouche", en: "the mouth", es: "la boca" }, { fr: "le bras", en: "the arm", es: "el brazo" }, { fr: "le cœur", en: "the heart", es: "el corazón" }, { fr: "le corps", en: "the body", es: "el cuerpo" }, { fr: "le monde", en: "the world", es: "el mundo" }, { fr: "la vie", en: "the life", es: "la vida" }, { fr: "l'homme", en: "the man", es: "el hombre" }, { fr: "la femme", en: "the woman", es: "la mujer" }, { fr: "l'enfant", en: "the child", es: "el niño/niña" }, { fr: "la family", en: "the family", es: "la familia" }, { fr: "le père", en: "the father", es: "el padre" }, { fr: "la mère", en: "the mother", es: "la madre" }, { fr: "le frère", en: "the brother", es: "el hermano" }, { fr: "la sœur", en: "the sister", es: "la hermana" }, { fr: "le travail", en: "the work", es: "el trabajo" }, { fr: "l'école", en: "the school", es: "la escuela" }, { fr: "le livre", en: "the book", es: "el libro" }, { fr: "le ciel", en: "the sky", es: "el cielo" }, { fr: "la terre", en: "the earth", es: "la tierra" }, { fr: "le soleil", en: "the sun", es: "el sol" }, { fr: "la lune", en: "the moon", es: "la luna" }, { fr: "l'argent", en: "the money/silver", es: "el dinero" }, { fr: "la peur", en: "the fear", es: "el miedo" }, { fr: "la joie", en: "the joy", es: "la alegría" }, { fr: "le rêve", en: "the dream", es: "el sueño" },

  // --- Adjectives ---
  { fr: "grand", en: "big/tall", es: "grande" }, { fr: "petit", en: "small", es: "pequeño" }, { fr: "bon", en: "good", es: "bueno" }, { fr: "mauvais", en: "bad", es: "malo" }, { fr: "beau", en: "beautiful", es: "hermoso" }, { fr: "nouveau", en: "new", es: "nuevo" }, { fr: "vieux", en: "old", es: "viejo" }, { fr: "chaud", en: "hot", es: "caliente" }, { fr: "froid", en: "cold", es: "frío" }, { fr: "rapide", en: "fast", es: "rápido" }, { fr: "lent", en: "slow", es: "lento" }, { fr: "heureux", en: "happy", es: "feliz" }, { fr: "triste", en: "sad", es: "triste" }, { fr: "difficile", en: "difficult", es: "difícil" }, { fr: "facile", en: "easy", es: "fácil" }, { fr: "propre", en: "clean", es: "limpio" }, { fr: "sale", en: "dirty", es: "sucio" }, { fr: "cher", en: "expensive", es: "caro" }, { fr: "large", en: "wide", es: "ancho" }, { fr: "étroit", en: "narrow", es: "estrecho" }, { fr: "fort", en: "strong", es: "fuerte" }, { fr: "faible", en: "weak", es: "débil" }, { fr: "jeune", en: "young", es: "joven" }, { fr: "gras", en: "fat", es: "gordo" }, { fr: "maigre", en: "thin", es: "delgado" }, { fr: "riche", en: "rich", es: "rico" }, { fr: "pauvre", en: "poor", es: "pobre" }, { fr: "vide", en: "empty", es: "vacío" }, { fr: "plein", en: "full", es: "lleno" }, { fr: "noir", en: "black", es: "negro" }, { fr: "blanc", en: "white", es: "blanco" }, { fr: "rouge", en: "red", es: "rojo" }, { fr: "bleu", en: "blue", es: "azul" }, { fr: "vert", en: "green", es: "verde" }, { fr: "jaune", en: "yellow", es: "amarillo" },

  // --- Time & Phrash ---
  { fr: "aujourd'hui", en: "today", es: "hoy" }, { fr: "demain", en: "tomorrow", es: "mañana" }, { fr: "hier", en: "yesterday", es: "ayer" }, { fr: "maintenant", en: "now", es: "ahora" }, { fr: "toujours", en: "always", es: "siempre" }, { fr: "souvent", en: "often", es: "a menudo" }, { fr: "parfois", en: "sometimes", es: "a veces" }, { fr: "jamais", en: "never", es: "nunca" }, { fr: "trop", en: "too much", es: "demasiado" }, { fr: "beaucoup", en: "a lot", es: "mucho" }, { fr: "un peu", en: "a little", es: "un poco" }, { fr: "ici", en: "here", es: "aquí" }, { fr: "là-bas", en: "over there", es: "allí" }, { fr: "ensemble", en: "together", es: "juntos" }, { fr: "seul", en: "alone", es: "solo" }
];

export default function FrenchVocab() {
  const [stats, setStats] = useState({});
  const [globalData, setGlobalData] = useState({ bestStreak: 0, streak: 0 });
  const [lang, setLang] = useState('en');
  const [screen, setScreen] = useState('setup'); // setup, quiz, stats
  const [mode, setMode] = useState('mcq');
  const [isFocus, setIsFocus] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    localforage.getItem('fra_vocab_stats').then(s => { if (s) setStats(s); });
    localforage.getItem('fra_vocab_global').then(g => { if (g) setGlobalData(g); });
    localforage.getItem('fra_source_lang').then(l => { if (l) setLang(l); });
  }, []);

  const ui = {
    en: {
        title: "Vocabulary 📚",
        subtitle: "Master French words and phrases",
        mcq: "MCQ 🔘",
        write: "Writing ✍️",
        fix: "Fix my errors 🛠️",
        stats: "Statistics 📊",
        topErr: "Top Errors 📉",
        noData: "No data yet.",
        back: "Back",
        clear: "Clear Data",
        correct: "Correct! 🎉",
        typePlac: "Type in French...",
        streak: "Streak:",
        rev: "Review 🛠️",
        class: "Classic ⚡"
    },
    es: {
        title: "Vocabulario 📚",
        subtitle: "Domina palabras y frases en francés",
        mcq: "QCM 🔘",
        write: "Escritura ✍️",
        fix: "Corregir mis errores 🛠️",
        stats: "Estadísticas 📊",
        topErr: "Errores principales 📉",
        noData: "Sin datos aún.",
        back: "Volver",
        clear: "Borrar datos",
        correct: "¡Correcto! 🎉",
        typePlac: "Escribe en francés...",
        streak: "Racha:",
        rev: "Revisión 🛠️",
        class: "Clásico ⚡"
    }
  };

  const curUI = ui[lang] || ui.en;

  const saveAll = (newStats, newGlobal) => {
    setStats(newStats);
    setGlobalData(newGlobal);
    localforage.setItem('fra_vocab_stats', newStats);
    localforage.setItem('fra_vocab_global', newGlobal);
  };

  const totalErrors = Object.values(stats).reduce((acc, v) => acc + (v.err || 0), 0);

  const startQuiz = (m, focus = false) => {
    setMode(m);
    setIsFocus(focus);
    setScreen('quiz');
    nextQuestion(focus, m);
  };

  const nextQuestion = (focusMode = isFocus, currentMode = mode) => {
    setIsTransitioning(false);
    setFeedback(null);
    setInputVal('');

    let pool = allVocab;
    if (focusMode) {
      pool = allVocab.filter(v => stats[v.fr] && stats[v.fr].err > 0);
      if (pool.length === 0) {
        setScreen('setup');
        alert(lang === 'es' ? "¡Buen trabajo! No hay más puntos débiles." : "Great job! No more weak spots for now.");
        return;
      }
    }

    const nextW = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(nextW);

    if (currentMode === 'mcq') {
      let opts = [nextW.fr];
      while (opts.length < 4) {
        let rW = allVocab[Math.floor(Math.random() * allVocab.length)].fr;
        if (!opts.includes(rW)) opts.push(rW);
      }
      setOptions(opts.sort(() => 0.5 - Math.random()));
    } else {
      setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
    }
  };

  const handleAnswer = (answer) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newStats = { ...stats };
    const newGlobal = { ...globalData };
    if (!newStats[currentWord.fr]) newStats[currentWord.fr] = { ok: 0, err: 0 };

    const correct = currentWord.fr.toLowerCase();
    const userAns = answer.trim().toLowerCase();

    if (userAns === correct) {
      newGlobal.streak++;
      if (newGlobal.streak > newGlobal.bestStreak) newGlobal.bestStreak = newGlobal.streak;
      newStats[currentWord.fr].ok++;
      if (isFocus && newStats[currentWord.fr].err > 0) newStats[currentWord.fr].err--;
      setFeedback({ status: 'success', text: curUI.correct, selected: answer });
    } else {
      newGlobal.streak = 0;
      newStats[currentWord.fr].err++;
      setFeedback({ status: 'error', text: `${currentWord.fr}`, selected: answer, correctWord: correct });
    }

    saveAll(newStats, newGlobal);
    setTimeout(() => nextQuestion(), 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAnswer(inputVal);
  };

  const clearData = () => {
    if (window.confirm(lang === 'es' ? "¿Estás seguro?" : "Are you sure you want to clear your progress?")) {
      setStats({});
      setGlobalData({ streak: 0, bestStreak: 0 });
      localforage.removeItem('fra_vocab_stats');
      localforage.removeItem('fra_vocab_global');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in relative pt-16">
      <Link to="/fr" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-white/10 transition z-50">
        🔙 {curUI.back}
      </Link>

      <div className="w-full max-w-md w-full">
        {screen === 'setup' && (
          <div className="glass p-8 rounded-2xl shadow-xl w-full border border-white/5 relative z-10 text-center">
            <h1 className="text-4xl font-black mb-2 theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>{curUI.title}</h1>
            <p className="opacity-70 mb-8 font-serif italic text-lg">{curUI.subtitle}</p>

            <div className="space-y-4 mb-8">
              <button onClick={() => startQuiz('mcq')} className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition border border-white/20">
                {curUI.mcq}
              </button>
              <button onClick={() => startQuiz('type')} className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition border border-white/20">
                {curUI.write}
              </button>
              {totalErrors > 0 && (
                <button onClick={() => startQuiz('type', true)} className="w-full p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition shadow-[0_0_15px_rgba(79,70,229,0.4)] mt-4 border border-indigo-400">
                  {curUI.fix.replace("{totalErrors}", totalErrors)} 🛠️
                </button>
              )}
            </div>

            <button onClick={() => setScreen('stats')} className="w-full p-3 rounded-lg bg-black/40 text-sm uppercase tracking-widest hover:bg-black/60 transition">
              {curUI.stats}
            </button>
          </div>
        )}

        {screen === 'stats' && (
          <div className="glass p-8 rounded-2xl shadow-xl w-full border border-white/5 relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-[var(--primary)] text-center" style={{ fontFamily: 'var(--font-main)' }}>{curUI.topErr}</h2>
            <div className="max-h-64 overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-2">
              {Object.keys(stats).filter(k => stats[k].err > 0).sort((a,b) => stats[b].err - stats[a].err).map(k => (
                <div key={k} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-lg font-serif inline-block px-2">{k}</span>
                  <div className="flex gap-4">
                    <span className="text-rose-400 font-mono font-bold">{stats[k].err} ✖</span>
                    <span className="text-emerald-400 font-mono font-bold">{stats[k].ok} ✔</span>
                  </div>
                </div>
              ))}
              {Object.keys(stats).filter(k => stats[k].err > 0).length === 0 && (
                <div className="text-center opacity-50 py-8 italic font-serif">{curUI.noData}</div>
              )}
            </div>
            <button onClick={() => setScreen('setup')} className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition">{curUI.back}</button>
            <button onClick={clearData} className="w-full mt-4 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-rose-400 transition">{curUI.clear}</button>
          </div>
        )}

        {screen === 'quiz' && currentWord && (
          <div>
            <div className="w-full flex justify-between items-center mb-6 px-2">
              <button onClick={() => setScreen('setup')} className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition px-3 py-1 bg-white/5 rounded">
                Menu
              </button>
              <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-[0.2em] px-3 py-1 bg-[var(--primary)]/10 rounded-full border border-[var(--primary)]/20">
                {isFocus ? curUI.rev : curUI.class}
              </div>
              <div className="text-sm font-bold text-[var(--primary)] drop-shadow-sm flex items-center justify-center gap-1">
                🔥 {curUI.streak} {globalData.streak} <span className="opacity-50 ml-1">({globalData.bestStreak})</span>
              </div>
            </div>

            <div className="glass p-8 rounded-2xl shadow-2xl w-full border border-white/10 text-center relative overflow-hidden">
               {isFocus && <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>}
               
               <div className="text-2xl md:text-3xl font-black text-white mb-8 mt-4 font-serif px-6 py-4 bg-white/5 inline-block rounded-2xl border border-white/10 drop-shadow-lg shadow-inner">
                 « {(currentWord[lang] || currentWord.en).toUpperCase()} »
               </div>
               
               {mode === 'type' ? (
                 <div className="mt-4 mb-6 relative">
                   <input 
                     ref={inputRef} type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={handleKeyPress}
                     placeholder={curUI.typePlac}
                     autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="none"
                     disabled={isTransitioning}
                     className="w-full p-4 rounded-xl border-2 text-center text-xl font-bold bg-black/40 text-white outline-none transition shadow-inner focus:border-[var(--primary)] border-white/10"
                   />
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-3 mb-6">
                   {options.map(opt => {
                     let btnClass = "border border-white/20 bg-white/5 hover:bg-white/10 text-white shadow-sm";
                     if (feedback) {
                       if (opt === currentWord.fr) btnClass = "border-emerald-500 bg-emerald-500/20 text-emerald-300";
                       else if (opt === feedback.selected && feedback.status === 'error') btnClass = "border-rose-500 bg-rose-500/10 text-rose-300 opacity-50";
                       else btnClass = "border-white/5 bg-black/20 opacity-30 text-white";
                     }
                     return (
                       <button
                         key={opt}
                         disabled={isTransitioning}
                         onClick={() => handleAnswer(opt)}
                         className={`w-full p-4 rounded-xl font-bold uppercase tracking-wider transition duration-300 text-lg font-serif ${btnClass}`}
                       >
                         {opt}
                       </button>
                     );
                   })}
                 </div>
               )}

               <div className="h-10 flex items-center justify-center">
                 {feedback && (
                   <div className={`font-bold font-serif text-2xl ${feedback.status === 'success' ? 'text-emerald-400' : 'text-rose-500 animate-shake'}`}>
                     {feedback.text}
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
