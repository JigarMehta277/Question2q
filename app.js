var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
const hbs = require("hbs");
const exphbs = require("express-handlebars");
var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

app.use(express.static(path.join(__dirname, "public")));

app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

mongoose.connect(database.url);
var carsale = require("./models/carsale");

const handlebarsInstance = exphbs.create({
  allowProtoPropertiesByDefault: true,
});

// Show all invoice-info
app.get("/api/invoices", async (req, res) => {
  try {
    const invoice = await carsale.find();
    const invoices = JSON.parse(JSON.stringify(invoice));
    res.render("allData", { data: invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.send("Internal Server Error");
  }
});
//search page for invocies
app.get("/search", async (req, res) => {
  res.render("serchform");
});
// Search for invoices based on criteria
app.post("/searchdata", async (req, res) => {
  const { Manufacturer, price_in_thousands } = req.body;

  // Build a query object based on the provided criteria
  const query = {};
  if (Manufacturer) {
    query.Manufacturer = Manufacturer;
  }
  if (price_in_thousands) {
    query.price_in_thousands = price_in_thousands;
  }

  try {
    const searchResults = await carsale.find(query);

    if (searchResults.length === 0) {
      return res.json({ message: "No matching invoices found." });
    }
    const invoices = JSON.parse(JSON.stringify(searchResults));
    res.render("allData", { data: invoices });
  } catch (error) {
    console.error("Error searching for invoices:", error);
    res.send("Internal Server Error");
  }
});
//insert page for invocies
app.get("/datainsert", async (req, res) => {
  res.render("InvoicesInsert");
});
// Show a specific invoice based on _id or invoiceID
app.get("/api/invoices/:invoice_id", async (req, res) => {
  const invoiceId = req.params.invoice_id;
  try {
    const invoice = await carsale.findById(invoiceId);
    if (!invoice) {
      return res.json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    res.send("Internal Server Error");
  }
});
// Insert a new invoice
app.post("/api/invoices", async (req, res) => {
  const newInvoiceData = req.body;
  try {
    const newInvoice = await carsale.create(newInvoiceData);
    const invoice = await carsale.find();
    const invoices = JSON.parse(JSON.stringify(invoice));
    res.render("allData", { data: invoices });
  } catch (error) {
    console.error("Error creating new invoice:", error);
    res.send("Internal Server Error");
  }
});

// Delete an existing invoice based on _id or invoiceID
app.delete("/api/invoices/:invoice_id", async (req, res) => {
  const invoiceId = req.params.invoice_id;
  try {
    const deletedInvoice = await carsale.findByIdAndDelete(invoiceId);
    if (!deletedInvoice) {
      return res.json({ error: "Invoice not found" });
    }
    res.send("Successfully! Invoice has been deleted.");
  } catch (error) {
    console.error("Error deleting invoice by ID:", error);
    res.send("Internal Server Error");
  }
});

// Update "Manufacturer" & "price_in_thousands" of an existing invoice based on _id or invoiceID
app.put("/api/invoices/:invoice_id", async (req, res) => {
  const invoiceId = req.params.invoice_id;
  const { Manufacturer, price_in_thousands } = req.body;
  const updateData = { Manufacturer, price_in_thousands };

  try {
    const updatedInvoice = await carsale.findByIdAndUpdate(
      invoiceId,
      updateData,
      { new: true }
    );
    if (!updatedInvoice) {
      return res.json({ error: "Invoice not found" });
    }
    res.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice by ID:", error);
    res.send("Internal Server Error");
  }
});

app.listen(port);
console.log("App listening on port : " + port);
