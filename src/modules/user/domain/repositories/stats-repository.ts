export default interface StatsRepository {
    find(): Promise<any | null>;
}