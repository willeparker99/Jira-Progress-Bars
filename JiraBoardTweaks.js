// ==UserScript==
// @name         Jira Progress Bars
// @namespace    http://prospectsoft.com/
// @version      0.1
// @description  try to take over the world!
// @author       Pill Warker
// @match        https://prospectsoft.atlassian.net/secure/RapidBoard.jspa*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";
  addGlobalStyle(
    ".tamper-progress-bars { position: absolute; background-color: rgba(0, 180, 0, 0.3); z-index: 1; top: 0px; bottom: 0px; left: 0px; height: inherit; border-radius: 4px }"
  );
  setTimeout(addBetterProgressBars, 6000);
})();

// Adds progress bars
function addBetterProgressBars() {
  const GH = window.GH;
  const currentItems = GH.GridDataController.model.data.issues;
  let index = 0;

  const amounts = {
    "Open": 0,
    "In Progress": 0,
    "Functional Testing": 0,
    "QA Testing": 0,
    "Resolved": 0,
    "Closed": 0
  };

  for (const obj in currentItems) {
    if (currentItems[obj]) {
      amounts[currentItems[obj].statusName]++;
      index++;
    }
  }

  const headers = [];
  headers.push(...window["ghx-column-headers"].children);

  headers.forEach(e => {
    const progress = document.createElement("div");
    progress.classList.add("tamper-progress-bars");
    e.style.zIndex = "2";
    e.appendChild(progress);
  });

  headers[0].lastChild.style.width = `${((index - amounts["Open"]) /
    index) *
    100}%`;
  headers[1].lastChild.style.width = `${((index -
    amounts["In Progress"]) /
    index) *
    100}%`;
  headers[2].lastChild.style.width = `${((index -
    amounts["Functional Testing"]) /
    index) *
    100}%`;
  headers[3].lastChild.style.width = `${((amounts["QA Testing"] +
    amounts["Resolved"] +
    amounts["Closed"]) /
    index) *
    100}%`;
}
function addGlobalStyle(css) {
  const head = document.querySelector("head");
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = css;
  head.appendChild(style);
}
