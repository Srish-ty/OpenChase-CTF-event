import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("openchase");

  if (req.method === "GET") {
    const { round } = req.query;

    try {
      const roundData = await db.collection("rounds").findOne({ name: round });

      if (!roundData) {
        return res.status(404).json({ message: "Round not found" });
      }

      const { track1, track2 } = roundData;

      res.status(200).json({
        track1: {
          question: track1.question,
          answer: track1.answer,
          hint: track1.hint,
        },
        track2: {
          question: track2.question,
          answer: track2.answer,
          hint: track2.hint,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
