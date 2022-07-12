const puppeteer = require("puppeteer");

module.exports = {
  async getData(req, res) {
    //const { serie } = req.params;
    //const series = ["a", "b", "c"];
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();

      //if (series.includes(serie)) {
      await page.goto(
        `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/2022`
      );
      //}

      const data = await page.evaluate(() => {
        const clubsNodeList = document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        );

        const clubsStats = [...clubsNodeList];

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

        let object = {};

        for (let i = 0; i < 20; i++) {
          object[i + 1] = {
            position: i + 1,
            name: clubsStats[i].cells[0].children[4].innerText,
            points: clubsStats[i].cells[1].innerText,
            matches: clubsStats[i].cells[2].innerText,
            victories: clubsStats[i].cells[3].innerText,
            draws: clubsStats[i].cells[4].innerText,
            defeats: clubsStats[i].cells[5].innerText,
            goalsFor: clubsStats[i].cells[6].innerText,
            goalsAgainst: clubsStats[i].cells[7].innerText,
            goalsDifference: clubsStats[i].cells[8].innerText,
            yellowCards: clubsStats[i].cells[9].innerText,
            redCards: clubsStats[i].cells[10].innerText,
            performance: clubsStats[i].cells[11].innerText + "%",
            previousResults: previousResults[i],
            nextMatch: clubsStats[i].cells[13].firstChild.title,
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
