import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;


const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/test-db', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json(dbRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// REGISTER USERS TO DB -------------------------------------------------------------------------------------------------------------
app.post("/createUser", async (req, res) => {
  console.log("Received user Registration Request:", {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    handicap: req.body.handicap
  });
  const { first_name, last_name, email, password, handicap } = req.body;

  try {
    // Check if the email already exists in the database
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      // Email already exists, return an error
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed_password = bcrypt.hashSync(password, 10);

    const query = `
      INSERT INTO users (first_name, last_name, email, hashed_password, handicap)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id`;
    const values = [first_name, last_name, email, hashed_password, handicap]; // Hash the password before storing it in production

    const result = await pool.query(query, values);

    res.status(201).json({ userId: result.rows[0].user_id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});
//FETCH CURRENT USER -------------------------------------------------------------------------------------------------------------
app.get("/getUserInfo", async (req, res) => {
  const { email } = req.query;

  try {
    const userQuery = `
      SELECT * 
      FROM users
      WHERE email = $1`;

    const userResult = await pool.query(userQuery, [email]);
    res.status(200).json(userResult.rows[0]);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Error fetching user info" });
  }
});

// USER LOGIN -------------------------------------------------------------------------------------------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user with the given email exists in the database
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid User credentials" });
    }

    const user = userResult.rows[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = bcrypt.compareSync(password, user.hashed_password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid User credentials" });
    }

    // Successful login
    res.status(200).json(user);
  } catch (error) {
    console.error("Error logging in User:", error);
    res.status(500).json({ error: "Error logging in User" });
  }
});

// FETCH ALL USERS  -------------------------------------------------------------------------------------------------------------
app.get("/getAllUsers", async (req, res) => {
  // const courseId = req.query.courseId;

  try {
    const allUsersQuery = `
    SELECT * 
    FROM users
    `;

    const allUsersResult = await pool.query(allUsersQuery);
    // console.log('ALL USERS RESULT: ', allUsersResult);
    res.status(200).json(allUsersResult.rows);
  } catch (error) {
    console.error("Error fetching course Data: ", error);
    res.status(500).json({ error: "Error fetching course data" });
  }
});

// COURSE LOOKUP -------------------------------------------------------------------------------------------------------------
app.get("/getCourseInfo", async (req, res) => {
  const courseId = req.query.courseId;

  try {
    const courseQuery = `
      SELECT c.course_name, c.address, t.tee_name, t.color, t.tee_id, h.hole_number, h.yardage, h.par, h.hole_id, h.handicap
      FROM courses c
      JOIN tees t ON c.course_id = t.course_id
      JOIN holes h ON t.tee_id = h.tee_id
      WHERE c.course_id = $1
      ORDER BY t.tee_name, h.hole_number;`;

    const courseResult = await pool.query(courseQuery, [courseId]);
    res.status(200).json(courseResult.rows);
  } catch (error) {
    console.error("Error fetching course Data: ", error);
    res.status(500).json({ error: "Error fetching course data" });
  }
});

// INDIVIDUAL SCORES LOOKUP  -------------------------------------------------------------------------------------------------------------
app.get("/getScores", async (req, res) => {
  const course_id = req.query.courseId;
  const user_id = req.query.userId

  try {
    const scoresQuery = `
    SELECT * FROM scores 
    WHERE round_id = $1 AND user_id = $2;
    ;`
    const scoresResult = await pool.query(scoresQuery, [course_id, user_id]);
    res.status(200).json(scoresResult.rows);
    // console.log('SCORES LOOKUP RESULT: ', scoresResult);
  } catch (error) {
    console.error("Error fetching scores Data: ", error);
    res.status(500).json({ error: "Error fetching scores data" });
  }

})

// ALL SCORES LOOKUP  -------------------------------------------------------------------------------------------------------------
app.get("/getAllScores", async (req, res) => {
  const course_id = req.query.courseId;

  try {
    const scoresQuery = `
    SELECT * FROM scores 
    WHERE round_id = $1;
    ;`
    const scoresResult = await pool.query(scoresQuery, [course_id]);
    res.status(200).json(scoresResult.rows);
    console.log('all SCORES LOOKUP RESULT: ', scoresResult.rows);
  } catch (error) {
    console.error("Error fetching ALL scores Data: ", error);
    res.status(500).json({ error: "Error fetching ALL scores data" });
  }

})

// ENTER SCORES  -------------------------------------------------------------------------------------------------------------
app.post("/enterScores", async (req, res) => {
  const { user_Id, round_Id, hole_Id, strokes } = req.body;
  console.log("Received user score entry:", {
    user_Id: req.body.user_Id,
    round_Id: req.body.round_Id,
    hole_Id: req.body.hole_Id,
    strokes: req.body.strokes
  });
  try {
    const scoreEntry = `
      INSERT INTO SCORES (user_Id, round_Id, hole_Id, strokes)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_Id, round_Id, hole_Id)
      DO UPDATE SET strokes = EXCLUDED.strokes
      RETURNING score_id;
    `;
    const values = [user_Id, round_Id, hole_Id, strokes];
    const result = await pool.query(scoreEntry, values);

    res.status(201).json({ scoreId: result.rows[0].score_id });
  } catch (error) {
    console.error("Error in score entry:", error);
    res.status(500).json({ error: "Error in score entry" });
  }
});

// EDIT PROFILE  -------------------------------------------------------------------------------------------------------------
app.post("/editProfile", async (req,res) => {
  const { handicap, user_id } = req.body;
  console.log('Incoming handicap change! NEW CAP = ', handicap, 'for USER = ', user_id);

  try {
    const handicapChange = `
    UPDATE users
    SET handicap = $1
    WHERE user_id = $2;
    `;
    const values = [handicap, user_id];
    const result = await pool.query(handicapChange, values);

    res.status(200).json({ message: "Handicap updated successfully" });
  } catch (error) {
    console.error("Error in handicap change:", error);
    res.status(500).json({ error: "Error in changing of handicap" });
  }
})