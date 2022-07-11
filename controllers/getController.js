const puppeteer = require("puppeteer");

module.exports = {
  async getData(req, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/2022"
    );

    const data = await page.evaluate(() => {
      let array = [];
      let i = 0;
      let name = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => element.firstChild.lastChild.innerText
      );

      let points = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[1].innerText)
      );

      let matches = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[2].innerText)
      );

      let victories = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[3].innerText)
      );

      let draws = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[4].innerText)
      );

      let defeats = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[5].innerText)
      );

      let goalsFor = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[6].innerText)
      );

      let goalsAgainst = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[7].innerText)
      );

      let yellowCards = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[9].innerText)
      );

      let redCards = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[10].innerText)
      );

      let performance = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => parseInt(element.cells[11].innerText)
      );

      let previousResults = [];

      for (let j = 0; j < 20; j++) {
        let values = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          )[j].cells[12].children,
          (element) => {
            switch (element.innerText) {
              case "V":
                return "Victory";
              case "E":
                return "Draw";
              case "D":
                return "Defeat";
              default:
                break;
            }
          }
        );
        previousResults.push(values);
      }

      let nextMatch = Array.from(
        document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        ),
        (element) => element.cells[13].firstChild.title
      );

      while (i < 20) {
        array.push({
          position: i+1,
          name: name[i],
          points: points[i],
          matches: matches[i],
          victories: victories[i],
          draws: draws[i],
          defeats: defeats[i],
          goalsFor: goalsFor[i],
          goalsAgainst: goalsAgainst[i],
          goalsDifference: goalsFor[i] - goalsAgainst[i],
          yellowCards: yellowCards[i],
          redCards: redCards[i],
          performance: performance[i] + "%",
          previousResults: previousResults[i],
          nextMatch: nextMatch[i],
        });
        i++;
      }

      return array;
    });

    res.status(200).json(data);

    await browser.close();
  },
};
