const express = require("express");
const app = express();
const PORT = 3030;

app.get("/", (req, res) => {
    res.json({message: "წარმატებით დარესფონსდა"})
})

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

