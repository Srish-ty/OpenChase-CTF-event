import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("openchase");

  if (req.method === "POST") {
    const { teamName, password, color, totalScore, roundNum } = req.body;

    const newTeam = {
      teamName,
      password,
      color,
      totalScore: totalScore || 0,
      roundNum: roundNum || 1,
    };

    try {
      const result = await db.collection("teams").insertOne(newTeam);

      res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
      console.error("Error inserting team:", error);
      res.status(500).json({ error: "Error creating team" });
    }
  } else {
    res.status(405).end();
  }
}
