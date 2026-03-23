import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreGraphQLApiModule } from 'src/engine/api/graphql/core-graphql-api.module';

import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { SdkClientController } from 'src/engine/core-modules/sdk-client-generation/controllers/sdk-client.controller';
import { SdkClientGenerationService } from 'src/engine/core-modules/sdk-client-generation/sdk-client-generation.service';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity]),
    WorkspaceCacheModule,
    CoreGraphQLApiModule,
  ],
  controllers: [SdkClientController],
  providers: [SdkClientGenerationService],
  exports: [SdkClientGenerationService],
})
export class SdkClientGenerationModule {}
