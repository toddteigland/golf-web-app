import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { createServer } from 'http'; // Import the http module
import { Server } from 'socket.io'; // Import Socket.IO
import { log } from 'console';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
const { Pool } = pg;


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


const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust according to your needs
    methods: ["GET", "POST"]
  }
});

// Handling Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle your events here
  // Example: socket.on('someEvent', (data) => { ... });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Change app.listen to httpServer.listen
httpServer.listen(port, () => {
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
// app.get("/getScores", async (req, res) => {
//   // const course_id = req.query.courseId;
//   const user_id = req.query.userId
//   // const round_id = req.query.roundId

//   try {
//     const scoresQuery = `
//     SELECT * FROM scores 
//     WHERE  user_id = $1;
//     ;`
//     const scoresResult = await pool.query(scoresQuery, [user_id]);
//     res.status(200).json(scoresResult.rows);
//     console.log('SCORES LOOKUP RESULT: ', scoresResult.rows);
//   } catch (error) {
//     console.error("Error fetching scores Data: ", error);
//     res.status(500).json({ error: "Error fetching scores data" });
//   }

// })

// ALL SCORES LOOKUP  -------------------------------------------------------------------------------------------------------------
app.get("/getAllScores", async (req, res) => {
  const course_id = req.query.courseId;

  try {
    const scoresQuery = `
    SELECT * FROM scores 
    ;`
    const scoresResult = await pool.query(scoresQuery);
    res.status(200).json(scoresResult.rows);
    // console.log('all SCORES LOOKUP RESULT: ', scoresResult.rows);
  } catch (error) {
    console.error("Error fetching ALL scores Data: ", error);
    res.status(500).json({ error: "Error fetching ALL scores data" });
  }

})

// TEAM SCORES LOOKUP  -------------------------------------------------------------------------------------------------------------
app.get("/getTeamScores", async (req, res) => {
  const course_id = req.query.courseId;

  try {
    const teamScoresQuery = `
    SELECT * FROM team_scores 
    ;`
    const teamScoresResult = await pool.query(teamScoresQuery);
    res.status(200).json(teamScoresResult.rows);
    // console.log('all SCORES LOOKUP RESULT: ', scoresResult.rows);
  } catch (error) {
    console.error("Error fetching TEAM scores Data: ", error);
    res.status(500).json({ error: "Error fetching TEAM scores data" });
  }

})

// ENTER SCORES  -------------------------------------------------------------------------------------------------------------
app.post("/enterScores", async (req, res) => {
  const { user_Id, round_Id, hole_number, strokes } = req.body;
  console.log("Received user score entry:", {
    user_Id: req.body.user_Id,
    round_Id: req.body.round_Id,
    hole_number: req.body.hole_number,
    strokes: req.body.strokes
  });
  try {
    const scoreEntry = `
      INSERT INTO SCORES (user_Id, round_Id, hole_number, strokes)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_Id, round_Id, hole_number)
      DO UPDATE SET strokes = EXCLUDED.strokes
      RETURNING score_id;
    `;
    const values = [user_Id, round_Id, hole_number, strokes];
    const result = await pool.query(scoreEntry, values);

    // res.status(201).json({ scoreId: result.rows[0].score_id });
    io.emit('scoreUpdated', { scoreId: result.rows[0].score_id });
    res.status(201).json({ scoreId: result.rows[0].score_id });

  } catch (error) {
    console.error("Error in score entry:", error);
    res.status(500).json({ error: "Error in score entry" });
  }
});

// ENTER Team SCORES  -------------------------------------------------------------------------------------------------------------
app.post("/enterTeamScores", async (req, res) => {
  const { team_Id, round_Id, hole_number, strokes } = req.body;
  console.log("Received TEAM score entry:", {
    team_Id: req.body.team_Id,
    round_Id: req.body.round_Id,
    hole_number: req.body.hole_number,
    strokes: req.body.strokes
  });
  try {
    const teamScoreEntry = `
      INSERT INTO TEAM_SCORES (team_Id, round_Id, hole_number, strokes)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (round_Id, team_Id, hole_number)
      DO UPDATE SET strokes = EXCLUDED.strokes
      RETURNING team_score_id;
    `;
    const values = [team_Id, round_Id, hole_number, strokes];
    const result = await pool.query(teamScoreEntry, values);

    io.emit('teamScoreUpdated', { scoreId: result.rows[0].score_id });
    res.status(201).json({ scoreId: result.rows[0].score_id });
    // console.log('team score updated::', result);

  } catch (error) {
    console.error("Error in team score entry:", error);
    res.status(500).json({ error: "Error in team score entry" });
  }
});

// ENTER Team Drive  -------------------------------------------------------------------------------------------------------------
app.post("/enterTeamDrive", async (req, res) => {
  const { team_Id, round_Id, hole_number, drive_used } = req.body;
  console.log("Received Team Drive entry:", {
    team_Id: req.body.team_Id,
    round_Id: req.body.round_Id,
    hole_number: req.body.hole_number,
    drive_used: req.body.drive_used
  });
  try {
    const teamDriveEntry = `
      INSERT INTO TEAM_SCORES (team_Id, round_Id, hole_number, drive_used)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (team_Id, round_Id, hole_number)
      DO UPDATE SET drive_used = EXCLUDED.drive_used
      RETURNING team_score_id;
    `;
    const values = [team_Id, round_Id, hole_number, drive_used];
    const result = await pool.query(teamDriveEntry, values);

    // res.status(201).json({ scoreId: result.rows[0].score_id });
    io.emit('teamDriveUpdated', { scoreId: result.rows[0].team_score_id });
    // console.log('team Drive updated - team score id::', team_score_id);
  } catch (error) {
    console.error("Error in team Drive entry:", error);
    res.status(500).json({ error: "Error in team Drive entry" });
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

// GET TEAM INFO -------------------------------------------------------------------------------------------------------------
app.get("/getTeamData", async (req, res) => {
  const user_id = req.query.userId;
  try {
      const getTeamsQuery = `
          SELECT 
              t.team_id,
              t.team_name,
              u.user_id,
              u.first_name,
              u.last_name,
              u.email,
              u.handicap
          FROM teams t
          INNER JOIN team_members tm ON t.team_id = tm.team_id
          INNER JOIN users u ON tm.user_id = u.user_id
          WHERE t.team_id IN (
            SELECT team_id
            FROM team_members
            WHERE user_id = $1
        )
          ORDER BY t.team_id, u.user_id;
      `;

      const teamData = await pool.query(getTeamsQuery, [user_id]);
      res.json(teamData.rows);
  } catch (error) {
      console.error('There was an error fetching team data:', error);
      res.status(500).send('Server error');
  }
});
// GET HISTORICAL SCORES -------------------------------------------------------------------------------------------------------------
app.get("/getHistoricalScores", async (req, res) => {
  const fetchYear = req.query.fetchYear;
  // console.log('fetchyear:', fetchYear);
  try {
    const historicalScoresQuery = `
      SELECT 
        h.handicap,
        h.round1handicap,
        h.round2handicap,
        h.round1score,
        h.round2score,
        h.user_id,
        u.first_name,
        u.last_name
      FROM historical_scores h
      JOIN users u ON h.user_id = u.user_id
      WHERE year = $1;
    `;
    const historicalScoreData = await pool.query(historicalScoresQuery, [fetchYear]);
    console.log('historical Score data: ', historicalScoreData.rows);
    res.json(historicalScoreData.rows);
  } catch (error) {
    console.error('There was an error fetching historical scores:', error);
    res.status(500).send({error: 'Error fetching historical scores'})
  }
});