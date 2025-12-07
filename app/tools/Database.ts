import { MongoClient } from "mongodb";

export async function databaseTool(
  query_type: string,
  time_period?: string,
  department?: string
): Promise<string> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MongoDB URI not configured. Please set MONGODB_URI in your environment variables."
    );
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const database = client.db("company"); // Database name
    const employeesCollection = database.collection("employees"); // Collection name

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (query_type) {
      case "count_all":
        const totalCount = await employeesCollection.countDocuments();
        return `There are ${totalCount} employees in total in the company.`;

      case "count_recent":
        const cutoffDate =
          time_period === "last_week" ? oneWeekAgo : oneMonthAgo;
        const recentCount = await employeesCollection.countDocuments({
          joinDate: { $gte: cutoffDate },
        });
        const timeText =
          time_period === "last_week" ? "last week" : "last month";
        return `There were ${recentCount} employees who joined ${timeText}.`;

      case "list_all":
        const allEmployees = await employeesCollection.find({}).toArray();
        const nameList = allEmployees.map((emp: any) => emp.name).join(", ");
        return `The employees in the company are: ${nameList}.`;

      case "count_by_department":
        if (!department) {
          return "Please specify a department to count employees.";
        }
        const deptCount = await employeesCollection.countDocuments({
          department: { $regex: new RegExp(`^${department}$`, "i") },
        });
        return `There are ${deptCount} employees in the ${department} department.`;

      default:
        return "I couldn't understand the database query type.";
    }
  } catch (error: any) {
    console.error("Database error:", error);
    throw new Error(`Database query failed: ${error.message}`);
  } finally {
    await client.close();
  }
}
