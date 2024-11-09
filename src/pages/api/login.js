import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("openchase");

  if (req.method === "POST") {
    const { teamName, password } = req.body;

    const team = await db.collection("teams").findOne({ teamName });

    if (team && password === team.password) {
      const { color, totalScore = 0, roundNum = 1 } = team;

      res.status(200).json({ success: true, color, totalScore, roundNum });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    res.status(405).end();
  }
}
