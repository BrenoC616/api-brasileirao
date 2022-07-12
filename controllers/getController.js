const puppeteer = require("puppeteer");

module.exports = {
  async getData(req, res) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();

      await page.goto(
        `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/2022`
      );

      const data = await page.evaluate(() => {
        const clubsNodeList = document.querySelectorAll(
          "#app > #menu-panel > article table .expand-trigger"
        );

        const clubsStats = [...clubsNodeList];

        let object = {};

        clubsStats.map((club, index) => {
          const prevHTMLcollection = club.cells[12].children;
          const previousResultsArray = [...prevHTMLcollection];

          object[index + 1] = {
            position: index + 1,
            name: club.cells[0].children[4].innerText,
            points: parseInt(club.cells[1].innerText),
            matches: parseInt(club.cells[2].innerText),
            victories: parseInt(club.cells[3].innerText),
            draws: parseInt(club.cells[4].innerText),
            defeats: parseInt(club.cells[5].innerText),
            goalsFor: parseInt(club.cells[6].innerText),
            goalsAgainst: parseInt(club.cells[7].innerText),
            goalsDifference: parseInt(club.cells[8].innerText),
            yellowCards: parseInt(club.cells[9].innerText),
            redCards: parseInt(club.cells[10].innerText),
            performance: club.cells[11].innerText + "%",
            previousResults: previousResultsArray.map((element) => {
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
            }),
            nextMatch: club.cells[13].firstChild.title,
          };
        });

        return object;
      });

      res.status(200).json(data);

      await browser.close();
    } catch (error) {
      res.status(400).json({ message: "Bad Request", error: error.message });
    }
  },
};
