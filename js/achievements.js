const AchievementManager = {
  all: [
    { id: "first_play", label: "First Launch" },
    { id: "reaction_master", label: "Reaction < 250ms" },
    { id: "memory_master", label: "Memory in ≤ 18 moves" },
    { id: "mole_hunter", label: "Mole score ≥ 15" },
    { id: "typing_fast", label: "Typing ≥ 50 WPM" },
    { id: "snake_runner", label: "Snake score ≥ 10" },
    { id: "tile_512", label: "Reach 512 in 2048" }
  ],

  getUnlocked() {
    return StorageManager.get(StorageKeys.achievements, []);
  },

  getUnlockedCount() {
    return this.getUnlocked().length;
  },

  isUnlocked(id) {
    return this.getUnlocked().includes(id);
  },

  unlock(id) {
    const unlocked = this.getUnlocked();

    if (unlocked.includes(id)) return;

    unlocked.push(id);
    StorageManager.set(StorageKeys.achievements, unlocked);

    UI.renderAchievements();
    UI.updateAchievementCount(this.getUnlockedCount());

    ConfettiManager.trigger(18);
    SoundManager.beep(880, 0.06);
  }
};
