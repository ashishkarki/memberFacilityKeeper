import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Member } from '../models/member.model';
import { members } from '../data/members.data';
import { Logger, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { MembershipType } from 'src/models/membership.model';

const logger = new Logger('MemberResolver');

@Resolver(() => Member)
export class MemberResolver {
  constructor(@InjectRedis() private readonly redis: Redis) {}

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

    try {
      const cachedMembers = await this.redis.get(cacheKey);

      if (cachedMembers) {
        logger.debug(`Cache hit from cache for key: ${cacheKey}`);
        return JSON.parse(cachedMembers);
      }

      logger.log(`Cache miss for key: ${cacheKey}`);
    } catch (error) {
      logger.error(`Redis error: ${error.message}. Falling back to database.`);
    }

    // If not in cache, query the database
    logger.debug(
      `Fetching members from database: membershipType=${membershipType}, limit=${limit}, offset=${offset}`,
    );
    let filteredMembers = members; // TODO: hardcoded data for now
    // // logger.debug(`filteredMembers.length: ${filteredMembers.length}`);

    // Filter by membership type if provided
    if (membershipType && membershipType !== 'ALL') {
      filteredMembers = filteredMembers.filter(
        (member) =>
          member.membership.membershipType === membershipType.toUpperCase(),
      );
    }

    // Apply pagination as well
    // // logger.debug(`filteredMembers.length: ${filteredMembers.length}`);
    const paginatedMembers = filteredMembers.slice(offset, offset + limit);

    // Save to cache with TTL of 60 seconds
    try {
      logger.debug(`Trying to Cache members with key: ${cacheKey}`);

      await this.redis.set(
        cacheKey,
        JSON.stringify(paginatedMembers),
        'EX',
        60,
      );

      logger.debug(`Successfully Cached members with key: ${cacheKey}`);
    } catch (error) {
      logger.debug(`Error Caching members with key: ${cacheKey}`);
    }

    return paginatedMembers;
  }

  @Query(() => Member, { nullable: true, description: 'Get a member by email' })
  getMemberByEmail(@Args('email') email: string): Member {
    const member = members.find((member) => member.email === email);

    if (!member) {
      throw new NotFoundException(`Member with email ${email} not found`);
    }

    return member;
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
