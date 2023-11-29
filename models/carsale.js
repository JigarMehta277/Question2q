const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  InvoiceNo: String,
  Manufacturer: String,
  Model: String,
  Sales_in_thousands: String,
  __year_resale_value: String,
  Vehicle_type: String,
  Price_in_thousands: String,
  Engine_size: String,
  Horsepower: String,
  Wheelbase: String,
  Width: String,
  Length: String,
  Curb_weight: String,
  Fuel_capacity: String,
  Fuel_efficiency: String,
  Latest_Launch: String,
  Power_perf_factor: String,
});

module.exports =  mongoose.model('carsales', invoiceSchema,'carsales');
