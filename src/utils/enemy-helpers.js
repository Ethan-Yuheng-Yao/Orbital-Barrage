const getNearestEnemy = (x, y) => {
  let nearest = null;
  let best = Infinity;
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const d = dist(x, y, enemy.x, enemy.y);
    if (d < best) {
      best = d;
      nearest = enemy;
    }
  }
  return nearest;
};
