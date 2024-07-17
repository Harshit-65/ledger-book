const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

// routes
app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    if (err) throw err;
    res.render("home", { files: files });
  });
});

app.get("/create", function (req, res) {
  res.render("create");
});

app.post("/create", function (req, res) {
  const content = req.body.text;
  console.log(content);
  //* current date
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = now.getFullYear();

  const fileName = `${day}-${month}-${year}.txt`;

  fs.writeFile(`./files/${fileName}`, content, function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/edit/:filename", function (req, res) {
  const filename = req.params.filename;

  fs.readFile(`./files/${filename}`, "utf8", function (err, data) {
    if (err) throw err;
    console.log(data);
    res.render("edit", { filename: filename, text: data });
  });
});

app.post("/update/:filename", function (req, res) {
  const filename = req.params.filename;
  const content = req.body.text;
  fs.writeFile(`./files/${filename}`, content, function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/delete/:filename", function (req, res) {
  const filename = req.params.filename;
  fs.unlink(`./files/${filename}`, function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});
