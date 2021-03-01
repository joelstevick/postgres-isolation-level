import { Injectable } from '@nestjs/common';
import { Stats } from 'src/models/stats.entity';

import { getConnection } from "typeorm";

export enum IsolationLevel {
    Serializable = 'SERIALIZABLE',
    ReadCommited = 'READ COMMITTED',
    RepeatableRead = 'REPEATABLE READ'
}

const TEST_RECORD_ID = 1
@Injectable()
export class StatsService {
    
    async findTestRecord() {
        return getConnection().getRepository(Stats).findOne(TEST_RECORD_ID);
    }
    async runTransaction(IsolationLevel: IsolationLevel): Promise<Stats> {

        return new Promise((async resolve => {
            // run the conflicting transactions
            async function execute(runConflictingTransaction: boolean) {
                await getConnection().transaction(IsolationLevel, async transactionalEntityManager => {

                    // read the test record in the first transaction and update its value
                    const stats = await transactionalEntityManager.findOne(Stats, TEST_RECORD_ID);

                    stats.value++;

                    if (runConflictingTransaction) {
                        await getConnection().transaction(IsolationLevel, async transactionalEntityManager2 => {
                            // read the test record in the conflicting transaction and update its value
                            const stats = await transactionalEntityManager2.findOne(Stats, TEST_RECORD_ID);

                            stats.value++;

                            await transactionalEntityManager2.save(stats);
                        });
                    }
                    await transactionalEntityManager.save(stats);

                    // done
                    resolve(stats);

                });
            }

            // make sure the test record exists
            async function createTestRecord() {
                const repository = await getConnection().getRepository(Stats);

                let stats = await repository.findOne(TEST_RECORD_ID);

                if (!stats) {
                    stats = {
                        id: TEST_RECORD_ID,
                        value: 0
                    }
                    await repository.save(stats);
                }

            }
            try {
                // make sure that the test record exists, and then try to update using two simultaneous transactions
                await createTestRecord();
                    
                await execute(true);
            } catch (e) {
                if (+e.code === 40001) {
                    console.log('retrying after conflict detected');

                    await execute(false);
                } else {
                    console.error(e);
                }
            }

        }))

    }
}

