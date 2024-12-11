import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Member } from '../models/member.model';
import { members } from '../data/members.data';
import { Logger, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { MembershipType } from 'src/models/membership.model';
import { PrismaService } from 'services/prisma.service';

const logger = new Logger('MemberResolver');

@Resolver(() => Member)
export class MemberResolver {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Member], {
    description: 'Get all members with optional filtering and pagination',
  })
  async getAllMembers(
    @Args('membershipType', { type: () => String, nullable: true })
    membershipType = 'ALL',
    @Args('limit', { type: () => Number, nullable: true }) limit = 10,
    @Args('offset', { type: () => Number, nullable: true }) offset = 0,
  ): Promise<Member[]> {
    this.validateMembershipType(membershipType);

    // First check in the cache and if present, return
    const cacheKey = `members:${membershipType}:${limit}:${offset}`;

    const cachedMembers = await this.getFromCache(cacheKey);
    if (cachedMembers && Array.isArray(cachedMembers)) {
      return cachedMembers;
    }

    // If not in cache, query the database
    const mappedMembersFromDb = await this.queryAllMembersFromDb(
      membershipType,
      limit,
      offset,
    );

    // Save to cache
    await this.saveToCache(cacheKey, mappedMembersFromDb);

    // finally return
    return mappedMembersFromDb;
  }

  @Query(() => Member, { nullable: true, description: 'Get a member by email' })
  async getMemberByEmail(@Args('email') email: string): Promise<Member> {
    const cacheKey = `members:email:${email.toLowerCase()}`;

    // First check in the cache
    const cachedMember = await this.getFromCache(cacheKey);
    if (cachedMember && !Array.isArray(cachedMember)) {
      logger.debug(`Cache hit for member email: ${email}`);
      return cachedMember;
    }

    // If not in cache, query the database
    logger.debug(`Fetching member from DB for email: ${email}`);
    const memberFromDb = await this.prisma.member.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        membership: true,
        visits: true,
      },
    });

    if (!memberFromDb) {
      throw new NotFoundException(`Member with email ${email} not found`);
    }

    // Map memberFromDb to GraphQL type
    const mappedMember = {
      ...memberFromDb,
      membership: {
        ...memberFromDb.membership,
        membershipType: memberFromDb.membership
          .membershipType as MembershipType,
      },
    };

    // Save to cache
    await this.saveToCache(cacheKey, mappedMember);

    // finally return
    return mappedMember;
  }

  @Mutation(() => Boolean, { description: 'Invalidate members cache' })
  async invalidateCache(): Promise<boolean> {
    try {
      const keys = await this.redis.keys('members:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.debug(`Invalidated ${keys.length} keys: ${keys.join(', ')}`);
      } else {
        logger.debug('No keys to invalidate.');
      }

      return true;
    } catch (error) {
      logger.error(`Failed to invalidate cache: ${error.message}`);
      return false;
    }
  }

  // ---- Private Helper Functions ---- //

  private async getFromCache(
    cacheKey: string,
  ): Promise<Member | Member[] | null> {
    try {
      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) {
        logger.debug(`Cache hit for key: ${cacheKey}`);

        // Restore Dates for Cached Data
        const parsedData = JSON.parse(cachedData);

        if (Array.isArray(parsedData)) {
          return parsedData.map((member) => this.rehydrateMemberDates(member));
        }

        return this.rehydrateMemberDates(parsedData);
      }
      logger.debug(`Cache miss for key: ${cacheKey}`);
    } catch (error) {
      logger.error(`Redis error: ${error.message}. Proceeding without cache.`);
    }
    return null;
  }

  private async saveToCache(
    cacheKey: string,
    memberData: Member | Member[],
  ): Promise<void> {
    try {
      await this.redis.set(
        cacheKey,
        JSON.stringify(memberData),
        'EX',
        60, // Cache TTL
      );
      logger.debug(`Cached members with key: ${cacheKey}`);
    } catch (error) {
      logger.error(`Error caching members: ${error.message}`);
    }
  }

  private async queryAllMembersFromDb(
    membershipType: string,
    limit: number,
    offset: number,
  ): Promise<Member[]> {
    logger.debug(
      `Fetching members from database: membershipType=${membershipType}, limit=${limit}, offset=${offset}`,
    );

    const membersFromDb = await this.prisma.member.findMany({
      where:
        membershipType !== 'ALL'
          ? {
              membership: {
                membershipType: membershipType.toUpperCase() as MembershipType,
              },
            }
          : undefined,
      include: {
        membership: true,
        visits: true,
      },
      skip: offset,
      take: limit,
    });

    return membersFromDb.map((member) => ({
      ...member,
      membership: {
        ...member.membership,
        membershipType: member.membership.membershipType as MembershipType,
      },
    }));
  }

  private rehydrateMemberDates(member: any): Member {
    return {
      ...member,
      membership: {
        ...member.membership,
        startDate: new Date(member.membership.startDate),
        endDate: new Date(member.membership.endDate),
      },
      visits: member.visits.map((visit) => ({
        ...visit,
        visitDateTime: new Date(visit.visitDateTime),
      })),
    };
  }

  private validateMembershipType(membershipType: string): void {
    if (!membershipType || membershipType === 'ALL') {
      return;
    }

    if (
      !Object.values(MembershipType).includes(
        membershipType.toUpperCase() as MembershipType,
      )
    ) {
      throw new Error(
        `Invalid membership type: ${membershipType}. Allowed values are GOLD, SILVER, BRONZE.`,
      );
    }
  }
}
