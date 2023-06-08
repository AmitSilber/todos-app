import { PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';
export declare class ConnectionService {
    private pool;
    getPoolConnection(): Promise<PoolClient>;
    query<R extends QueryResultRow = any, I extends any[] = any[]>(queryTextOrConfig: string | QueryConfig<I>, values?: I): Promise<QueryResult<R>>;
}
