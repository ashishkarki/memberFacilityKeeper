import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MemberResolver } from './resolvers/member.resolver';
import { CacheModule } from './cache.module';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [
    CacheModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // auto generate schema
    }),
  ],
  providers: [PrismaService, MemberResolver],
})
export class AppModule {}
