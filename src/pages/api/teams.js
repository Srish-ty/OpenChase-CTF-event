// pages/api/teams.js
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("your_database_name");

  if (req.method === "POST") {
    const { teamName, password, group } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeam = { teamName, password: hashedPassword, group };
    const result = await db.collection("teams").insertOne(newTeam);

    res.status(201).json(result);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
