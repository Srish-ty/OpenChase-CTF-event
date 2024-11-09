import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { teamName, answerCorrect, color, roundNum } = req.body;
    const client = await clientPromise;
    const db = client.db("openchase");

    try {
      const team = await db.collection("teams").findOne({ teamName });

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      let newScore = team.totalScore || 0;
      let currentRound = team.roundNum || 1;

      if (answerCorrect) {
        newScore += 50;
        currentRound += 1;
      } else {
        newScore -= 20;
      }

      await db.collection("teams").updateOne(
        { teamName },
        {
          $set: {
            totalScore: newScore,
            roundNum: currentRound,
          },
        }
      );

      res.status(200).json({
        message: "Score and round updated successfully",
        newScore,
        currentRound,
      });
    } catch (error) {
      console.error("Error updating score:", error);
      res.status(500).json({ message: "Error updating score" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
