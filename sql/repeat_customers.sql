-- Who are our repeat customers?
SELECT
    c.GivenName,
    c.Surname,
    COUNT(DISTINCT s.OrderKey)   AS Orders,
    SUM(s.Quantity * s.NetPrice) AS Revenue
FROM factSales AS s
JOIN dimCustomer AS c
    ON s.CustomerKey = c.CustomerKey
GROUP BY c.CustomerKey, c.GivenName, c.Surname
HAVING COUNT(DISTINCT s.OrderKey) > 1
ORDER BY Orders DESC, Revenue DESC;
