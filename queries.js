const { MongoClient } = require("mongodb");

// Use MONGODB_URI environment variable if provided, otherwise fall back to localhost
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB server");
    const db = client.db("plp_bookstore");
    const books = db.collection("books");

    console.log("\nTASK 2: BASIC CRUD OPERATIONS");

    // 1. Find all books in a specific genre
    const fantasyBooks = await books.find({ genre: "Fantasy" }).toArray();
    console.log("Fantasy Books:", fantasyBooks);

    // 2. Find books published after a certain year
    const modernBooks = await books.find({ published_year: { $gt: 2010 } }).toArray();
    console.log("Books published after 2010:", modernBooks);

    // 3. Find books by a specific author
    const orwellBooks = await books.find({ author: "George Orwell" }).toArray();
    console.log("Books by George Orwell:", orwellBooks);

    // 4. Update the price of a specific book
    const updateResult = await books.updateOne(
      { title: "1984" },
      { $set: { price: 14.99 } }
    );
    console.log("Price update result:", updateResult.modifiedCount);

    // 5. Delete a book by its title
    const deleteResult = await books.deleteOne({ title: "The Hobbit" });
    console.log("Delete result:", deleteResult.deletedCount);


    console.log("\nTASK 3: ADVANCED QUERIES");

    // 1. Find books that are in stock AND published after 2010
    const inStockModern = await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
    console.log("In-stock books after 2010:", inStockModern);

    // 2. Projection: only return title, author, and price
    const projection = await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();
    console.log("Books with projection (title, author, price):", projection);

    // 3. Sorting: ascending by price
    const ascending = await books.find().sort({ price: 1 }).toArray();
    console.log("Books sorted by price (ascending):", ascending);

    // 4. Sorting: descending by price
    const descending = await books.find().sort({ price: -1 }).toArray();
    console.log("Books sorted by price (descending):", descending);

    // 5. Pagination: 5 books per page (example: page 2)
    const page = 2;
    const limit = 5;
    const skip = (page - 1) * limit;
    const paginated = await books.find().skip(skip).limit(limit).toArray();
    console.log(`Books page ${page} (5 per page):`, paginated);

     console.log("\nTASK 4: AGGREGATION PIPELINES");

    // 1. Average price of books by genre
    const avgPriceByGenre = await books.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
    ]).toArray();
    console.log("Average price by genre:", avgPriceByGenre);

    // 2. Author with the most books
    const topAuthor = await books.aggregate([
      { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
      { $sort: { totalBooks: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log("Author with the most books:", topAuthor);

    // 3. Group books by publication decade
    const booksByDecade = await books.aggregate([
      {
        $project: {
          decade: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] }
        }
      },
      { $group: { _id: "$decade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log("Books grouped by decade:", booksByDecade);


    console.log("\nTASK 5: INDEXING");

    // 1. Create index on title
    const titleIndex = await books.createIndex({ title: 1 });
    console.log("Index created on title:", titleIndex);

    // 2. Create compound index on author and published_year
    const compoundIndex = await books.createIndex({ author: 1, published_year: 1 });
    console.log("Compound index created on author + published_year:", compoundIndex);

    // 3. Use explain() to show performance
    const explainQuery = await books.find({ title: "1984" }).explain("executionStats");
    console.log("Explain output for title search:", JSON.stringify(explainQuery.executionStats, null, 2));


  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

run().catch(console.dir);
