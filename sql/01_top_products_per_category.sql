-- Q1. What are our top 3 products by revenue in each category,
--     and how much of their category do they account for?
-- Dialect: SQL Server (T-SQL). Revenue is in USD (Quantity * NetPrice).

WITH product_revenue AS (
    SELECT
        p.CategoryName,
        p.ProductName,
        SUM(s.Quantity * s.NetPrice)                AS Revenue,
        SUM(s.Quantity * (s.NetPrice - s.UnitCost)) AS Profit
    FROM factSales  AS s
    JOIN dimProduct AS p
        ON p.ProductKey = s.ProductKey
    GROUP BY p.CategoryName, p.ProductName
),
ranked AS (
    SELECT
        CategoryName,
        ProductName,
        Revenue,
        Profit,
        RANK() OVER (PARTITION BY CategoryName ORDER BY Revenue DESC) AS RankInCategory,
        SUM(Revenue) OVER (PARTITION BY CategoryName)                AS CategoryRevenue
    FROM product_revenue
)
SELECT
    CategoryName,
    RankInCategory,
    ProductName,
    ROUND(Revenue, 0)                          AS Revenue,
    ROUND(100.0 * Profit  / Revenue, 1)        AS MarginPct,
    ROUND(100.0 * Revenue / CategoryRevenue, 1) AS PctOfCategory
FROM ranked
WHERE RankInCategory <= 3
ORDER BY CategoryName, RankInCategory;
