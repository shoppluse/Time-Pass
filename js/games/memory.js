window.MemoryGame = {
  values: [],
  flipped: [],
  matched: 0,
  moves: 0,
  lock: false,

  init() {
    const emojis = ["🍎","🍌","🍇","🍒","🍉","🍋","🥝","🍓"];

    this.values = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        revealed: false,
        matched: false
      }));

    this.flipped = [];
    this.matched = 0;
    this.moves = 0;
    this.lock = false;

    this.render();
    this.updateUI();

    document.getElementById("memoryStatus").textContent = "Find all matching pairs.";
  },

  render() {
    const grid = document.getElementById("memoryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    this.values.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "memory-card";

      if (card.revealed) cardEl.classList.add("revealed");
      if (card.matched) cardEl.classList.add("matched");

      cardEl.textContent = (card.revealed || card.matched) ? card.emoji : "?";
      cardEl.addEventListener("click", () => this.flip(index));

      grid.appendChild(cardEl);
    });
  },

  flip(index) {
    if (this.lock) return;

    const card = this.values[index];
    if (card.revealed || card.matched) return;

    card.revealed = true;
    this.flipped.push(index);

    SoundManager.beep(500, 0.03);
    this.render();

    if (this.flipped.length === 2) {
      this.moves++;
      this.lock = true;

      const [firstIndex, secondIndex] = this.flipped;
      const first = this.values[firstIndex];
      const second = this.values[secondIndex];

      if (first.emoji === second.emoji) {
        first.matched = true;
        second.matched = true;
        this.matched++;
        this.flipped = [];
        this.lock = false;

        if (this.matched === 8) {
          const best = StorageManager.getNumber(StorageKeys.memoryBest, 0);
          if (!best || this.moves < best) {
            StorageManager.set(StorageKeys.memoryBest, this.moves);
            UI.renderLeaderboard();
          }

          if (this.moves <= 18) {
            AchievementManager.unlock("memory_master");
          }

          document.getElementById("memoryStatus").textContent = `Excellent! Completed in ${this.moves} moves.`;
          ConfettiManager.trigger(20);
        } else {
          document.getElementById("memoryStatus").textContent = "Match found! Keep going.";
        }

        this.render();
        this.updateUI();
      } else {
        document.getElementById("memoryStatus").textContent = "Not a match. Try again.";

        setTimeout(() => {
          first.revealed = false;
          second.revealed = false;
          this.flipped = [];
          this.lock = false;

          this.render();
          this.updateUI();
        }, 800);

        this.updateUI();
      }
    }
  },

  updateUI() {
    document.getElementById("memoryMoves").textContent = this.moves;
    document.getElementById("memoryMatches").textContent = this.matched;
  }
};
