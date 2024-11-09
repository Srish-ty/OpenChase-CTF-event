import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { teamName, answerCorrect } = req.body;
    const client = await clientPromise;
    const db = client.db("openchase");

    try {
      const team = await db.collection("teams").findOne({ teamName });

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      const roundNum = team.roundNum;

      let newScore = team.score;

      if (answerCorrect) {
        newScore += 50;
      } else {
        newScore -= 10;
      }

      await db
        .collection("teams")
        .updateOne({ teamName }, { $set: { score: newScore } });

      const newCheckpoints = [...team.checkpoints];
      newCheckpoints[roundNum - 1] = true;

      await db
        .collection("teams")
        .updateOne({ teamName }, { $set: { checkpoints: newCheckpoints } });

      res.status(200).json({
        message: "Score and checkpoints updated successfully",
        newScore,
        newCheckpoints,
      });
    } catch (error) {
      console.error("Error updating score:", error);
      res.status(500).json({ message: "Error updating score" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
