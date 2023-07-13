// question-answering-server/index.ts
import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from 'openai';
import { Message } from './App';

const openaiApiKey = process.env.OPENAI_API_KEY || "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"; // Replace with your API key
const openaiConfig = new Configuration(
  {
    apiKey: openaiApiKey
  }
)
const openaiClient = new OpenAIApi(
  openaiConfig
);

export async function getAnswer(question: string, context: Message[], model = "gpt-3.5-turbo") {
  try {
    context.push({role: "user", content: question})

    type ChatCompletionRequest = ChatCompletionRequestMessage[];

    const convertedArray: ChatCompletionRequest = context.map(item => ({
      role:item.role === 'user' ? 'user' : 'assistant',
      content: item.content
    }));
    const result = await openaiClient.createChatCompletion(
      {
        model: model,
        messages: convertedArray,
        stream: false
      }
    );
    const answer = result.data.choices[0];
    return answer;
  } catch (error) {
    console.error('Error:', error);
    return;
  }
}