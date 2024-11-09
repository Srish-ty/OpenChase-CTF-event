import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { color, round } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db("openchase");

      const roundData = await db.collection("rounds").findOne({ name: round });

      if (!roundData) {
        return res.status(404).json({ message: "Round not found" });
      }

      res.status(200).json(roundData[color]);
    } catch (error) {
      console.error("Error fetching round data:", error);
      res.status(500).json({ message: "Error fetching round data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
