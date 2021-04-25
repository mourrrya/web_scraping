const request = require("request-promise");
const cheerio = require("cheerio");
const JSON2CSV = require("json2csv").Parser;
const fs = require("fs");

let imbdData = [];
const movies = [
  "https://www.imdb.com/title/tt7888964/?ref_=hm_cht_1",
  "https://www.imdb.com/title/tt0242518/?ref_=tt_sims_tt",
  "https://www.imdb.com/title/tt5034838/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=ea4e08e1-c8a3-47b5-ac3a-75026647c16e&pf_rd_r=6TN8P78QGECZZR9Z6QNJ&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=moviemeter&ref_=chtmvm_tt_3",
  "https://www.imdb.com/title/tt0068646/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=ZRVRXZWVW3ZQ83HM0W7S&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_2",
  "https://www.imdb.com/title/tt0118799/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=YKB1M7FR7N7QHWWFY9X0&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_21",
];
// const movie = "https://www.imdb.com/title/tt0242518/?ref_=tt_sims_tt";

(async () => {
  movies.forEach(async (movie) => {
    const response = await request({
      url: movie,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,bn;q=0.6",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);
    const movieTitle = $('div[class="title_wrapper"] > h1').text().trim();
    const ratting = $('div[class="ratingValue"] > strong > span').text().trim();
    const summary = $('div[class="summary_text"]').text().trim();
    const releaseDate = $('a[title="See more release dates"]').text().trim();

    imbdData.push({
      movieTitle,
      ratting,
      summary,
      releaseDate,
    });
    const jsonMovie = JSON.stringify({ movies: [...imbdData] });
    fs.writeFileSync("movies.json", jsonMovie);
  });
})();
