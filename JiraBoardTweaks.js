// ==UserScript==
// @name         Jira Progress Bars
// @namespace    http://prospectsoft.com/
// @version      0.2
// @description  try to take over the world!
// @author       Pill Warker
// @match        https://prospectsoft.atlassian.net/secure/RapidBoard.jspa*
// @grant        none
// @updateURL    https://github.com/willeparker99/Jira-Progress-Bars.git
// @downloadUrl  https://github.com/willeparker99/Jira-Progress-Bars.git
// ==/UserScript==

(function() {
  (function addCustom() {
    console.log("Refreshing Header");
    const GH = window.GH;
    addGlobalStyle(
      ".tamper-progress-bars { position: absolute; z-index: 1; top: 0px; bottom: 0px; left: 0px; height: inherit; border-radius: 4px }"
    );

    const currentItems = GH.GridDataController.model.data.issues;
    let index = 0;
    const amounts = {
      "To Do": 0,
      "In Progress": 0,
      "Functional Testing": 0,
      "QA Testing": 0,
      Done: 0
    };

    for (const obj in currentItems) {
      switch (currentItems[obj].statusName) {
        case "Open":
          amounts["To Do"]++;
          break;
        case "In Progress":
          amounts["In Progress"]++;
          break;
        case "Functional Testing":
          amounts["Functional Testing"]++;
          break;
        case "QA Testing":
            amounts["QA Testing"]++
        case "Resolved":
        case "Closed":
          amounts["Done"]++;
          break;
      }
      index++;
    }
    amounts["To Do"] = ((index - amounts["To Do"]) / index) * 100;
    amounts["In Progress"] = ((index - amounts["In Progress"]) / index) * 100;
    amounts["Functional Testing"] =
      ((index - amounts["Functional Testing"]) / index) * 100;
    amounts["QA Testing"] = (amounts["QA Testing"] / index) * 100
    amounts["Done"] = (amounts["Done"] / index) * 100;

    GH.tpl.rapid.swimlane.renderColumnsHeader = function render(
      opt_data,
      opt_ignored
    ) {
      var output =
        '<div id="ghx-column-header-group" class="ghx-column-header-group' +
        (opt_data.statistics.fieldConfigured ? " ghx-has-stats" : "") +
        ' ghx-fixed"><ul id="ghx-column-headers" class="ghx-column-headers">';
      var columnList162 = opt_data.columns;
      var columnListLen162 = columnList162.length;
      let header = 0;
      for (
        var columnIndex162 = 0;
        columnIndex162 < columnListLen162;
        columnIndex162++
      ) {
        var columnData162 = columnList162[columnIndex162];
        let bar;
        if (header === 3) {
            bar = createBar(amounts["QA Testing"], 0.2) + createBar(amounts["Done"], 0.2)
        } else {
            bar = createBar(amounts[columnData162.name], 0.4)
        }
        output +=
          '<li class="ghx-column' +
          (columnData162.minBusted ? " ghx-busted ghx-busted-min" : "") +
          (columnData162.maxBusted ? " ghx-busted ghx-busted-max" : "") +
          '" data-id="' +
          soy.$$escapeHtml(columnData162.id) +
          '" ><div class="ghx-column-header-flex"><div class="ghx-column-header-flex-1"><h2 data-tooltip="' +
          soy.$$escapeHtml(columnData162.name) +
          '">' +
          soy.$$escapeHtml(columnData162.name) +
          "</h2>" +
          (opt_data.statistics.fieldConfigured
            ? GH.tpl.rapid.swimlane.renderColumnCount({ column: columnData162 })
            : "") +
          "</div>" +
          (opt_data.statistics.fieldConfigured
            ? '<div class="ghx-limits">' +
              GH.tpl.rapid.swimlane.renderColumnConstraints({
                column: columnData162
              }) +
              "</div>"
            : "") +
          `${bar}</div></li>`;
        header++;
      }
      output += '</ul><div id="ghx-swimlane-header-stalker"></div></div>';
      return output;
    };
  })();

  // Helper Functions
  function addGlobalStyle(css) {
    const head = document.querySelector("head");
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = css;
    head.appendChild(style);
  }
  function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
  }
  function createBar(amountName, alpha){
    return `<div class="tamper-progress-bars" style="width: ${
        amountName
      }%;background-color: hsla(${clamp(
        amountName,
        0,
        100
      )}, 100%, 50%, ${alpha})"></div>`;
  }
})();
