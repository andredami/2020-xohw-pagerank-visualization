export interface Rank {
    vertex: number;
    value: number;
}

export interface Pagerank {
    id: number;
    results: Map<number, number>;
    min_rank: number;
    max_rank: number;
}
