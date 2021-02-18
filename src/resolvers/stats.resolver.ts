import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { Stats } from "src/models/stats.entity";
import { IsolationLevel, StatsService } from "src/services/stats/stats.service";

@Resolver((of) => Stats)
export class StatsResolver {
    constructor(private statsService: StatsService) {

    }
    @Query(() => Stats)
    async stats(): Promise<Stats> {

        return { id: 1, value: 0};
    }

    @Mutation(returns => Stats)
    async runTransactionReadCommitted()  {
        return this.statsService.runTransaction(IsolationLevel.ReadCommited);
    }
    
    @Mutation(returns => Stats)
    async runTransactionRepeatableRead()  {
        return this.statsService.runTransaction(IsolationLevel.RepeatableRead);
    }
}