import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

const allVocab = [
  // --- Verbs ---
  { fr: "être", en: "to be", es: "ser/estar", type: "verb" }, { fr: "avoir", en: "to have", es: "tener", type: "verb" }, { fr: "faire", en: "to do/make", es: "hacer", type: "verb" }, { fr: "dire", en: "to say", es: "decir", type: "verb" }, { fr: "aller", en: "to go", es: "ir", type: "verb" }, { fr: "voir", en: "to see", es: "ver", type: "verb" }, { fr: "savoir", en: "to know", es: "saber", type: "verb" }, { fr: "pouvoir", en: "can/to be able to", es: "poder", type: "verb" }, { fr: "vouloir", en: "to want", es: "querer", type: "verb" }, { fr: "venir", en: "to come", es: "venir", type: "verb" }, { fr: "prendre", en: "to take", es: "tomar", type: "verb" }, { fr: "croire", en: "to believe", es: "creer", type: "verb" }, { fr: "mettre", en: "to put", es: "poner", type: "verb" }, { fr: "parler", en: "to speak", es: "hablar", type: "verb" }, { fr: "manger", en: "to eat", es: "comer", type: "verb" }, { fr: "donner", en: "to give", es: "dar", type: "verb" }, { fr: "penser", en: "to think", es: "pensar", type: "verb" }, { fr: "passer", en: "to pass", es: "pasar", type: "verb" }, { fr: "regarder", en: "to look at", es: "mirar", type: "verb" }, { fr: "aimer", en: "to love/like", es: "amar/querer", type: "verb" }, { fr: "quitter", en: "to leave (a place)", es: "dejar/abandonar", type: "verb" }, { fr: "trouver", en: "to find", es: "encontrar", type: "verb" }, { fr: "rendre", en: "to return/give back", es: "devolver", type: "verb" }, { fr: "comprendre", en: "to understand", es: "comprender", type: "verb" }, { fr: "attendre", en: "to wait", es: "esperar", type: "verb" }, { fr: "sortir", en: "to go out", es: "salir", type: "verb" }, { fr: "vivre", en: "to live", es: "vivir", type: "verb" }, { fr: "entendre", en: "to hear", es: "oír", type: "verb" }, { fr: "chercher", en: "to search", es: "buscar", type: "verb" }, { fr: "travailler", en: "to work", es: "trabajar", type: "verb" }, { fr: "appeler", en: "to call", es: "llamar", type: "verb" }, { fr: "tomber", en: "to fall", es: "caer", type: "verb" }, { fr: "arriver", en: "to arrive", es: "llegar", type: "verb" }, { fr: "partir", en: "to leave/depart", es: "irse/partir", type: "verb" }, { fr: "connaître", en: "to know (somebody)", es: "conocer", type: "verb" }, { fr: "devenir", en: "to become", es: "convertirse en", type: "verb" }, { fr: "demander", en: "to ask", es: "preguntar/pedir", type: "verb" }, { fr: "acheter", en: "to buy", es: "comprar", type: "verb" }, { fr: "rester", en: "to stay", es: "quedarse", type: "verb" }, { fr: "recevoir", en: "to receive", es: "recibir", type: "verb" }, { fr: "devoir", en: "must/to have to", es: "deber", type: "verb" }, { fr: "conduire", en: "to drive", es: "conducir", type: "verb" }, { fr: "sembler", en: "to seem", es: "parecer", type: "verb" }, { fr: "tenir", en: "to hold", es: "sostener/tener", type: "verb" }, { fr: "porter", en: "to carry/wear", es: "llevar", type: "verb" }, { fr: "montrer", en: "to show", es: "mostrar", type: "verb" }, { fr: "continuer", en: "to continue", es: "continuar", type: "verb" }, { fr: "suivre", en: "to follow", es: "seguir", type: "verb" }, { fr: "commencer", en: "to begin", es: "empezar", type: "verb" }, { fr: "compter", en: "to count", es: "contar", type: "verb" }, { fr: "remettre", en: "to put back", es: "volver a poner", type: "verb" }, { fr: "permettre", en: "to allow", es: "permitir", type: "verb" }, { fr: "occuper", en: "to occupy", es: "ocupar", type: "verb" }, { fr: "décider", en: "to decide", es: "decidir", type: "verb" }, { fr: "servir", en: "to serve", es: "servir", type: "verb" }, { fr: "revenir", en: "to come back", es: "volver/regresar", type: "verb" }, { fr: "laisser", en: "to leave/let", es: "dejar", type: "verb" }, { fr: "répondre", en: "to answer", es: "responder", type: "verb" }, { fr: "rappeler", en: "to remind/recall", es: "recordar/volver a llamar", type: "verb" }, { fr: "présenter", en: "to present", es: "presentar", type: "verb" }, { fr: "accepter", en: "to accept", es: "aceptar", type: "verb" }, { fr: "agir", en: "to act", es: "actuar", type: "verb" }, { fr: "poser", en: "to pose/put down", es: "poner/plantear", type: "verb" }, { fr: "jouer", en: "to play", es: "jugar", type: "verb" }, { fr: "reconnaître", en: "to recognize", es: "reconocer", type: "verb" }, { fr: "choisir", en: "to choose", es: "elegir", type: "verb" }, { fr: "toucher", en: "to touch", es: "tocar", type: "verb" }, { fr: "retrouver", en: "to find again", es: "recuperar/encontrar", type: "verb" }, { fr: "perdre", en: "to lose", es: "perder", type: "verb" }, { fr: "expliquer", en: "to explain", es: "expliquer", type: "verb" }, { fr: "considérer", en: "to consider", es: "considerar", type: "verb" }, { fr: "ouvrir", en: "to open", es: "abrir", type: "verb" }, { fr: "gagner", en: "to win", es: "ganar", type: "verb" }, { fr: "exister", en: "to exist", es: "existir", type: "verb" }, { fr: "refuser", en: "to refuse", es: "rechazar", type: "verb" }, { fr: "lire", en: "to read", es: "leer", type: "verb" }, { fr: "réussir", en: "to succeed", es: "tener éxito", type: "verb" }, { fr: "changer", en: "to change", es: "cambiar", type: "verb" }, { fr: "représenter", en: "to represent", es: "representar", type: "verb" }, { fr: "assurer", en: "to assure", es: "assurer", type: "verb" }, { fr: "essayer", en: "to try", es: "essayer", type: "verb" }, { fr: "empêcher", en: "to prevent", es: "empêcher", type: "verb" }, { fr: "reprendre", en: "to retake", es: "reprendre", type: "verb" }, { fr: "mener", en: "to lead", es: "dirigir/llevar", type: "verb" }, { fr: "appartenir", en: "to belong", es: "pertenecer", type: "verb" },
  { fr: "aider", en: "to help", es: "ayudar", type: "verb" }, { fr: "dormir", en: "to sleep", es: "dormir", type: "verb" }, { fr: "chanter", en: "to sing", es: "cantar", type: "verb" }, { fr: "danser", en: "to dance", es: "bailar", type: "verb" }, { fr: "étudier", en: "to study", es: "estudiar", type: "verb" }, { fr: "apprendre", en: "to learn", es: "aprender", type: "verb" }, { fr: "boire", en: "to drink", es: "beber", type: "verb" }, { fr: "marcher", en: "to walk", es: "caminar", type: "verb" }, { fr: "courir", en: "to run", es: "correr", type: "verb" }, { fr: "écrire", en: "to write", es: "escribir", type: "verb" }, { fr: "écouteur", en: "to listen", es: "escuchar", type: "verb" }, { fr: "préparer", en: "to prepare", es: "preparar", type: "verb" }, { fr: "utiliser", en: "to use", es: "usar", type: "verb" }, { fr: "visiter", en: "to visit", es: "visitar", type: "verb" }, { fr: "voyager", en: "to travel", es: "viajar", type: "verb" }, { fr: "payer", en: "to pay", es: "pagar", type: "verb" }, { fr: "vendre", en: "to sell", es: "vender", type: "verb" }, { fr: "offrir", en: "to offer", es: "ofrecer", type: "verb" }, { fr: "oublier", en: "to forget", es: "olvidar", type: "verb" }, { fr: "rencontrer", en: "to meet", es: "conocer/encontrar", type: "verb" }, { fr: "partager", en: "to share", es: "compartir", type: "verb" }, { fr: "espérer", en: "to hope", es: "esperar", type: "verb" }, { fr: "fermer", en: "to close", es: "cerrar", type: "verb" },
  { fr: "sauter", en: "to jump", es: "saltar", type: "verb" }, { fr: "nager", en: "to swim", es: "nadar", type: "verb" }, { fr: "voler", en: "to fly/steal", es: "volar/robar", type: "verb" }, { fr: "dessiner", en: "to draw", es: "dibujar", type: "verb" }, { fr: "peindre", en: "to paint", es: "pintar", type: "verb" }, { fr: "crier", en: "to shout", es: "gritar", type: "verb" }, { fr: "chuchoter", en: "to whisper", es: "susurrar", type: "verb" }, { fr: "raconter", en: "to tell (a story)", es: "contar", type: "verb" }, { fr: "promettre", en: "to promise", es: "prometer", type: "verb" }, { fr: "mentir", en: "to lie", es: "mentir", type: "verb" }, { fr: "se souvenir", en: "to remember", es: "recordar", type: "verb" }, { fr: "imaginer", en: "to imagine", es: "imaginar", type: "verb" }, { fr: "supposer", en: "to suppose", es: "suponer", type: "verb" }, { fr: "organiser", en: "to organize", es: "organizar", type: "verb" }, { fr: "construire", en: "to build", es: "construir", type: "verb" }, { fr: "réparer", en: "to repair", es: "reparar", type: "verb" }, { fr: "nettoyer", en: "to clean", es: "limpiar", type: "verb" }, { fr: "envoyer", en: "to send", es: "enviar", type: "verb" }, { fr: "allumer", en: "to turn on", es: "encender", type: "verb" }, { fr: "éteindre", en: "to turn off", es: "apagar", type: "verb" }, { fr: "entrer", en: "to enter", es: "entrar", type: "verb" }, { fr: "casser", en: "to break", es: "romper", type: "verb" }, { fr: "couper", en: "to cut", es: "cortar", type: "verb" }, { fr: "cuisiner", en: "to cook", es: "cocinar", type: "verb" }, { fr: "brûler", en: "to burn", es: "quemar", type: "verb" }, { fr: "mordre", en: "to bite", es: "morder", type: "verb" }, { fr: "pousser", en: "to push", es: "empujar", type: "verb" }, { fr: "tirer", en: "to pull", es: "tirar/jalar", type: "verb" }, { fr: "frapper", en: "to hit", es: "golpear", type: "verb" }, { fr: "pleurer", en: "to cry", es: "llorar", type: "verb" }, { fr: "rire", en: "to laugh", es: "reír", type: "verb" }, { fr: "sourire", en: "to smile", es: "sonreír", type: "verb" }, { fr: "réveiller", en: "to wake up", es: "despertar", type: "verb" }, { fr: "habiller", en: "to dress", es: "vestir", type: "verb" }, { fr: "laver", en: "to wash", es: "lavar", type: "verb" }, { fr: "prêter", en: "to lend", es: "prestar", type: "verb" }, { fr: "emprunter", en: "to borrow", es: "pedir prestado", type: "verb" }, { fr: "finir", en: "to finish", es: "terminar", type: "verb" },

  // --- Nouns ---
  { fr: "la maison", en: "the house", es: "la casa", type: "noun" }, { fr: "la chambre", en: "the bedroom", es: "la habitación", type: "noun" }, { fr: "la cuisine", en: "the kitchen", es: "la cocina", type: "noun" }, { fr: "le salon", en: "the living room", es: "el salón", type: "noun" }, { fr: "la salle de bain", en: "the bathroom", es: "el baño", type: "noun" }, { fr: "la porte", en: "the door", es: "la puerta", type: "noun" }, { fr: "la fenêtre", en: "the window", es: "la ventana", type: "noun" }, { fr: "le lit", en: "the bed", es: "la cama", type: "noun" }, { fr: "la table", en: "the table", es: "la mesa", type: "noun" }, { fr: "la chaise", en: "the chair", es: "la silla", type: "noun" }, { fr: "le jardin", en: "the garden", es: "el jardín", type: "noun" },
  { fr: "le pain", en: "the bread", es: "el pan", type: "noun" }, { fr: "l'eau", en: "the water", es: "el agua", type: "noun" }, { fr: "le fromage", en: "the cheese", es: "el queso", type: "noun" }, { fr: "le vin", en: "the wine", es: "el vino", type: "noun" }, { fr: "le café", en: "the coffee", es: "el café", type: "noun" }, { fr: "le thé", en: "the tea", es: "el té", type: "noun" }, { fr: "le petit-déjeuner", en: "the breakfast", es: "el desayuno", type: "noun" }, { fr: "le déjeuner", en: "the lunch", es: "el almuerzo", type: "noun" }, { fr: "le dîner", en: "the dinner", es: "la cena", type: "noun" }, { fr: "les fruits", en: "the fruits", es: "las frutas", type: "noun" }, { fr: "les légumes", en: "the vegetables", es: "las verduras", type: "noun" }, { fr: "la viande", en: "the meat", es: "la carne", type: "noun" }, { fr: "le poisson", en: "the fish", es: "el pescado", type: "noun" }, { fr: "le sucre", en: "the sugar", es: "el azúcar", type: "noun" }, { fr: "le sel", en: "the salt", es: "la sal", type: "noun" },
  { fr: "la ville", en: "the city", es: "la ciudad", type: "noun" }, { fr: "la rue", en: "the street", es: "la calle", type: "noun" }, { fr: "la voiture", en: "the car", es: "el coche", type: "noun" }, { fr: "le vélo", en: "the bicycle", es: "la bicicleta", type: "noun" }, { fr: "le train", en: "the train", es: "el tren", type: "noun" }, { fr: "l'avion", en: "the airplane", es: "el avión", type: "noun" }, { fr: "le bateau", en: "the boat", es: "el barco", type: "noun" }, { fr: "le sac", en: "the bag", es: "el bolso/saco", type: "noun" }, { fr: "le billet", en: "the ticket", es: "el boleto", type: "noun" }, { fr: "l'hôtel", en: "the hotel", es: "el hotel", type: "noun" }, { fr: "le restaurant", en: "the restaurant", es: "el restaurante", type: "noun" }, { fr: "le magasin", en: "the shop", es: "la tienda", type: "noun" }, { fr: "la plage", en: "the beach", es: "la playa", type: "noun" }, { fr: "la montagne", en: "the mountain", es: "la montaña", type: "noun" },
  { fr: "le temps", en: "the time/weather", es: "el tiempo", type: "noun" }, { fr: "la main", en: "the hand", es: "la mano", type: "noun" }, { fr: "le pied", en: "the foot", es: "el pie", type: "noun" }, { fr: "la tête", en: "the head", es: "la cabeza", type: "noun" }, { fr: "l'œil", en: "the eye", es: "el ojo", type: "noun" }, { fr: "la bouche", en: "the mouth", es: "la boca", type: "noun" }, { fr: "le bras", en: "the arm", es: "el brazo", type: "noun" }, { fr: "le cœur", en: "the heart", es: "el corazón", type: "noun" }, { fr: "le corps", en: "the body", es: "el cuerpo", type: "noun" }, { fr: "le monde", en: "the world", es: "el mundo", type: "noun" }, { fr: "la vie", en: "the life", es: "la vida", type: "noun" }, { fr: "l'homme", en: "the man", es: "el hombre", type: "noun" }, { fr: "la femme", en: "the woman", es: "la mujer", type: "noun" }, { fr: "l'enfant", en: "the child", es: "el niño/niña", type: "noun" }, { fr: "la family", en: "the family", es: "la familia", type: "noun" }, { fr: "le père", en: "the father", es: "el padre", type: "noun" }, { fr: "la mère", en: "the mother", es: "la madre", type: "noun" }, { fr: "le frère", en: "the brother", es: "el hermano", type: "noun" }, { fr: "la sœur", en: "the sister", es: "la hermana", type: "noun" }, { fr: "le travail", en: "the work", es: "el trabajo", type: "noun" }, { fr: "l'école", en: "the school", es: "la escuela", type: "noun" }, { fr: "le livre", en: "the book", es: "el libro", type: "noun" }, { fr: "le ciel", en: "the sky", es: "el cielo", type: "noun" }, { fr: "la terre", en: "the earth", es: "la tierra", type: "noun" }, { fr: "le soleil", en: "the sun", es: "el sol", type: "noun" }, { fr: "la lune", en: "the moon", es: "la luna", type: "noun" }, { fr: "l'argent", en: "the money/silver", es: "el dinero", type: "noun" }, { fr: "la peur", en: "the fear", es: "el miedo", type: "noun" }, { fr: "la joie", en: "the joy", es: "la alegría", type: "noun" }, { fr: "le rêve", en: "the dream", es: "el sueño", type: "noun" },
  { fr: "la pomme", en: "the apple", es: "la manzana", type: "noun" }, { fr: "la banane", en: "the banana", es: "el plátano", type: "noun" }, { fr: "l'orange", en: "the orange", es: "la naranja", type: "noun" }, { fr: "la fraise", en: "the strawberry", es: "la fresa", type: "noun" }, { fr: "la tomate", en: "the tomato", es: "el tomate", type: "noun" }, { fr: "la carotte", en: "the carrot", es: "la zanahoria", type: "noun" }, { fr: "l'oignon", en: "the onion", es: "la cebolla", type: "noun" }, { fr: "l'ail", en: "the garlic", es: "el ajo", type: "noun" }, { fr: "le riz", en: "the rice", es: "el arroz", type: "noun" }, { fr: "les pâtes", en: "the pasta", es: "la pasta", type: "noun" }, { fr: "le stylo", en: "the pen", es: "el bolígrafo", type: "noun" }, { fr: "le papier", en: "the paper", es: "el papel", type: "noun" }, { fr: "le téléphone", en: "the phone", es: "el teléfono", type: "noun" }, { fr: "l'ordinateur", en: "the computer", es: "el ordenador", type: "noun" }, { fr: "la clé", en: "the key", es: "la llave", type: "noun" }, { fr: "la montre", en: "the watch", es: "el reloj", type: "noun" }, { fr: "les lunettes", en: "the glasses", es: "las gafas", type: "noun" }, { fr: "le miroir", en: "the mirror", es: "el espejo", type: "noun" }, { fr: "le parc", en: "the park", es: "el parque", type: "noun" }, { fr: "la bibliothèque", en: "the library", es: "la biblioteca", type: "noun" }, { fr: "le cinéma", en: "the cinema", es: "el cine", type: "noun" }, { fr: "la pharmacie", en: "the pharmacy", es: "la farmacia", type: "noun" }, { fr: "la banque", en: "the bank", es: "el banco", type: "noun" }, { fr: "l'hôpital", en: "the hospital", es: "el hospital", type: "noun" }, { fr: "l'aéroport", en: "the airport", es: "el aeropuerto", type: "noun" }, { fr: "la gare", en: "the station", es: "la estación", type: "noun" }, { fr: "la fleur", en: "the flower", es: "la flor", type: "noun" }, { fr: "l'arbre", en: "the tree", es: "el árbol", type: "noun" }, { fr: "la rivière", en: "the river", es: "el río", type: "noun" }, { fr: "le lac", en: "the lake", es: "el lago", type: "noun" }, { fr: "la mer", en: "the sea", es: "el mar", type: "noun" }, { fr: "le vent", en: "the wind", es: "el viento", type: "noun" }, { fr: "la pluie", en: "the rain", es: "la lluvia", type: "noun" }, { fr: "la neige", en: "the snow", es: "la nieve", type: "noun" }, { fr: "le nuage", en: "the cloud", es: "la nube", type: "noun" }, { fr: "le chien", en: "the dog", es: "el perro", type: "noun" }, { fr: "le chat", en: "the cat", es: "el gato", type: "noun" }, { fr: "le cheval", en: "the horse", es: "el caballo", type: "noun" }, { fr: "l'oiseau", en: "the bird", es: "el pájaro", type: "noun" }, { fr: "le lion", en: "the lion", es: "el león", type: "noun" }, { fr: "l'ours", en: "the bear", es: "el oso", type: "noun" }, { fr: "le canard", en: "the duck", es: "el pato", type: "noun" }, { fr: "l'étoile", en: "the star", es: "la estrella", type: "noun" }, { fr: "le cadeau", en: "the gift", es: "el regalo", type: "noun" }, { fr: "la fête", en: "the party", es: "la fiesta", type: "noun" }, { fr: "le voyage", en: "the trip", es: "el viaje", type: "noun" }, { fr: "la musique", en: "the music", es: "la música", type: "noun" }, { fr: "le film", en: "the movie", es: "la película", type: "noun" },

  // --- Adjectives ---
  { fr: "grand", en: "big/tall", es: "grande", type: "adj" }, { fr: "petit", en: "small", es: "pequeño", type: "adj" }, { fr: "bon", en: "good", es: "bueno", type: "adj" }, { fr: "mauvais", en: "bad", es: "malo", type: "adj" }, { fr: "beau", en: "beautiful", es: "hermoso", type: "adj" }, { fr: "nouveau", en: "new", es: "nuevo", type: "adj" }, { fr: "vieux", en: "old", es: "viejo", type: "adj" }, { fr: "chaud", en: "hot", es: "caliente", type: "adj" }, { fr: "froid", en: "cold", es: "frío", type: "adj" }, { fr: "rapide", en: "fast", es: "rápido", type: "adj" }, { fr: "lent", en: "slow", es: "lento", type: "adj" }, { fr: "heureux", en: "happy", es: "feliz", type: "adj" }, { fr: "triste", en: "sad", es: "triste", type: "adj" }, { fr: "difficile", en: "difficult", es: "difícil", type: "adj" }, { fr: "facile", en: "easy", es: "fácil", type: "adj" }, { fr: "propre", en: "clean", es: "limpio", type: "adj" }, { fr: "sale", en: "dirty", es: "sucio", type: "adj" }, { fr: "cher", en: "expensive", es: "caro", type: "adj" }, { fr: "large", en: "wide", es: "ancho", type: "adj" }, { fr: "étroit", en: "narrow", es: "estrecho", type: "adj" }, { fr: "fort", en: "strong", es: "fuerte", type: "adj" }, { fr: "faible", en: "weak", es: "débil", type: "adj" }, { fr: "jeune", en: "young", es: "joven", type: "adj" }, { fr: "gras", en: "fat", es: "gordo", type: "adj" }, { fr: "maigre", en: "thin", es: "delgado", type: "adj" }, { fr: "riche", en: "rich", es: "rico", type: "adj" }, { fr: "pauvre", en: "poor", es: "pobre", type: "adj" }, { fr: "vide", en: "empty", es: "vacío", type: "adj" }, { fr: "plein", en: "full", es: "lleno", type: "adj" }, { fr: "noir", en: "black", es: "negro", type: "adj" }, { fr: "blanc", en: "white", es: "blanco", type: "adj" }, { fr: "rouge", en: "red", es: "rojo", type: "adj" }, { fr: "bleu", en: "blue", es: "azul", type: "adj" }, { fr: "vert", en: "green", es: "verde", type: "adj" }, { fr: "jaune", en: "yellow", es: "amarillo", type: "adj" },

  // --- Time & Phrases ---
  { fr: "aujourd'hui", en: "today", es: "hoy", type: "phrase" }, { fr: "demain", en: "tomorrow", es: "mañana", type: "phrase" }, { fr: "hier", en: "yesterday", es: "ayer", type: "phrase" }, { fr: "maintenant", en: "now", es: "ahora", type: "phrase" }, { fr: "toujours", en: "always", es: "siempre", type: "phrase" }, { fr: "souvent", en: "often", es: "a menudo", type: "phrase" }, { fr: "parfois", en: "sometimes", es: "a veces", type: "phrase" }, { fr: "jamais", en: "never", es: "nunca", type: "phrase" }, { fr: "trop", en: "too much", es: "demasiado", type: "phrase" }, { fr: "beaucoup", en: "a lot", es: "mucho", type: "phrase" }, { fr: "un peu", en: "a little", es: "un poco", type: "phrase" }, { fr: "ici", en: "here", es: "aquí", type: "phrase" }, { fr: "là-bas", en: "over there", es: "allí", type: "phrase" }, { fr: "ensemble", en: "together", es: "juntos", type: "phrase" }, { fr: "seul", en: "alone", es: "solo", type: "phrase" }
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
      const typePool = allVocab.filter(v => v.type === nextW.type && v.fr !== nextW.fr);
      
      while (opts.length < 4 && typePool.length >= 3) {
        let rW = typePool[Math.floor(Math.random() * typePool.length)].fr;
        if (!opts.includes(rW)) opts.push(rW);
      }
      
      // Fallback if not enough of same type
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
