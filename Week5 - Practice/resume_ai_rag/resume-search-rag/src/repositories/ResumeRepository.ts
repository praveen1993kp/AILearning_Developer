import { MongoClient, ObjectId } from 'mongodb';
import { Resume } from '../types';
import config from '../config';

export class ResumeRepository {
    private client: MongoClient;
    private dbName: string;
    private collectionName: string;

    constructor(mongoUri?: string, dbName?: string, collectionName?: string) {
        const uri = mongoUri || config.MONGODB_URI || 'mongodb://localhost:27017';
        this.client = new MongoClient(uri);
        this.dbName = dbName || config.DB_NAME || 'resume_search';
        this.collectionName = collectionName || config.COLLECTION_NAME || 'resumes';
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.close();
    }

    async create(resume: Resume): Promise<Resume> {
        const db = this.client.db(this.dbName);
        const result = await db.collection(this.collectionName).insertOne(resume);
        return { ...resume, _id: result.insertedId };
    }

    async findById(id: string): Promise<Resume | null> {
        const db = this.client.db(this.dbName);
        return await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });
    }

    async findAll(): Promise<Resume[]> {
        const db = this.client.db(this.dbName);
        return await db.collection(this.collectionName).find().toArray();
    }

    async update(id: string, resume: Partial<Resume>): Promise<Resume | null> {
        const db = this.client.db(this.dbName);
        await db.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: resume });
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const db = this.client.db(this.dbName);
        const result = await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }

    async bm25Search(query: string, filters?: object, topK: number = 10): Promise<Resume[]> {
        try {
            // Ensure client is connected; ignore if already connected
            try {
                await this.client.connect();
            } catch (connErr) {
                // log but continue - connect may be a no-op if already connected
                console.warn('MongoClient.connect() warning:', (connErr as any).message || connErr);
            }

            const db = this.client.db(this.dbName);

            const indexName = config.BM25_INDEX_NAME || this.collectionName + '_bm25';

            // Build the $search stage using Atlas Search text operator (BM25 configured in index)
            const searchStage: any = {
                $search: {
                    index: indexName,
                    text: {
                        query: query,
                        path: [
                            'text',
                            'skills',
                            'role',
                            'company',
                            'education',
                            'experienceSummary'
                        ]
                    }
                }
            };

            // Apply filters if provided (simple example: convert top-level filters to $match)
            const pipeline: any[] = [searchStage];
            if (filters && Object.keys(filters).length > 0) {
                pipeline.push({ $match: filters });
            }

            pipeline.push({ $limit: topK });

            pipeline.push({
                $project: {
                    resumeId: '$_id',
                    score: { $meta: 'searchScore' },
                    name: 1,
                    email: 1,
                    skills: 1,
                    role: 1,
                    company: 1,
                    experienceSummary: 1,
                    text: 1
                }
            });

            const results = await db.collection(this.collectionName).aggregate(pipeline).toArray();

            // Normalize results
            return results.map((doc: any) => ({
                resumeId: doc.resumeId ? doc.resumeId.toString() : doc._id.toString(),
                score: doc.score,
                name: doc.name,
                email: doc.email,
                skills: doc.skills,
                role: doc.role,
                company: doc.company,
                experienceSummary: doc.experienceSummary,
                snippet: typeof doc.text === 'string' ? doc.text.slice(0, 400) : undefined
            } as unknown as Resume));
        } catch (err: any) {
            console.error('bm25Search failed:', err.message || err, { query, filters, topK });
            throw err;
        }
    }

    async vectorSearch(embedding: number[], filters?: object, topK: number = 10): Promise<Resume[]> {
        try {
            try {
                await this.client.connect();
            } catch (connErr) {
                console.warn('MongoClient.connect() warning:', (connErr as any).message || connErr);
            }

            const db = this.client.db(this.dbName);

            if (!Array.isArray(embedding) || embedding.length === 0) {
                throw new Error('Invalid query embedding provided to vectorSearch');
            }

            // Precompute query norm
            const queryNorm = Math.sqrt(embedding.reduce((s, v) => s + (v || 0) * (v || 0), 0));

            // Build aggregation pipeline to compute cosine similarity without using Atlas knnBeta
            const pipeline: any[] = [];

            // Filter out documents without embeddings
            pipeline.push({ $match: { embedding: { $exists: true, $ne: [] } } });

            // Optional filters
            if (filters && Object.keys(filters).length > 0) {
                pipeline.push({ $match: filters });
            }

            // Compute dot product and norm for each document
            pipeline.push({
                $addFields: {
                    dotProduct: {
                        $reduce: {
                            input: { $range: [0, { $size: '$embedding' }] },
                            initialValue: 0,
                            in: {
                                $add: [
                                    '$$value',
                                    {
                                        $multiply: [
                                            { $arrayElemAt: ['$embedding', '$$this'] },
                                            { $arrayElemAt: [embedding, '$$this'] }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    docNorm: {
                        $sqrt: {
                            $reduce: {
                                input: '$embedding',
                                initialValue: 0,
                                in: { $add: ['$$value', { $multiply: ['$$this', '$$this'] }] }
                            }
                        }
                    }
                }
            });

            // Compute cosine similarity, guard against division by zero
            pipeline.push({
                $addFields: {
                    score: {
                        $cond: [
                            { $or: [{ $eq: ['$docNorm', 0] }, { $eq: [queryNorm, 0] }] },
                            0,
                            { $divide: ['$dotProduct', { $multiply: ['$docNorm', queryNorm] }] }
                        ]
                    }
                }
            });

            pipeline.push({ $sort: { score: -1 } });
            pipeline.push({ $limit: topK });

            pipeline.push({
                $project: {
                    resumeId: '$_id',
                    score: 1,
                    name: 1,
                    email: 1,
                    skills: 1,
                    role: 1,
                    company: 1,
                    experienceSummary: 1,
                    text: 1
                }
            });

            const results = await db.collection(this.collectionName).aggregate(pipeline).toArray();

            return results.map((doc: any) => ({
                resumeId: doc.resumeId ? doc.resumeId.toString() : doc._id.toString(),
                score: doc.score,
                name: doc.name,
                email: doc.email,
                skills: doc.skills,
                role: doc.role,
                company: doc.company,
                experienceSummary: doc.experienceSummary,
                snippet: typeof doc.text === 'string' ? doc.text.slice(0, 400) : undefined
            } as unknown as Resume));
        } catch (err: any) {
            console.error('vectorSearch failed:', err.message || err, { topK });
            throw err;
        }
    }
}