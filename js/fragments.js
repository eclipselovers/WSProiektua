export const folder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6" name="folder"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>`;
export const leftArrow = `<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-4 w-4 absolute right-0 -bottom-0.5" name="leftArrowInCircle"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>`;

export const stringToHTML = (str) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

export const higher = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" aria-hidden="true" width="25" style="margin-right: -8px; margin-left: -3px;">
  <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 5.414V17a1 1 0 1 1-2 0V5.414L6.707 7.707a1 1 0 0 1-1.414 0z" clip-rule="evenodd"></path>
</svg>`;

export const lower = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" aria-hidden="true" width="25" style="margin-right: -8px; margin-left: -3px;">
  <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 14.586V3a1 1 0 0 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 0z" clip-rule="evenodd"></path>
</svg>`;

export const stats = `
<div id="statsWindow" class="stats-container">
  <div class="stats-header">
    <h2>Statistics</h2>
    <button id="closeStats">&times;</button>
  </div>
  <div class="stats-grid">
    <div class="stat-item">
      <span class="stat-value" id="totalTries">0</span>
      <span class="stat-label">Total tries</span>
    </div>
    <div class="stat-item">
      <span class="stat-value" id="successRate">0%</span>
      <span class="stat-label">Success rate</span>
    </div>
    <div class="stat-item">
      <span class="stat-value" id="currentStreak">0</span>
      <span class="stat-label">Current streak</span>
    </div>
    <div class="stat-item">
      <span class="stat-value" id="bestStreak">0</span>
      <span class="stat-label">Best streak</span>
    </div>
  </div>
  <button id="showDistribution">Show Guess Distribution</button>
  <div id="nextPlayer" class="next-player">
    <p>New footballer:</p>
    <span id="countdown">00:00:00</span>
  </div>
  <div class="credits">
    Web Sistemak<br>
    2025/2026 ikasturteko praktika
  </div>
</div>
`;

