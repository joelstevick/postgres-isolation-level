import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { Stats } from "src/models/stats.entity";
import { IsolationLevel, StatsService, TEST_RECORD_ID } from "src/services/stats/stats.service";

@Resolver((of) => Stats)
export class StatsResolver {
    constructor(private statsService: StatsService) {

    }
    @Query(() => Stats)
    async stats(): Promise<Stats> {

       return this.statsService.findTestRecord();
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