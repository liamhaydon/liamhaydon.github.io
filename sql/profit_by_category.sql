-- Which product categories are the most profitable?
SELECT
    p.CategoryName,
    SUM(s.Quantity * (s.NetPrice - s.UnitCost)) AS Profit
FROM factSales AS s
JOIN dimProduct AS p
    ON s.ProductKey = p.ProductKey
GROUP BY p.CategoryName
ORDER BY Profit DESC;
