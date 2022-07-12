const puppeteer = require("puppeteer");

module.exports = {
  async getData(req, res) {
    try {
      const { year } = req.params;
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto(
        `https://www.cbf.com.br/futebol-brasileiro/competicoes/campeonato-brasileiro-serie-a/2022`
      );

      const data = await page.evaluate(() => {
        let clubsNodeList;

        2022 >= 2018
          ? (clubsNodeList = document.querySelectorAll(
              "#app > #menu-panel > article table.tabela-expandir tbody tr.expand-trigger"
            ))
          : (clubsNodeList = document.querySelectorAll(
              "#app > #menu-panel > article table.tabela-expandir tbody tr"
            ));

        const clubsStats = [...clubsNodeList];

        let object = {};

        clubsStats.map((club, index) => {
          const previousResulstsHTMLCollection =
            club.cells[12] === undefined ? "" : club.cells[12].children;
          const previousResults = [...previousResulstsHTMLCollection];

          console.log(previousResults);

          object[index + 1] = {
            position: index + 1,
            name: club.cells[0].lastChild.innerText,
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
            previousResults: previousResults.map(({ innerText }) => {
              switch (innerText) {
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
            nextMatch:
              club.cells[13] === undefined || club.cells[13].firstChild === null
                ? "Not Found"
                : club.cells[13].firstChild.title,
          };
        });

        return object;
      });

      await browser.close();

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: "Bad Request", error: error.message });
      console.error(error);
    }
  },
};
