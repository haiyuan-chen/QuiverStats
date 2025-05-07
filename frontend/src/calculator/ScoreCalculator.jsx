export class ScoreCalculator {
    constructor(totalSize=122, rings=10) {
      this.totalSize = totalSize;
      this.rings     = rings;
      this.step      = totalSize / (2 * rings);
    }
  
    calculate(event, svgElement) {
      const rect = svgElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * this.totalSize;
      const y = ((event.clientY - rect.top)  / rect.height) * this.totalSize;
      const dx = x - this.totalSize/2, dy = y - this.totalSize/2;
      const dist = Math.hypot(dx, dy);
      const raw  = Math.ceil((this.totalSize/2 - dist)/this.step);
      const score = Math.max(0, Math.min(this.rings, raw));
      return { x, y, score };
    }
  }
  