import { app } from "@azure/functions";
import { generateAlternateReport } from "./utils/reportGenerator.js";

export async function testFunction (request, context) {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    // Parse the request body as JSON
    const body = await request.json();

    // Extract seed, conversation, and rubrics from the request body
    const seed = body.seed || "";
    const conversation = body.conversation || [];
    const rubrics = body.rubrics || "Default rubrics";
    context.log("conversation", conversation);
    let conversationArray = conversation;
    conversationArray.sort(
      (a, b) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
    let splicedConversation = conversationArray.slice(2);
    const interview = splicedConversation
      .map((item) => [
        { role: item.botChunk.role, content: item.botChunk.content },
        { role: item.userChunk.role, content: item.userChunk.content },
      ])
      .flat();
    // Call the generateAlternateReport function with body parameters
    const report = await generateAlternateReport(seed, interview, rubrics);
    // let reportResponse = await processInterview(interview,interviewQuestions,rubrics)
    /**
     * Remember that you have to implement the processInterview function in the reportGenerator.js file
     */
  //   console.log("Report processed:",reportResponse);
    // Return the generated report as the response
    return { body: report };
  } catch (error) {
    context.log.error("Error in processing report generation:", error);
    return {
      status: 500,
      body: "An error occurred while generating the report.",
    };
  }
};
