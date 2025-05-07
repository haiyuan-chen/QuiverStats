export class ScoreCalculator {
  constructor(totalSize = 122, rings = 10) {
    this.totalSize = totalSize;
    this.rings = rings;
    this.step = totalSize / (2 * rings);
  }

  // calculate(event, svgElement) {
  //   const rect = svgElement.getBoundingClientRect();
  //   const x = ((event.clientX - rect.left) / rect.width) * this.totalSize;
  //   const y = ((event.clientY - rect.top)  / rect.height) * this.totalSize;
  //   const dx = x - this.totalSize/2, dy = y - this.totalSize/2;
  //   const dist = Math.hypot(dx, dy);
  //   const raw  = Math.ceil((this.totalSize/2 - dist)/this.step);
  //   const score = Math.max(0, Math.min(this.rings, raw));
  //   return { x, y, score };
  // }

// Before: using ceil + fudge…
// After: simple floor()+1 + clamp

calculate(event, svgElement) {
    const rect = svgElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width)  * this.totalSize;
    const y = ((event.clientY - rect.top)  / rect.height) * this.totalSize;
  
    const half = this.totalSize / 2;
    const dx   = x - half;
    const dy   = y - half;
    const dist = Math.hypot(dx, dy);
  
    // raw rings away from the outside (can be negative or >rings)
    const raw = (half - dist) / this.step;
    // floor +1 gives the correct “higher‐score on boundary” behavior
    let score = Math.floor(raw) + 1;
  
    // clamp to [0, rings]
    if (score < 0)      score = 0;
    else if (score > this.rings) score = this.rings;
  
    return { x, y, score };
  }
  
}
