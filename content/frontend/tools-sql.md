---
title: SQL
category: Tools
toc: true
---

## Data Definition

### Constraints

Define constraints on columns.

#### Primary Key

- Each row must be unique.
- Disallows NULL.
- Each table can have only one primary key.

#### Unique

- Each row must be unique.
- Allows NULL.
- Each table can have multiple unique keys.

#### Foreign Key

- Each row must belong to another column (Primary Key or Unique).
- Allows NULL.

> **Why must a Foreign Key reference a Primary Key or UNIQUE constraint?**
>
> - Avoid Ambiguity: the referenced row must be uniquely identifiable.
> - Efficient Lookups: the referenced column always have an index to allow efficient lookups on whether a referencing row has a match.

#### Check

- Each row must satisfy the predicate (TRUE or UNKNOWN).
- Allows NULL.

#### Not Null

- Disallows NULL.

> In PostgreSQL, NOT NULL is more efficient than CHECK(id IS NOT NULL).

## Data Manipulation

### Queries

The clauses are logically processed in the following order:

1. FROM
2. WHERE (Expressions -> DISTINCT)
3. GROUP BY
4. HAVING
5. SELECT
6. ORDER BY (OFFSET -> LIMIT)

> The database engine doesn't have to follow logical query processing, as long as the final result would be the same.

> **All-at-once Operations**: all expressions that appear in the same logical query processing phase are evaluated logically at the same point in time.

#### FROM

Specify a table you want to query.

```sql
SELECT *
FROM employees;
```

#### WHERE

Specify a predicate to filter the rows.

```sql
SELECT *
FROM employees
WHERE id = 1;
```

#### GROUP BY

Produces a group for each distinct combination.

```sql
SELECT city
FROM employees
GROUP BY city;
```

> All phases subsequent to the GROUP BY phase operate on groups. Each group is represented by a single row.

Elements that do not participate in the GROUP BY clause are allowed only as inputs to an [aggregate function](#aggregate-function).

```sql
SELECT city, AVG(salary)
FROM employees
GROUP BY city;
```

#### HAVING

Specify a predicate to filter the groups. Because the HAVING clause is processed after the rows have been grouped, you can refer to [aggregate function](#aggregate-function) in the HAVING filter predicate.

```sql
SELECT city
FROM employees
GROUP BY city
HAVING AVG(salary) > 20000; -- filter groups
```

#### SELECT

Specify the columns you want to return in the result table of the query.

```sql
SELECT name
FROM employees;
```

You can use asterisk to return all columns.

```sql
SELECT *
FROM employees;
```

You can use AS clause to define a column alias.

```sql
SELECT join_date AS date
FROM employees;
```

You can use DISTINCT clause to remove duplicate rows.

```sql
SELECT DISTINCT city
FROM employees;
```

#### ORDER BY

Sort the rows in certain order.

```sql
SELECT *
FROM employees
ORDER BY age;
```

You can use DESC to sort in descending order.

```sql
SELECT *
FROM employees
ORDER BY age DESC;
```

You can refer to column aliases created in the SELECT phase.

```sql
SELECT join_date AS date
FROM employees
ORDER BY date;
```

You can specify elements that do not appear in the SELECT clause.

```sql
SELECT name
FROM employees
ORDER BY age;
```

#### LIMIT OFFSET

With the LIMIT clause you indicate how many rows to filter.

```sql
SELECT id, name
FROM employees
LIMIT 5; -- return lines 1 to 5
```

With the OFFSET clause you indicate how many rows to skip.

```sql
SELECT id, name
FROM employees
LIMIT 5 OFFSET 5; -- return lines 5 to 10
```

> The rows skipped by an OFFSET clause still have to be computed inside the server, therefore a large OFFSET might be inefficient.

### Subqueries

- **Scalar Subquery**: similar to an expression.
- **Multivalued Subquery**: IN operate on a multivalued subquery.

#### Self-Contained Subqueries

Self-contained subqueries are subqueries that are independent of the tables in the outer query.

- the subquery is evaluated only once before the outer query is evaluated.

#### Correlated Subqueries

Correlated subqueries are subqueries that refer to attributes from the tables that appear in the outer query.

- the subquery cannot be invoked as a standalone query.
- the subquery is evaluated separately for each outer row in the logical query processing step in which it appears.

### Joins

#### CROSS JOIN

1. Cartesian Product

#### INNER JOIN

1. Cartesian Product
2. ON Filter

#### OUTER JOIN

1. Cartesian Product
2. ON Filter
3. Add Outer Rows

### Aggregate Functions

An aggregate function computes a single result from multiple input rows.
Such as COUNT, SUM, AVG, MIN, or MAX.

1. Context: output of the WHERE clause
2. Window: defined by the GROUP BY clause

### Window Functions

An window function computes a single result from multiple input rows.
Such as ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD.
You can also use COUNT, SUM, AVG, MIN, or MAX.

1. Context: output of the GROUP BY clause
2. Window: defined by the OVER clause

### Set Operators

Set operators are operators that combine rows from two query result sets. You can use ALL to preserve duplicates.

- UNION
- INTERSECT
- EXCEPT

## Appendix

- SQL: structured query language.
- RDBMS: relational database management system.
- Predicate: a logical expression that evaluate to TRUE, FALSE, or UNKNOWN.
