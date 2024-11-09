import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("openchase");

  if (req.method === "GET") {
    try {
      const teams = await db.collection("teams").find().toArray();

      const leaderboard = teams.map((team) => {
        return {
          teamName: team.teamName,
          totalScore: team.totalScore || 0,
        };
      });

      leaderboard.sort((a, b) => b.totalScore - a.totalScore);

      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      res.status(500).json({ error: "Error fetching leaderboard data." });
    }
  } else {
    res.status(405).end();
  }
}
