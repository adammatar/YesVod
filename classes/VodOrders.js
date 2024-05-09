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
    const usage = this.vodRecords.reduce((acc, record) => {
        const monthYear = `${record.dateTime.getMonth() + 1}-${record.dateTime.getFullYear()}`;
        const customerMonthGenreKey = `${record.customerId}-${monthYear}-${record.genre}`;
        if (!acc[customerMonthGenreKey]) {
            acc[customerMonthGenreKey] = { customerId: record.customerId, monthYear, genre: record.genre, totalCharge: 0, itemCount: 0 };
        }
        acc[customerMonthGenreKey].totalCharge += record.price;
        acc[customerMonthGenreKey].itemCount++;
        return acc;
    }, {});

    Object.values(usage).forEach(item => {
        item.discount = 0;
        if (item.itemCount >= 3) {
            item.discount = item.totalCharge * 0.25; // 25% discount
            item.totalCharge -= item.discount;
        }
    });

    const result = Object.values(usage).map(({ customerId, monthYear, totalCharge, discount }) =>
        `${customerId},${monthYear},${totalCharge.toFixed(2)},${discount.toFixed(2)}`
    );

    console.log(result.join('\n'));
}

createSummaryReport() {
  const summary = this.vodRecords.reduce((acc, record) => {
      const monthYear = `${record.dateTime.getMonth() + 1}-${record.dateTime.getFullYear()}`;
      const genreKey = `${record.genre}-${monthYear}`;

      if (!acc[monthYear]) {
          acc[monthYear] = { monthYear, totalRevenue: 0, totalOrders: 0, totalDiscounts: 0 };
      }
      acc[monthYear].totalRevenue += record.price;
      acc[monthYear].totalOrders++;

      if (!acc[genreKey]) {
          acc[genreKey] = { count: 0, revenue: 0 };
      }
      acc[genreKey].count++;
      acc[genreKey].revenue += record.price;

      return acc;
  }, {});

  Object.values(summary).forEach(item => {
      if (item.revenue && item.count >= 3) {
          const discount = item.revenue * 0.25; // 25% discount on the accumulated genre revenue if 3 or more items were purchased
          if (summary[item.monthYear]) {
              summary[item.monthYear].totalDiscounts += discount;
              summary[item.monthYear].totalRevenue -= discount;
          }
      }
  });

  const result = Object.values(summary).filter(item => item.totalRevenue).map(({ monthYear, totalRevenue, totalOrders, totalDiscounts }) =>
      `${monthYear},${totalRevenue.toFixed(2)},${totalOrders},${totalDiscounts.toFixed(2)}`
  );

  console.log(result.join('\n'));
}

}
module.exports = VodOrders;
