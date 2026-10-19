-- Q2. How do repeat customers compare to one-time customers?
--     (Cross-checks the "74 repeat customers / $319K" cards in the Power BI report.)
-- Dialect: SQL Server (T-SQL).

WITH customer_orders AS (
    SELECT
        CustomerKey,
        COUNT(DISTINCT OrderKey)  AS Orders,
        SUM(Quantity * NetPrice)  AS Revenue
    FROM factSales
    GROUP BY CustomerKey
),
segmented AS (
    SELECT
        CustomerKey,
        Orders,
        Revenue,
        CASE WHEN Orders > 1 THEN 'Repeat' ELSE 'One-time' END AS Segment
    FROM customer_orders
)
SELECT
    Segment,
    COUNT(*)                                              AS Customers,
    SUM(Orders)                                           AS Orders,
    ROUND(SUM(Revenue), 0)                                AS Revenue,
    ROUND(SUM(Revenue) / SUM(Orders), 2)                  AS AvgOrderValue,
    ROUND(100.0 * SUM(Revenue) / SUM(SUM(Revenue)) OVER (), 1) AS PctOfTotalRevenue
FROM segmented
GROUP BY Segment
ORDER BY Revenue DESC;
