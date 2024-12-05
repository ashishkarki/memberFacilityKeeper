import { Args, Query, Resolver } from '@nestjs/graphql';
import { Member } from '../models/member.model';
import { members } from '../data/members.data';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Member)
export class MemberResolver {
  @Query(() => [Member], {
    description: 'Get all members with optional filtering and pagination',
  })
  getAllMembers(
    @Args('membershipType', { type: () => String, nullable: true })
    membershipType?: string,
    @Args('limit', { type: () => Number, nullable: true }) limit = 10,
    @Args('offset', { type: () => Number, nullable: true }) offset = 0,
  ): Member[] {
    let filteredMembers = members;

    // Filter by membership type if provided
    if (membershipType) {
      filteredMembers = filteredMembers.filter(
        (member) =>
          member.membership.membershipType === membershipType.toUpperCase(),
      );
    }

    // Apply pagination as well
    return filteredMembers.slice(offset, offset + limit);
  }

  @Query(() => Member, { nullable: true, description: 'Get a member by email' })
  getMemberByEmail(@Args('email') email: string): Member {
    const member = members.find((member) => member.email === email);

    if (!member) {
      throw new NotFoundException(`Member with email ${email} not found`);
    }

    return member;
  }
}
