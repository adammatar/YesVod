class VodOrders {
  constructor(vodRecords) {
      this.vodRecords = vodRecords.map(record => {
          const [customerId, dateTime, genre, titleId, price] = record.split(',');
          const [time, date] = dateTime.split(' ');
          const [ss, mi, hh] = time.split(':');
          const [dd, mm, yyyy] = date.split('-');
          return {
              customerId,
              dateTime: new Date(`${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`),
              genre,
              titleId,
              price: parseFloat(price)
          };
      });
  }

  createTotalCustomerUsage() {
      const summary = this.vodRecords.reduce((acc, record) => {
          const monthYear = `${record.dateTime.getMonth() + 1}-${record.dateTime.getFullYear()}`;
          const key = `${record.customerId}-${monthYear}`;
          if (!acc[key]) {
              acc[key] = { customerId: record.customerId, monthYear, totalCharge: 0 };
          }
          acc[key].totalCharge += record.price;
          return acc;
      }, {});

      const result = Object.values(summary).map(({ customerId, monthYear, totalCharge }) =>
          `${customerId},${monthYear},${totalCharge.toFixed(2)}`
      );

      console.log(result.join('\n'));
  }

  createSummaryReport() {
      const summary = this.vodRecords.reduce((acc, record) => {
          const monthYear = `${record.dateTime.getMonth() + 1}-${record.dateTime.getFullYear()}`;
          if (!acc[monthYear]) {
              acc[monthYear] = { monthYear, totalRevenue: 0, totalOrders: 0 };
          }
          acc[monthYear].totalRevenue += record.price;
          acc[monthYear].totalOrders++;
          return acc;
      }, {});

      const result = Object.values(summary).map(({ monthYear, totalRevenue, totalOrders }) =>
          `${monthYear},${totalRevenue.toFixed(2)},${totalOrders}`
      );

      console.log(result.join('\n'));
  }
}

module.exports = VodOrders;
