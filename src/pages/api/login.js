// pages/api/login.js
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("your_database_name");

  if (req.method === "POST") {
    const { teamName, password } = req.body;
    const team = await db.collection("teams").findOne({ teamName });

    if (team && (await bcrypt.compare(password, team.password))) {
      res.status(200).json({ success: true, group: team.group });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
