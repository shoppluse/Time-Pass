const ConfettiManager = {
  trigger(count = 24) {
    const colors = ["#7c3aed", "#22d3ee", "#22c55e", "#f59e0b", "#ef4444"];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
      piece.style.animationDuration = `${1.2 + Math.random() * 1.2}s`;

      document.body.appendChild(piece);

      setTimeout(() => {
        piece.remove();
      }, 2200);
    }
  }
};
