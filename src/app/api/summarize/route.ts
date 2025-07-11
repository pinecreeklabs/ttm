import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { conversation } = await request.json();
    
    if (!conversation || conversation.trim().length === 0) {
      return NextResponse.json({ error: 'No conversation provided' }, { status: 400 });
    }

    // Simple AI-powered summarization
    const summary = generateSimpleSummary(conversation);
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate summary' 
    }, { status: 500 });
  }
}

function generateSimpleSummary(conversation: string): string {
  const lines = conversation.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return 'No conversation to summarize.';
  
  const userMessages = lines.filter(line => line.startsWith('user:')).map(line => line.replace('user:', '').trim());
  const assistantMessages = lines.filter(line => line.startsWith('assistant:')).map(line => line.replace('assistant:', '').trim());
  
  const topics = extractTopics(userMessages.join(' '));
  const keyAdvice = extractKeyAdvice(assistantMessages.join(' '));
  
  let summary = '💬 **Conversation Summary**\\n\\n';
  
  if (topics.length > 0) {
    summary += `**Topics Discussed:** ${topics.join(', ')}\\n\\n`;
  }
  
  if (keyAdvice.length > 0) {
    summary += `**Key Points:** ${keyAdvice}\\n\\n`;
  }
  
  summary += `**Conversation Length:** ${lines.length} messages exchanged\\n`;
  summary += `**Duration:** ${Math.ceil(lines.length / 2)} minutes (estimated)`;
  
  return summary;
}

function extractTopics(text: string): string[] {
  const topics = [];
  const lowerText = text.toLowerCase();
  
  // General conversation topics
  if (lowerText.includes('question') || lowerText.includes('help') || lowerText.includes('advice')) {
    topics.push('Questions & Help');
  }
  if (lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('trouble')) {
    topics.push('Problem Solving');
  }
  if (lowerText.includes('information') || lowerText.includes('learn') || lowerText.includes('explain')) {
    topics.push('Information & Learning');
  }
  if (lowerText.includes('task') || lowerText.includes('work') || lowerText.includes('project')) {
    topics.push('Tasks & Projects');
  }
  if (lowerText.includes('plan') || lowerText.includes('schedule') || lowerText.includes('organize')) {
    topics.push('Planning & Organization');
  }
  
  return topics;
}

function extractKeyAdvice(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Find sentences that contain advice keywords
  const adviceSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return lowerSentence.includes('should') || 
           lowerSentence.includes('recommend') || 
           lowerSentence.includes('important') ||
           lowerSentence.includes('make sure') ||
           lowerSentence.includes('try to') ||
           lowerSentence.includes('consider') ||
           lowerSentence.includes('suggest');
  });
  
  // Return the first relevant advice sentence, truncated if too long
  if (adviceSentences.length > 0) {
    let advice = adviceSentences[0].trim();
    if (advice.length > 150) {
      advice = advice.substring(0, 150) + '...';
    }
    return advice;
  }
  
  return 'General guidance and information provided';
}