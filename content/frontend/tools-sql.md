---
title: SQL
group: Tools
toc: true
---

## Data Definition

### Constraints

Define constraints on columns.

#### Primary Key

- Each row must be unique.
- Disallows NULL.
- Each table can have only one primary key.

> RDBMS will create a unique index to enforce uniqueness.

#### Unique

- Each row must be unique.
- Allows multiple NULLs.
- Each table can have multiple unique keys.

> RDBMS will create a unique index to enforce uniqueness.

#### Foreign Key

- Each row must belong to another column (Primary Key or Unique).
- Allows NULL.

> **Why must reference a Primary Key or UNIQUE constraint?**\
> Avoid Ambiguity: the referenced row must be uniquely identifiable.

#### Check

- Each row must satisfy the predicate (TRUE or UNKNOWN).
- Allows NULL.

#### Not Null

- Disallows NULL.

### CREATE

```sql
CREATE TABLE animals (
    id INTEGER PRIMARY KEY,
    name TEXT
);
```

### INSERT

```sql
INSERT INTO animals VALUES
(1, 'A'),
(2, 'B');
```

### DROP

```sql
DROP TABLE animals;
```

## Data Manipulation

### Queries

The clauses are logically processed in the following order:

1. FROM
2. WHERE
3. GROUP BY
4. HAVING
5. SELECT
   - Expressions
   - DISTINCT
6. ORDER BY
   - OFFSET
   - LIMIT

> The database engine doesn't have to follow logical query processing, as long as the final result would be the same.

> **All-at-once Operations**: expressions evaluated at the same phase are unordered.

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

> The WHERE clause can use indexes to improve query performance.

#### GROUP BY

Groups rows by specified columns.

```sql
SELECT city
FROM employees
GROUP BY city;
```

> All phases subsequent to the GROUP BY phase operate on groups. Each group is represented by a single row.

Elements that do not participate in the GROUP BY clause are allowed only as inputs to an [aggregate function](#aggregate-functions).

```sql
SELECT city, AVG(salary)
FROM employees
GROUP BY city;
```

#### HAVING

Specify a predicate to filter the groups. Because the HAVING clause is processed after the rows have been grouped, you can refer to [aggregate function](#aggregate-functions) in the HAVING filter predicate.

```sql
SELECT city
FROM employees
GROUP BY city
HAVING AVG(salary) > 20000;
```

#### SELECT

Specify the columns you want to return.

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

> DISTINCT does not retain columns that are not included in the SELECT list.

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
LIMIT 5 OFFSET 5; -- return lines 6 to 10
```

> The rows skipped by an OFFSET clause still have to be computed inside the server, therefore a large OFFSET might be inefficient.

### Subqueries

A subquery can return a single value, multiple values, or a table.

#### Self-Contained Subqueries

- Has no dependency on tables from the outer query.
- Evaluated only once.

#### Correlated Subqueries

- Has dependency on tables from the outer query.
- Evaluated separately for each outer row.

### Joins

#### CROSS JOIN

1. Cartesian Product

#### INNER JOIN

1. Cartesian Product
2. Filter Rows

#### OUTER JOIN

1. Cartesian Product
2. Filter Rows
3. Add Outer Rows

#### LATERAL

The right table can reference columns from the left table.

### Table Expressions

#### Derived Tables

A subquery that returns a table.

```sql
SELECT *
FROM (<query>);
```

#### Common Table Expressions (CTEs)

Has a different namespace from Derived Tables.

```sql
WITH students AS (
   <query>
)
<query>
```

CTEs support recursion.

```sql
WITH RECURSIVE students AS (
   <query> -- invoked only once
   UNION ALL
   <query> -- invoked repeatedly until it returns an empty set
)
<query>
```

#### Views

A query stored in the database.

#### Inline table-valued functions (TVFs)

Similar to a View with parameters.

### Aggregate Functions

An aggregate function computes a single result from multiple input rows.
Such as COUNT, SUM, AVG, MIN, or MAX.

1. Context: output of the WHERE clause
2. Window: defined by the GROUP BY clause

### Window Functions

An window function computes a single result from multiple input rows.
Such as ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, COUNT, SUM, AVG, MIN, or MAX.

1. Context: output of the HAVING clause
2. Window: defined by the OVER clause
   - PARTITION BY: define group
   - ORDER BY: define ordering
   - ROWS BETWEEN AND: filter frame

### Set Operators

Combine rows from two query result. You can use ALL to preserve duplicates.

|                                      | Deduplicate | Result |
| ------------------------------------ | ----------- | ------ |
| UNION, INTERSECT, EXCEPT             | Yes         | Set    |
| UNION ALL, INTERSECT ALL, EXCEPT ALL | No          | Bag    |

> NULL is treated like non-NULL values.

## Appendix

- SQL: structured query language.
- RDBMS: relational database management system.
- Predicate: a logical expression that evaluate to TRUE, FALSE, or UNKNOWN.
- NULL: not a value but rather a marker for a missing value.
- Table: unordered set of rows.
- Cursor: ordered set of rows.
