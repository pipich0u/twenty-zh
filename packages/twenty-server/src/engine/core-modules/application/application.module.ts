import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreGraphQLApiModule } from 'src/engine/api/graphql/core-graphql-api.module';
import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { WorkspaceFlatApplicationMapCacheService } from 'src/engine/core-modules/application/workspace-flat-application-map-cache.service';
import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { SdkClientGenerationModule } from 'src/engine/core-modules/sdk-client-generation/sdk-client-generation.module';
import { TwentyConfigModule } from 'src/engine/core-modules/twenty-config/twenty-config.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity, WorkspaceEntity]),
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
    WorkspaceCacheModule,
    TwentyConfigModule,
    FeatureFlagModule,
    CoreGraphQLApiModule,
    SdkClientGenerationModule,
  ],
  exports: [ApplicationService, WorkspaceFlatApplicationMapCacheService],
  providers: [ApplicationService, WorkspaceFlatApplicationMapCacheService],
})
export class ApplicationModule {}
