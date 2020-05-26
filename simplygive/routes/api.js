const express = require("express");
// https://expressjs.com/en/guide/routing.html#express-router
const router = express.Router();
const { sqlFetch } = require("./utils/utils");

function getPageAndCount(usersPage, usersCount, totalItems) {
  let page, count;
  if (!usersPage) {
    page = 1;
  } else {
    // parse the string as a decimal (Base 10) number
    page = parseInt(usersPage, 10);
    if (Number.isNaN(page)) {
      page = 1;
    }
  }
  if (!usersCount) {
    count = 6;
  } else {
    // parse the string as a decimal (Base 10) number
    count = parseInt(usersCount, 10);
    if (Number.isNaN(page)) {
      count = 6;
    }
  }
  var pageNum = Math.ceil(totalItems / count);
  // Set the max count can be to totalItems
  count = Math.min(totalItems, count);
  // Set the min count can be to 1
  count = Math.max(1, count);
  // Set the max page can be to pageNum
  page = Math.min(pageNum, page);
  // Set the min page can be to 1
  page = Math.max(1, page);
  return [page, count];
}

router.get("/products", async (req, res) => {
  const allProductsCount = await sqlFetch`
			SELECT COUNT(id) as count
		 	FROM products
     `;
  const findAllCount = allProductsCount[0].count;
  let [page, count] = getPageAndCount(
    req.query.page,
    req.query.count,
    // get first row of returned results
    findAllCount
  );
  const offset = count * (page - 1);
  const products = await sqlFetch`
    SELECT *
    FROM products
    `;
    // ORDER BY id
    // OFFSET ${offset} ROWS
    // FETCH NEXT ${count} ROWS ONLY
  res.json({
    products: products,
    count: findAllCount,
    pageNum: Math.ceil(findAllCount / count)
  });
});

router.get("/people", async (req, res) => {
  const user = req.user
  if (user) {
    const allPeopleCount = await sqlFetch`
        SELECT COUNT(id) as count
        FROM people
        WHERE userEmail = ${user.email}
      `;
    const findAllCount = allPeopleCount[0].count;
    let [page, count] = getPageAndCount(
      req.query.page,
      req.query.count,
      // get first row of returned results
      findAllCount
    );
    const offset = count * (page - 1);
    const people = await sqlFetch`
      SELECT *
      FROM people
      WHERE userEmail = ${user.email}
      ORDER BY id
      OFFSET ${offset} ROWS
      FETCH NEXT ${count} ROWS ONLY
      `;
    res.json({
      people: people,
      count: findAllCount,
      pageNum: Math.ceil(findAllCount / count)
    });
  }
  else {
    return null
  }
});

router.get("/me", async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({
      error: "You are not logged in!"
    });
  } else {
    res.json({
      me: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      }
    });
  }
});

module.exports = router;