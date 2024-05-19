const VodOrders = require('./classes/VodOrders');

const vodRecords = [
    "0238383,2024-APR-01 17:54:23, COMEDY,76737227,19.90",
    "0218354,2024-04-04 12:54:23, COMEDY,87227,10.50",
    "0338363,2024-04-02 13:56:23, ACTION,67667,19.90",
    "0238322,2024-04-01 17:52:23, COMEDY,47227,30.90",
    "0218354,2024-04-01 16:51:23, DRAMA,137227,19.90",
    "0238385,2024-05-01 17:54:23, NEWS,96737227,19.90",
    "0238322,2024-04-01 17:54:23, REALITY,96737227,29.90",
    "0238383,2024-05-01 18:54:23, COMEDY,5737227,0.90",
    "0238383,2024-05-01 17:54:23, ACTION,137227,19.90",
    "0238383,2024-05-01 17:59:23, ACTION,137247,19.90",
    "0238383,2024-05-01 17:01:23, ACTION,137217,19.90"
];

const vodOrders = new VodOrders(vodRecords);

// Test Method 1 ==> createTotalCustomerUsage  :)
console.log("Testing Total Customer Usage:");
console.log("customerId,monthYear,totalCharge,discount");
vodOrders.createTotalCustomerUsage();

// Test Method 2 ==> createSummaryReport
console.log("\nTesting Summary Report:");
console.log("monthYear,totalRevenue,totalOrders,totalDiscounts");
vodOrders.createSummaryReport();
