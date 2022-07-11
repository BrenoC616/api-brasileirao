const puppeteer = require("puppeteer");

module.exports = {
  async getData(req, res) {
    const { serie } = req.params;
    const series = ["a", "b", "c"];
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();

      if (series.includes(serie)) {
        await page.goto(
          `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-${serie}/2022`
        );
      }

      const data = await page.evaluate(() => {
        const name = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => element.firstChild.lastChild.innerText
        );

        const points = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[1].innerText)
        );

        const matches = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[2].innerText)
        );

        const victories = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[3].innerText)
        );

        const draws = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[4].innerText)
        );

        const defeats = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[5].innerText)
        );

        const goalsFor = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[6].innerText)
        );

        const goalsAgainst = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[7].innerText)
        );

        const yellowCards = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[9].innerText)
        );

        const redCards = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[10].innerText)
        );

        const performance = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => parseInt(element.cells[11].innerText)
        );

        let previousResults = [];

        for (let j = 0; j < 20; j++) {
          const values = Array.from(
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

        const nextMatch = Array.from(
          document.querySelectorAll(
            "#app > #menu-panel > article table .expand-trigger"
          ),
          (element) => element.cells[13].firstChild.title
        );

        let object = {};

        for (let i = 0; i < 20; i++) {
          object[i + 1] = {
            position: i + 1,
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
          };
        }

        return object;
      });

      res.status(200).json(data);

      await browser.close();
    } catch (error) {
      res.status(400).json({ message: "Bad Request", error: error.message });
    }
  },
};
