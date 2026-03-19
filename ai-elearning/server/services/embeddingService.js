import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

let pineconeIndex = null;

export async function getPineconeIndex() {
  if (pineconeIndex) return pineconeIndex;
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  pineconeIndex = pc.index(process.env.PINECONE_INDEX);
  return pineconeIndex;
}

function chunkText(text, chunkSize = 500) {
  const words = text.split(' ');
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

export async function embedCourse(course) {
  try {
    if (!openai) {
      console.warn('⚠️ OpenAI not configured, skipping embedding');
      return;
    }
    const index = await getPineconeIndex();
    const namespace = course._id.toString();
    const vectors = [];

    for (const lesson of course.lessons) {
      const rawText = lesson.content || lesson.title;
      if (!rawText) continue;
      const chunks = chunkText(rawText);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embeddingRes = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk,
        });
        vectors.push({
          id: `${lesson._id}-chunk-${i}`,
          values: embeddingRes.data[0].embedding,
          metadata: {
            text: chunk,
            lessonId: lesson._id.toString(),
            lessonTitle: lesson.title,
            courseId: course._id.toString(),
            courseTitle: course.title,
          },
        });
      }
    }

    for (let i = 0; i < vectors.length; i += 100) {
      await index.namespace(namespace).upsert(vectors.slice(i, i + 100));
    }

    console.log(`✅ Embedded ${vectors.length} chunks for course: ${course.title}`);
  } catch (err) {
    console.error('❌ Embedding failed:', err.message);
  }
}

export async function semanticSearch(query, courseId, topK = 5) {
  try {
    if (!openai) {
      console.warn('⚠️ OpenAI not configured, skipping search');
      return [];
    }
    const index = await getPineconeIndex();
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const results = await index.namespace(courseId).query({
      vector: embeddingRes.data[0].embedding,
      topK,
      includeMetadata: true,
    });
    return results.matches.map((m) => ({
      text: m.metadata?.text || '',
      lessonTitle: m.metadata?.lessonTitle || '',
      score: m.score,
    }));
  } catch (err) {
    console.error('❌ Semantic search failed:', err.message);
    return [];
  }
}