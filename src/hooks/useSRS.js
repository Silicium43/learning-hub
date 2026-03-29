import { useState, useEffect } from 'react';
import localforage from 'localforage';

export const SRS_INTERVALS = [
  0, // 0: Initial
  4 * 60 * 60 * 1000, // 1: Apprentice 1 (4h)
  8 * 60 * 60 * 1000, // 2: Apprentice 2 (8h)
  24 * 60 * 60 * 1000, // 3: Apprentice 3 (1d)
  2 * 24 * 60 * 60 * 1000, // 4: Apprentice 4 (2d)
  7 * 24 * 60 * 60 * 1000, // 5: Guru 1 (1w)
  14 * 24 * 60 * 60 * 1000, // 6: Guru 2 (2w)
  30 * 24 * 60 * 60 * 1000, // 7: Master (1mo)
  120 * 24 * 60 * 60 * 1000, // 8: Enlightened (4mo)
  // 9: Burned (inf)
];

// Items state model:
// { id, srsLevel: 0-9, nextReview: timestamp, isUnlocked: boolean }

export function useSRS(initialDatabase, storageKey) {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const saved = await localforage.getItem(storageKey);
      if (saved) {
        setItems(saved);
      } else {
        const init = {};
        initialDatabase.forEach(item => {
          init[item.id] = { 
            srsLevel: 0, 
            nextReview: Date.now(), 
            isUnlocked: item.defaultUnlocked || false 
          };
        });
        setItems(init);
        await localforage.setItem(storageKey, init);
      }
      setLoading(false);
    }
    load();
  }, [storageKey]);

  const save = async (newItems) => {
    setItems(newItems);
    await localforage.setItem(storageKey, newItems);
  };

  const getAvailableReviews = () => {
    const now = Date.now();
    return Object.entries(items)
      .filter(([id, data]) => data.isUnlocked && data.srsLevel < 9 && data.nextReview <= now)
      .map(([id]) => id);
  };

  const submitReview = (id, isCorrect) => {
    const prev = items[id];
    let newLevel = prev.srsLevel;

    if (isCorrect) {
      newLevel = Math.min(newLevel + 1, 9);
    } else {
      // WaniKani penalty: -1 level if < Guru, -2 levels if >= Guru
      const penalty = newLevel >= 5 ? 2 : 1;
      newLevel = Math.max(newLevel - penalty, 1);
    }

    const interval = SRS_INTERVALS[newLevel] || Infinity;
    const nextReview = Date.now() + interval;

    const newItems = { ...items, [id]: { ...prev, srsLevel: newLevel, nextReview } };
    save(newItems);
  };

  return { items, loading, getAvailableReviews, submitReview, save };
}
