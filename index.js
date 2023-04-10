const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pug = require("pug");
const pdf = require("html-pdf");
const { addToMinio } = require("./minio");
const app = express();
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// res.render("Oswiadczenieskladkowe", {
//   imieINazwisko: req.body.imieINazwisko,
//   numerPESEL: req.body.numerPESEL,
//   answer: req.body.answers,
//   od: req.body.od,
//   dod: req.body.do,
//   dataZlozenia: req.body.dataZlozenia,
//   stopienNiepelnosprawnosci: req.body.stopienNiepelnosprawnosci,
// });

app.get("/oswiadczenieskladkowe", async function (req, res) {
  const compiledFunction = pug.compileFile("./views/Oswiadczenieskladkowe.pug");
  const compiledContent = compiledFunction({
    imieINazwisko: req.body.imieINazwisko,
    numerPESEL: req.body.numerPESEL,
    answer: req.body.answers,
    od: req.body.od,
    dod: req.body.do,
    dataZlozenia: req.body.dataZlozenia,
    stopienNiepelnosprawnosci: req.body.stopienNiepelnosprawnosci,
  });

  const bufferFile = await new Promise((resolve, reject) => {
    pdf.create(compiledContent).toBuffer(function (err, buffer) {
      if (err) reject(err);
      else resolve(buffer);
    });
  });
  await addToMinio(
    `oswiadczenieskladkowe/${req.body.imieINazwisko}.pdf`,
    bufferFile,
    req
  );
  res.sendStatus(200);
});

app.listen(3001, function () {
  console.log("App listening on port 3001!");
});

