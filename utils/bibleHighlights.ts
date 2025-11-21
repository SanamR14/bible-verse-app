import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "bibleHighlights";

export async function getHighlights(): Promise<string[]> {
  try {
    const saved = await AsyncStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export async function toggleHighlight(id: string) {
  const existing = await getHighlights();

  let updated: string[];

  if (existing.includes(id)) {
    updated = existing.filter((x) => x !== id);
  } else {
    updated = [...existing, id];
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
