-- Q3. How have monthly sales and profit changed from 2021 to 2024?
--     Year-over-year growth for each month, plus a year-to-date running total.
-- Dialect: SQL Server (T-SQL).

WITH monthly AS (
    SELECT
        YEAR(OrderDate)                         AS OrderYear,
        MONTH(OrderDate)                        AS OrderMonth,
        SUM(Quantity * NetPrice)                AS Revenue,
        SUM(Quantity * (NetPrice - UnitCost))   AS Profit
    FROM factSales
    WHERE OrderDate >= '2021-01-01' AND OrderDate < '2025-01-01'
    GROUP BY YEAR(OrderDate), MONTH(OrderDate)
),
with_prior AS (
    SELECT
        *,
        LAG(Revenue) OVER (PARTITION BY OrderMonth ORDER BY OrderYear) AS RevenueLastYear
    FROM monthly
)
SELECT
    OrderYear,
    OrderMonth,
    ROUND(Revenue, 0)                                              AS Revenue,
    ROUND(Profit, 0)                                               AS Profit,
    ROUND(100.0 * Profit / Revenue, 1)                             AS MarginPct,
    ROUND(100.0 * (Revenue - RevenueLastYear)
                / NULLIF(RevenueLastYear, 0), 1)                   AS YoYGrowthPct,
    ROUND(SUM(Revenue) OVER (PARTITION BY OrderYear
                             ORDER BY OrderMonth
                             ROWS UNBOUNDED PRECEDING), 0)         AS YTDRevenue
FROM with_prior
ORDER BY OrderYear, OrderMonth;
