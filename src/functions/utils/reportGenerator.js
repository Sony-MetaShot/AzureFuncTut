// reportGenerator.js
// const OpenAI = require('openai') // Import the OpenAI API client
// Function to generate the alternate report
import { OpenAI } from 'openai'; // Import the OpenAI API client

const openai =new OpenAI({
    apiKey:process.env.OPENAI_KEY,
    dangerouslyAllowBrowsner:true,
});

export async function generateAlternateReport(seed, conversation, rubrics) {
    const response = await botReportResponse(alternateContent, seed, conversation, rubrics);
    return response;
  }
  
  // Helper function to handle the response using OpenAI API
  async function botReportResponse(
    contentFunction, 
    seed, 
    conversation, 
    rubrics
  ) {
    try {
      // Convert conversation array to a single string
      const conversationText = conversation
        .map(message => `${message.role}: ${message.content}`)
        .join('\n');
      console.log("conversationText", conversationText);
      console.log("seed", seed);
      
      
      // Assume OpenAI API is initialized, replace with the correct model or API key
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: contentFunction(seed, rubrics) }, 
          { role: "user", content: conversationText },
        ],
      });
  
      return chatCompletion.choices[0].message.content ?? ''; // Fallback to empty string if null
    } catch (error) {
      console.error("Error in botReportResponse:", error, conversation);
      throw new Error(`Error in report generation. Conversation: ${conversation}`);
    }
  }
  
  // Function that generates the content based on the seed and rubrics
  export const alternateContent = (seed, rubrics) => {
    return (
      `You are a bot that grades candidates' answers to various interview questions. You are to grade the answers based on the following criteria. The question and the answer will be provided to you. The criteria are as follows:
  
  ${rubrics}
  
  All the factors are completely independent of each other and need to be evaluated as if they are the only factor. The scores are to be given out of the maximum score for each criterion. For example, /10 or /15 or /25 or /10 or /10 or /45 or so on.
  
  Evaluate the factors strictly based on their definitions provided.
  
  Based on ${seed}, evaluate the following interview conversation and grade the answers and follow-up answers to questions asked on a topic. The evaluation should contain comprehensive scoring following the parameters above.
  Technical accuracy in non-technical scores should have N/A as the value if the questions are more aligned to a non-technical job position.
  Code quality and system design should have N/A as the value if the questions are more aligned to a non-technical job position.
  
  If you do not have the topics to base the evaluation on, figure out the topics and the questions and grade the answer based on the above rubrics.
  
  #### NOTE: FOLLOW THE JSON FORMAT FOR OUTPUT GIVEN BELOW TO THE DOT.
  Your output should be of the format:
  
  {
      \"technicalScores\":{
          \"topic\": Single overall Score based on the above mentioned rubrics,
          \"topic\": Single overall Score based on the above mentioned rubrics,
          ##OTHER TOPICS AS PER SEED AND CONVERSATION##
      },
      \"nonTechnicalScores\":{
          \"Technical Accuracy\": SCORE OUT OF 10,
          \"Problem-Solving Approach\": SCORE OUT OF 10,
          \"Communication\": SCORE OUT OF 10,
          \"Depth of Knowledge\": SCORE OUT OF 10,
          \"Adaptability\": SCORE OUT OF 10,
          \"Code Quality\": SCORE OUT OF 10,
          \"System Design\": SCORE OUT OF 10,
          ##OTHER TOPICS AS PER SEED AND CONVERSATION##
      },
      \"overAllScore\": OVERALL SCORE OUT OF 100,
      \"candidateSummary\": SUMMARY OF THE CANDIDATE'S PERFORMANCE,
      \"candidateInsights\": INSIGHTS ON THE CANDIDATE'S PERFORMANCE,
  }`
    );
  };
  