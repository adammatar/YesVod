class VodOrders {
    constructor(vodRecords) {
      this.vodRecords = vodRecords.map(record => {
          const [customerId, dateTime, genre, titleId, price] = record.split(',');
          const [date, time] = dateTime.trim().split(' ');
          const [year, month, day] = date.split('-');
          const monthNumbers = {
              JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
              JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
          };
          const normalizedMonth = monthNumbers[month] || month; // Handles cases like "04" directly
          return {
              customerId: customerId.trim(),
              dateTime: new Date(`${year}-${normalizedMonth}-${day}T${time}`),
              genre: genre.trim(),
              titleId: titleId.trim(),
              price: parseFloat(price)
          };
      });
  }


  createTotalCustomerUsage() {
    const customerUsage = this.vodRecords.reduce((acc, record) => {
        const monthYear = `${record.dateTime.getMonth() + 1}-${record.dateTime.getFullYear()}`;
        const customerKey = `${record.customerId}-${monthYear}`;
        if (!acc[customerKey]) {
            acc[customerKey] = { customerId: record.customerId, monthYear, totalCharge: 0, itemCount: 0 };
        }
        acc[customerKey].totalCharge += record.price;
        acc[customerKey].itemCount++;
        return acc;
    }, {});

    Object.values(customerUsage).forEach(item => {
        item.discount = 0;
        if (item.itemCount >= 3) {
            item.discount = item.totalCharge * 0.25; // 25% discount
            item.totalCharge -= item.discount;
        }
    });

    const result = Object.values(customerUsage).map(({ customerId, monthYear, totalCharge, discount }) =>
        `${customerId},${monthYear},${totalCharge.toFixed(2)},${discount.toFixed(2)}`
    );

    console.log(result.join('\n'));
}

createSummaryReport() {
    const summary = this.vodRecords.reduce((acc, record) => {
        const monthYear = `${record.dateTime.getMonth() + 1}-${record.dateTime.getFullYear()}`;

        if (!acc[monthYear]) {
            acc[monthYear] = { monthYear, totalRevenue: 0, totalOrders: 0, totalDiscounts: 0 };
        }
        acc[monthYear].totalRevenue += record.price;
        acc[monthYear].totalOrders++;
        return acc;
    }, {});

    Object.values(summary).forEach(monthSummary => {
        const customerOrders = this.vodRecords.filter(record => {
            const monthYear = `${record.dateTime.getMonth() + 1}-${record.dateTime.getFullYear()}`;
            return monthYear === monthSummary.monthYear;
        });

        const customerCounts = {};
        customerOrders.forEach(record => {
            if (!customerCounts[record.customerId]) {
                customerCounts[record.customerId] = 0;
            }
            customerCounts[record.customerId]++;
        });

        Object.entries(customerCounts).forEach(([customerId, orderCount]) => {
            if (orderCount >= 3) {
                const discountAmount = customerOrders.reduce((totalDiscount, record) => {
                    if (record.customerId === customerId) {
                        totalDiscount += record.price * 0.25; // 25% discount
                    }
                    return totalDiscount;
                }, 0);
                monthSummary.totalDiscounts += discountAmount;
                monthSummary.totalRevenue -= discountAmount;
            }
        });
    });

    const result = Object.values(summary).map(({ monthYear, totalRevenue, totalOrders, totalDiscounts }) =>
        `${monthYear},${totalRevenue.toFixed(2)},${totalOrders},${totalDiscounts.toFixed(2)}`
    );

    console.log(result.join('\n'));
}


  }
  module.exports = VodOrders;
